import type { Social } from "@src/types";
import React, { useState } from "react";

interface ShareOptionProps {
  editSocialOption: (edited: Social) => void;
  data: Social;
}

function ShareOption({ data, editSocialOption }: ShareOptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newCharacterLimit, setNewCharacterLimit] = useState(
    data.characterLimit
  );

  const { name, enabled, characterLimit } = data;

  function handleEditClick() {
    setIsEditing(true);
  }

  const handleSaveClick = () => {
    editSocialOption({ ...data, characterLimit: newCharacterLimit });
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
            src={`/assets/icons/${name}.png`}
            alt={`${name} icon`}
            className="icon"
          />
        </div>
        <div className="social-details">
          <div className="social-name">{name}</div>
          <div className="social-description">Share on {name}</div>
        </div>
        <div className="checkbox">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={enabled}
            onChange={(e) => {
              const enabled = e.currentTarget.checked;
              editSocialOption({ ...data, enabled });
            }}
          />
          <label htmlFor={name}></label>
        </div>
        <div className="social-edit">
          <button className="edit-button" onClick={handleEditClick}>
            Edit
          </button>
        </div>
      </div>

      <div className={`edit-social-details ${isEditing ? "expanded" : ""}`}>
        <div className="edit-social-input">
          <label htmlFor="char-limit">Character Limit</label>
          <input
            type="number"
            id="char-limit"
            required
            defaultValue={characterLimit}
            value={newCharacterLimit}
            onChange={(e) => {
              const value = e.currentTarget.value;
              const parsedValue = Number.parseInt(value);

              if (parsedValue) {
                setNewCharacterLimit(parsedValue);
              }
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

export default ShareOption;
