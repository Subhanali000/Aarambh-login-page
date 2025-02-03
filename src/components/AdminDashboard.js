import React from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const downloadExcel = async () => {
    try {
      const token = localStorage.getItem("adminToken"); // Retrieve the admin token
      const response = await axios.get("https://backend-lac-theta.vercel.app/api/forms/download", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request header
        },
        responseType: "blob", // Make sure to handle the response as a blob (Excel file)
      });

      // Create a downloadable link and trigger it
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(new Blob([response.data]));
      link.href = url;
      link.setAttribute("download", "registrations.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download the file.");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={downloadExcel}>Download Excel</button>
    </div>
  );
};

export default AdminDashboard;
