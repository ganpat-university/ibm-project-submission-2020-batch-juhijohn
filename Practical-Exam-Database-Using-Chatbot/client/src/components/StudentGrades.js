import React, { useEffect, useState, useRef, useContext } from 'react';
import 'datatables.net-dt';
import 'datatables.net-dt/css/jquery.dataTables.css';
import $ from 'jquery';
import AuthContext from "../Context/AuthContext";
import axios from 'axios';
import PdfComp from './PdfComp';
import { Link } from 'react-router-dom';

function StudentGrades() {
    const [solutions, setSolutions] = useState([]);
    const { accessToken } = useContext(AuthContext);
    const tableRef = useRef(null);
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const dataTableRef = useRef(null);

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

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
                    `${process.env.REACT_APP_SERVERURL}/solution/grades`, // Update endpoint
                    { headers }
                );
                setSolutions(response.data.solutions);
            } catch (error) {
                console.error('Error fetching solutions:', error);
            }
        };

        fetchData();

        setTimeout(() => {
            if (tableRef.current && !dataTableRef.current) {
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
                    stripeClasses: [],
                    order: [[1, 'asc']]
                });
            }
            return () => {
                if (dataTableRef.current) {
                    dataTableRef.current.destroy();
                    dataTableRef.current = null;
                }
            };
        }, 1000);

    }, [accessToken, solutions]);

    const showPdf = (pdf) => {
        setPdfFile(`${process.env.REACT_APP_SERVERURL}/uploads/${pdf}`);
    };

    const handleViewSolution = (solution) => {
        setSelectedSolution(solution);
        showPdf(solution.filename);
    };

    const handleClosePdfModal = () => {
        setPdfFile(null);
        setSelectedSolution(null);
    };

    return (
        <div className="overflow-x-auto  md:mr-[0rem] mr-0">
            <table ref={tableRef} className="table-auto w-full border border-gray-300">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-gray-300">Name</th>
                        <th className="px-4 py-2 border-gray-300">Date</th>
                        <th className="px-4 py-2 border-gray-300">Subject</th>
                        <th className="px-4 py-2 border-gray-300">Grade</th>
                        <th className="px-4 py-2 border-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {solutions.map((solution) => (
                        <tr key={solution._id} >
                            <td className="border px-4 py-2 border-gray-300">{solution.exam.name}</td>
                            <td className="border px-4 py-2 border-gray-300">{formatDate(solution.exam.date)}</td>
                            <td className="border px-4 py-2 border-gray-300">{solution.exam.subject}</td>
                            <td className="border px-4 py-2 border-gray-300"> {solution.grade < 1 ? "N/A" : solution.grade}</td>
                            <td className="border py-2 border-gray-300 flex justify-center gap-4 ">
                                <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-800 " onClick={() => handleViewSolution(solution)}>
                                    View Solution
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

export default StudentGrades;
