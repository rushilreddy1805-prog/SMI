import { useState } from "react";
import { getAvatarColor, getCgpaClass } from "../utils/helpers";

/**
 * StudentList — displays all students in a searchable table.
 *
 * Props:
 *   students  {Array}    - List of student objects
 *   onView    {Function} - Opens profile for a student
 *   onEdit    {Function} - Opens edit modal for a student
 *   onDelete  {Function} - Triggers delete confirmation
 */
export function StudentList({ students, onView, onEdit, onDelete }) {
  const [search, setSearch] = useState("");

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      `${s.firstName} ${s.lastName} ${s.id} ${s.email} ${s.major}`
        .toLowerCase()
        .includes(q)
    );
  });

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2>All Students ({filtered.length})</h2>
        <div className="search-wrap">
          <i className="search-icon">🔍</i>
          <input
            className="input"
            style={{ width: 220 }}
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="center-box">
            <div className="icon">🔍</div>
            <p>No students match your search.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>ID</th>
                <th>Major</th>
                <th>Year</th>
                <th>CGPA</th>
                <th>Credits</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div
                        className="avatar"
                        style={{ background: getAvatarColor(s.id) }}
                      >
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{s.firstName} {s.lastName}</div>
                        <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{s.id}</td>
                  <td>{s.major}</td>
                  <td>{s.year}</td>
                  <td><span className={getCgpaClass(s.cgpa)}>{s.cgpa.toFixed(1)}</span></td>
                  <td>{s.credits}</td>
                  <td>
                    <span className={`badge badge-${s.status}`}>{s.status}</span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => onView(s)}>View</button>
                      <button className="btn btn-primary btn-sm" onClick={() => onEdit(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(s)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
