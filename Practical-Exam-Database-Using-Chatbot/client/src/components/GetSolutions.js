import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import PdfComp from './PdfComp';
import { useParams } from 'react-router-dom';
import AuthContext from '../Context/AuthContext';
import $ from 'jquery';
import 'datatables.net-dt'; // Import DataTables library
import 'datatables.net-dt/css/jquery.dataTables.css';

const GetSolutions = () => {
    const { examId } = useParams();
    const [solutions, setSolutions] = useState([]);
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const { accessToken } = useContext(AuthContext);
    const tableRef = useRef(null);
    const dataTableRef = useRef(null); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                };

                const response = await axios.get(`${process.env.REACT_APP_SERVERURL}/solution/getbyexam/${examId}`, { headers });
                setSolutions(response.data.solutions);
            } catch (error) {
                console.error('Error fetching solutions:', error);
            }
        };

        fetchData();

        setTimeout(() => {
            if (tableRef.current && !dataTableRef.current) {
                dataTableRef.current = $(tableRef.current).DataTable({
                    searching: false,
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
                });
            }
            return () => {
                if (dataTableRef.current) {
                    dataTableRef.current.destroy();
                    dataTableRef.current = null;
                }
            };
        }, 1000);

    }, [accessToken, examId]);

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

    const handleGradeChange = (e, index) => {
        const updatedSolutions = [...solutions];
        updatedSolutions[index].grade = e.target.value;
        setSolutions(updatedSolutions);
    };

    const handleGradeUpdate = async (solutionId, newGrade) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_SERVERURL}/solution/grade/${solutionId}`,
                { grade: newGrade },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                }
            );

            console.log("Grade updated successfully:", response.data.updateSolution);
        } catch (error) {
            console.log("Error updating grade:", error);
        }
    };

    return (
        <div className="overflow-x-auto ml-[0rem] md:ml-[4rem] md:mr-[4rem] mr-0">
            <table ref={tableRef} className="table-auto min-w-full border border-gray-300">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-gray-300">Exam</th>
                        <th className="px-4 py-2 border-gray-300">Subject</th>
                        <th className="px-4 py-2 border-gray-300">Sem</th>
                        <th className="px-4 py-2 border-gray-300">Uploaded By</th>
                        <th className="px-4 py-2 border-gray-300">Grade</th>
                        <th className="px-4 py-2 border-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {solutions.map((solution, index) => (
                        <tr key={solution._id}>
                            <td className="border px-4 py-2 border-gray-300">{solution.exam.name}</td>
                            <td className="border px-4 py-2 border-gray-300">{solution.exam.subject}</td>
                            <td className="border px-4 py-2 border-gray-300">{solution.exam.sem}</td>
                            <td className="border px-4 py-2 border-gray-300">{solution.uploadedBy.enrollment}</td>
                            <td className="border px-4 py-2 border-gray-300">
                                <input
                                    type="text"
                                    value={solution.grade}
                                    onChange={(e) => handleGradeChange(e, index)}
                                />
                            </td>
                            <td className="border px-4 py-2 border-gray-300 ">
                                <button
                                    type="button"
                                    className="bg-[#007bff] text-white py-2 px-4 rounded-md hover:bg-[#337fcf] ml-2"
                                    onClick={() => handleViewSolution(solution)}
                                >
                                    View Solution
                                </button>
                                <button
                                    type="button"
                                    className="bg-[#6c757d] text-white py-2 px-4 rounded-md hover:bg-[#444a4e] ml-2"
                                    onClick={() => handleGradeUpdate(solution._id, solution.grade)}
                                >
                                    Grade
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
};

export default GetSolutions;
