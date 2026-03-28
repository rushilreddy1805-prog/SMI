import { useState } from "react";
import { MAJORS, YEARS, STATUSES, EMPTY_FORM, validateForm } from "../utils/helpers";

/**
 * StudentForm — controlled form for adding or editing a student.
 *
 * Props:
 *   initial    {Object|null} - Existing data for edit; null for add
 *   onSubmit   {Function}    - Called with valid form data
 *   onCancel   {Function}    - Closes the form
 *   submitting {boolean}     - Shows saving state
 */
export function StudentForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial, cgpa: String(initial.cgpa), credits: String(initial.credits) }
      : EMPTY_FORM
  );
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const handleSubmit = () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouched(Object.fromEntries(Object.keys(errs).map((k) => [k, true])));
      return;
    }
    onSubmit({ ...form, cgpa: parseFloat(form.cgpa), credits: parseInt(form.credits) });
  };

  const Field = ({ name, label, type = "text", opts }) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {opts ? (
        <select
          id={name}
          className={errors[name] && touched[name] ? "error" : ""}
          value={form[name]}
          onChange={(e) => set(name, e.target.value)}
          disabled={submitting}
        >
          <option value="">Select…</option>
          {opts.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          className={`input${errors[name] && touched[name] ? " error" : ""}`}
          value={form[name]}
          onChange={(e) => set(name, e.target.value)}
          disabled={submitting}
        />
      )}
      {errors[name] && touched[name] && (
        <span className="field-error">{errors[name]}</span>
      )}
    </div>
  );

  return (
    <>
      <div className="form-grid">
        <Field name="firstName" label="First Name" />
        <Field name="lastName"  label="Last Name" />
        <Field name="email"     label="Email" type="email" />
        <Field name="phone"     label="Phone" />
        <Field name="major"     label="Major"  opts={MAJORS} />
        <Field name="year"      label="Year"   opts={YEARS} />
        <Field name="cgpa"      label="CGPA (0.0 – 10.0)" />
        <Field name="credits"   label="Credits" />
        <Field name="status"    label="Status" opts={STATUSES} />
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
        <button className="btn btn-primary"   onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving…" : initial ? "Save Changes" : "Add Student"}
        </button>
      </div>
    </>
  );
}
