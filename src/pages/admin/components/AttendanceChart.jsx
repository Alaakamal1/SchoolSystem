import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AttendanceChart = () => {
  const data = [
    { name: "Present", value: 420 },
    { name: "Absent", value: 80 },
  ];

  const COLORS = ["#4CAF50", "#F44336"]; // أخضر للحضور، أحمر للغياب

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md border border-[#eee]">
      <h2 className="text-lg font-bold mb-2">Attendance Overview</h2>
      <p className="text-sm text-gray-500 mb-4">Today’s Attendance</p>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-around mt-4">
        <div className="flex items-center gap-2 text-green-600 font-medium">
          <span className="w-3 h-3 rounded-full bg-green-600 inline-block"></span>
          Present ({data[0].value})
        </div>
        <div className="flex items-center gap-2 text-red-600 font-medium">
          <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
          Absent ({data[1].value})
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
