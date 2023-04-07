import React from "react";

function ContactDeveloper() {
  return (
    <div className="container">
      <div className="contact">
        <div>
          <a href="https://github.com/ttebify/content-caddy" target="_blank">https://github.com/ttebify/content-caddy</a>
        </div>
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
