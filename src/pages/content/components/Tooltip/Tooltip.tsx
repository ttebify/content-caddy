import { InputDetector } from "@src/api";
import type { ExtensionConfigAndSocials, Social } from "@src/types";
import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";

const actions = [
  {
    name: "bookmark",
  },
  {
    name: "copy",
  },
  {
    name: "lightBulb",
  },
];

const onlyActiveSocials = (socials: Social[]) => {
  return socials.filter((s) => s.enabled === true);
};

export default function Tooltip() {
  const [selectedText, setSelectedText] = useState("");
  const [extensionState, setExtensionState] =
    useState<ExtensionConfigAndSocials>();
  const [requestExplaination, setRequestExplaination] = useState(false);
  const [fetchingExplaination, setFetchingExplaination] = useState(false);
  const [explanation, setExplaination] = useState("");

  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chrome.storage.sync.get(
      ["config", "socials"],
      (result: ExtensionConfigAndSocials) => {
        setExtensionState({
          config: result.config,
          socials: onlyActiveSocials(result.socials),
        });
      }
    );

    // Listen for changes in chrome.storage.sync
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.config) {
        setExtensionState((state) => ({
          ...state,
          config: changes.config.newValue,
        }));
      }

      if (changes.socials) {
        setExtensionState((state) => ({
          ...state,
          socials: onlyActiveSocials(changes.socials.newValue),
        }));
      }
    });

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      chrome.storage.onChanged.removeListener((changes) => {
        if (changes.config) {
          setExtensionState((state) => ({
            ...state,
            config: changes.config.newValue,
          }));
        }

        if (changes.socials) {
          setExtensionState((state) => ({
            ...state,
            socials: onlyActiveSocials(changes.socials.newValue),
          }));
        }
      });
    };
  }, []);

  useEffect(() => {
    if (extensionState && !extensionState.config.isExtensionEnabled) {
      chrome.runtime.onMessage.addListener(function (request) {
        if (request.type === "createBookmark") {
          if (request.success) {
            console.log(request.message);
          } else {
            console.log(request.message);
          }
        } else if (request.type === "explainText") {
          const message = request.message;

          if (request.success) {
            setExplaination(message);
          } else {
            console.error(message);
            setExplaination("Error: Could not fetch explanation.");
          }
          setFetchingExplaination(false);
        }
      });

      document.addEventListener("mouseup", handleSelection);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mouseup", handleSelection);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [extensionState?.config.isExtensionEnabled]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.code === "KeyC") {
      handleSelection(event);
    }
  }, []);

  const handleSelection = useCallback((event: MouseEvent | KeyboardEvent) => {
    // check if the active element is a text input field
    const activeElement = event.target as HTMLElement;
    const isTextInput = new InputDetector(
      activeElement.parentElement
    ).isInputField();

    // Leave this to improve inputDetector api. See: https://github.com/ttebify/content-caddy/issues/21
    // console.log(isTextInput, activeElement);

    if (isTextInput) {
      return false;
    }

    const selection = window.getSelection();
    const range = document.createRange();

    if (selection?.anchorNode && selection.focusNode) {
      const anchorNode = selection.anchorNode;
      const anchorOffset = selection.anchorOffset;
      const focusNode = selection.focusNode;
      const focusOffset = selection.focusOffset;

      if (anchorNode === focusNode && anchorOffset > focusOffset) {
        // swap the anchor and focus nodes for right-to-left selection
        range.setStart(focusNode, focusOffset);
        range.setEnd(anchorNode, anchorOffset);
      } else {
        range.setStart(anchorNode, anchorOffset);
        range.setEnd(focusNode, focusOffset);
      }

      const rawSelectedText = range.toString();
      const target = event.target;

      // Check if the clicked element is a highlighted text
      if (
        target instanceof HTMLElement &&
        target.classList.contains(`content_caddy-highlight`)
      ) {
        return;
      }

      if (
        selection &&
        !selection.isCollapsed &&
        rawSelectedText.trim().length > 0
      ) {
        setSelectedText(rawSelectedText);
        setExplaination("");

        // Highlight the selected text using the hiliteColor command (if available)
        if (document.queryCommandSupported("hiliteColor")) {
          removePreviousSelection();
          document.execCommand("hiliteColor", false, "#d3b200");
        } else {
          // Fallback: wrap the selected text in a span element with the highlight class
          const previousSelection = document.querySelector(
            `.content_caddy-highlight`
          );
          if (previousSelection) {
            removePreviousSelection();
          }

          const highlight = document.createElement("span");
          highlight.className = `content_caddy-highlight`;
          highlight.textContent = rawSelectedText;

          range.deleteContents();
          range.insertNode(highlight);
        }

        // Display the tooltip near the selected text
        const rect = range.getBoundingClientRect();
        const scrollTop =
          document.defaultView?.pageYOffset ||
          document.documentElement.scrollTop;

        tooltipRef.current.style.display = "inline-flex";

        const tooltipHeight = tooltipRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const top = rect.top + scrollTop - tooltipHeight - 10;
        const bottom = rect.bottom + scrollTop + 10;
        let positionTop = top;

        // Check if the tooltip is getting cut off by the top of the window
        if (top < 0) {
          positionTop = bottom;
          // Check if the tooltip is getting cut off by the bottom of the window
          if (positionTop + tooltipHeight > windowHeight) {
            positionTop = windowHeight - tooltipHeight;
          }
        }

        tooltipRef.current.style.left = `${rect.left}px`;
        tooltipRef.current.style.top = `${positionTop}px`;
      } else {
        removePreviousSelection();
      }
    }
  }, []);

  function removePreviousSelection() {
    setRequestExplaination(false);
    // Remove previous highlight if any
    const previousHighlight = document.querySelector(
      ".content_caddy-highlight"
    );
    if (previousHighlight) {
      previousHighlight.outerHTML = previousHighlight.innerHTML;
    }

    // Hide the tooltip if it is displayed
    if (tooltipRef.current.style.display === "inline-flex") {
      tooltipRef.current.style.display = "none";
    }
  }

  const handleButtonClick = (name: string, characterLimit?: number) => {
    const buttonName = name;

    switch (buttonName) {
      case "copy":
        navigator.clipboard
          .writeText(selectedText)
          .then(() => {
            console.log("Text copied to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
          });
        removePreviousSelection();
        break;

      case "twitter":
      case "linkedin":
      case "facebook":
        if (characterLimit && selectedText.length <= characterLimit) {
          const encodedText = encodeURIComponent(selectedText);
          const encodedSource =
            extensionState?.config?.quoteSource &&
            extensionState.config.quoteSource === true
              ? encodeURIComponent(
                  `\n\n__source: ${
                    document.title ? document.title : "Untitled page"
                  }`
                )
              : "";
          const shareUrl =
            buttonName === "twitter"
              ? `https://twitter.com/intent/tweet?text=${encodedText}${encodedSource}`
              : buttonName === "linkedin"
              ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  window.location.href
                )}&title=${encodedText}${encodedSource}`
              : `https://www.facebook.com/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}&quote=${encodedText}${encodedSource}`;
          window.open(shareUrl, "_blank");
          removePreviousSelection();
        } else {
          alert(`Text exceeds maximum length for sharing on ${buttonName}!`);
        }
        break;

      case "whatsapp": {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          selectedText
        )}`;
        window.open(whatsappUrl, "_blank");
        removePreviousSelection();
        break;
      }

      case "bookmark": {
        const title = document.title ? document.title : "Untitled page";
        const url = window.location.href;

        const selection = selectedText;
        const selectedTextEncoded = selection.substring(0, 200);
        const schemeUrl =
          url + `#:~:text=${encodeURIComponent(selectedTextEncoded)}`;

        chrome.runtime.sendMessage({
          type: "createBookmark",
          title: title,
          text: selection,
          url: schemeUrl,
        });

        removePreviousSelection();

        break;
      }

      case "lightBulb": {
        setRequestExplaination(true);
        setFetchingExplaination(true);

        chrome.runtime.sendMessage({
          type: "explainText",
          text: selectedText,
        });

        break;
      }

      default:
        break;
    }
  };

  return (
    <div
      id="content_caddy-tooltip"
      style={{ display: "none" }}
      ref={tooltipRef}
    >
      <p>Remember with ease</p>
      <div id="row">
        {extensionState &&
          extensionState.socials.map((social) => (
            <button
              key={social.name}
              type="button"
              onClick={() => {
                handleButtonClick(social.name, social.characterLimit);
              }}
            >
              <img
                src={chrome.runtime.getURL(`assets/icons/${social.name}.png`)}
                alt={social.name}
              />
            </button>
          ))}
        {actions.map((action) => {
          const handleClick: React.MouseEventHandler<HTMLButtonElement> = (
            event
          ) => {
            event.preventDefault();
            handleButtonClick(action.name);
          };
          return (
            <button key={action.name} type="button" onClick={handleClick}>
              <img
                src={chrome.runtime.getURL(`assets/icons/${action.name}.png`)}
                alt={action.name}
              />
            </button>
          );
        })}
      </div>
      {requestExplaination && (
        <div
          className={clsx("explain-container", {
            loading: fetchingExplaination,
          })}
        >
          <div className="preview">{selectedText}</div>
          <div className="explanation">{explanation}</div>
        </div>
      )}
    </div>
  );
}
