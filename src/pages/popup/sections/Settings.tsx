import React from "react";

function Settings() {
  return (
    <div className="container">
      <h2>Settings</h2>
      <p className="text-base">Control how Content Caddy behaves</p>

      <div className="settings">
        <div className="setting">
          <div>
            <label htmlFor="disable-extension">
              Temporarily disable extension
            </label>
            <p className="setting-description">
              Disable the extension for a short period of time.
            </p>
          </div>
          <div className="checkbox">
            <input
              type="checkbox"
              id="disable-extension"
              name="disable-extension"
            />
            <label htmlFor="disable-extension"></label>
          </div>
        </div>
        <div className="setting">
          <div>
            <label htmlFor="add-quote">Add quote to text</label>
            <p className="setting-description">
              Add a source to the text where it was copied from.
            </p>
          </div>
          <div className="checkbox">
            <input type="checkbox" id="add-quote" name="add-quote" />
            <label htmlFor="add-quote"></label>
          </div>
        </div>

        <div className="setting share-option">
          <div className="share-option-input">
            <label htmlFor="social-name">Social Name</label>
            <input type="text" id="social-name" placeholder="e.g. Twitter" />
          </div>
          <div className="share-option-input">
            <label htmlFor="sharing-link">Sharing Link</label>
            <input
              type="text"
              id="sharing-link"
              placeholder="e.g. https://twitter.com/intent/tweet?text=%s"
            />
          </div>
          <div className="share-option-input">
            <label htmlFor="social-icon">Social Icon</label>
            <input
              type="text"
              id="social-icon"
              placeholder="e.g. fab fa-twitter"
            />
          </div>
          <div className="share-option-input">
            <label htmlFor="char-limit">Character Limit</label>
            <input type="number" id="char-limit" placeholder="e.g. 280" />
          </div>
          <button className="add-button">Add</button>
          <div className="error-message">
            <p>Please fill out all fields.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
