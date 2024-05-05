import './App.css';
import AdminDashboard from './components/AdminDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import Login from './components/Login';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import StudentDashboard from './components/StudentDashboard';
import ViewPapers from './components/ViewPapers';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import AuthProvider from './Context/AuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GetSolutions from './components/GetSolutions';
import { useEffect } from 'react';
function App() {
 
  return (
    <>
      <GoogleOAuthProvider clientId="729680220811-ikh30vg95j4710spbisa0qhbm540mmov.apps.googleusercontent.com">
        <BrowserRouter>

          <AuthProvider>

            <Navbar />
            <Routes>
              <Route exact path="/" element={<ViewPapers />} />
              <Route exact path="/login" element={<Login />} />

              <Route path="/user/*" element={<PrivateRoute role="student" />}>
                <Route path="student-dashboard" element={<StudentDashboard />} />
              </Route>
              <Route path="/user/*" element={<PrivateRoute role="admin" />}>
                <Route path="admin-dashboard" element={<AdminDashboard />} />
              </Route>
              <Route path="/user/*" element={<PrivateRoute role="instructor" />}>
                <Route path="instructor-dashboard" element={<InstructorDashboard />} />
              </Route>
              <Route path="/exams/:examId/solutions" element={<GetSolutions />} />

            </Routes>

          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>

    </>
  );
}

export default App;
