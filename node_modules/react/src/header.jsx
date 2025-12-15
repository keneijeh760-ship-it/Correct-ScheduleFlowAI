
import { useNavigate } from "react-router-dom";

function Header () {
    const navigate = useNavigate();

    return (


       <nav className="navbar">
<div className="nav-container">
<div className="logo">ScheduleFlow AI 🧠</div>
<ul className="nav-links">
<li><a className="Home" href="/">Home</a></li>
<li><a className="Schedule" href="/schedules">My Schedule</a></li>
<li><a className="about" href="/Contact">Contact Us</a></li>
<li><a className="Support" href="/Support">Support</a></li>
      </ul>
      <div id="auth-buttons">
        <button onClick={() => navigate("/signin")} className="sign_in" >Sign In</button>
<button onClick={() => navigate("/register")} className="get_started" >Get Started</button>
      </div>
      

      </div>
  </nav>
        
    );

}

export default Header