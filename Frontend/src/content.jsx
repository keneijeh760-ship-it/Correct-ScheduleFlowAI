
import React, { useState } from 'react';

function Content() {
  const [taskInput, setTaskInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!taskInput.trim()) {
      alert('Please enter at least one task.');
      return;
    }
    setLoading(true);
    try {
      // Split tasks by comma or newline
      const tasks = taskInput.split(/\n|,/).map(t => t.trim()).filter(Boolean);
     const response = await fetch('https://schedule-flow-ni8hb0lwd-kenes-projects-52f601fb.vercel.app/api/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tasks,
          userId: 'demo-user', // For demo purposes
          save: true, // This will save the PDF to the archive
          category: 'personal',
          purpose: 'AI Generated Schedule'
        })
      });
      if (!response.ok) throw new Error('Failed to generate PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'schedule.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      // Show success message
      alert('PDF generated and saved to your archive! Check the Schedules page to view it.');
    } catch (err) {
      alert('Error generating schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="container">
        <div className="wave-ring">
          {/* ...existing code for SVGs... */}
          <svg viewBox="0 0 200 200">
            <defs>
              <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f00ff" />
                <stop offset="100%" stopColor="#00e5ff" />
              </linearGradient>
            </defs>
            <path
              fill="none"
              stroke="url(#waveGradient1)"
              strokeWidth="2"
              d="M100,10
                 C140,10 190,60 190,100
                 C190,140 140,190 100,190
                 C60,190 10,140 10,100
                 C10,60 60,10 100,10 Z"
            />
          </svg>
          <svg viewBox="0 0 200 200">
            <path
              fill="none"
              stroke="url(#waveGradient1)"
              strokeWidth="2"
              d="M100,10
                 C140,10 190,60 190,100
                 C190,140 140,190 100,190
                 C60,190 10,140 10,100
                 C10,60 60,10 100,10 Z"
            />
          </svg>
          <svg viewBox="0 0 200 200">
            <path
              fill="none"
              stroke="url(#waveGradient1)"
              strokeWidth="2"
              d="M100,10
                 C140,10 190,60 190,100
                 C190,140 140,190 100,190
                 C60,190 10,140 10,100
                 C10,60 60,10 100,10 Z"
            />
          </svg>
        </div>

        <div className="ai-input-area">
          <div className="text-content">
            <h1>
              Create Your <br /> own schedule with <br /> AI Website
            </h1>
            <p>Boost your productivity with AI-powered scheduling. Effortlessly organize your tasks and manage your time with ScheduleFlow AI.</p>
          </div>

          <textarea
            className="demo"
            placeholder="Enter your tasks (separate by comma or new line)"
            id="taskInput"
            value={taskInput}
            onChange={e => setTaskInput(e.target.value)}
            rows={4}
            style={{ resize: 'vertical', width: '320px', maxWidth: '90vw' }}
          />
          <button
            className="generateBtn"
            id="generateBtn"
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate & Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Content;
