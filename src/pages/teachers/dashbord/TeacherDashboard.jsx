import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Mock teacher data
const TEACHER = {
  id: "t1",
  name: "Mr. John Smith",
  classes: ["Grade 10 - A", "Grade 10 - B", "Grade 11 - A"],
};

// Mock students with grades and attendance
const STUDENTS = [
  { id: "s1", name: "Mohamed Ahmed", class: "Grade 10 - A", grade: 85, attendance: 92 },
  { id: "s2", name: "Sara Ali", class: "Grade 10 - A", grade: 78, attendance: 88 },
  { id: "s3", name: "Youssef Khaled", class: "Grade 10 - B", grade: 90, attendance: 96 },
  { id: "s4", name: "Lina Mahmoud", class: "Grade 11 - A", grade: 72, attendance: 80 },
  { id: "s5", name: "Khaled Amr", class: "Grade 11 - A", grade: 65, attendance: 70 },
];

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

export default function TeacherDashboard() {
  const totalClasses = TEACHER.classes.length;

  const avgGrade = useMemo(
    () => Math.round(STUDENTS.reduce((sum, s) => sum + s.grade, 0) / STUDENTS.length),
    []
  );

  const avgAttendance = useMemo(
    () => Math.round(STUDENTS.reduce((sum, s) => sum + s.attendance, 0) / STUDENTS.length),
    []
  );

  // Attendance data for Pie chart
  const attendanceData = [
    { name: "Present", value: avgAttendance },
    { name: "Absent", value: 100 - avgAttendance },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <p className="text-gray-500">Welcome, {TEACHER.name}</p>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-sm text-gray-500">Total Classes</h2>
            <p className="text-2xl font-bold">{totalClasses}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-sm text-gray-500">Average Grade</h2>
            <p className="text-2xl font-bold">{avgGrade}%</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-sm text-gray-500">Average Attendance</h2>
            <p className="text-2xl font-bold">{avgAttendance}%</p>
          </div>
        </section>

        {/* Attendance Chart */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Overall Attendance</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={attendanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Students Table */}
        <section className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">Class</th>
                  <th className="px-4 py-3 text-left">Grade</th>
                  <th className="px-4 py-3 text-left">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {STUDENTS.map((st, idx) => (
                  <tr key={st.id} className={idx % 2 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{st.name}</td>
                    <td className="px-4 py-3">{st.class}</td>
                    <td className="px-4 py-3">{st.grade}%</td>
                    <td className="px-4 py-3">{st.attendance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
