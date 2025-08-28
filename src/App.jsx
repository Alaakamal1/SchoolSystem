import { useState } from "react";
import "./App.css";
import { Routes, Route, useLocation ,Navigate} from "react-router";
import { AuthProvider } from "./core/context/UseAuth";
import Sidebar from "./core/components/layout/Sidebar";
import ProtectedRoute from "./core/components/ProtectedRoute";
import Header from "./core/components/layout/Header";
import { ToastContainer } from "react-toastify";
///Admin
import AdminDashboard from "./pages/admin/dashbord/AdminDashboard";
import TeachersTable from "./pages/admin/teachers/TeachersTable";
import StudentsTable from "./pages/admin/students/StudentsTable";
import LoginPage from "./pages/auth/LoginPage";
import AddStudent from "./pages/admin/students/AddStudent";
import StudentDetials from "./pages/admin/students/StudentDetials";
import AddAttendance from "./pages/admin/attendance/AddAttendance";
import Addteacher from "./pages/admin/teachers/AddTeacher";
import TeacherDetials from "./pages/admin/teachers/TeacherDetials";
import AddSubject from "./pages/admin/subject/AddSubject";
import SubjectsTable from "./pages/admin/subject/SubjectsTable";
import ClassesTable from "./pages/admin/classes/ClassesTable";
import AddClassroom from "./pages/admin/classes/AddClassroom";
import AttendancePage from "./pages/admin/attendance/Attendance";

//Teacher
import AddExam from "./pages/teachers/exam/AddExam";
import TeacherDashbord from "./pages/teachers/dashbord/TeacherDashboard";

//Student
import StudentsDashbord from "./pages/students/dashbord/StudentDashboard";
// import Students from "./pages/students/students";
import GetExam from "./pages/students/exam/GetExam";
import ShowExams from "./pages/students/exam/ShowExams";
import ShowAttendance from "./pages/students/attendance/ShowAttendance";

function App() {
  const location = useLocation();
  const hideSidebarPaths = ["/login"];
  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);
  const [title, setTitle] = useState("");
  const isNested = location.pathname.split("/").length > 2;
  const role = localStorage.getItem("role");

  return (
    <>
      <AuthProvider>
        <div className="flex ">
          {!shouldHideSidebar && (
            <Sidebar onClick={(value) => setTitle(value)} />
          )}
          <div className="flex-grow  relative">
            {!shouldHideSidebar && !isNested && <Header title={title} />}

            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  role === "admin" ? (
                    <Navigate to="/admin/dashboard" replace />
                  ) : role === "teacher" ? (
                    <Navigate to="/teacher/dashboard" replace />
                  ) : role === "student" ? (
                    <Navigate to="/student/dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
                {/********************************
                 **************Admin************
                 *********************************/ }
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute role={"admin"}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/teachers"
                element={
                  <ProtectedRoute role={"admin"}>
                    <TeachersTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/addteacher"
                element={
                  <ProtectedRoute role={"admin"}>
                    <Addteacher />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/teacher/:id"
                element={
                  <ProtectedRoute role={"admin"}>
                    <TeacherDetials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/studentstable"
                element={
                  <ProtectedRoute role={"admin"}>
                    <StudentsTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/addstudent"
                element={
                  <ProtectedRoute role={"admin"}>
                    <AddStudent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/student/:id"
                element={
                  <ProtectedRoute role={"admin"}>
                    <StudentDetials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/attendance"
                element={
                  <ProtectedRoute role={"admin"}>
                    <AttendancePage />
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
              {/* <Route
                path="/admin/addattndance"
                element={
                  <ProtectedRoute role={"admin"}>
                    <AddSubjects />
                  </ProtectedRoute>
                }
              /> */}
               <Route
                path="/admin/subjectstable"
                element={
                  <ProtectedRoute role={"admin"}>
                    <SubjectsTable />
                  </ProtectedRoute>
                }/>
                
                  <Route
                path="/admin/addsubject"
                element={
                  <ProtectedRoute role={"admin"}>
                    <AddSubject/>
                  </ProtectedRoute>
                }/>
                <Route
                path="/admin/classestable"
                element={
                  <ProtectedRoute role={"admin"}>
                    <ClassesTable/>
                  </ProtectedRoute>
                }/>
                <Route
                path="/admin/addclassroom"
                element={
                  <ProtectedRoute role={"admin"}>
                    <AddClassroom/>
                  </ProtectedRoute>
                }/>

                {/********************************
                 **************Teacher************
                 *********************************/ }


              <Route
                path="/teacher/dashboard"
                element={
                  <ProtectedRoute role={"teacher"}>
                    <TeacherDashbord />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/addexam"
                element={
                  <ProtectedRoute role={"teacher"}>
                    <AddExam />
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
                {/********************************
                 **************Student************
                 *********************************/ }
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute role={"student"}>
                    <StudentsDashbord />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path="/students"
                element={
                  <ProtectedRoute role={"student"}>
                    <Students />
                  </ProtectedRoute>
                }
              /> */}
              <Route
                path="/students/getexam"
                element={
                  <ProtectedRoute role={"student"}>
                    <GetExam />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/showgrade"
                element={
                  <ProtectedRoute role={"student"}>
                    <ShowExams />
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
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
