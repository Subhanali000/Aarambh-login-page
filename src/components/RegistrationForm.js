import { useState } from "react";

const RegistrationForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    branch: "",
    phone: "",
    performanceType: "",
    soloOrGroup: "",
    groupSize: "",
    groupMembers: "",
    additionalComments: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("https://backend-lac-theta.vercel.app/api/forms/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Form submitted!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>AARAMBH 2K25 Registration</h2>
      <input name="fullName" placeholder="Full Name" required onChange={handleChange} />
      <select name="branch" required onChange={handleChange}>
        <option value="">Select Branch</option>
        <option value="CSE CORE">CSE CORE</option>
        <option value="MECHANICAL">MECHANICAL</option>
      </select>
      <input name="phone" placeholder="Phone Number" required onChange={handleChange} />
      <select name="performanceType" required onChange={handleChange}>
        <option value="">Performance Type</option>
        <option value="Solo Singing">Solo Singing</option>
        <option value="Group Dancing">Group Dancing</option>
      </select>
      <input name="additionalComments" placeholder="Any comments?" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default RegistrationForm;
