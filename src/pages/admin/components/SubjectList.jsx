import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router";
import PrimaryTable from "../../../core/components/PrimaryTable";
import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
// import PrimaryModal from "../../../core/components/PrimaryModal";
import Skeleton from "react-loading-skeleton";

const SubjectList = ({
  subjects = [],
  deletesubject,
  loading = false,
}) => {
  const columns = [
    { name: "Code", className: "flex-2" },
    { name: "Name", className: "flex-2" },
    { name: "Chapters", className: "flex-2" },
    { name: "Academic Year", className: "flex-2" },   
    { name: "Level", className: "flex-2" },
    { name: "Action", className: "flex-2" },
  ];

  const SubjectListSkeleton = ({ rowCount = 8 }) => (
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
            <SubjectListSkeleton />
          ) : subjects.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No Subject found
            </div>
          ) : (
            subjects.map((subject) => (
              <PrimaryTableRow
                key={subject._id}
                columns={columns.map((col) => col.className)}
              >
                <div>{subject.code || "N/A"}</div>
                <div>{subject.name || "N/A"}</div>
                <div>{subject.chapter || "N/A"}</div>
                <div>{subject.academicYear || "N/A"}</div>
                <div>{subject.level || "N/A"}</div>

                {/* Actions */}
                <div className="flex gap-4 text-lg text-[#4B4D4F]">
                  <Link to={`/subjects/${subject._id}/update`}>
                    <FiEdit className="cursor-pointer" />
                  </Link>
                  <PrimaryModal
                    title="Are you sure you want to delete this subject?"
                    onConfirm={() => deletesubject(subject._id)}
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

export default SubjectList;
