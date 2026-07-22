import { useMemo, useRef, useState } from "react";

const initialForm = {
  name: "",
  age: "",
  gender: "",
  section: "",
  phone: "",
  image: "",
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fileInputRef = useRef(null);

  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return students;

    return students.filter(student => {
      return (
        student.name.toLowerCase().includes(value) ||
        student.gender.toLowerCase().includes(value) ||
        student.section.toLowerCase().includes(value) ||
        student.phone.toLowerCase().includes(value)
      );
    });
  }, [students, search]);

  const handleChange = event => {
    const { name, value } = event.target;

    setForm(previous => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = event => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm(previous => ({
        ...previous,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    const name = form.name.trim();
    const phone = form.phone.trim();

    if (
      !name ||
      !form.age ||
      !form.gender ||
      !form.section ||
      !phone ||
      !form.image
    ) {
      alert("Please complete all fields.");
      return;
    }

    if (Number(form.age) < 3 || Number(form.age) > 25) {
      alert("Age must be between 3 and 25.");
      return;
    }

    if (editingId) {
      setStudents(previous =>
        previous.map(student =>
          student.id === editingId
            ? {
                ...student,
                ...form,
                name,
                phone,
              }
            : student,
        ),
      );
    } else {
      const newStudent = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(),
        ...form,
        name,
        phone,
      };

      setStudents(previous => [newStudent, ...previous]);
    }

    resetForm();
  };

  const handleEdit = student => {
    setEditingId(student.id);

    setForm({
      name: student.name,
      age: student.age,
      gender: student.gender,
      section: student.section,
      phone: student.phone,
      image: student.image,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = id => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?",
    );

    if (!confirmed) return;

    setStudents(previous => previous.filter(student => student.id !== id));

    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-4 rounded-3xl border border-slate-500 bg-gray-900 px-6 py-5 shadow-sm">
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Student Management
              </h1>
            </div>

            <div className="w-fit rounded-xl bg-blue-50 px-4 py-2 font-bold text-blue-700">
              Total students: {students.length}
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[500px_minmax(0,1fr)]">
          {/* Left side form */}
          <section className="h-fit rounded-3xl border border-slate-200 bg-gray-900 p-6 shadow-sm sm:p-7">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? "Edit Student" : "Add New Student"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-white"
                >
                  Student Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full student name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="age"
                    className="mb-2 block text-sm font-semibold text-white"
                  >
                    Age
                  </label>

                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="3"
                    max="25"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="Age"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="mb-2 block text-sm font-semibold text-white"
                  >
                    Gender
                  </label>

                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-white outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="section"
                    className="mb-2 block text-sm font-semibold text-white"
                  >
                    Section
                  </label>

                  <select
                    id="section"
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-white outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">Select section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-white"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+964 750 123 4567"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-semibold text-white"
                >
                  Student Image
                </label>

                <label
                  htmlFor="image"
                  className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition hover:border-blue-400 hover:bg-blue-50"
                >
                  {form.image ? (
                    <img
                      src={form.image}
                      alt="Student preview"
                      className="h-20 w-20 rounded-2xl object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
                      📷
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800">
                      {form.image ? "Change student image" : "Choose an image"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Click here to upload JPG, PNG or WEBP.
                    </p>
                  </div>
                </label>

                <input
                  ref={fileInputRef}
                  id="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="flex gap-3 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-semibold text-white transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-800 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99]"
                >
                  {editingId ? "Update Student" : "+ Add Student"}
                </button>
              </div>
            </form>
          </section>

          {/* Right side table */}
          <section className="min-w-0 rounded-3xl border border-slate-200 bg-gray-900 p-6 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Student List</h2>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-225 w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Image
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Student Name
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Age
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Gender
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Section
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Phone Number
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-24 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                          🎓
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-slate-800">
                          {students.length === 0
                            ? "No students yet"
                            : "No students found"}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                          {students.length === 0
                            ? "Add your first student using the form on the left."
                            : "Try searching with another name, section, gender or phone number."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => (
                      <tr
                        key={student.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <img
                            src={student.image}
                            alt={student.name}
                            className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-200"
                          />
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <p className="font-semibold text-white">
                            {student.name}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-600">
                          {student.age}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                            {student.gender}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            Section {student.section}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-600">
                          {student.phone}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(student)}
                              className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-500 hover:text-white"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(student.id)}
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
