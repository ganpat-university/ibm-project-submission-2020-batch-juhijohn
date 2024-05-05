import React, { useState } from "react";
import { Document, Page } from "react-pdf";

function PdfThumbnail(props) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="flex justify-center ">
      <div className="p-2 rounded-md bg-slate-200 ">
        <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            className="mt-3 bg-slate-700"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            scale={0.2}
          />
        </Document>
      </div>
    </div>
  );
}

export default PdfThumbnail;
