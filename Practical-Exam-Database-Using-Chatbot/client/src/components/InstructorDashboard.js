import React from 'react'
import UploadExam from './UploadExam'
import GetInstructorExam from './GetInstructorExam'
import OngoingExam from './OngoingExam'
import OngoingExamContainer from './OngoingExamContainer'
// import GetSolutions from './GetSolutions'd

const InstructorDashboard = () => {
  return (
    <>
      <section className='bg-gray-200 flex justify-center flex-col-reverse flex-wrap '>
        <div className='flex justify-center gap-10'>
          <div className='m-1 p-2 bg-white w-[45%] '>
            <UploadExam />
          </div>
          <div>
            <OngoingExamContainer />
          </div>
        </div>
        {/* <GetSolutions /> */}
        <div className=' m-3 p-2'>
          <h2 className='text-[1.65rem] font-bold mb-[2rem]'>Scheduled Exam</h2>
          <GetInstructorExam />
        </div>
      </section>
    </>
  )
}

export default InstructorDashboard