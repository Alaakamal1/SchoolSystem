import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router";
import PrimaryTable from "../../../core/components/PrimaryTable";
import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
// import PrimaryDropDown from "../../../core/components/PrimaryDropDown";
// import PrimaryModal from "../../../core/components/PrimaryModal";
import Skeleton from "react-loading-skeleton";

const TeachersList = ({
  teachers = [],
  statuses = [],
  deleteteacher,
  changeStatus,
  loading = false,
}) => {
  const columns = [
    { name: "Name", className: "flex-3" },
    { name: "Phone", className: "flex-2" },
    { name: "Age", className: "flex-2" },
    { name: "Gender", className: "flex-2" },
    { name: "Subject", className: "flex-2" },
    { name: "Classes", className: "flex-2" },
    { name: "Actions", className: "flex-1" },
  ];

  const genderMapper = { 0: "Male", 1: "Female" };
  const getGender = (gender) => genderMapper[gender] || "Unknown";

  const getStatusColor = (label) => {
    switch (label) {
      case "Active":
        return "text-green-600 border-green-600";
      case "Inactive":
        return "text-red-600 border-red-600";
      default:
        return "text-gray-600 border-gray-400";
    }
  };

  const TeachersListSkeleton = ({ rowCount = 8 }) => (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <PrimaryTableRow key={index} columns={columns.map((c) => c.className)}>
          <div className="flex items-center gap-2">
            <Skeleton circle width={40} height={40} />
            <Skeleton width={120} height={20} />
          </div>
          {columns.slice(1).map((col, idx) => (
            <Skeleton key={idx} width={90} height={20} />
          ))}
        </PrimaryTableRow>
      ))}
    </>
  );

  return (
    <div className="w-full">
      <div className="hidden md:block">
        <PrimaryTable columns={columns} classes={"min-h-[85vh]"}>
          {loading ? (
            <TeachersListSkeleton />
          ) : teachers.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No Teachers found
            </div>
          ) : (
            teachers.map((teacher) => {
              const currentStatus = statuses.find(
                (s) => s.value === teacher.status
              );

              return (
                <PrimaryTableRow
                  key={teacher._id}
                  columns={columns.map((col) => col.className)}
                >
                  {/* Name */}
                  <Link to={`${teacher._id}`}>
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          teacher.image ||
                          "https://placehold.co/48x48?text=No+Image"
                        }
                        alt={teacher.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <p className="text-md font-bold truncate max-w-[180px]">
                        {teacher.fullName}
                      </p>
                    </div>
                  </Link>

                  {/* Phone */}
                  <div>{teacher.phone || "N/A"}</div>

                  {/* Age */}
                  <div>{teacher.age || "N/A"}</div>

                  {/* Gender */}
                  <div>{getGender(teacher.gender)}</div>

                  {/* Subject */}
                  <div>{teacher.subject || "N/A"}</div>

                  {/* Classes */}
                  <div>{teacher.classes || "N/A"}</div>

                  {/* Status Dropdown */}
                  <PrimaryDropDown
                    text={currentStatus?.label || "N/A"}
                    onSelect={(index) => {
                      const selected = statuses[index];
                      changeStatus(teacher._id, selected.value);
                    }}
                    hasIcon={false}
                    className="flex-1 w-37"
                    textClassName={`border px-2 p-1 rounded-lg w-full ${getStatusColor(
                      currentStatus?.label
                    )}`}
                  >
                    {statuses.map((status, index) => (
                      <div key={`${teacher._id}-${status.value}-${index}`}>
                        {status.label}
                      </div>
                    ))}
                  </PrimaryDropDown>

                  {/* Actions */}
                  <div className="flex gap-4 text-lg text-[#4B4D4F]">
                    <Link to={`/teachers/${teacher._id}/update`}>
                      <FiEdit className="cursor-pointer" />
                    </Link>
                    <PrimaryModal
                      title="Are you sure you want to delete this teacher?"
                      onConfirm={() => deleteteacher(teacher._id)}
                    >
                      <AiOutlineDelete className="cursor-pointer" />
                    </PrimaryModal>
                  </div>
                </PrimaryTableRow>
              );
            })
          )}
        </PrimaryTable>
      </div>
    </div>
  );
};

export default TeachersList;
