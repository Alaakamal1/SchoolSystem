import { useState } from 'react'
import './App.css'
import { Routes, Route, useLocation } from "react-router";
import { AuthProvider } from "./core/context/UseAuth";
import ProtectedRoute from "./core/components/ProtectedRoute";
import Dashboard from './pages/admin/Dashboard'
import Addstudent from './pages/admin/Addstudent';
import AddAttendance from './pages/admin/AddAttendance';
import Addteacher from './pages/admin/Addteacher';
import AddSubjects from './pages/admin/AddSubjects';
import Sidebar from './core/components/layout/Sidebar';
import AddExam from './pages/teachers/AddExam';
import Students from './pages/students/students';
import GetExam from './pages/students/GetExam';
import ShowExams from './pages/students/ShowExams';
import ShowAttendance from './pages/students/ShowAttendance';
import Header from './core/components/layout/Header';
import LoginPage from './pages/auth/LoginPage';
import TeacherDetials from './pages/admin/teacherDetials';
import { ToastContainer } from 'react-toastify';

function App() {
  const location = useLocation();
  const hideSidebarPaths = ["/login"];
  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);
  const [title, setTitle] = useState("Dashboard");
  const isNested = location.pathname.split("/").length > 2;
  return (
    <>
       <AuthProvider>
        <div className="flex gap-4">
          {!shouldHideSidebar && (
            <Sidebar onClick={(value) => setTitle(value)} />
          )}
          <div className="flex-grow mr-4 relative">
            {!shouldHideSidebar && !isNested && <Header title={title} />}

            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute role={"admin"}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
                <Route
                  path="/admin/addteacher"
                  element={
                    <ProtectedRoute role={"admin"}>
                      <Addteacher/>
                    </ProtectedRoute>
                  }
                />
              <Route
                path="/admin/addstudent"
                element={
                  <ProtectedRoute role={"admin"}>
                    <Addstudent/>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/addattndance"
                element={
                  <ProtectedRoute role={"admin"}>
                    <AddAttendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/teacher/:id"
                element={
                  <ProtectedRoute role={"admin"}>
                    <TeacherDetials/>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/addattndance"
                element={
                  <ProtectedRoute role={"admin"}>
                    <AddSubjects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/addexam"
                element={
                  <ProtectedRoute role={"teacher"}>
                    <AddExam/>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/:id"
                element={
                  <ProtectedRoute role={"teacher"}>
                    <TeacherDetials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute role={"student"}>
                  <Students />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/getexam"
                element={
                  <ProtectedRoute role={"student"}>
                    <GetExam/>
                  </ProtectedRoute>
                }
              />
                <Route
                path="/students/showgrade"
                element={
                  <ProtectedRoute role={"student"}>
                    <ShowExams/>
                  </ProtectedRoute>
                }
              />
                <Route
                path="/students/showattendance"
                element={
                  <ProtectedRoute role={"student"}>
                    <ShowAttendance />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
        <ToastContainer/>
      </AuthProvider>
    </>
  )
}

export default App
