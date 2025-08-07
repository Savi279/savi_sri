import React from 'react';
import '../styleSheets/contactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-wrapper">

      <div className="call-card">
        <div className="icon-circle">
          <span role="img" aria-label="phone">📞</span>
        </div>
        <div className="contact-text">
          <h3>Call Us</h3>
          <p>+91 9121978725</p>
          <p>Mon-Sat: 10AM - 8PM</p>
        </div>
      </div>

      <div className="email-card">
        <div className="icon-circle">
          <span role="img" aria-label="email">✉️</span>
        </div>
        <div className="contact-text">
          <h3>Email Us</h3>
          <p>savisri279@gmail.com</p>
          <p>We aim to respond within 24 hours.</p>
        </div>
      </div>

      <div className="message-card">
        <div className="icon-circle">
          <span role="img" aria-label="message">💬</span>
        </div>
        <div className="contact-text">
          <h3>Send a Message</h3>
          <p>We'd love to hear from you. Please fill out the form below:</p>
          <form className="form">
            <input type="text" className="form-input" placeholder="Your name..." required />
            <input type="email" className="form-input" placeholder="Your email..." required />
            <textarea className="form-textarea" placeholder="Your message..." required></textarea>
            <button type="submit" className="form-button">Send</button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default ContactUs;
