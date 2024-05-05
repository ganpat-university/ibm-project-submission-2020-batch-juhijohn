import axios from "axios";
import RegistrationForm from "./RegistrationForm";
import UploadPaper from "./UploadPaper";

import UserDataTable from "./UserDataTable";
import { useEffect, useState } from "react";

const AdminDashboard = () => {

  const [count, setCount] = useState({
    total: 0,
    instructor: 0,
    student: 0
  })


  const fetchData = async () => {
    try {

      const response = await axios.get(
        `${process.env.REACT_APP_SERVERURL}/user/count`,
      );
      const { instructorsCount, studentsCount, totalCount } = response.data;
      setCount({
        total: totalCount,
        instructor: instructorsCount,
        student: studentsCount
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {

    fetchData();
  }, [])


  return (
    <>
      <section className="md:bg-gray-200">
        <div className="p-4 text-2xl ring-gray-400 ring-1">
          <h1>Admin Dashboard</h1>
        </div>
        <div className="mt-[3.5rem] mb-[4.25rem] ">
          <div className="flex flex-wrap justify-center gap-16 mt-3 mb-3 text-white">
            <div className="h-[6rem] md:w-[20%] p-3 bg-[#3B71CA] text-center rounded-md ">
              <p className="text-3xl font-bold pb-1">{count.total}</p>
              <p>Total Users</p>
            </div>
            <div className="h-[6rem] md:w-[20%] p-3  bg-[#E4A11B] text-center rounded-md">
              <p className="text-3xl font-bold pb-1">{count.student}</p>

              <p>Total Students</p>
            </div>
            <div className="h-[6rem] md:w-[20%] p-3 bg-[#54B4D3] text-center rounded-md">
              <p className="text-3xl font-bold pb-1">{count.instructor}</p>

              <p>Total instructors</p>
            </div>
          </div>
        </div>
        <div className="">
          <div className="md:bg-white md:w-[91.5%] w-full  lg:ml-[4rem] p-5 shadow-md">
            <UserDataTable />
          </div>
        </div>
        <div className="max-md:m-[0rem] max-lg:m-[10rem]  flex justify-center items-center h-[100vh] lg:h-[86vh] flex-wrap md:gap-[1.75rem]">
          <div className="md:bg-white px-[0rem] pb-[4rem] md:shadow-xl md:ring-1 ring-gray-200 w-full lg:w-[45%] ">
            <RegistrationForm />
          </div>
          <div className="md:bg-white px-[0rem] pb-[4rem] md:shadow-xl md:ring-1 ring-gray-200 w-full  lg:w-[45%]">
            <UploadPaper />
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
