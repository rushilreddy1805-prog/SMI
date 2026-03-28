import { useState } from "react";
import "./styles.css";

import { fetchStudents, createStudent, updateStudent, deleteStudentById } from "./utils/api";
import { useFetch } from "./hooks/useFetch";
import { useToast } from "./hooks/useToast";

import { LoginPage }      from "./components/LoginPage";
import { StudentList }    from "./components/StudentList";
import { StudentProfile } from "./components/StudentProfile";
import { StudentForm }    from "./components/StudentForm";
import { Toast }          from "./components/Toast";

export default function App() {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);

  // ── Data from API ─────────────────────────────────────────────────────────
  const { data: apiStudents, loading, error, refetch } = useFetch(fetchStudents, []);

  // Local state layered on top of API data (add/edit/delete without refetching)
  const [localStudents, setLocalStudents] = useState(null);
  const students = localStudents ?? apiStudents ?? [];

  // Sync local state when API loads for the first time
  if (apiStudents && localStudents === null) {
    setLocalStudents(apiStudents);
  }

  // ── UI State ──────────────────────────────────────────────────────────────
  const [view,     setView]     = useState("list");
  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving,   setSaving]   = useState(false);

  const { toasts, toast } = useToast();

  // ── Show login if not authenticated ───────────────────────────────────────
  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={setCurrentUser} />
        <Toast toasts={toasts} />
      </>
    );
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  const closeModal = () => { if (!saving) setModal(null); };

  const handleAdd = async (formData) => {
    setSaving(true);
    try {
      await createStudent(formData);
      const newStudent = {
        ...formData,
        id: `STU-${String(students.length + 1).padStart(3, "0")}`,
      };
      setLocalStudents((prev) => [newStudent, ...prev]);
      toast("Student added successfully!", "success");
      setModal(null);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      const numericId = parseInt(selected.id.replace(/\D/g, ""));
      await updateStudent(numericId, formData);
      const updated = { ...selected, ...formData };
      setLocalStudents((prev) => prev.map((s) => s.id === selected.id ? updated : s));
      if (view === "profile") setSelected(updated);
      toast("Student updated!", "success");
      setModal(null);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const numericId = parseInt(selected.id.replace(/\D/g, ""));
      await deleteStudentById(numericId);
      setLocalStudents((prev) => prev.filter((s) => s.id !== selected.id));
      if (view === "profile") setView("list");
      toast("Student removed.", "success");
      setModal(null);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("list");
    setModal(null);
    setSelected(null);
    setLocalStudents(null);
    toast("Logged out successfully.", "info");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <h1>🎓 Student Management</h1>
        <div className="navbar-actions">
          {/* Logged-in user info */}
          <div className="user-info">
            <div className="user-avatar">
              {currentUser.name.charAt(0)}
            </div>
            <span>{currentUser.name}</span>
            <span className="user-role">{currentUser.role}</span>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setLocalStudents(null); refetch(); toast("Refreshed from API", "info"); }}
          >
            ↻ Refresh
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setModal("add")}>
            + Add Student
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        {/* Loading */}
        {loading && (
          <div className="center-box">
            <div className="spinner" />
            <p>Loading students from API…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="center-box">
            <div className="icon">⚠️</div>
            <p style={{ color: "#dc2626" }}>{error}</p>
            <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={refetch}>
              Retry
            </button>
          </div>
        )}

        {/* List View */}
        {!loading && !error && view === "list" && (
          <StudentList
            students={students}
            onView={(s) => { setSelected(s); setView("profile"); }}
            onEdit={(s) => { setSelected(s); setModal("edit"); }}
            onDelete={(s) => { setSelected(s); setModal("confirm"); }}
          />
        )}

        {/* Profile View */}
        {!loading && !error && view === "profile" && selected && (
          <StudentProfile
            student={selected}
            onBack={() => setView("list")}
            onEdit={() => setModal("edit")}
          />
        )}
      </div>

      {/* Add Modal */}
      {modal === "add" && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Student</h2>
              <button className="btn btn-secondary btn-sm" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <StudentForm initial={null} onSubmit={handleAdd} onCancel={closeModal} submitting={saving} />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modal === "edit" && selected && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2>Edit — {selected.firstName} {selected.lastName}</h2>
              <button className="btn btn-secondary btn-sm" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <StudentForm initial={selected} onSubmit={handleUpdate} onCancel={closeModal} submitting={saving} />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {modal === "confirm" && selected && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="btn btn-secondary btn-sm" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗑️</div>
              <p>Delete <strong>{selected.firstName} {selected.lastName}</strong>?</p>
              <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                This cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="btn btn-danger"    onClick={handleDelete} disabled={saving}>
                {saving ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
