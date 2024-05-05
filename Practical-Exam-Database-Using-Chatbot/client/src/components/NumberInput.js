import React, { useContext, useState } from 'react';
import axios from 'axios';
import AuthContext from '../Context/AuthContext';

const NumberInput = ({ solutionId }) => {
  const { accessToken } = useContext(AuthContext);
  const [value, setValue] = useState(0);
  const [grade, setGrade] = useState(0);
  const [marks, setMarks] = useState(null); 

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.put(
        `${process.env.REACT_APP_SERVERURL}/solution/grade/${solutionId}`,
        { grade },
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

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setValue(isNaN(newValue) ? 0 : newValue);
  };

  const increment = () => {
    setValue(value + 1);
  };

  const decrement = () => {
    setValue(value - 1);
  };

  return (
    <>
      <div className="flex items-center" hidden={marks !== null}>
        <button
          className="bg-indigo-500 text-white text-[1.25rem] rounded-sm p-2 w-8 hover:bg-indigo-700 focus:outline-none text-center"
          onClick={decrement}
        >
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          className="w-[3rem] rounded-sm border border-indigo-200 mx-3 py-1 text-center focus:outline-none"
        />
        <button
          className="bg-indigo-500 text-white text-[1.25rem] rounded-sm p-2 h-9 w-8 hover:bg-indigo-700 focus:outline-none text-center"
          onClick={increment}
        >
          +
        </button>
      </div>
      <div className='flex '>
       
        <button
          onClick={handleUpdate}
          type="submit"
          className="w-[50%] mt-2 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-800"
          hidden={marks !== null} // Disable button if marks are already displayed
        >
          Grade
        </button>
        {marks !== null && (
          <p className="mt-2 ml-2">Marks: {marks}</p> 
        )}
      </div>
    </>
  );
};

export default NumberInput;
