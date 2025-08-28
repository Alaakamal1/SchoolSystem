import { useForm } from "react-hook-form";
import PrimaryInput from "../../../core/components/PrimaryInput";
import { toast } from "react-toastify";
import { apiClient } from "../../../core/utils/apiClient";
import { useParams } from "react-router";

const AddSubject = () => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      subjectName: "",
      code: "",
      chapter: "",
      teacher: "",
      classes: [""],
    },
  });

  const prepareSubjectFormData = (data) => {
    const formData = new FormData();

    const appendOrEmpty = (key, value) => {
      formData.append(key, value ?? "");
    };

    appendOrEmpty("subjectName", data.subjectName);
    appendOrEmpty("code", data.code);
    appendOrEmpty("chapter", data.chapter);
    appendOrEmpty("teacher", data.teacher);
    formData.append("classes", JSON.stringify(data.classes));

    return formData;
  };

  const onSubmit = async (data) => {
    try {
      const formData = prepareSubjectFormData(data);
      const url = id ? `/Subject/${id}` : `/addsubject`;
      const method = id ? "patch" : "post";

      await apiClient[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        id ? "Subject updated successfully" : "Subject added successfully"
      );

      if (!id) reset();
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(`Error: ${msg}`);
    }
  };

  const isDisabled = (id) => {
    return !!id;
  };

  const allowOnlyNumbers = (e) => {
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-sky-900">
            {id ? "Edit Subject" : "Add New Subject"}
          </h1>

          {id && (
            <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg shadow-sm">
              <p className="font-semibold">Course Code: {watch("code")}</p>
              <p className="text-xs text-gray-600">
                Created:{" "}
                {watch("createdAt")
                  ? new Date(watch("createdAt")).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PrimaryInput
              label="Subject Name"
              name="subjectName"
              register={register}
              error={errors.subjectName}
              placeholder="Enter subject name"
            />
            <PrimaryInput
              label="Code"
              name="code"
              register={register}
              error={errors.code}
              placeholder="Enter subject code"
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PrimaryInput
              label="Chapters"
              name="chapter"
              onKeyDown={allowOnlyNumbers}
              register={register}
              error={errors.chapter}
              placeholder="Enter number of chapters"
            />
            <PrimaryInput
              label="Teacher"
              name="teacher"
              type="text"
              register={register}
              error={errors.teacher}
              disabled={isDisabled(id)}
              className={isDisabled(id) ? "opacity-70 pointer-events-none" : ""}
              placeholder="Enter teacher name"
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
                ? "Update Subject"
                : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubject;
