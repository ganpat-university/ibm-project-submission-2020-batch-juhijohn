import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import OngoingExam from './OngoingExam';
import AuthContext from "../Context/AuthContext";

const OngoingExamContainer = () => {
    const [ongoingExam, setOngoingExam] = useState(null);
    const [error, setError] = useState(null);
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchOngoingExam = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_SERVERURL}/exam/getOngoing`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        },
                    }
                );
                setOngoingExam(response.data.exam);
            } catch (error) {
                setError('Error fetching ongoing exam');
            }
        };

        fetchOngoingExam();
    }, []);

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            {ongoingExam && <OngoingExam exam={ongoingExam} />}
        </div>
    );
};

export default OngoingExamContainer;