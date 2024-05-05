import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import ExamTiming from "./ExamTiming";
import PdfThumbnail from "./PdfThumbnail";
import PdfComp from "./PdfComp";
import swal from 'sweetalert';

const GetStudentsExam = () => {
  const [ongoingExam, setOngoingExam] = useState(null);
  const [allExams, setAllExams] = useState([]);
  const { accessToken } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
 

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        // Fetch ongoing exam
        try {
          console.log(`1st`);
          const ongoingResponse = await axios.get(
            `${process.env.REACT_APP_SERVERURL}/exam/getStudentOngoing`,
            { headers }
          );
          if (ongoingResponse.data.success) {
            setOngoingExam(ongoingResponse.data.exam);
          }
        } catch (error) {
          console.log(error);
          
        } try {
          console.log(`2st`);

          const todayResponse = await axios.get(
            `${process.env.REACT_APP_SERVERURL}/exam/getforstudents`,
            { headers }
          );
          if (todayResponse.data.success) {
            setAllExams(todayResponse.data.exams);
          }
        } catch (error) {
          console.log(error);
          
        } try {  
          console.log(`3st`);

          const upcomingResponse = await axios.get(
          `${process.env.REACT_APP_SERVERURL}/exam/getupcoming`,
          { headers }
        );
        if (upcomingResponse.data.success) {
          setAllExams(prevExams => [...prevExams, ...upcomingResponse.data.exams]);
        }
          
        } catch (error) {
          console.log(error);
          
        }
        
      }
     
    fetchData();
  }, []);

  const handleFileUpload = async (examId) => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      };

      await axios.post(
        `${process.env.REACT_APP_SERVERURL}/solution/upload/${examId}`,
        formData,
        { headers }
      );
      swal({
        title: "Successfull",
        text: "Exam Scheduled Successfully!", 
        icon: "success",
        button: "Ok", 
      });
      console.log("File uploaded successfully!");
    } catch (error) {
      swal({
        title: "Failed",
        text: "Failed to upload Solution!", 
        icon: "error",
        button: "Ok",
      });
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`${process.env.REACT_APP_SERVERURL}/uploads/${pdf}`);
  };



  const handleClosePdfModal = () => {
    setPdfFile(null);
    setSelectedSolution(null);
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to format date to DD/MM/YY format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className=" ">
      <div className="flex flex-wrap justify-around">
        <div className=" lg:w-1/2 px-4">
          <h2 className="text-center font-bold text-3xl mt-2 mb-5">Ongoing Exam</h2>
          {ongoingExam && (
            <div className="bg-indigo-200 p-4 rounded-md shadow-md cursor-pointer mb-4">
              <div className="flex flex-wrap justify-around items-center">
                <div onClick={() => showPdf(ongoingExam.filename)}>
                  <PdfThumbnail pdfFile={`${process.env.REACT_APP_SERVERURL}/uploads/${ongoingExam.filename}`} />
                </div>
                <div>
                  <p className="font-bold">Exam: <span className="font-light">{ongoingExam.name}</span></p>
                  <p className="font-bold">Subject: <span className="font-light">{ongoingExam.subject}</span></p>
                  <p className="font-bold">Date: <span className="font-light">{formatDate(ongoingExam.date)}</span></p>
                  <p className="font-bold">Instructor: <span className="font-light">{ongoingExam.scheduledBy.fname} {ongoingExam.scheduledBy.lname} </span></p>
                  <p className="font-bold">Ends in: <ExamTiming deadline={ongoingExam.endTime} /></p>
                  <div>
                    <input
                      type="file"
                      className="my-2"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                    <button
                      onClick={() => handleFileUpload(ongoingExam._id)}
                      type="submit"
                      className="w-full mt-4 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-800"
                    >
                      Upload Solution
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-center font-bold text-3xl p-2">Upcoming Exams</h2>
          <div className="flex flex-col flex-wrap justify-center gap-4 items-center m-2">
            {allExams.map((exam) => (
              <div
                className="bg-indigo-200 p-4 rounded-md shadow-md hover:bg-indigo-300 hover:shadow-xl cursor-pointer mb-4"
                key={exam._id}
              >
                <div className="flex flex-col justify-center flex-wrap w-[19rem]">
                  <p className="font-bold">Exam: <span className="font-light">{exam.name}</span></p>
                  <p className="font-bold">Subject: <span className="font-light">{exam.subject}</span></p>
                  <p className="font-bold">Instructor: <span className="font-light">{exam.scheduledBy.fname} {exam.scheduledBy.lname} </span></p>
                  <p className="font-bold">Date: <span className="font-light">{formatDate(exam.date)}</span></p>
                  <p className="font-bold">Time: <span className="font-light">{formatTime(exam.startTime)}</span></p>
                </div>
              </div>
            ))}
            {pdfFile && (
              <PdfComp pdfFile={pdfFile} onClose={handleClosePdfModal} />
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default GetStudentsExam;
