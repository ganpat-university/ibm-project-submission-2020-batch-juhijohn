import React from 'react';
import PdfThumbnail from './PdfThumbnail';

const OngoingExam = ({ exam }) => {
    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };



    return (
        <div className="border mt-1 border-gray-300 shadow-md mb-4 bg-white">
            <div className="">
                <h2 className=' font-bold text-2xl md:text-[1.75rem] text-gray-800  border-gray-300 border-b-2 px-[2rem] p-3'>Ongoing exam</h2>

                <div className='p-[3rem]'>
                    <PdfThumbnail pdfFile={`${process.env.REACT_APP_SERVERURL}/uploads/${exam.filename}`} />

                </div>
                <div className='px-[3rem] pb-[2rem] flex flex-col justify-center'>
                    <p><span className="font-semibold">Name: </span>{exam.name}</p>
                    <p><span className="font-semibold">Date: </span>{formatDate(exam.date)}</p>
                    <p><span className="font-semibold">Subject: </span>{exam.subject}</p>
                    <p><span className="font-semibold">Start Time: </span>{formatTime(exam.startTime)}</p>
                    <p><span className="font-semibold">End Time: </span> {formatTime(exam.endTime)}</p>
                    {/* <button type="submit" className="bg-red-600 text-white my-3 py-2 px-4 rounded-md hover:bg-red-800 w-full">
                        Delete
                    </button> */}
                </div>

            </div>
        </div>
    );
};

export default OngoingExam;
