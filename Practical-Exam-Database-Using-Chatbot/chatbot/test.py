import pymongo
from bson import ObjectId
from flask import Flask, request, jsonify, render_template, send_file
import shutil
from Crypto.Cipher import AES
import base64
from datetime import datetime
import os

# MongoDB connection details
DATABASE_URL = "mongodb+srv://hemkamli425:WhrsGjX8TBqmSI6g@cluster0.t3gtalu.mongodb.net/"
DATABASE_NAME = "practicalexam"
USER_COLLECTION_NAME = "users"
PDF_COLLECTION_NAME = "paper"
EXAM_COLLECTION_NAME = "exams"
SOLUTION_COLLECTION_NAME = "solutions"

# Initialize Flask app
app = Flask(__name__)
# Connect to MongoDB
try:
    # Connect to the MongoDB server
    client = pymongo.MongoClient(DATABASE_URL)
    
    # Access your database
    db = client[DATABASE_NAME]

    # Access your collections
    user_collection = db[USER_COLLECTION_NAME]
    solution_collection = db[SOLUTION_COLLECTION_NAME]
    exam_collection = db[EXAM_COLLECTION_NAME]
    pdf_collection = db[PDF_COLLECTION_NAME]
    
    print("Successfully connected to MongoDB!")
except pymongo.errors.ConnectionFailure as e:
    print("Could not connect to MongoDB:", e)

@app.route("/")
def home():
    return render_template("index.html")

# AES decryption function
def decrypt_message(encrypted_message, key):
    key = key.encode('utf-8')
    encrypted_message = base64.b64decode(encrypted_message)
    iv = encrypted_message[:AES.block_size]
    # print("Mihir Devghare IV: ", iv)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted_message = cipher.decrypt(encrypted_message[AES.block_size:]).decode('utf-8').rstrip('\0')
    return decrypted_message

@app.route("/get_data", methods=["POST"])
def get_data():
    data_type = request.form.get("data_type")
    if data_type == "user":
        return get_user_data()
    
    elif data_type == "predefined":
        predefined_message = request.form.get("predefined_message")
        # Handle predefined messages here
        response_message = handle_predefined_message(predefined_message)
        return jsonify({"message": response_message})
    
    elif data_type == "subject_enrollment_response":
        # Retrieve subject and enrollment from the response
        encrypted_subject = request.form.get("subject")
        encrypted_enrollment = request.form.get("enrollment")

        # Decrypt the message
        encryption_key = "ADEDMoXsv81lpe7x3wl5d1sbhOzmNQbc"  # Replace with your encryption key
        decrypted_subject = decrypt_message(encrypted_subject, encryption_key)
        decrypted_subject= decrypted_subject.strip()
        decrypted_enrollment = decrypt_message(encrypted_enrollment, encryption_key)
        decrypted_enrollment= decrypted_enrollment.strip()

        # Fetch the grade using subject and enrollment
        grade = fetch_grade(decrypted_subject, decrypted_enrollment)
        # print("Grade by MD: ",grade)        
        return jsonify({"message": grade})
    
    elif data_type == "sem_branch_response":
        encrypted_sem = request.form.get("sem")
        encrypted_branch = request.form.get("branch")

        # Decrypt the message
        encryption_key = "ADEDMoXsv81lpe7x3wl5d1sbhOzmNQbc"  # Replace with your encryption key
        decrypted_branch = decrypt_message(encrypted_branch, encryption_key)
        decrypted_branch = decrypted_branch.strip()

        decrypted_sem = decrypt_message(encrypted_sem, encryption_key)
        decrypted_sem = decrypted_sem.strip()  # Strip leading and trailing whitespace
        
        ds= "3"
        decrypted_sem= decrypted_sem[0]
        # Compare decrypted_sem and ds
        # if decrypted_sem == ds:
        #     print("ABCDEFGH")
        # else:
        #     print("JK")
        # print("First character: ", decrypted_sem[0])
        # print("Len First character: ", len(decrypted_sem[0]))


        print("Dec Sem:", decrypted_sem)
        print("Dec Branch:", decrypted_branch)      
        
        # Call get_student_exams function to get exam information
        exam_info = get_student_exams(decrypted_sem, decrypted_branch)
        # print("Exam Info is: ", exam_info)
        if isinstance(exam_info, list):
            # If exams are found, return the list of exam information
            return jsonify({"exams": exam_info})
        else:
            # If no exams are found, return the message
            return jsonify({"message": exam_info})
        
        
    elif data_type == "download_previous_yr_paper":
        encrypted_subjectForPDF=request.form.get("subjectForPDF")
        
        # Decrypt the subject for PDF
        encryption_key = "ADEDMoXsv81lpe7x3wl5d1sbhOzmNQbc"  # Replace with your encryption key
        decrypted_subjectForPDF = decrypt_message(encrypted_subjectForPDF, encryption_key)
        decrypted_subjectForPDF= decrypted_subjectForPDF.strip()
        print("Decrypted Subject for PDF: ", decrypted_subjectForPDF)
        
        #Call the download_pdf function to download the pdf
        pdf_info= download_pdf(decrypted_subjectForPDF)
        print(pdf_info)
        return jsonify({"message": pdf_info})
    
    else:
        return jsonify({"error": "Invalid data type."})

def fetch_grade(subject, enrollment):
    # Find the exam document based on the subject\ print("Subject:", subject)
    print("Enrollment:", enrollment)
    print("Subject:", subject)

    # Find the exam document based on the Subject
    exam_document = exam_collection.find_one({"subject": subject})
    print("Exam Document:", exam_document)
    if not exam_document:
        return "Exam not found for this subject."

    # Find the user document based on the enrollment number
    user_document = user_collection.find_one({"enrollment": enrollment})
    print("User Document:", user_document)
    if not user_document:
        return "User not found."
    print("Exam ID:", exam_document['_id'])
    print("User ID:", user_document['_id'])
    
    # Find the solution document based on the user, exam, and uploadedBy fields
    solution_document = solution_collection.find_one({
        "uploadedBy": user_document["_id"],
        "exam": exam_document["_id"]
    })
    
    print("Solution Document:", solution_document)
    if solution_document:
        # Extract and return the grade from the solution document
        return solution_document.get("grade", "Grade not available.")
    else:
        return "Grade not found for this user and subject."

def get_user_data():
    user_id = request.form.get("user_id")
    user_data = user_collection.find_one({"_id": ObjectId(user_id)})
    if user_data:
        # Exclude the MongoDB document ID and any sensitive fields before returning
        user_data.pop('_id', None)
        user_data.pop('password', None)  # Example: If 'password' is a sensitive field
        user_data.pop('__v',None)
        user_data.pop('role',None)
        return jsonify(user_data)
    else:
        return jsonify({"error": "User ID not found in the database."})

def handle_predefined_message(predefined_message):
    # Implement logic to handle predefined messages
    if predefined_message == "Get exam Instructions":
        return "Here are the exam instructions: ..."
    elif predefined_message == "Check Score":
        # Ask for the subject
        return "Please enter the subject."
    elif predefined_message == "Get exam Details":
        return "Here are the exam details: ..."
    else:
        return "Unknown predefined message."

def get_student_exams(sem, branch):
    print("semester:", sem)
    print("Branch:", branch)
    # print(type(branch))
    
    try:
        exam_documents= exam_collection.find({"branch":branch,"sem":sem}) 
        print("Exam Documents:", exam_documents)
    except Exception as e:
        print("Erorr facing: ", e)
    
    exams_info = []
    today = datetime.now().date()  # Get today's date
    
    for exam_document in exam_documents:
        date_str = exam_document.get("date")  # Get the date string from the document
        if date_str:
            # Convert the date string to a datetime object
            exam_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            if exam_date > today:
                subject = exam_document.get("subject", "Subject not available")
                exams_info.append({"date": date_str, "subject": subject})
                
    # print("MD LIst: ",exams_info)
    if exams_info:
        for exam in exams_info:
            print("Date:", exam["date"])
            print("Subject:", exam["subject"])
        return exams_info
    else:
        return "No upcoming exams found for the specified semester and branch."

def download_pdf(subjectName):
    # Find PDF documents with the specified subject name
    pdf_documents = pdf_collection.find({"subject": subjectName})
    print("PDF Documents: ", pdf_documents)

    # Check if any PDF documents are found
    if pdf_documents:
        print("Found PDFs")

        for pdf_document in pdf_documents:
            fp = "E:\\Sem 8\\IBM_Project\\PracBot_Proj\\pracbot-main\\backend\\"
            pdf_file_path = pdf_document.get("path")
            pdf_file_path = fp + pdf_file_path

            file_name = os.path.basename(pdf_file_path)
            # download_dir = os.path.join(os.getcwd(), "downloads")
            # if not os.path.exists(download_dir):
            #     os.makedirs(download_dir)
            home_directory = os.path.expanduser("~")
            download_dir = os.path.join(home_directory,"Downloads")
            
            
            print("Download diretory testing: ",download_dir)
            # download_path = "E:\\Sem 8\\IBM_Project\\PracBot_Proj\\pracbot-main\\pracbot_Chatbot\\" + file_name
            download_path = download_dir+"\\"+file_name

            try:
                with open(pdf_file_path, 'rb') as source, open(download_path, 'wb') as dest:
                    shutil.copyfileobj(source, dest)
            except Exception as e:
                print("Error:", e)
                return "Error downloading PDF files for the specified subject name."

        return "PDF files downloaded successfully."
    else:
        return "No PDF files found for the specified subject name."


if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=False, port=10000)
    