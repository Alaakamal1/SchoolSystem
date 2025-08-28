import { useMemo, useState } from "react";

// Notes:
// - This is a single React component you can drop into a Vite/CRA/Next project.
// - Uses Tailwind CSS for styling (assumes Tailwind is already configured).
// - All UI text is in English. onSave builds a payload ready to send to your backend.
// - Replace the mock data with real API calls where indicated.

// Mock data for classes, sections and students
const CLASSES = [
  { id: "g10-a", name: "Grade 10 - Class A" },
  { id: "g10-b", name: "Grade 10 - Class B" },
  { id: "g11-a", name: "Grade 11 - Class A" },
];

const SECTIONS_BY_CLASS = {
  "g10-a": [
    { id: "g10-a-1", name: "Section 1" },
    { id: "g10-a-2", name: "Section 2" },
  ],
  "g10-b": [{ id: "g10-b-1", name: "Section 1" }],
  "g11-a": [
    { id: "g11-a-1", name: "Section 1" },
    { id: "g11-a-2", name: "Section 2" },
  ],
};

const STUDENTS_BY_SECTION = {
  "g10-a-1": [
    { id: "s1", name: "Mohamed Ahmed", number: "2023001" },
    { id: "s2", name: "Sara Ali", number: "2023002" },
    { id: "s3", name: "Youssef Khaled", number: "2023003" },
  ],
  "g10-a-2": [
    { id: "s4", name: "Lina Mahmoud", number: "2023004" },
    { id: "s5", name: "Khaled Amr", number: "2023005" },
  ],
  "g10-b-1": [{ id: "s6", name: "Ahmed Samir", number: "2023010" }],
  "g11-a-1": [
    { id: "s7", name: "Gina Mohamed", number: "2023101" },
    { id: "s8", name: "Karim Fares", number: "2023102" },
  ],
  "g11-a-2": [{ id: "s9", name: "Malak Tarek", number: "2023103" }],
};

const STATUS_OPTIONS = [
  { value: "present", label: "Present" },
  { value: "absent_excused", label: "Absent (Excused)" },
  { value: "absent_unexcused", label: "Absent (Unexcused)" },
  { value: "late", label: "Late" },
];

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]?.id ?? "");
  const [selectedSection, setSelectedSection] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const sections = useMemo(() => SECTIONS_BY_CLASS[selectedClass] ?? [], [selectedClass]);

  const students = useMemo(() => {
    const list = STUDENTS_BY_SECTION[selectedSection] ?? [];
    if (!search.trim()) return list;
    const s = search.trim().toLowerCase();
    return list.filter(
      (st) => st.name.toLowerCase().includes(s) || st.number.toLowerCase().includes(s)
    );
  }, [selectedSection, search]);

  // ensure a default section is selected when class changes
  const onClassChange = (id) => {
    setSelectedClass(id);
    const first = (SECTIONS_BY_CLASS[id] ?? [])[0]?.id ?? "";
    setSelectedSection(first);
    setRows({});
  };

  if (!selectedSection && sections.length) {
    setSelectedSection(sections[0].id);
  }

  const markAllPresent = () => {
    const updates = { ...rows };
    (STUDENTS_BY_SECTION[selectedSection] ?? []).forEach((st) => {
      updates[st.id] = { status: "present", note: updates[st.id]?.note ?? "" };
    });
    setRows(updates);
  };

  const setStatus = (studentId, status) => {
    setRows((prev) => ({ ...prev, [studentId]: { status, note: prev[studentId]?.note ?? "" } }));
  };

  const setNote = (studentId, note) => {
    setRows((prev) => ({ ...prev, [studentId]: { status: prev[studentId]?.status ?? "present", note } }));
  };

  const buildPayload = () => {
    const data = (STUDENTS_BY_SECTION[selectedSection] ?? []).map((st) => ({
      studentId: st.id,
      status: rows[st.id]?.status ?? "present",
      note: rows[st.id]?.note ?? "",
    }));
    return {
      classId: selectedClass,
      sectionId: selectedSection,
      date,
      records: data,
    };
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const payload = buildPayload();

      // TODO: replace with real API endpoint (fetch/axios)
      // await fetch('/api/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      console.log('Attendance payload', payload);
      await new Promise((r) => setTimeout(r, 700)); // simulate save
      setMessage({ type: 'success', text: 'Attendance saved successfully.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'An error occurred while saving.' },e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Attendance Management</h1>
            <p className="text-sm text-gray-500">Select class, section and date, then mark student attendance.</p>
          </div>
          <button
            onClick={markAllPresent}
            className="px-4 py-2 rounded-2xl shadow bg-white hover:bg-gray-100 border text-sm"
          >
            Mark All Present
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="flex flex-col">
            <label className="mb-1 text-sm">Class</label>
            <select
              className="rounded-2xl border p-2 bg-white"
              value={selectedClass}
              onChange={(e) => onClassChange(e.target.value)}
            >
              {CLASSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Section</label>
            <select
              className="rounded-2xl border p-2 bg-white"
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setRows({});
              }}
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Date</label>
            <input
              type="date"
              className="rounded-2xl border p-2 bg-white"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Search student</label>
            <input
              type="text"
              className="rounded-2xl border p-2 bg-white"
              placeholder="Name or student number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Student No.</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Note</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No students to display
                    </td>
                  </tr>
                )}
                {students.map((st, idx) => (
                  <tr key={st.id} className={idx % 2 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 align-top">{idx + 1}</td>
                    <td className="px-4 py-3 align-top">{st.number}</td>
                    <td className="px-4 py-3 align-top font-medium">{st.name}</td>
                    <td className="px-4 py-3 align-top">
                      <select
                        className="rounded-xl border p-2 bg-white"
                        value={rows[st.id]?.status ?? "present"}
                        onChange={(e) => setStatus(st.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <input
                        type="text"
                        className="rounded-xl border p-2 w-full bg-white"
                        placeholder="Optional"
                        value={rows[st.id]?.note ?? ""}
                        onChange={(e) => setNote(st.id, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="flex items-center justify-between gap-3">
          <div className="text-sm text-gray-500">
            {students.length > 0 && (
              <span>
                Showing students: <strong>{students.length}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {message && (
              <div
                className={`px-3 py-2 rounded-2xl text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}
            <button
              onClick={onSave}
              disabled={saving || !selectedSection}
              className="px-5 py-2 rounded-2xl shadow bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </footer>

        <details className="bg-white border rounded-2xl p-4 text-xs text-gray-700">
          <summary className="cursor-pointer select-none">Payload preview (debug)</summary>
          <pre className="mt-3 whitespace-pre-wrap break-all">{JSON.stringify(buildPayload(), null, 2)}</pre>
        </details>
      </div>
    </div>
  );
}
