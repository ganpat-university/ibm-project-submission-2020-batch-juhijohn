import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import AuthContext from "./AuthContext";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeToken] = useCookies(["access_token"]);
  const [accessToken, setAccessToken] = useState(cookies["access_token"] || "");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate()
  useEffect(() => {
    setAccessToken(cookies.access_token);
    setIsAuthenticated(true);
    if (!cookies.access_token) {
      setIsAuthenticated(false);
      console.log("Not");
    }
    console.log("access token", accessToken);
  }, [cookies]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    googleLogout();
    removeToken(["access_token"]);
    setAccessToken("");
    navigate('/')
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, accessToken, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
