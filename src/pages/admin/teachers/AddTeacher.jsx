import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FaRegBuilding } from "react-icons/fa";
import { TiTimesOutline } from "react-icons/ti";
import { MdOutlineCloudUpload } from "react-icons/md";
import PrimaryInput from "../../../core/components/PrimaryInput";
import PrimaryButton from "../../../core/components/PrimaryButton";
import PrimaryDate from "../../../core/components/PrimaryDate";
import PrimarySelect from "../../../core/components/PrimarySelect";
import { toast } from "react-toastify";
import { apiClient } from "../../../core/utils/apiClient";
import { Endpoints } from "../../../core/utils/endpoints";
import { useParams } from "react-router";

const AddTeacher = () => {
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      name: "",
      dateOfBirth: "",
      image: null,
      phone: "",
      email: "",
      nationalId: "",
      gender: "",
      address: {
        street: "",
        buildingNumber: "",
        floor: "",
        apartment: "",
        note: "",
      },
      education: [],
      workExperience: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  });
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const watchedImage = watch("image");

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (e) {
      console.error("Error formatting date:", e);
      return "";
    }
  };

  const fetchTeacherData = async (id) => {
    try {
      const response = await apiClient.get(`${Endpoints.teachers}/${id}`);
      const formattedWorkExperience = response.data.data.workExperience.map(
        (exp) => ({
          ...exp,
          from: formatDateForInput(exp.from),
          to: formatDateForInput(exp.to),
        })
      );
      console.log("deep", response.data.data.department);

      const data = {
        name: response.data.data.name,
        image: response.data.data.image,
        phone: response.data.data.phone,
        email: response.data.data.email,
        address: response.data.data.address,
        education: response.data.data.education._id,
        workExperience: formattedWorkExperience,
      };
      reset(data);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      toast("Error fetching doctor data", { type: "error" });
    }
  };

  useEffect(() => {
    if (id) {
      fetchTeacherData(id);
    }
  }, [id]);

  useEffect(() => {
    if (typeof getValues("image") === "string") {
      setImagePreview(getValues("image"));
      return;
    }
    if (watchedImage && watchedImage[0] instanceof File) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [watchedImage]);

  const addWorkExperience = () => {
    append({
      position: "",
      workPlace: "",
      from: "",
      to: "",
    });
  };
  const postTeacher = async (data) => {
    try {
      await apiClient.post("/teacher", data);
      toast("Teacher added successfully", { type: "success" });

      // Reset form
      reset();
      setImagePreview(null);
    } catch (error) {
      console.log("error", error);
      toast(
        `Error adding Teacher: ${
          error.response?.data?.message ?? error.message
        }`,
        {
          type: "error",
        }
      );
    }
  };
  const updateTeacher = async (data) => {
    try {
      await apiClient.patch(`/teacher/${id}`, data);
      toast("Teacher updated successfully", { type: "success" });
    } catch (error) {
      console.log("error", error);
      toast(
        `Error updating Teacher: ${
          error.response?.data?.message ?? error.message
        }`,
        {
          type: "error",
        }
      );
    }
  };
  const onSubmit = async (data) => {
    try {
      const formDataToSend = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "workExperience") {
          data.workExperience.forEach((experience, index) => {
            formDataToSend.append(
              `workExperience[${index}][position]`,
              experience.position
            );
            formDataToSend.append(
              `workExperience[${index}][workPlace]`,
              experience.workPlace
            );
            formDataToSend.append(
              `workExperience[${index}][from]`,
              experience.from
            );
            formDataToSend.append(
              `workExperience[${index}][to]`,
              experience.to
            );
          });
        } else if (key === "education") {
          data.education.forEach((edu, index) => {
            formDataToSend.append(
              `education[${index}][university]`,
              edu.university
            );
            formDataToSend.append(`education[${index}][degree]`, edu.degree);
            formDataToSend.append(`education[${index}][major]`, edu.major);
            formDataToSend.append(
              `education[${index}][startDate]`,
              edu.startDate
            );
            formDataToSend.append(`education[${index}][endDate]`, edu.endDate);
          });
        } else if (key === "image") {
          if (data.image && data.image[0] instanceof File) {
            formDataToSend.append("image", data.image[0]);
          } else {
            formDataToSend.append("image", data.image);
          }
        } else {
          if (id && key != "email") {
            formDataToSend.append(key, data[key]);
          } else if (!id) {
            formDataToSend.append(key, data[key]);
          }
        }
      });

      if (id) {
        await updateTeacher(formDataToSend);
      } else {
        await postTeacher(formDataToSend);
      }
    } catch (error) {
      console.error("Error with Teacher:", error);
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
    <div className="min-h-screen bg-gray-50 rounded-[8px]">
      <div className="">
        <div className="bg-white overflow-hidden rounded-[8px]">
          <form
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className="p-8 space-y-8 md:w-9/10 mx-auto"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <h2 className="text-xl font-semibold text-[#233955]">
                  Personal Details
                </h2>
              </div>
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[#233955] mb-2">
                  Profile Image *
                </label>
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="h-32 w-32 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <MdOutlineCloudUpload className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("image", {
                        required: getValues("image")
                          ? false
                          : "Image is required",
                      })}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-[#a2f2ee] hover:bg-[#a2f2ee] text-[#233955] px-4 py-2 rounded-lg border border-[#a2f2ee] transition-colors inline-flex items-center space-x-2 active:scale-99"
                    >
                      <MdOutlineCloudUpload className="h-4 w-4" />
                      <span>Upload Image</span>
                    </label>
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.image.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <h2 className="text-xl font-semibold text-[#233955]">
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PrimaryInput
                  label="Full Name"
                  name="name"
                  register={register}
                  error={errors.name}
                />

                <PrimaryInput
                  label="National ID"
                  name="nationalId"
                  register={register}
                  error={errors.nationalId}
                  onKeyDown={allowOnlyNumbers}
                  disabled={isDisabled(id)}
                  className={
                    isDisabled(id) ? "opacity-70 pointer-events-none" : ""
                  }
                />
                <PrimaryInput
                  label="Phone"
                  name="phone"
                  onKeyDown={allowOnlyNumbers}
                  register={register}
                  error={errors.phone}
                />
                <PrimaryInput
                  label="Email"
                  name="email"
                  type="email"
                  register={register}
                  error={errors.email}
                  disabled={isDisabled(id)}
                  className={
                    isDisabled(id) ? "opacity-70 pointer-events-none" : ""
                  }
                />

                <PrimaryDate
                  label="Date of Birth"
                  name="dateOfBirth"
                  control={control}
                  error={errors.dateOfBirth}
                  disabled={isDisabled(id)}
                  className={
                    isDisabled(id) ? "opacity-70 pointer-events-none" : ""
                  }
                />

                <PrimarySelect
                  label="Gender"
                  name="gender"
                  control={control}
                  options={[
                    { value: "0", label: "Male" },
                    { value: "1", label: "Female" },
                  ]}
                  error={errors.gender}
                  disabled={isDisabled(id)}
                  className={
                    isDisabled(id) ? "opacity-70 pointer-events-none" : ""
                  }
                />

                <PrimaryInput
                  label="Street"
                  name="address.street"
                  register={register}
                  error={errors.address?.street}
                />
                <PrimaryInput
                  label="Building Number"
                  name="address.buildingNumber"
                  onKeyDown={allowOnlyNumbers}
                  register={register}
                  error={errors.address?.buildingNumber}
                />
                <PrimaryInput
                  label="Floor"
                  onKeyDown={allowOnlyNumbers}
                  name="address.floor"
                  register={register}
                  error={errors.address?.floor}
                />
                <PrimaryInput
                  label="Apartment No"
                  name="address.apartment"
                  onKeyDown={allowOnlyNumbers}
                  register={register}
                  error={errors.address?.apartment}
                />
                <PrimaryInput
                  label="Note"
                  name="address.note"
                  register={register}
                  error={errors.address?.note}
                />
              </div>
            </div>
            {/* Education Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Education
                  </h2>
                </div>
                <PrimaryButton
                  type="button"
                  onClick={() =>
                    appendEducation({
                      university: "",
                      degree: "",
                      major: "",
                      startDate: "",
                      endDate: "",
                    })
                  }
                >
                  Add Education
                </PrimaryButton>
              </div>

              {educationFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-gray-50 rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Education {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <TiTimesOutline className="h-5 w-5 cursor-pointer" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* University */}
                    <PrimaryInput
                      label="University *"
                      name={`education.${index}.university`}
                      register={register}
                      error={errors.education?.[index]?.university}
                    />

                    {/* Degree */}
                    <PrimaryInput
                      label="Degree *"
                      name={`education.${index}.degree`}
                      register={register}
                      error={errors.education?.[index]?.degree}
                    />

                    {/* Major */}
                    <PrimaryInput
                      label="Major *"
                      name={`education.${index}.major`}
                      register={register}
                      error={errors.education?.[index]?.major}
                    />

                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        {...register(`education.${index}.startDate`, {
                          required: "Start date is required",
                        })}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.education?.[index]?.startDate
                            ? "border-red-300"
                            : "border-gray-200"
                        }`}
                      />
                      {errors.education?.[index]?.startDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.education[index].startDate.message}
                        </p>
                      )}
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        {...register(`education.${index}.endDate`, {
                          required: "End date is required",
                          validate: (value) => {
                            const start = watch(`education.${index}.startDate`);
                            if (
                              start &&
                              value &&
                              new Date(start) > new Date(value)
                            ) {
                              return "End date must be after start date";
                            }
                            return true;
                          },
                        })}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          errors.education?.[index]?.endDate
                            ? "border-red-300"
                            : "border-gray-200"
                        }`}
                      />
                      {errors.education?.[index]?.endDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.education[index].endDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Work Experience Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <FaRegBuilding className="h-5 w-5 text-[#233955]" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Work Experience
                  </h2>
                </div>
                <PrimaryButton type="button" onClick={addWorkExperience}>
                  Add Experience
                </PrimaryButton>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-gray-50 rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Experience {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <TiTimesOutline className="h-5 w-5 cursor-pointer" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position *
                      </label>
                      <input
                        type="text"
                        {...register(`workExperience.${index}.position`, {
                          required: "Position is required",
                        })}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                          errors.workExperience?.[index]?.position
                            ? "border-red-300"
                            : "border-gray-200"
                        }`}
                        placeholder="Senior Cardiologist"
                      />
                      {errors.workExperience?.[index]?.position && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.workExperience[index].position.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Workplace *
                      </label>
                      <input
                        type="text"
                        {...register(`workExperience.${index}.workPlace`, {
                          required: "Workplace is required",
                        })}
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                          errors.workExperience?.[index]?.workPlace
                            ? "border-red-300"
                            : "border-gray-200"
                        }`}
                        placeholder="General Hospital"
                      />
                      {errors.workExperience?.[index]?.workPlace && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.workExperience[index].workPlace.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          {...register(`workExperience.${index}.from`, {
                            required: "From date is required",
                          })}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                            errors.workExperience?.[index]?.from
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                        />
                      </div>
                      {errors.workExperience?.[index]?.from && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.workExperience[index].from.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          {...register(`workExperience.${index}.to`, {
                            required: "To date is required",
                            validate: (value) => {
                              const fromDate = watch(
                                `workExperience.${index}.from`
                              );
                              if (
                                fromDate &&
                                value &&
                                new Date(fromDate) > new Date(value)
                              ) {
                                return "To date must be after From date";
                              }
                              return true;
                            },
                          })}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                            errors.workExperience?.[index]?.to
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                        />
                      </div>
                      {errors.workExperience?.[index]?.to && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.workExperience[index].to.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-6 w-xs mx-auto md:w-xl">
              <PrimaryButton
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                hasIcon={!id}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{id ? "Updating..." : "Adding..."}</span>
                  </div>
                ) : (
                  <span>{id ? "Update Teacher" : "Add Teacher"}</span>
                )}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTeacher;
