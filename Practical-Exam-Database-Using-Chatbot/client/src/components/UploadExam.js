import React, { useContext, useState } from 'react';
import axios from 'axios';
import AuthContext from '../Context/AuthContext';
import swal from 'sweetalert';

const UploadExam = () => {
  const { accessToken } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("");
  const [sem, setSem] = useState("");
  const [file, setFile] = useState("");
  const [date, setDate] = useState(""); // Added state for date
  const [startTime, setStartTime] = useState(""); // Added state for startTime
  const [endTime, setEndTime] = useState(""); // Added state for endTime

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("subject", subject);
    formData.append("branch", branch);
    formData.append("file", file);
    formData.append("sem", sem);
    formData.append("date", date); 
    formData.append("startTime", startTime); // Appending startTime to formData
    formData.append("endTime", endTime); // Appending endTime to formData
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_SERVERURL}/exam/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        }
      );
      console.log(result);
      console.log("upload successful!");
      swal({
        title: "Successfull",
        text: "Exam Scheduled Successfully!", 
        icon: "success",
        button: "Ok",
      });
      setName("");
      setSubject("")
      setBranch("");
      setFile("");
      setSem("");
      setDate("");
      setStartTime("")
      setEndTime("")

    }
    catch (e) {
      console.log(e);
      alert("Failed!!!");
      swal({
        title: "Failed!",
        text: "Failed to schedule exam!", 
        icon: "error",
        button: "Ok",
      });

    }
  };

  return (
    <div className="App ">
      <h2 className='my-[2rem] font-bold text-2xl md:text-[1.75rem] text-gray-800'>Schedule a exam</h2>
      <form className="formStyle px-[3.5rem] mb-2" onSubmit={submitImage}>
        <input className=' mb-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-indigo-200 focus:ring focus:ring-indigo-200 focus:ring-opacity-50' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <select
          className="mb-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-indigo-200 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          required
        >
          <option value="" disabled>Select Branch</option>
          <option value="CBA">CBA</option>
          <option value="BDA">BDA</option>
          <option value="CS">CS</option>
        </select>
        <select
          className="mb-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-indigo-200 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={sem}
          onChange={(e) => setSem(e.target.value)}
          required
        >
          <option value="" disabled>Select Semester</option>
          <option value="1">1</option>
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="7">7</option>
        </select>
        <select
          className="mb-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-indigo-200 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        >
          <option value="" disabled>Select Subject</option>
          <option value="IOT">IOT</option>
          <option value="CD">CD</option>
          <option value="AI">AI</option>
          <option value="DBMS">DBMS</option>
        </select>
        {/* Other select inputs */}


        <input
          type="date"
          className="mb-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-indigo-200 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          className="mb-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-indigo-200 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <input
          type="time"
          className="mb-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-indigo-200 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <input
          type="file"
          className="mb-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-indigo-200 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <div className='flex '>
          <button type="submit" className="w-full mb-2 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-800">Schedule Exam</button>
        </div>
      </form>
    </div>
  );
}

export default UploadExam;
