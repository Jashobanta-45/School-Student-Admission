import React, { useEffect, useState } from "react";
import axios from "axios";

function Student() {
  const [studentid, setId] = useState("");
  const [studentname, setName] = useState("");
  const [studentaddress, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    Load();
  }, []);

  // 🔹 Load all students
  async function Load() {
    try {
      const result = await axios.get("http://localhost:2006/student/getAll");
      setStudents(result.data);
      console.log("Loaded students:", result.data);
    } catch (error) {
      console.error("Error loading students:", error);
    }
  }

  // 🔹 Save a new student
  async function save(event) {
    event.preventDefault();
    try {
      await axios.post("http://localhost:2006/student/save", {
        studentName: studentname,
        studentAddress: studentaddress,
        mobile,
      });
      alert("✅ Student registered successfully!");
      clearForm();
      Load();
    } catch (err) {
      console.error(err);
      alert("❌ Student registration failed");
    }
  }

  // 🔹 Edit student (fill form for update)
  function editStudent(student) {
    setId(student.id || student._id);
    setName(student.studentName);
    setAddress(student.studentAddress); // ✅ Fixed: Correct field name
    setMobile(student.mobile);
  }

  // 🔹 Delete student
  async function DeleteStudent(id) {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await axios.delete(`http://localhost:2006/student/delete/${id}`);
      alert("🗑️ Student deleted successfully!");
      Load();
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed!");
    }
  }

  // 🔹 Update student
  async function update(event) {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:2006/student/update/${studentid}`, {
        studentName: studentname,
        studentAddress: studentaddress,
        mobile,
      });
      alert("✅ Student updated successfully!");
      clearForm();
      Load();
    } catch (err) {
      console.error(err);
      alert("❌ Student update failed!");
    }
  }

  // 🔹 Clear form fields
  function clearForm() {
    setId("");
    setName("");
    setAddress("");
    setMobile("");
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">🎓 Student Management</h1>

      {/* 🧾 Student Form */}
      <form>
        <div className="form-group mb-3">
          <label>Student Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter student name"
            value={studentname}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Student Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter student address"
            value={studentaddress}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Mobile</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={save}>
            Register
          </button>
          <button className="btn btn-warning" onClick={update}>
            Update
          </button>
        </div>
      </form>

      <br />

      {/* 🧮 Student Table */}
      <table className="table table-dark mt-4 text-center">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Student Address</th>
            <th>Mobile</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id || student._id}>
                <td>{student.studentName}</td>
                <td>{student.studentAddress}</td>
                <td>{student.mobile}</td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => editStudent(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => DeleteStudent(student.id || student._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Student;
