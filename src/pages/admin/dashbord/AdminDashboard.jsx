// import AppointmentCardList from "./components/AppointmentCardList";
// import PatientOverviewChart from "./components/PatientOverviewChart";
// import PatientDepartmentDonutChart from "./components/PatientDepartmentDonutChart";
// import DoctorsScheduleList from "./components/DoctorsScheduleList";

// const AdminDashboard = () => {
//   return (
//     <div className="flex flex-col gap-4">
//       <AppointmentCardList />
//       <PatientOverviewChart />
//       <div className="flex gap-4">
//         <PatientDepartmentDonutChart className="flex-grow" />
//         <DoctorsScheduleList className="flex-grow" />
//       </div>
//     </div>
//   );
// };


import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

// Dummy Data
const stats = {
  students: 1200,
  teachers: 80,
  subjects: 25,
  classrooms: 40,
};

const studentLevels = Array.from({ length: 12 }, (_, i) => ({
  level: `Level ${i + 1}`,
  students: Math.floor(Math.random() * 120 + 50), // أرقام عشوائية
}));

const studentGender = [
  { name: "Male", value: 700 },
  { name: "Female", value: 500 },
];

const teacherSpecialization = [
  { subject: "Math", teachers: 15 },
  { subject: "Science", teachers: 12 },
  { subject: "English", teachers: 20 },
  { subject: "History", teachers: 8 },
  { subject: "PE", teachers: 10 },
  { subject: "Other", teachers: 15 },
];

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F", "#AF19FF"];

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold">Students</h2>
          <p className="text-3xl font-semibold text-blue-600">{stats.students}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold">Teachers</h2>
          <p className="text-3xl font-semibold text-green-600">{stats.teachers}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold">Subjects</h2>
          <p className="text-3xl font-semibold text-purple-600">{stats.subjects}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold">Classrooms</h2>
          <p className="text-3xl font-semibold text-orange-600">{stats.classrooms}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Students by Level */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Students by Level</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentLevels}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Students by Gender */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Students by Gender</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={studentGender}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {studentGender.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Teachers by Specialization */}
        <div className="bg-white shadow rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">Teachers by Specialization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teacherSpecialization}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="teachers" fill="#16A34A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
