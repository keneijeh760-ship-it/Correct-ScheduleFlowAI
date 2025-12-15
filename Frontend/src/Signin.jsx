import React, { useState } from "react";

function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userData", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "/";
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <>
    <a href="/" className="back-home">← Back to Home</a>


    <div className="signin-container">
      <div className="signin-form">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit} id="signForm">
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            </div>
            

         
          <button type="submit" className="signin-btn">Sign In</button>
        </form>
        {error && <div className="error-message">{error}</div>}
        <p className="form-footer">Don’t have an account? <a href="/register">Create one</a></p>
      </div>
    </div>
    </>
    
  );
}

export default Signin;
