import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function All() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="footer">
<span className="copyright">&copy; 2025 AI Scheduler. All rights reserved.</span>
<ul className="footer-links">
<li><a className="privacy" href="/privacy">Privacy Policy</a></li>
<li><a className="terms" href="/terms">Terms of Service</a></li>
<li><a className="contact" href="/contact">Contact Us</a></li>
      </ul>
    </div>
  
    </>
  )
}

export default All
