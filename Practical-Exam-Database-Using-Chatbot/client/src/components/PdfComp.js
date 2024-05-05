import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import axios from 'axios';
import { MdOutlineFileDownload } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";

function PdfComp(props) {
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(true);

    useEffect(() => {
        setIsModalOpen(true);
    }, [props.pdfFile]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        props.onClose(); // Call onClose to reset pdfFile state in GetSolutions component
    };

    const handleDownload = async (filename) => {
        try {
            const result = await axios.get(filename, {
                responseType: 'blob',
            });

            const blob = new Blob([result.data], { type: 'application/pdf' });

            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'downloaded.pdf';

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex justify-center">
            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto bg-opacity-50 backdrop-blur-md">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                            onClick={closeModal}
                        >
                            <div className="absolute opacity-75"></div>
                        </div>

                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl ">
                            <div className="p-4 bg-gray-100 shadow-lg">
                                <div className="flex justify-end gap-4">
                                    <MdOutlineFileDownload className="text-[2rem] cursor-pointer" onClick={() => handleDownload(props.pdfFile)} />
                                    <IoCloseSharp className="text-[2rem] cursor-pointer" onClick={closeModal} />
                                </div>
                                <p>
                                    Page  {pageNumber} of {numPages}
                                </p>

                                <div className="flex justify-center ">
                                    <Document
                                        file={props.pdfFile}
                                        className=""
                                        onLoadSuccess={onDocumentLoadSuccess}
                                    >
                                        {Array.apply(null, Array(numPages))
                                            .map((x, i) => i + 1)
                                            .map((page) => (
                                                <Page
                                                    key={page}
                                                    className=""
                                                    pageNumber={page}
                                                    renderTextLayer={false}
                                                    renderAnnotationLayer={false}
                                                />
                                            ))}
                                    </Document>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PdfComp;
