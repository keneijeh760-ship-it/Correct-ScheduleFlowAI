import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      setError("Please sign in to view your schedules.");
      return;
    }
    const user = JSON.parse(userData);
    try {
      const res = await fetch(`/api/schedules?userId=${encodeURIComponent(user.id)}`);
      const data = await res.json();
      if (res.ok) setSchedules(data.schedules || []);
      else setError(data.error || "Failed to load schedules");
    } catch {
      setError("Failed to load schedules.");
    }
  };

  return (
    <div className="page">
        <div className="topbar">
            <h1>My Schedules</h1>
            <Link to="/" className="link">← Back to Home</Link>

        </div>
 {error && <div className="empty">{error}</div>}
      <div className="list">
        {schedules.map((item, i) => (
          <div key={i} className="card">
            <div className="date">{new Date(item.createdAt).toLocaleString()}</div>
            <pre>{item.tasks}</pre>
            <pre>{item.schedule}</pre>
          </div>
        ))}
      </div>
      {!schedules.length && !error && <div className="empty">No schedules yet. Generate one from the home page.</div>}
    </div>
  );
}

export default Schedules;

        