export const MAJORS   = ["Computer Science", "Data Science", "Software Engineering", "Mathematics", "Cybersecurity"];
export const YEARS    = ["Freshman", "Sophomore", "Junior", "Senior"];
export const STATUSES = ["active", "inactive", "probation"];

export const AVATAR_COLORS = ["#1e40af", "#15803d", "#b45309", "#7c3aed", "#0e7490",
  "#be123c", "#0f766e", "#c2410c", "#4338ca", "#0369a1"];

export function getAvatarColor(id) {
  const num = parseInt(id.replace(/\D/g, "")) || 0;
  return AVATAR_COLORS[num % AVATAR_COLORS.length];
}

// CGPA out of 10
export function getCgpaClass(cgpa) {
  if (cgpa >= 8.0) return "gpa-high";
  if (cgpa >= 6.0) return "gpa-mid";
  return "gpa-low";
}

export function validateForm(data) {
  const errors = {};
  if (!data.firstName?.trim()) errors.firstName = "Required";
  if (!data.lastName?.trim())  errors.lastName  = "Required";
  if (!data.email?.includes("@")) errors.email  = "Valid email required";
  if (!data.major)  errors.major  = "Required";
  if (!data.year)   errors.year   = "Required";
  if (!data.status) errors.status = "Required";

  // CGPA range: 0.0 – 10.0
  const cgpa = parseFloat(data.cgpa);
  if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) errors.cgpa = "Must be 0.0 – 10.0";

  const credits = parseInt(data.credits);
  if (isNaN(credits) || credits < 0) errors.credits = "Must be ≥ 0";
  return errors;
}

export const EMPTY_FORM = {
  firstName: "", lastName: "", email: "", phone: "",
  major: "", year: "", cgpa: "", credits: "", status: "active",
};
