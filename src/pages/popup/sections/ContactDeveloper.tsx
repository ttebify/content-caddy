import React from "react";

function ContactDeveloper() {
  return (
    <div className="container">
      <div className="contact">
        <div className="profile-picture"></div>
        <h2>Justice Ekemezie</h2>
        <p>I illuminate concepts with code and prose</p>
        <div className="icons">
          <a href="#" className="icon">
            <img src="/assets/icons/github.png" alt="GitHub" />
          </a>
          <a href="#" className="icon">
            <img src="/assets/icons/twitter.png" alt="Twitter" />
          </a>
          <a href="#" className="icon">
            <img src="/assets/icons/linkedin.png" alt="Linkedin" />
          </a>
          <a href="#" className="icon">
            <img src="/assets/icons/mail.png" alt="Email" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactDeveloper;
