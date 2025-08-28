import { useEffect, useRef, useState } from "react";
import TeacherList from "../components/TeacherList";
import PrimaryInput from "../../../core/components/PrimaryInput";
import Pagination from "../../../core/components/Pagination";
import { Link } from "react-router";
import { apiClient } from "../../../core/utils/apiClient";
import PrimaryButton from "../../../core/components/PrimaryButton";
import { toast } from "react-toastify";
import { useQuery } from "../../../core/hooks/useQuery";
import { Endpoints } from "../../../core/utils/endpoints";

const TeachersTable = () => {
  const searchRef = useRef(null);
  const [filters, setFilters] = useState({
    name: "",
    page: 1,
  });

  const { state, refetch } = useQuery(Endpoints.students, "GET", filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, name: e.target.value, page: 1 }));
  };

  const pageChangeHandler = ({ selected }) => {
    setFilters((prev) => ({ ...prev, page: selected + 1 }));
  };

  const deleteStudent = async (id) => {
    try {
      await apiClient.delete(`${Endpoints.students}/${id}`);
      refetch(filters);
      toast.success("Teacher deleted successfully");
    } catch (err) {
      toast.error(`Failed to delete Teacher: ${err.message}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-4 max-w-[1400px] mx-auto">
        <header className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <PrimaryInput
              placeholder="Search by Teacher name..."
              onChange={handleSearchChange}
              ref={searchRef}
              value={filters.name}
              className="flex-1 min-w-[200px]"
            />
            <Link to="/admin/addteacher" className="sm:ml-auto">
              <PrimaryButton className="w-full sm:w-auto">
                Add Teacher
              </PrimaryButton>
            </Link>
          </div>
        </header>

        {state.loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            <TeacherList
              students={state.data?.data || []}
              deleteStudent={deleteStudent}
            />
            <div className="flex justify-center mt-8">
              <Pagination
                totalPages={state.data?.totalPages || 1}
                pageChangeHandler={pageChangeHandler}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeachersTable;
