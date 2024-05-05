import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { pdfjs } from 'react-pdf';
import PdfComp from './PdfComp';
import PdfThumbnail from './PdfThumbnail';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

const ViewPapers = () => {
  const [allPaper, setAllPapers] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [filter, setFilter] = useState({
    year: '',
    filename: '',
    subject: '',
    branch: '',
  });

  const getPdf = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_SERVERURL}/paper/all`);
      console.log("papers",result.data.papers);
      setAllPapers(result.data.papers);
    } catch (error) {
      console.log(error);
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`${process.env.REACT_APP_SERVERURL}/uploads/${pdf}`);
  };

  useEffect(() => {
    getPdf();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  useEffect(() => {
    const handleFilterSubmit = async () => {
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_SERVERURL}/paper/filter?branch=${filter.branch}&subject=${filter.subject}&year=${filter.year}&filename=${filter.filename}`
        );
        console.log(result.data.papers);
        setAllPapers(result.data.papers);
      } catch (error) {
        console.log(error);
      }
    };

    handleFilterSubmit();
  }, [filter]);

  return (
    <div className="App  ">
      <div className="pt-8">
        <div className='pb-3'>
        
        <label>
            Filename:
          </label>
            <input className='mx-2 px-2 py-1 ring-1 ring-inset ring-gray-300' type="text" name="filename" value={filter.filename} onChange={handleFilterChange} />

          <label>
            Year:
          </label>
            <select className="mx-2 rounded-md px-2 py-1 ring-1 ring-inset ring-gray-300" name="year" value={filter.year} onChange={handleFilterChange} >
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>

          <label>
            Subject:
          </label>
          <select className="mx-2 rounded-md px-2 py-1 ring-1 ring-inset ring-gray-300" name="subject" value={filter.subject} onChange={handleFilterChange} >
              <option value="IOT">IOT</option>
              <option value="CD">CD</option>
              <option value="DBMS">DBMS</option>
              <option value="ESFP">ESFP</option>
            </select>
          
          <label>
            Branch:
          </label>
          <select className="mx-2 rounded-md px-2 py-1 ring-1 ring-inset ring-gray-300" name="branch" value={filter.branch} onChange={handleFilterChange} >
              <option value="CBA">CBA</option>
              <option value="CS">CS</option>
              <option value="BDA">BDA</option>
            </select>
          
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4  ">
          {allPaper == null
            ? ''
            : allPaper.map((data) => (
                <div
                  className="p-2 mx-[6rem] my-4 cursor-pointer transform transition-transform hover:scale-125"
                  key={data._id}
                  onClick={() => showPdf(data.filename)}
                >
                  <PdfThumbnail pdfFile={`${process.env.REACT_APP_SERVERURL}/uploads/${data.filename}`} />
                  <h6>{data.filename.slice(0, data.filename.indexOf('.pdf'))} - {data.year}</h6>
                </div>
              ))}
        </div>
      </div>
      {pdfFile && <PdfComp pdfFile={pdfFile} onClose={() => setPdfFile(null)} />}
    </div>
  );
};

export default ViewPapers;
