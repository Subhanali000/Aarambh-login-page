import { useState, useEffect } from "react";
import axios from "axios";

import './App.css'; // Import the CSS file
const API_URL = "https://backend-vbgz.onrender.com/"; // Your local backend URL
const App = () => {
  // State for form inputs
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    branch: "",
    phone: "",
    performanceType: "",
    otherPerformance: "",
    soloOrGroup: "",
    groupSize: "",
    groupMembers: "",
    additionalComments: "",
  });

  // State for admin login
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [submittedData, setSubmittedData] = useState([]); 

  useEffect(() => {
    const fetchSubmittedData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/forms/data`);
        setSubmittedData(response.data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching submitted data:", error);
      }
    };

    if (isLoggedIn) {
      fetchSubmittedData();
    }
  }, [isLoggedIn]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle admin login submission
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, { username, password });
  
      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token); // Store the received token in localStorage
        setIsLoggedIn(true);
        setIsModalOpen(false);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.error || "Login failed");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Submitting form:", form); // Log form data before submission
  
    // Show a loading message to the user
    setLoading(true); // Set loading state to true before submitting
  
    if (!form.fullName || !form.email || !form.branch || !form.phone) {
      alert("Please fill out all required fields.");
      setLoading(false); // Hide loading state if validation fails
      return;
    }
  
    try {
      const response = await axios.post(`${API_URL}/api/forms/submit`, form);
      
      console.log("Response from backend:", response); // Log response from the backend
  
      if (response.data.success) {
        setSubmittedData((prevData) => [...prevData, form]);
        setForm({
          fullName: "",
          email: "",
          branch: "",
          phone: "",
          performanceType: "",
          otherPerformance: "",
          soloOrGroup: "",
          groupSize: "",
          groupMembers: "",
          additionalComments: "",
        });
        alert(response.data.message); // Show success message to user
      } else {
        alert("Error: " + response.data.error); // Show error message to user
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false); // Hide loading state once the request completes
    }
  };
  

  // Handle download of submitted data
  const downloadData = async () => {
    const token = localStorage.getItem("adminToken"); // Get the token
  
    console.log("Token sent:", token); // Log the token to ensure it's correctly retrieved from localStorage
  
    if (!token) {
      alert("You must be logged in as an admin to download the data.");
      return;
    }
  
    try {
      const response = await axios.get(`${API_URL}/api/forms/download`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers for authentication
        },
        responseType: "blob",
      });
  
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
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false); // Reset login status
    alert("Logged out successfully");
  };
 
  const [loading, setLoading] = useState(false); // Add a loading state

return (
  
  <div className="registration-container">
   
    <h1>AARAMBH 2K25 Registration</h1>

    <p>Hello Juniors! 🌟</p>
    <p>
      The Fresher's Party is your time to shine! We’re excited to see your amazing talents and performances. 
      Whether you want to perform solo or as a group, this is your chance to show off your skills! 🎶💃
    </p>
    <p>
      Please fill out this form to let us know about your performance. We can’t wait to see the magic you bring to the stage! ✨
    </p>
    {isLoggedIn && (
    <div className="dashboard">
      
      <button onClick={handleLogout}>Logout</button>
    </div>
  )}



      <button className="adminbuttion" onClick={() => setIsModalOpen(true)}>
        Admin Login
      </button>
     

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Admin Login</h2>
            <form onSubmit={handleAdminLogin}>
              <label>Username</label>
              <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <label>Password</label>
              <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Login</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button onClick={() => setIsModalOpen(false)} className="modal-button">
              Close
            </button>
          </div>
        </div>
      )}
       {/* Loading state */}
    {loading && <p>Submitting your form... Please wait.</p>}
      <form onSubmit={handleSubmit}>
        <label>Full Name *</label>
        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required />
        
        <label>Email *</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
        
        <label>Branch *</label>
        <select name="branch" value={form.branch} onChange={handleChange} required>
          <option value="">Select Branch</option>
          <option value="CSE CORE">CSE CORE</option>
          <option value="CSE AIML">CSE AIML</option>
          <option value="CSE AI & DS">CSE AI & DS</option>
          <option value="CIVIL">CIVIL</option>
          <option value="MECHANICAL">MECHANICAL</option>
          <option value="BIOTECH">BIOTECH</option>
          <option value="ROBOTICS">ROBOTICS</option>
        </select>

        <label>Phone *</label>
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
        
        <label>Performance Type *</label>
        <select name="performanceType" value={form.performanceType} onChange={handleChange} required>
          <option value="">Select Performance</option>
          <option value="Solo Singing">Solo Singing 🎤</option>
          <option value="Group Singing">Group Singing 🎤</option>
          <option value="Solo Dancing">Solo Dancing 💃🕺</option>
          <option value="Group Dancing">Group Dancing 💃🕺</option>
          <option value="Acting/Drama">Acting/Drama 🎭</option>
          <option value="Stand-up Comedy">Stand-up Comedy 🎙️</option>
          <option value="Poetry">Poetry 📝</option>
          <option value="Instrumental Music">Instrumental Music 🎸🎹</option>
          <option value="Rapping">Rapping 🎤</option>
          <option value="Other">Other</option>
        </select>

        {form.performanceType === "Other" && (
          <div>
            <label>If you selected "Other", please specify:</label>
            <input type="text" name="otherPerformance" value={form.otherPerformance} onChange={handleChange} />
          </div>
        )}
          
        <label>Solo or Group *</label>
        <select name="soloOrGroup" value={form.soloOrGroup} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Solo">Solo</option>
          <option value="Group">Group</option>
        </select>

        {form.soloOrGroup === "Group" && (
          <>
            <label>Group Size</label>
            <input type="number" name="groupSize" value={form.groupSize} onChange={handleChange} />
            <label>Group Members Name & Branch</label>
            <textarea name="groupMembers" value={form.groupMembers} onChange={handleChange}></textarea>
          </>
        )}

        <label>Any Additional Comments or Requirements</label>
        <textarea name="additionalComments" value={form.additionalComments} onChange={handleChange}></textarea>

        <button type="submit">Submit Registration</button>
      </form>
       
      {isLoggedIn && (
        <div className="download">
          <button onClick={downloadData}>Download Submitted Data</button>
        </div>
        
      )}
    </div>
    
  );
};

export default App;
