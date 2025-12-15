import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function Contact () {
    const [phone, setPhone] = useState('');
    return (
        <>
        <div className="Contact_head">
            <h1>Get in Touch with Schedule AI</h1>
            <p>We're here to help you streamline your scheduling process. Reach out for support, demos, or any questions.</p>
        </div>
        <div className="contact-container">
          <div className="Message_container">
              <div className="Message_form">
                  <h2>Send Us a Message</h2>
                  <form id="Message_form">
                      <div className="form-group">
                          <label htmlFor="Your Full name ">Name</label>
                          <input type="text" id="Your Full name" name="Your Full name" placeholder="Your Full name" required/>
                      </div>
                      <div className="form-group">
                          <label htmlFor="Email ">Email Address</label>
                          <input type="text" id="Email Address" name="Email Address" placeholder="you@example.com" required/>
                      </div>
                      <div className="form-group">
                          <label htmlFor="PhoneInput">Phone Number</label>
                          <PhoneInput
                              country={'us'}
                              value={phone}
                              onChange={setPhone}
                              inputStyle={{ width: '100%' }}
                              inputProps={{ name: 'phone', required: true }}
                          />
                      </div>
                      <div className="form-group">
                          <label htmlFor="message">Message</label>
                          <textarea
                              id="message"
                              name="message"
                              placeholder="How can we help you today?"
                              rows={4}
                              style={{ resize: 'vertical', width: '100%' }}
                              className="message-textarea"
                          />
                      </div>
                      <button type="submit" className="send-message-btn">Send Message</button>
                  </form>
              </div>
          </div>
        </div>
        </>
    );
}

export default Contact