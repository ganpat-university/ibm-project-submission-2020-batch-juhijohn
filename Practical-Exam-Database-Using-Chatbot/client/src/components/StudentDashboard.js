import React, { useState } from 'react';
import GetStudentsExam from './GetStudentsExam';
import StudentGrades from './StudentGrades';
import bot from '../images/bot2.jpg';
import useOutsideWindowActivity from '../Hooks/useOutsideWindowActivity';
import { IoMdClose } from "react-icons/io";

const StudentDashboard = () => {
  const isOutsideActivity = useOutsideWindowActivity();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleChatbot = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsChatbotOpen(prevState => !prevState);
      setIsAnimating(false);
    }, 500); 
  };

  if (!isOutsideActivity) {
    console.log('User switched to another application or window');
  }

  return (
    <>
      <section className='bg-gray-200 h-[91.5vh]'>
        <div>
          <GetStudentsExam />
        </div>
        <div className='mt-3'>
          <StudentGrades />
        </div>
        <div style={{ position: 'fixed', right: 10, bottom: 10, zIndex: 9999 }}>
          {isChatbotOpen ? (
            <>
              <button onClick={toggleChatbot} className={`transition-transform duration-500 transform ${isAnimating ? 'rotate-180' : 'rotate-0'}`}><IoMdClose className='text-blue-800 text-[3rem]' /></button>
              <div style={{ position: 'absolute', bottom: '100%', right: 0 }}>
                {/* Your chatbot component */}
                <iframe
                  src="http://localhost:5002/"  
                  width="400px"
                  height="500px"
                  title="Chatbot"
                  style={{ border: 'none' }}
                />
              </div>
            </>
          ) : (
            <button onClick={toggleChatbot} className={`bg-transparent transition-transform duration-500 transform ${isAnimating ? 'rotate-180' : 'rotate-0'}`}>
              <img src={bot} alt="Logo" className="rounded-full w-20 h-20" />
            </button>
          )}
        </div>
      </section>
    </>
  );
};

export default StudentDashboard;
