import React, { useEffect, useState, useRef, useContext } from 'react';
import 'datatables.net-dt'; // Import DataTables library
import 'datatables.net-dt/css/jquery.dataTables.css'; // Import DataTables CSS file
import $ from 'jquery';
import AuthContext from "../Context/AuthContext";
import axios from 'axios';
import swal from 'sweetalert';

function UserDataTable() {
    const [users, setUsers] = useState([]);
    const { accessToken } = useContext(AuthContext);
    const tableRef = useRef(null);
    const dataTableRef = useRef(null); // Ref to store DataTable instance

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
                const response = await axios.get(
                    `${process.env.REACT_APP_SERVERURL}/user/all`,
                    { headers }
                );
                // Axios automatically parses JSON responses, no need to call response.json()
                console.log(response.data.users);
                setUsers(response.data.users); // Use response.data directly
            } catch (error) {
                console.error('Error fetching users:', error);
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

    }, []);

    const handleDelete = async (userId) => {
        try {
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            await axios.delete(
                `${process.env.REACT_APP_SERVERURL}/user/delete/${userId}`,
                { headers }
            );
            // Remove the user from the state
            setUsers(users.filter(user => user._id !== userId));
            swal("Deleted!", "User has been deleted!", "success");
        } catch (error) {
            console.error('Error deleting user:', error);
            swal({
                title: "Failed!",
                text: "Failed to delete user!", 
                icon: "error",
                button: "Ok",
              });
        }
    };

    const handleUpdate = async (userId, updatedUser) => {
        try {
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await axios.put(
                `${process.env.REACT_APP_SERVERURL}/user/update/${userId}`,
                updatedUser,
                { headers }
            );
            const updatedUsers = users.map(user =>
                user._id === userId ? response.data.user : user
            );
            setUsers(updatedUsers);
          
        } catch (error) {
            swal({
                title: "Failed!",
                text: "Failed to update user!", 
                icon: "error",
                button: "Ok",
              });
            console.error('Error updating user:', error);
        }
    };

    // Reinitialize DataTable whenever users change

    return (
        <div className="overflow-x-auto ml-[0rem] md:ml-[4rem] md:mr-[4rem] mr-0">
            <table ref={tableRef} className="table-auto min-w-full border border-gray-300">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-gray-300">First Name</th>
                        <th className="px-4 py-2 border-gray-300">Last Name</th>
                        <th className="px-4 py-2 border-gray-300">Email</th>
                        <th className="px-4 py-2 border-gray-300">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id} >
                            <td className="border px-4 py-2 border-gray-300">
                                <input
                                    type="text"
                                    value={user.fname}
                                    onChange={e => {
                                        const updatedUser = { ...user, fname: e.target.value };
                                        handleUpdate(user._id, updatedUser);
                                    }}
                                />
                            </td>
                            <td className="border px-4 py-2 border-gray-300">
                                <input
                                    type="text"
                                    value={user.lname}
                                    onChange={e => {
                                        const updatedUser = { ...user, lname: e.target.value };
                                        handleUpdate(user._id, updatedUser);
                                    }}
                                />
                            </td>
                            <td className="border px-4 py-2 border-gray-300">
                                <input
                                    type="text"
                                    value={user.email}
                                    onChange={e => {
                                        const updatedUser = { ...user, email: e.target.value };
                                        handleUpdate(user._id, updatedUser);
                                    }}
                                />
                            </td>
                            <td className="border px-4 py-2 border-gray-300 flex justify-center">
                                <button type="button" className="bg-[#dc3545] text-white py-2 px-4 rounded-md hover:bg-[#b12929] mr-2" onClick={() => handleDelete(user._id)}>
                                    Delete
                                </button>
                                <button type="button" className="bg-[#f1c02d] text-white py-2 px-4 rounded-md hover:bg-[#ffcc33] ml-2" onClick={() => handleUpdate(user._id, user)}>
                                    Update
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserDataTable;
