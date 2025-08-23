import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router";
import PrimaryTable from "../../../core/components/PrimaryTable";
import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
import PrimaryDropDown from "../../../core/components/PrimaryDropDown";
import PrimaryModal from "../../../core/components/PrimaryModal";
import Skeleton from "react-loading-skeleton";

const PatientsList = ({
  patients = [],
  statuses = [],
  deletePatient,
  changeStatus,
  loading = false,
}) => {
  const columns = [
    { name: "Name", className: "flex-3" },
    { name: "Serial Number", className: "flex-2" },
    { name: "Phone", className: "flex-2" },
    { name: "Age", className: "flex-2" },
    { name: "Gender", className: "flex-2" },
    { name: "Blood Type", className: "flex-2" },
    { name: "Status", className: "flex-2" },
    { name: "Actions", className: "flex-1" },
  ];

  const genderMapper = { 0: "Male", 1: "Female" };
  const getGender = (gender) => genderMapper[gender] || "Unknown";

  const statusColors = {
    Expected: "bg-blue-100 text-blue-700 border-blue-300",
    Arrived: "bg-green-100 text-green-700 border-green-300",
    Reviewed: "bg-purple-100 text-purple-700 border-purple-300",
    Admitted: "bg-yellow-100 text-yellow-800 border-yellow-300",
    "Ready for Discharge": "bg-orange-100 text-orange-700 border-orange-300",
    Discharged: "bg-gray-100 text-gray-700 border-gray-300",
    Deceased: "bg-red-100 text-red-700 border-red-300",
    Inactive: "bg-slate-100 text-slate-700 border-slate-300",
  };

  const getStatusColor = (label) =>
    statusColors[label] || "bg-gray-100 text-gray-700 border-gray-300";

  const PatientsListSkeleton = ({ rowCount = 8 }) => (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <PrimaryTableRow
          key={index}
          columns={columns.map((c) => c.className)}
        >
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
            <PatientsListSkeleton />
          ) : patients.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              No patients found
            </div>
          ) : (
            patients.map((patient) => {
              const currentStatus =
                statuses.find(
                  (s) => s.value === (patient.statusId?._id || patient.statusId)
                ) || null;

              return (
                <PrimaryTableRow
                  key={patient._id}
                  columns={columns.map((col) => col.className)}
                >
                  <Link to={`${patient._id}`}>
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          patient.image ||
                          "https://placehold.co/48x48?text=No+Image"
                        }
                        alt={patient.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <p className="text-md font-bold truncate max-w-[180px]">
                        {patient.fullName}
                      </p>
                    </div>
                  </Link>
                  <div>{patient.serialNumber || "N/A"}</div>
                  <div>{patient.phone || "N/A"}</div>
                  <div>{patient.age || "N/A"}</div>
                  <div>{getGender(patient.gender)}</div>
                  <div>{patient.medicalInfoId?.bloodType || "N/A"}</div>

                  <PrimaryDropDown
                    text={currentStatus?.label || "N/A"}
                    onSelect={(index) => {
                      const selected = statuses[index];
                      changeStatus(patient._id, selected.value);
                    }}
                    hasIcon={false}
                    className="flex-1 w-37"
                    textClassName={`border px-2 p-1 rounded-lg w-full ${getStatusColor(
                      currentStatus?.label
                    )}`}
                  >
                    {statuses.map((status, index) => (
                      <div key={`${patient._id}-${status.value}-${index}`}>
                        {status.label}
                      </div>
                    ))}
                  </PrimaryDropDown>

                  <div className="flex gap-4 text-lg text-[#4B4D4F]">
                    <Link to={`/patients/${patient._id}/update`}>
                      <FiEdit className="cursor-pointer" />
                    </Link>
                    <PrimaryModal
                      title="Are you sure you want to delete this patient?"
                      onConfirm={() => deletePatient(patient._id)}
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

export default PatientsList;
