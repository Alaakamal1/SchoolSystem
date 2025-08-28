import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router";
import PrimaryTable from "../../../core/components/PrimaryTable";
import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
// import PrimaryModal from "../../../core/components/PrimaryModal";
import Skeleton from "react-loading-skeleton";

const ClassList = ({
  Classrooms = [],
  deleteClassroom,
  loading = false,
}) => {
  const columns = [
    { name: "Class ID", className: "flex-2" },
    { name: "Class Name", className: "flex-2" },
    { name: "No. of Subjects ", className: "flex-2" },
    { name: "Academic Year", className: "flex-2" },  
    { name: "Level", className: "flex-2" },
    { name: "No. Students", className: "flex-2" },
    { name: "Action", className: "flex-2" },
  ];

  const ClassListSkeleton = ({ rowCount = 6 }) => (
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
            <ClassListSkeleton />
          ) : Classrooms.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No Classroom found
            </div>
          ) : (
            Classrooms.map((Classroom) => (
              <PrimaryTableRow
                key={Classroom._id}
                columns={columns.map((col) => col.className)}
              >
                <div>{Classroom.classcode || "N/A"}</div>
                <div>{Classroom.classname || "N/A"}</div>
                <div>{Classroom.subjectOfClass || "N/A"}</div>
                <div>{Classroom.academicYear || "N/A"}</div>
                <div>{Classroom.level || "N/A"}</div>

                <div className="flex gap-4 text-lg text-[#4B4D4F]">
                  <Link to={`/Classrooms/${Classroom._id}/update`}>
                    <FiEdit className="cursor-pointer" />
                  </Link>
                  <PrimaryModal
                    title="Are you sure you want to delete this Classroom?"
                    onConfirm={() => deleteClassroom(Classroom._id)}
                  >
                    <AiOutlineDelete className="cursor-pointer" />
                  </PrimaryModal>
                </div>
              </PrimaryTableRow>
            ))
          )}
        </PrimaryTable>
      </div>
    </div>
  );
};

export default ClassList;
