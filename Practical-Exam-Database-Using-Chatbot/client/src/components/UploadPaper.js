import React, { useState } from "react";
import axios from "axios";
import swal from "sweetalert";
const UploadPaper = () => {
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("");
  const [file, setFile] = useState("");
  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("year", year);
    formData.append("subject", subject);
    formData.append("branch", branch);
    formData.append("file", file);
    console.log(subject, year, branch, file);
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_SERVERURL}/paper/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(result);
      swal({
        title: "Successfull",
        text: "Paper Uploaded Successfully!", 
        icon: "success",
        button: "Ok",
      });
      setYear("");
      setSubject("");
      setBranch("");
      setFile("");
    } catch (e) {
      console.log(e);
      swal({
        title: "Failed!",
        text: "Failed to Upload Paper!", 
        icon: "error",
        button: "Ok",
      });
    }
  };
  return (
    <div className="App">
      <h2 className=" mb-[2rem] font-bold text-2xl md:text-[1.5rem] text-indigo-900  border-b-2 border-gray-200  p-3">
        Upload a Paper
      </h2>

      <form className="formStyle px-8" onSubmit={submitImage}>
        <select
          className="mb-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-indigo-200 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Branch
          </option>
          <option value="CBA">CBA</option>
          <option value="BDA">BDA</option>
          <option value="CS">CS</option>
        </select>
        <select
          className="mb-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-indigo-200 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Subject
          </option>
          <option value="CD">CD</option>
          <option value="IOT">IOT</option>
          <option value="ML">ML</option>
          <option value="TOC">TOC</option>
          <option value="DBMS">DBMS</option>
        </select>
        <select
          className="mb-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-indigo-200 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Year
          </option>
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
        </select>
        <br />
        <input
          type="file"
          className="mb-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-indigo-200 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <div className="flex ">
          <button
            type="submit"
            className="w-full mt-4 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-800"
          >
            Upload Paper
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPaper;
