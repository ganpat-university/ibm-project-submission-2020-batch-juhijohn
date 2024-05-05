
import React, { useState } from 'react';

const SolutionViewer = ({ solution }) => {
  const [showPdf, setShowPdf] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  const togglePdf = () => {
    setShowPdf(!showPdf);
  };

  return (
    <li>
      <div>
        <p>{solution.filename}</p>
        <button onClick={togglePdf}>Show PDF</button>
      </div>
      {showPdf && (
        <>
          <h2>{solution._id}</h2>
          <embed src={solution.path} type="application/pdf" width="100%" height="600px" />
        </>
      )}
    </li>
  );
}

export default SolutionViewer;

