import './index.css'
import All from './Footer.jsx';
import Header from './header.jsx'
import Content from './content.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./register";
import Signin from "./Signin";
import SchedulesPage from './schedules-page';
import Contact from './Contactus.jsx';
import Support from './Support.jsx';

function App() {
  return (
    <Router>
      <Header />   {/* ✅ inside Router */}
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/schedules" element={<SchedulesPage />} />
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/support' element={<Support/>}/>
        
      </Routes>

      <All/>
    </Router>
  );
}

export default App;