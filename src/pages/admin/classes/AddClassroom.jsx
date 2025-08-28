import { useForm } from "react-hook-form";
import PrimaryInput from "../../../core/components/PrimaryInput";
import { toast } from "react-toastify";
import { apiClient } from "../../../core/utils/apiClient";
import { useNavigate, useParams } from "react-router";

const AddClassroom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      classroomName: "",
      classroomCode: "",
      numOfSubject: "",
      classTeacher: "",
      numOfStudent: "",
      academicYear:""

    },
  });

  const prepareSubjectFormData = (data) => {
    const formData = new FormData();

    const appendOrEmpty = (key, value) => {
      formData.append(key, value ?? "");
    };

    appendOrEmpty("classroomName", data.classroomName);
    appendOrEmpty("classroomCode", data.classroomCode);
    appendOrEmpty("numOfSubject", data.numOfSubject);
    appendOrEmpty("classTeacher", data.classTeacher);
    appendOrEmpty("numOfStudent", data.numOfStudent);
    appendOrEmpty("academicYear", data.academicYear);


    return formData;
  };

  const onSubmit = async (data) => {
    try {
      const formData = prepareSubjectFormData(data);
      const url = id ? `/classroom/${id}` : `/addClassroom`;
      const method = id ? "patch" : "post";

      await apiClient[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        id ? "Classroom updated successfully" : "Classroom added successfully"
      );

      if (!id) reset();
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(`Error: ${msg}`);
    }
  };

  // const isDisabled = (id) => {
  //   return !!id;
  // };

  const allowOnlyNumbers = (e) => {
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10">
    <div className="flex justify-between  mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-sky-950">
            {id ? "Edit Classroom" : "Add New Classroom"}
          </h1>
          {id && (
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              <p className="font-medium">Serial: {watch("serialNumber")}</p>
              <p className="text-sm">
                Created: {new Date(watch("createdAt")).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} classroomName="space-y-8">
          {/* Row 1 */}
          <div classroomName="p-6 rounded-xl border-2 border-gray-100">
          <div classroomName="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PrimaryInput
              label="Classroom Name"
              name="classroomName"
              register={register}
              error={errors.classroomName}
              placeholder="Enter classroom name"
            />
            <PrimaryInput
              label="classroomCode"
              name="classroomCode"
              register={register}
              error={errors.classroomCode}
              placeholder="Enter classroomCode"
            />

          {/* Row 2 */}
            <PrimaryInput
              label="Nummer Of Subjects"
              name="numOfSubject"
              onKeyDown={allowOnlyNumbers}
              register={register}
              error={errors.numOfSubject}
              placeholder="Enter number of num of subjects"
            />
            <PrimaryInput
              label="Class Teacher"
              name="classTeacher"
              type="text"
              register={register}
              error={errors.classTeacher}
              // disabled={isDisabled(id)}
              // className={isDisabled(id) ? "opacity-70 pointer-events-none" : ""}
              // placeholder="Enter classTeacher name"
            />

              <PrimaryInput
              label="Nummer Of Subjects"
              name="numOfStudent"
              onKeyDown={allowOnlyNumbers}
              register={register}
              error={errors.numOfSubject}
              placeholder="Enter number of num of student"
            />
            <PrimaryInput
              label="AcademicYear"
              name="academicYear"
              type="text"
              register={register}
              error={errors.classTeacher}
              // disabled={isDisabled(id)}
              // className={isDisabled(id) ? "opacity-70 pointer-events-none" : ""}
              // placeholder="Enter classTeacher name"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-6 ">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-sky-700 text-white font-semibold py-3 px-10 rounded-lg shadow-md hover:bg-sky-800 transition duration-200"
            >
              {isSubmitting
                ? "Submitting..."
                : id
                ? "Update Classroom"
                : "Add Classroom"}
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassroom;
