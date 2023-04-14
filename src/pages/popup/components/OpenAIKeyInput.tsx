import React, { useState } from "react";

interface OpenAiKeyInputProps {
  setApiKey: (key: string) => void;
  unsafe_key: string;
}

function OpenAiKeyInput({ setApiKey, unsafe_key }: OpenAiKeyInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [unsafeKey, setUnsafeKey] = useState(unsafe_key);

  function handleEditClick() {
    setIsEditing(true);
  }

  const handleSaveClick = () => {
    setApiKey(unsafeKey);
    setIsEditing(false);
  };

  function handleCancelClick() {
    setIsEditing(false);
  }

  return (
    <div className="settings">
      <div className="setting share-option">
        <div className="social-icon">
          <img
            src="/assets/icons/chatgpt.png"
            alt="chatgpt icon"
            className="icon"
          />
        </div>
        <div className="social-details">
          <div className="social-name">OpenAI API Key</div>
          <div className="social-description">
            Enter your OpenAI API key to enable the &quot;Highlight to
            Explain&quot; feature.
          </div>
        </div>
        <div />
        <div className="social-edit">
          <button className="edit-button" onClick={handleEditClick}>
            Add key
          </button>
        </div>
      </div>

      <div className={`edit-social-details ${isEditing ? "expanded" : ""}`}>
        <div className="edit-social-input">
          <label htmlFor="key">
            Enter your key{" "}
            <small style={{ color: "gray" }}>
              (Generate an OpenAI API key by following the instructions on the{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noreferrer"
              >
                OpenAI website.
              </a>
              )
            </small>{" "}
          </label>
          <input
            type="text"
            id="key"
            required
            value={unsafeKey}
            onChange={(e) => {
              const value = e.currentTarget.value;
              setUnsafeKey(value);
            }}
          />
        </div>
        <div className="edit-social-buttons">
          <button
            className="save-button"
            type="button"
            onClick={handleSaveClick}
          >
            Save
          </button>
          <button
            className="cancel-button"
            type="button"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default OpenAiKeyInput;
