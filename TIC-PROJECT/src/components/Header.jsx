import React from 'react';
import { useState } from 'react';

function Header (){
    const[activetab, setactivetab] = useState("AI Diagnosis");

    return(
        <>
            <header>
                <h1>PulseAI</h1>
                <p>Your AI Health Assistant</p>

                <nav>
                    <button 
                    className={activetab === "AI Diagnosis" ? "active" : ""}
                     onClick={()=> setactivetab("AI Diagnosis")}>AI Diagnosis</button>
                    <button 
                     className={activetab === "Nearby Facilities" ? "active" : ""}
                    onClick={()=> setactivetab("Nearby Facilities")}>Nearby Facilites</button>
                </nav>
                {activetab === "AI Diagnosis" && (
  <div>
    <h1>AI DIAGNOSTICS</h1>
    <p>Chat bot is here</p>
  </div>
)}

{activetab === "Nearby Facilities" && (
  <div>
    <h1>Nearby Facilities</h1>
    <p>Here you can see the facilities near you</p>
  </div>
)}
            </header>
        </>
    );
}