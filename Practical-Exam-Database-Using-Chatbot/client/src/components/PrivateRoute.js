import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../Context/AuthContext';
import axios from 'axios';

const PrivateRoute = ({ role }) => {
  const { isAuthenticated, accessToken } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [renderComponent, setRenderComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVERURL}/user/check/${accessToken}`);
        setUserRole(response.data.role);
      } catch (error) {
        console.log(error);
        console.log("Failed to decode!");
        setUserRole('guest');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      checkRole();
    } else {
      setUserRole('guest');
      setLoading(false);
    }
  }, [accessToken, isAuthenticated]);

  useEffect(() => {
    if (userRole !== null) {
      if (isAuthenticated && userRole === role) {
        setRenderComponent(<Outlet />);
        console.log(role);
      } else {
        console.log(role);
        setRenderComponent(<Navigate to="/login" />);
      }
    }
  }, [isAuthenticated, userRole]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return renderComponent || null;
};

export default PrivateRoute;
