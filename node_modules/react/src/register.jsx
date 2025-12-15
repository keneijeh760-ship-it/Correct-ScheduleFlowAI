import React, { useState } from "react";

function Register() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userData", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");
        setSuccess("Account created! Redirecting...");
        setTimeout(() => (window.location.href = "/"), 1500);
      } else {
        setError(data.error || "Failed to create account");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <>
    <a href="/" className="back-home">← Back to Home</a>


    <div className="register-container">
      <div className="register-form">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit} id="registerForm">
          <div className="name-row">
            <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
            </div>
            
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
             <input  type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

          </div>
         <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <div className="password-requirements">
Password must be at least 8 characters long
</div>

         </div>
          <div className="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input  type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
          </div>
          
          <button type="submit" className="register-btn">Create Account</button>
        </form>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <p className="form-footer">Already have an account? <a href="/signin">Sign in</a></p>
      </div>
    </div>
    </>
    
  );
}

export default Register;
