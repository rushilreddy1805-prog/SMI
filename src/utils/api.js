// ─── API LAYER ───────────────────────────────────────────────────────────────
// Uses JSONPlaceholder to simulate a real REST API.
// Users from /users are mapped into student records with Telugu names.

const BASE_URL = "https://jsonplaceholder.typicode.com";

const MAJORS   = ["Computer Science", "Data Science", "Software Engineering", "Mathematics", "Cybersecurity"];
const YEARS    = ["Freshman", "Sophomore", "Junior", "Senior"];
const STATUSES = ["active", "active", "active", "probation", "inactive"];
const CGPAS    = [9.4, 8.7, 7.5, 8.2, 6.9, 7.7, 8.1, 9.1, 6.5, 7.3];

const TELUGU_FIRST_NAMES = [
  "Venkata", "Lakshmi", "Srinivas", "Padmavathi", "Ravi",
  "Sudha", "Nagarjuna", "Bhavani", "Prasad", "Swathi"
];

const TELUGU_LAST_NAMES = [
  "Reddy", "Rao", "Naidu", "Chowdary", "Varma",
  "Murthy", "Babu", "Devi", "Krishna", "Goud"
];

const TELUGU_CITIES = [
  "Hyderabad", "Visakhapatnam", "Vijayawada", "Warangal",
  "Tirupati", "Guntur", "Nellore", "Rajahmundry", "Karimnagar", "Kadapa"
];

const TELUGU_PHONES = [
  "+91 94400 12345", "+91 95500 23456", "+91 96600 34567",
  "+91 97700 45678", "+91 98800 56789", "+91 99900 67890",
  "+91 93300 78901", "+91 92200 89012", "+91 91100 90123", "+91 90000 01234"
];

function pick(arr, id) { return arr[id % arr.length]; }

/**
 * Maps a JSONPlaceholder user object into a student record with Telugu names.
 */
function mapUserToStudent(user) {
  const idx       = user.id - 1;
  const firstName = TELUGU_FIRST_NAMES[idx % TELUGU_FIRST_NAMES.length];
  const lastName  = TELUGU_LAST_NAMES[idx % TELUGU_LAST_NAMES.length];
  const email     = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;

  return {
    id:        `STU-${String(user.id).padStart(3, "0")}`,
    firstName,
    lastName,
    email,
    phone:   TELUGU_PHONES[idx % TELUGU_PHONES.length],
    major:   pick(MAJORS, user.id),
    year:    pick(YEARS, user.id + 1),
    cgpa:    CGPAS[user.id % CGPAS.length],
    credits: 15 + user.id * 9,
    status:  pick(STATUSES, user.id + 2),
    city:    TELUGU_CITIES[idx % TELUGU_CITIES.length],
    company: user.company?.name || "—",
    website: user.website || "",
  };
}

/**
 * Fetch all students from the API.
 * GET /users → mapped to student records
 */
export async function fetchStudents() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error(`Failed to fetch students (${res.status})`);
  const users = await res.json();
  return users.map(mapUserToStudent);
}

/**
 * Fetch a single student by numeric user id.
 */
export async function fetchStudentById(numericId) {
  const res = await fetch(`${BASE_URL}/users/${numericId}`);
  if (!res.ok) throw new Error(`Student not found (${res.status})`);
  const user = await res.json();
  return mapUserToStudent(user);
}

/**
 * Simulate creating a student. POST /users
 */
export async function createStudent(data) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create student");
  return res.json();
}

/**
 * Simulate updating a student. PUT /users/:numericId
 */
export async function updateStudent(numericId, data) {
  const res = await fetch(`${BASE_URL}/users/${numericId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update student");
  return res.json();
}

/**
 * Simulate deleting a student. DELETE /users/:numericId
 */
export async function deleteStudentById(numericId) {
  const res = await fetch(`${BASE_URL}/users/${numericId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete student");
  return true;
}
