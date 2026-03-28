import { getAvatarColor, getCgpaClass } from "../utils/helpers";

/**
 * StudentProfile — detailed view of a single student.
 *
 * Props:
 *   student {Object}    - Student data object
 *   onBack  {Function}  - Go back to list
 *   onEdit  {Function}  - Open edit modal
 */
export function StudentProfile({ student, onBack, onEdit }) {
  const s = student;

  return (
    <div className="card fade-in">
      {/* Header */}
      <div className="profile-header">
        <div
          className="profile-avatar"
          style={{ background: getAvatarColor(s.id) }}
        >
          {s.firstName[0]}{s.lastName[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div className="profile-name">{s.firstName} {s.lastName}</div>
          <div className="profile-sub">{s.id} · {s.major} · {s.year}</div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back</button>
          <button className="btn btn-primary btn-sm" onClick={onEdit}>Edit</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat">
          <div className={`stat-val ${getCgpaClass(s.cgpa)}`}>{s.cgpa.toFixed(1)}</div>
          <div className="stat-lbl">CGPA / 10</div>
        </div>
        <div className="stat">
          <div className="stat-val">{s.credits}</div>
          <div className="stat-lbl">Credits</div>
        </div>
        <div className="stat">
          <span className={`badge badge-${s.status}`}>{s.status}</span>
          <div className="stat-lbl" style={{ marginTop: 6 }}>Status</div>
        </div>
      </div>

      {/* Details */}
      <div className="info-grid">
        <div className="info-block">
          <h3>Contact</h3>
          <div className="info-row"><span className="info-label">Email</span><span className="info-value">{s.email}</span></div>
          <div className="info-row"><span className="info-label">Phone</span><span className="info-value">{s.phone || "—"}</span></div>
          <div className="info-row"><span className="info-label">City</span><span className="info-value">{s.city || "—"}</span></div>
          <div className="info-row"><span className="info-label">Website</span><span className="info-value">{s.website || "—"}</span></div>
        </div>
        <div className="info-block">
          <h3>Academic</h3>
          <div className="info-row"><span className="info-label">Major</span><span className="info-value">{s.major}</span></div>
          <div className="info-row"><span className="info-label">Year</span><span className="info-value">{s.year}</span></div>
          <div className="info-row"><span className="info-label">CGPA</span><span className="info-value">{s.cgpa.toFixed(1)} / 10</span></div>
          <div className="info-row"><span className="info-label">Credits</span><span className="info-value">{s.credits}</span></div>
          <div className="info-row"><span className="info-label">Status</span><span className="info-value">{s.status}</span></div>
        </div>
      </div>
    </div>
  );
}
