import React, { useEffect, useState, useRef, useContext } from 'react';
import 'datatables.net-dt'; // Import DataTables library
import 'datatables.net-dt/css/jquery.dataTables.css'; // Import DataTables CSS file
import $ from 'jquery';
import AuthContext from "../Context/AuthContext";
import axios from 'axios';
import { Link } from 'react-router-dom';
import PdfComp from './PdfComp';
import swal from 'sweetalert';

function GetInstructorExam() {
    const [exams, setExams] = useState([]);
    const { accessToken } = useContext(AuthContext);
    const tableRef = useRef(null);
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const dataTableRef = useRef(null); // Ref to store DataTable instance

    // Function to format time to AM/PM format
    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Function to format date to DD/MM/YY format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
                const response = await axios.get(
                    `${process.env.REACT_APP_SERVERURL}/exam/getforinstructors`,
                    { headers }
                );
                setExams(response.data.exams);
            } catch (error) {
                console.error('Error fetching exams:', error);
            }
        };

        fetchData();

        setTimeout(() => {
            if (tableRef.current && !dataTableRef.current) {
                // Initialize DataTable only if it hasn't been initialized yet
                dataTableRef.current = $(tableRef.current).DataTable({
                    searching: true,
                    paging: true,
                    lengthMenu: [5, 10, 25, 50],
                    language: {
                        search: 'Search:',
                        lengthMenu: 'Show _MENU_ entries',
                        info: 'Showing _START_ to _END_ of _TOTAL_ entries',
                        paginate: {
                            first: 'First',
                            last: 'Last',
                            next: 'Next',
                            previous: 'Previous'
                        }
                    },
                    stripeClasses: [], // Empty array to disable DataTables' default stripe classes
                    // Set default sorting by date column, ascending order
                    order: [[1, 'asc']]
                });
            }
            return () => {
                // Cleanup: Destroy DataTable instance when component unmounts
                if (dataTableRef.current) {
                    dataTableRef.current.destroy();
                    dataTableRef.current = null;
                }
            };
        }, 1000);

    }, [accessToken, exams]);
    const showPdf = (pdf) => {
        setPdfFile(`{}/uploads/${pdf}`);
    };

    const handleViewSolution = (solution) => {
        setSelectedSolution(solution);
        showPdf(solution.filename);
    };

    const handleClosePdfModal = () => {
        setPdfFile(null);
        setSelectedSolution(null);
    };

    const handleDelete = async (examId) => {
        try {
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            await axios.delete(
                `${process.env.REACT_APP_SERVERURL}/exam/delete/${examId}`,
                { headers }
            );
            setExams(exams.filter(exam => exam._id !== examId));
            swal("Deleted!", "Exam has been deleted!", "success");
        } catch (error) {
            console.error('Error deleting user:', error);
            swal({
                title: "Failed!",
                text: "Failed to delete user!",
                icon: "error",
                button: "Ok",
            });
        }
    }
    return (
        <div className="overflow-x-auto  md:mr-[0rem] mr-0">
            <table ref={tableRef} className="table-auto w-full border border-gray-300">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-gray-300">Name</th>
                        <th className="px-4 py-2 border-gray-300">Date</th>
                        <th className="px-4 py-2 border-gray-300">Start Time</th>
                        <th className="px-4 py-2 border-gray-300">End Time</th>
                        <th className="px-4 py-2 border-gray-300">Branch</th>
                        <th className="px-4 py-2 border-gray-300">Sem</th>
                        <th className="px-4 py-2 border-gray-300">Subject</th>
                        <th className="px-4 py-2 border-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map((exam, index) => (
                        <tr key={exam._id} >
                            <td className="border px-4 py-2 border-gray-300">{exam.name}</td>
                            <td className="border px-4 py-2 border-gray-300">{formatDate(exam.date)}</td>
                            <td className="border px-4 py-2 border-gray-300">{formatTime(exam.startTime)}</td>
                            <td className="border px-4 py-2 border-gray-300">{formatTime(exam.endTime)}</td>
                            <td className="border px-4 py-2 border-gray-300">{exam.branch}</td>
                            <td className="border px-4 py-2 border-gray-300">{exam.sem}</td>
                            <td className="border px-4 py-2 border-gray-300">{exam.subject}</td>
                            <td className="border py-2 border-gray-300 flex justify-center gap-4 ">
                                <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-800 " onClick={() => handleViewSolution(exam)}>
                                    View Paper
                                </button>
                                <button type="submit" className="bg-[#575f66] text-white py-2 px-4 rounded-md hover:bg-[#394046] ">
                                    <Link to={`/exams/${exam._id}/solutions`}>Solutions</Link>
                                </button>

                                <button type="submit" className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-800 " onClick={() => handleDelete(exam._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {pdfFile && (
                <PdfComp pdfFile={pdfFile} onClose={handleClosePdfModal} />
            )}
        </div>
    );
}

export default GetInstructorExam;
