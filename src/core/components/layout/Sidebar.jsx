import { NavLink } from "react-router";
import { RiHotelBedLine } from "react-icons/ri";
import { LuHospital, LuCalendarCheck } from "react-icons/lu";
import { BsCalendarWeek } from "react-icons/bs";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import { SiGoogleclassroom } from "react-icons/si";
import { FaSchool } from "react-icons/fa";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { useState } from "react";
import  UseAuth   from "../../context/UseAuth";
import { FaPeopleGroup  ,FaRegCalendarXmark} from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";


const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = UseAuth();

  const role = user?.role; 

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const menuItems = {
    admin: [
      {
        to: "/admin/dashboard",
        icon: <MdOutlineDashboardCustomize className="w-6 h-6 mr-2" />,
        label: "Dashboard",
      },
      {
        to: "/admin/teachers",
        icon: <LiaChalkboardTeacherSolid className="w-6 h-6 mr-2" />,
        label: "Teachers",
      },
      {
        to: "/admin/studentstable",
        icon: <FaPeopleGroup  className="w-6 h-6 mr-2" />,
        label: "Students",
      },
      {
        to: "/admin/attendance",
        icon: <FaRegCalendarXmark className="w-6 h-6 mr-2" />,
        label: "Attendance",
      },
      {
        to: "/admin/subjectstable",
        icon: <IoBookOutline className="w-6 h-6 mr-2" />,
        label: "Subjects",
      },
      {
        to: "/admin/classestable",
        icon: <SiGoogleclassroom className="w-6 h-6 mr-2" />,
        label: "Classes",
      },
            {
        to: "/admin/schedule",
        icon: <BsCalendarWeek className="w-6 h-6 mr-2" />,
        label: "Schedule",
      },
    ],
    teacher: [
       {
        to: "/teacher/dashboard",
        icon: <LuCalendarCheck className="w-6 h-6 mr-2" />,
        label: "Dashbord",
      },
      {
        to: "/my-students",
        icon: <LuCalendarCheck className="w-6 h-6 mr-2" />,
        label: "My Students",
      },
      {
        to: "/exams",
        icon: <BsCalendarWeek className="w-6 h-6 mr-2" />,
        label: "Exams",
      },
      {
        to: "/schedule",
        icon: <LuHospital className="w-6 h-6 mr-2" />,
        label: "My Schedule",
      },
    ],
    student: [
        {
        to: "/student/dashbord",
        icon: <LuCalendarCheck className="w-6 h-6 mr-2" />,
        label: "Dashbord",
      },
      {
        to: "/my-schedule",
        icon: <BsCalendarWeek className="w-6 h-6 mr-2" />,
        label: "My Schedule",
      },
      {
        to: "/my-attendance",
        icon: <RiHotelBedLine className="w-6 h-6 mr-2" />,
        label: "My Attendance",
      },
      {
        to: "/my-exams",
        icon: <LuHospital className="w-6 h-6 mr-2" />,
        label: "My Exams",
      },
    ],
  };

  return (
    <>
      {/* Topbar (Mobile) */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-sky-700 px-4 py-3 text-blue-950 shadow-md">
        <div className="flex items-center">
          <FaSchool size={36} className="text-gray-100" />
          <span className="ml-2 text-xl font-bold text-gray-100">EduTrack</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-100 focus:outline-none"
        >
          <HiMenu size={28} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 w-full md:w-64 bg-sky-700 z-50 transform transition-transform duration-300 shadow-lg md:shadow-none ${
          isSidebarOpen ? "translate-y-0" : "-translate-y-full"
        } md:translate-y-0 md:flex md:flex-col`}
      >
        <div className="text-gray-100 text-lg pt-5 h-screen flex flex-col justify-between">
          <div className="overflow-y-auto">
            {/* Header (Mobile close btn) */}
            <div className="flex items-center justify-between px-4 pb-4 md:hidden">
              <span className="text-2xl font-bold">EduTrack</span>
              <button onClick={toggleSidebar}>
                <HiX size={26} />
              </button>
            </div>

            {/* Header (Desktop) */}
            <div className="hidden md:flex items-center px-4 py-8">
              <FaSchool className="w-10 h-10" />
              <span className="px-2 text-3xl font-bold">EduTrack</span>
            </div>

            {/* Links */}
            <nav>
              <ul className="space-y-5 px-6 py-5 text-gray-100">
                {role &&
                  menuItems[role]?.map(({ to, icon, label }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          `flex items-center px-2 py-2 rounded-full transition ${
                            isActive
                              ? "bg-gray-100 text-sky-700"
                              : "hover:bg-gray-100 hover:text-sky-700"
                          }`
                        }
                        onClick={handleCloseSidebar}
                      >
                        {icon}
                        {label}
                      </NavLink>
                    </li>
                  ))}
              </ul>
            </nav>
          </div>

          {/* Logout */}
          <div className="px-6 pb-6">
            <button
              className="w-full px-6 py-2 border-gray-100 text-gray-100 border-2 rounded-full font-semibold hover:bg-gray-100 hover:text-sky-700 transition cursor-pointer"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur bg-white/30 z-40 md:hidden"
          onClick={handleCloseSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
