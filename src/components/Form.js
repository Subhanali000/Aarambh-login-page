import React, { useState } from "react";
import axios from "axios";

const Form = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    performanceType: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/forms/submit", formData);
      alert(response.data.message);
      setFormData({ fullName: "", department: "", performanceType: "" });
    } catch (error) {
      alert("Error submitting form");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/forms/download", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "formData.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Error downloading file");
    }
  };

  return (
    <div>
      <h2>Performance Registration</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
        <select name="performanceType" value={formData.performanceType} onChange={handleChange} required>
          <option value="">Select Performance</option>
          <option value="Solo Singing">Solo Singing</option>
          <option value="Group Dancing">Group Dancing</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      <button onClick={handleDownload}>Download Data as Excel</button>
    </div>
  );
};

export default Form;
