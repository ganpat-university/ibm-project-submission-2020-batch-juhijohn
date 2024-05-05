import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../Context/AuthContext';

const Navbar = () => {
    const { handleLogout, accessToken } = useContext(AuthContext);

    return (
        <>
            <nav class=" p-4 shadow-md  bg-gradient-to-r from-[#2980b9] to-[#2c3e50] text-white">
                <div class="container mx-auto flex justify-between items-center">
                    <div class=" font-bold text-lg">
                        <Link to="/">
                            PracBot
                        </Link>
                    </div>

                    <div class="space-x-4 flex justify-between">
                        {accessToken ? <div>
                            <p onClick={handleLogout}>Logout</p>
                        </div> :
                            <Link to="/login">
                                <p className=''>Login</p>
                            </Link>
                        }
                    </div>
                </div>
            </nav>
        </>

    )
}

export default Navbar