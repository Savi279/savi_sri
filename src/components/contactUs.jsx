import React, { useState } from 'react';
import '../styleSheets/contactUs.css';
import { customerContactApi } from '../api/customer_api'; // Import customerContactApi

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', 'loading'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('loading');

    try {
      const response = await customerContactApi.sendMessage({ name, email, message });
      console.log('Message sent:', response);
      setSubmissionStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setSubmissionStatus('error');
    }
  };

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
          <form className="form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Your name..." 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input 
              type="email" 
              className="form-input" 
              placeholder="Your email..." 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea 
              className="form-textarea" 
              placeholder="Your message..." 
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button type="submit" className="form-button" disabled={submissionStatus === 'loading'}>
              {submissionStatus === 'loading' ? 'Sending...' : 'Send'}
            </button>
            {submissionStatus === 'success' && (
              <p className="submission-message success">Message sent successfully! 🎉</p>
            )}
            {submissionStatus === 'error' && (
              <p className="submission-message error">Failed to send message. Please try again. 😢</p>
            )}
          </form>
        </div>
      </div>

    </div>
  );
};

export default ContactUs;
