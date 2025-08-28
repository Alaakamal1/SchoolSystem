const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().split("T")[0]; // YYYY-MM-DD
  } catch (e) {
    console.error("Error formatting date:", e);
    return "";
  }
};
export default formatDateForInput;