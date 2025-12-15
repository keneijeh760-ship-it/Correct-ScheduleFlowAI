import React, { useState } from "react";

function Support() {
  const [showChecklist, setShowChecklist] = useState(false);
  return (
    <div className="support-container">
      <h1>AI Scheduler Support</h1>
      <p>
        Need help? Try our quick troubleshooting checklist or reach out for assistance!
      </p>
      <button className="send-message-btn" style={{marginBottom: '18px'}} onClick={() => setShowChecklist(!showChecklist)}>
        {showChecklist ? "Hide Checklist" : "Show Troubleshooting Checklist"}
      </button>
      {showChecklist && (
        <ul className="support-list">
          <li>✅ Is your internet connection stable?</li>
          <li>✅ Are you signed in to your account?</li>
          <li>✅ Is your browser up to date?</li>
          <li>✅ Have you tried refreshing the page?</li>
          <li>✅ Still need help? <a href="/contact">Contact Support</a></li>
        </ul>
      )}
      <div className="support-surprise">
        <h2>Motivational Quote</h2>
        <p>"Success is the sum of small efforts, repeated day in and day out."</p>
      </div>
    </div>
  );
}

export default Support;
