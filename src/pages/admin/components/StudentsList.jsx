import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router";
import PrimaryTable from "../../../core/components/PrimaryTable";
import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
import Skeleton from "react-loading-skeleton";

const StudentsList = ({
  students = [],
    loading = false,
  deleteStudent,
}) => {
  const columns = [
    { name: "Name", className: "flex-3" },
    { name: "ID", className: "flex-2" },
    { name: "Email", className: "flex-2" },
    { name: "Phone", className: "flex-2" },
    { name: "Gender", className: "flex-2" },
    { name: "Class", className: "flex-2" },
    { name: "Actions", className: "flex-1" },
  ];

  const genderMapper = {
    0: "Male",
    1: "Female",
  };

  const getGender = (gender) => {
    return genderMapper[gender] || "Unknown";
  };
  const StudentsListSkeleton = ({ rowCount = 10 }) => (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <div className="flex items-center gap-2" key={index}>
          <div className="flex items-center gap-2 flex-3">
            <Skeleton circle width={40} height={40} />
            <Skeleton width={100} height={20} />
          </div>
          {columns.slice(1).map((col, idx) => (
            <div className={col.className} key={idx}>
              <Skeleton width={90} height={20} />
            </div>
          ))}
        </div>
      ))}
    </>
  );

  return (
    <div className="w-full">
      <div className="hidden md:block">
        <PrimaryTable columns={columns} classes={"min-h-[85vh]"}>
           {loading ? (
           <TeachersListSkeleton />
          ) : students.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No Students found
            </div>
          ) : (
            students.map((student) => (
              <PrimaryTableRow
                key={student._id}
                columns={columns.map((col) => col.className)}
              >
                <Link to={`${student._id}`}>
                  <div className="flex items-center gap-2">
                    <img
                      src={student.image || "https://placehold.co/48x48?text=No+Image"}
                      alt={student.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p className="text-md font-bold truncate max-w-[180px]">
                      {student.fullName}
                    </p>
                  </div>
                </Link>
                <div>{student.id || "N/A"}</div>
                <div>{student.phone || "N/A"}</div>
                <div>{student.age || "N/A"}</div>
                <div>{getGender(student.gender)}</div>

                <div className="flex gap-4 text-lg text-[#4B4D4F]">
                  <Link to={`/students/${student._id}/update`}>
                    <FiEdit className="cursor-pointer" />
                  </Link>
                  <PrimaryModal
                    title="Are you sure you want to delete this student?"
                    onConfirm={() => deleteStudent(student._id)}
                  >
                    <AiOutlineDelete className="cursor-pointer" />
                  </PrimaryModal>
                </div>
              </PrimaryTableRow>
            ))
          )}
        </PrimaryTable>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {students.length === 0 ? (
          <StudentsListSkeleton rowCount={5} />
        ) : (
          students.map((student) => (
            <div
              key={student._id}
              className="bg-white p-4 rounded-xl shadow-md border flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src={student.image || "https://placehold.co/48x48?text=No+Image"}
                  alt={student.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold text-lg">{student.fullName}</p>
                  <p className="text-sm text-gray-500">{student.phone}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                <span><b>Age:</b> {student.age || "N/A"}</span>
                <span><b>Gender:</b> {getGender(student.gender)}</span>
              </div>
            <div className="flex justify-end gap-4 text-lg text-[#4B4D4F] pt-2">
                <Link to={`/students/${student._id}/update`}>
                  <FiEdit className="cursor-pointer" />
                </Link>
                <PrimaryModal
                  title="Are you sure you want to delete this student?"
                  onConfirm={() => deleteStudent(student._id)}
                >
                  <AiOutlineDelete className="cursor-pointer" />
                </PrimaryModal>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentsList;