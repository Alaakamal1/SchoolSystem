import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import PrimaryInput from "../../../core/components/PrimaryInput";
import PrimaryDate from "../../../core/components/PrimaryDate";
import PrimarySelect from "../../../core/components/PrimarySelect";
import { toast } from "react-toastify";
import { apiClient } from "../../../core/utils/apiClient";
import { useNavigate, useParams } from "react-router";
import PrimaryButton from "../../../core/components/PrimaryButton";
import { TbXboxX } from "react-icons/tb";
import { Endpoints } from "../../../core/utils/endpoints";

const AddStudent = () => {
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

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
      nationalId: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      parentName: "",
      image: null,
      address: {
        street: "",
        buildingNumber: "",
        floor: "",
        apartment: "",
        note: "",
      },
      parentInfo: [
        {
          parentName: "",
          parentEmail: "",
          parentPhone: "",
          payment: "",
          parentAddress: {
            street: "",
            buildingNumber: "",
            floor: "",
            apartment: "",
            note: "",
          },
        },
      ],
    },
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control,
    name: "parentInfo",
  });

  const watchedImage = watch("image");

  useEffect(() => {
    const imageValue = getValues("image");
    if (typeof imageValue === "string") {
      setImagePreview(imageValue);
    } else if (watchedImage && watchedImage[0] instanceof File) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else if (!watchedImage) {
      setImagePreview(null);
    }
  }, [watchedImage, getValues]);

  const fetchPatientData = async (id) => {
    try {
      const res = await apiClient.get(`${Endpoints.patients}/${id}`);
      const d = res.data.data;
      const patientFormData = {
        serialNumber: d.serialNumber || "",
        createdAt: d.createdAt || "",
        name: d.name || "",
        nationalId: d.nationalId || "",
        phone: d.phone || "",
        email: d.email || "",
        dateOfBirth: d.dateOfBirth ? d.dateOfBirth.split("T")[0] : "",
        gender: d.gender !== undefined ? String(d.gender) : "",
        image: d.image || null,
        address: d.AddressId,
      };
      reset(patientFormData);
      if (d.patientImage) {
        setImagePreview(d.patientImage);
      }
    } catch (err) {
      console.error("Error fetching patient data:", err);
    }
  };
  if (id) {
    fetchPatientData(id);
  }

  const preparePatientFormData = (data) => {
    const formData = new FormData();

    const appendOrEmpty = (key, value) => {
      formData.append(key, value ?? "");
    };

    appendOrEmpty("name", data.name);
    appendOrEmpty("nationalId", data.nationalId);
    appendOrEmpty("phone", data.phone);
    appendOrEmpty("email", data.email);
    appendOrEmpty("dateOfBirth", data.dateOfBirth);
    appendOrEmpty("gender", data.gender);
    appendOrEmpty("parentName", data.parentName);
    formData.append("address", JSON.stringify(data.address));
    formData.append("parentInfo", JSON.stringify(data.parentInfo));
    if (data.image && data.image.length > 0 && data.image[0] instanceof File) {
      formData.append("image", data.image[0]);
    }

    return formData;
  };

  const onSubmit = async (data) => {
    try {
      const formData = preparePatientFormData(data);

      const url = id ? `/student/${id}` : `/addstudent`;

      const method = id ? "patch" : "post";

      await apiClient[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        id ? "Student updated successfully" : "Student added successfully"
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-lg p-8">
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
            {id ? "Edit Student" : "Add New Student"}
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

        <form
          onSubmit={handleSubmit((data) => onSubmit(data))}
          className="space-y-8"
        >
          {/* Image & Personal Info */}
          <div className="p-6 rounded-xl border-2 border-gray-100">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Patient"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Image</span>
                )}
              </div>
              <label className="cursor-pointer bg-blue-200 text-blue-950 font-semibold px-4 py-2 rounded-xl hover:bg-blue-100">
                {imagePreview ? "Change Image" : "Upload Image"}
                <PrimaryInput
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="hidden"
                  id="image-upload"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PrimaryInput
                label="Full Name"
                name="name"
                register={register}
                error={errors.name}
              />
              <PrimaryInput
                label="Parent Name"
                name="parentName"
                register={register}
                error={errors.parentName}
                disabled={isDisabled(id)}
                className={
                  isDisabled(id) ? "opacity-70 pointer-events-none" : ""
                }
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

          <div className="p-6 rounded-xl border-2 border-gray-100">
            <h2 className="text-2xl font-semibold text-blue-950 mb-4">
              Parents Contacts
            </h2>
            {contactFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 rounded-lg relative "
              >
                <PrimaryInput
                  label="Name"
                  name={`parentInfo[${index}].parentName`}
                  register={register}
                  error={errors.parentInfo?.[index]?.parentName}
                />
                <PrimaryInput
                  label="Phone"
                  name={`parentInfo[${index}].parentPhone`}
                  onKeyDown={allowOnlyNumbers}
                  register={register}
                  error={errors.parentInfo?.[index]?.parentPhone}
                />
                <PrimaryInput
                  label="Email"
                  name={`parentInfo[${index}].parentEmail`}
                  register={register}
                  error={errors.parentInfo?.[index]?.parentEmail}
                />
                <PrimarySelect
                  label="Payment"
                  name={`parentInfo[${index}].payment`}
                  control={control}
                  options={[
                    { value: "cash", label: "Cash" },
                    { value: "debit", label: "Debit" },
                  ]}
                  error={errors?.parentInfo?.[index]?.payment}
                />
                <PrimaryInput
                  label="Street"
                  name={`parentInfo[${index}].parentAddress.street`}
                  register={register}
                  error={errors?.parentInfo?.[index]?.parentAddress?.street}
                />
                <PrimaryInput
                  label="Building Number"
                  name={`parentInfo[${index}].parentAddress.buildingNumber`}
                  onKeyDown={allowOnlyNumbers}
                  register={register}
                  error={
                    errors?.parentInfo?.[index]?.parentAddress?.buildingNumber
                  }
                />
                <PrimaryInput
                  label="Floor"
                  name={`parentInfo[${index}].parentAddress.floor`}
                  onKeyDown={allowOnlyNumbers}
                  register={register}
                  error={errors?.parentInfo?.[index]?.parentAddress?.floor}
                />
                <PrimaryInput
                  label="Apartment No"
                  name={`parentInfo[${index}].parentAddress.apartment`}
                  onKeyDown={allowOnlyNumbers}
                  register={register}
                  error={errors?.parentInfo?.[index]?.parentAddress?.apartment}
                />
                <PrimaryInput
                  label="Note"
                  name={`parentInfo[${index}].parentAddress.note`}
                  register={register}
                  error={errors?.parentInfo?.[index]?.parentAddress?.note}
                />

                {contactFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this contact?")
                      ) {
                        removeContact(index);
                      }
                    }}
                    className="absolute top-2 right-2"
                  >
                    <TbXboxX className="text-red-600 w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <PrimaryButton
              label="Add Contact"
              onClick={() => {
                if (contactFields.length < 2) {
                  appendContact({
                    parentName: "",
                    parentPhone: "",
                    parentEmail: "",
                    payment: "",
                    parentAddress: {
                      street: "",
                      buildingNumber: "",
                      floor: "",
                      apartment: "",
                      note: "",
                    },
                  });
                } else {
                  toast.warning("You can add a maximum of 2 parents.");
                }
              }}
              disabled={contactFields.length >= 2}
            />
          </div>
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-sky-700 text-white font-bold py-3 px-8 rounded-xl hover:bg-[#233960]"
            >
              {isSubmitting
                ? "Submitting..."
                : id
                ? "Update Student"
                : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
