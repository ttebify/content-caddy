import React, { useEffect, useState } from "react";
import ShareOption from "../components/ShareOption";
import type {
  ExtensionConfigAndSocials,
  ExtensionDefaultState,
  Social,
} from "@src/types";

function Settings() {
  const [extensionState, setExtensionState] =
    useState<ExtensionConfigAndSocials>();

  useEffect(() => {
    chrome.storage.sync.get(
      ["config", "socials"],
      (result: ExtensionConfigAndSocials) => {
        setExtensionState({
          config: result.config,
          socials: result.socials,
        });
      }
    );

    // Listen for changes in chrome.storage.sync
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.config) {
        setExtensionState((prev) => ({
          ...prev,
          config: changes.config.newValue,
        }));
      }

      if (changes.socials) {
        setExtensionState((prev) => ({
          ...prev,
          socials: changes.socials.newValue,
        }));
      }
    });

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      chrome.storage.onChanged.removeListener((changes) => {
        if (changes.config) {
          setExtensionState((prev) => ({
            ...prev,
            config: changes.config.newValue,
          }));
        }

        if (changes.socials) {
          setExtensionState((prev) => ({
            ...prev,
            socials: changes.socials.newValue,
          }));
        }
      });
    };
  }, []);

  const modifyExtensionConfig = (
    config: Partial<ExtensionConfigAndSocials>
  ) => {
    // write to storage
    chrome.storage.sync.set({ ...config }, () => {
      // update the state using the new value from chrome.storage.sync
      chrome.storage.sync.get(
        ["config", "socials"],
        (result: ExtensionDefaultState) => {
          setExtensionState({
            config: result.config,
            socials: result.socials,
          });
        }
      );
    });
  };

  const handleEditSocialOption = (editedSocial: Social) => {
    const modifiedSocials = extensionState.socials.map((social) =>
      social.name === editedSocial.name ? editedSocial : social
    );
    modifyExtensionConfig({ socials: modifiedSocials });
  };

  console.log(extensionState);

  return (
    <div className="container">
      <h2>Settings</h2>
      <p className="text-base">Control how Content Caddy behaves</p>

      {extensionState && (
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
                checked={extensionState.config.isExtensionEnabled}
                onChange={(e) => {
                  const checked = e.currentTarget.checked;
                  modifyExtensionConfig({
                    config: {
                      ...extensionState.config,
                      isExtensionEnabled: checked,
                    },
                  });
                }}
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
              <input
                type="checkbox"
                id="add-quote"
                name="add-quote"
                checked={extensionState.config.quoteSource}
                onChange={(e) => {
                  const checked = e.currentTarget.checked;
                  modifyExtensionConfig({
                    config: {
                      ...extensionState.config,
                      quoteSource: checked,
                    },
                  });
                }}
              />
              <label htmlFor="add-quote"></label>
            </div>
          </div>
          {extensionState.socials.map((social) => (
            <ShareOption
              key={social.name}
              data={social}
              editSocialOption={handleEditSocialOption}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Settings;
