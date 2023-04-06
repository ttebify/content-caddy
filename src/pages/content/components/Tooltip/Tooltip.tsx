import React, { useEffect, useRef, useState } from "react";

const socials = [
  {
    name: "twitter",
    image: "/assets/icons/twitter.png",
    className: "twitter-button",
  },
  {
    name: "linkedin",
    image: "/assets/icons/linkedin.png",
    className: "linkedin-button",
  },
  {
    name: "bookmark",
    image: "/assets/icons/bookmark.png",
    className: "bookmark-button",
  },
  {
    name: "copy",
    image: "/assets/icons/copy.png",
    className: "copy-button",
  },
  {
    name: "add",
    image: "/assets/icons/add.png",
    className: "add-button",
  },
];

const MAX_TEXT_LENGTH = 1000; // Maximum character limit for Twitter
// const MAX_URL_TEXT_LENGTH = 200;

export default function Tooltip() {
  const [selectedText, setSelectedText] = useState("");

  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request) {
      if (request.type === "createBookmark") {
        if (request.success) {
          console.log(request.message);
        } else {
          console.log(request.message);
        }
      }
    });

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.code === "KeyC") {
      handleSelection(event);
    }
  };

  const handleSelection = (event: MouseEvent | KeyboardEvent) => {
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
  };

  function removePreviousSelection() {
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

  const handleButtonClick = (name: string) => {
    const buttonName = name;
    removePreviousSelection();

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
        break;

      case "twitter":
        if (selectedText.length <= MAX_TEXT_LENGTH) {
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            selectedText
          )}`;
          window.open(twitterUrl, "_blank");
        } else {
          alert("Text exceeds maximum length for tweeting!");
        }
        break;

      case "linkedin":
        if (selectedText.length <= MAX_TEXT_LENGTH) {
          const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            window.location.href
          )}&title=${encodeURIComponent(selectedText)}`;
          window.open(linkedinUrl, "_blank");
        } else {
          alert("Text exceeds maximum length for sharing on LinkedIn!");
        }
        break;

      case "add":
        // TODO: Implement bookmarking functionality
        break;

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
        {socials.map((social) => (
          <button
            key={social.name}
            type="button"
            className={social.className}
            onClick={() => {
              handleButtonClick(social.name);
            }}
          >
            <img src={chrome.runtime.getURL(social.image)} alt={social.name} />
          </button>
        ))}
      </div>
    </div>
  );
}
