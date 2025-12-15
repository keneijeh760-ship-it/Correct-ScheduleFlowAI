import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./schedules-archive.css";

function SchedulesPage() {
  const [pdfSchedules, setPdfSchedules] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    loadPdfSchedules();
  }, []);

  const loadPdfSchedules = async () => {
    try {
      const demoUserId = "demo-user";
      const res = await fetch(
        `http://localhost:5000/api/schedules?userId=${encodeURIComponent(
          demoUserId
        )}`
      );

      if (res.ok) {
        const data = await res.json();
        setPdfSchedules(data.schedules || []);
      } else {
        setPdfSchedules([]);
      }
      setLoading(false);
    } catch (err) {
      setPdfSchedules([]);
      setLoading(false);
    }
  };

  const deletePdfSchedule = async (id) => {
    try {
      const res = await fetch('https://schedule-flow-d53yvzg4x-kenes-projects-52f601fb.vercel.app/api/generate-schedule', {
        method: "DELETE",
      });

      if (res.ok) {
        setPdfSchedules(pdfSchedules.filter((pdf) => pdf.id !== id));
      } else {
        console.error("Failed to delete PDF schedule");
      }
    } catch (err) {
      console.error("Error deleting PDF schedule:", err);
    }
  };

  const downloadPdf = (pdfUrl, filename) => {
    if (pdfUrl?.startsWith("/api/download-pdf/")) {
      window.open(`http://localhost:5000${pdfUrl}`, "_blank");
    } else if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = filename || "schedule.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // ✅ Safe filtering with fallbacks
  const filteredPdfSchedules = pdfSchedules.filter((pdf) => {
    const filename = pdf?.filename || "";
    const tasks = pdf?.tasks || "";
    const category = pdf?.category || "";

    const matchesSearch =
      filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tasks.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "work", "academic", "personal", "fitness", "business"];

  return (
    <div className="schedules-archive-page">
      <div className="schedules-topbar">
        <h1>PDF Schedule Archive</h1>
        <p>Access all your previously generated AI schedule PDFs</p>
        <Link to="/" className="schedules-back-link">
          ← Back to Home
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="schedules-search-section">
        <div className="search-filter-container">
          <div className="search-group">
            <label>Search PDFs:</label>
            <input
              type="text"
              className="search-input"
              placeholder="Search by filename, tasks, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Category:</label>
            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all"
                    ? "All Categories"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && <div className="loading-state">Loading PDF schedules...</div>}
      {error && <div className="empty-state">{error}</div>}

      <div className="schedules-list">
        {filteredPdfSchedules.map((pdf) => (
          <div key={pdf.id} className="schedule-card">
            <div className="card-header">
              <div className="card-title-section">
                <h3>📄 {pdf.filename || "Untitled Schedule"}</h3>
                <span className="category-tag">
                  {pdf.category || "uncategorized"}
                </span>
              </div>
              <div className="card-actions">
                <button
                  onClick={() =>
                    downloadPdf(pdf.downloadUrl, pdf.filename || "schedule.pdf")
                  }
                  className="download-btn"
                >
                  📥 Download
                </button>
                <button
                  onClick={() => deletePdfSchedule(pdf.id)}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            <div className="card-info">
              <strong>Generated for:</strong>{" "}
              <span>{pdf.purpose || "General use"}</span>
            </div>

            <div className="card-date">
              Generated:{" "}
              {pdf.generatedAt
                ? new Date(pdf.generatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Unknown date"}
            </div>

            <div className="card-section">
              <h4>Tasks:</h4>
              <p className="tasks-text">{pdf.tasks || "No tasks listed"}</p>
            </div>

            <div className="card-section">
              <h4>PDF Details:</h4>
              <div className="pdf-details">
                <div>
                  <strong>File Size:</strong> {pdf.fileSize || "N/A"}
                </div>
                <div>
                  <strong>Pages:</strong> {pdf.pages || "N/A"}
                </div>
                <div>
                  <strong>Format:</strong> {pdf.format || "PDF"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!filteredPdfSchedules.length && !loading && !error && (
        <div className="empty-state">
          {searchTerm || filterCategory !== "all"
            ? "No PDF schedules match your search criteria."
            : "No PDF schedules generated yet. Generate your first schedule from the home page to see it here."}
        </div>
      )}

      <div className="generate-section">
        <Link to="/" className="generate-btn">
          Generate New Schedule PDF
        </Link>
        <p>New PDF schedules will be automatically saved to this archive</p>
      </div>
    </div>
  );
}

export default SchedulesPage;
