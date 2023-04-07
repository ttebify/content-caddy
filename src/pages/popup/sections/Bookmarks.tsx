import type { Bookmark } from "@src/types";
import React, { useEffect, useState } from "react";

interface BookmarkProps {
  bookmark: Bookmark;
  deleteBookmark: (id: string) => void;
}
const BookmarkCard = ({ bookmark, deleteBookmark }: BookmarkProps) => {
  return (
    <div className="bookmark-card">
      <div className="bookmark-text">
        <h3 className="bookmark-title">{bookmark.title}</h3>
        <p className="bookmark-excerpt">{bookmark.excerpt}</p>
        <a
          className="bookmark-link"
          href={bookmark.url}
          onClick={() => window.open(bookmark.url, "_blank")}
        >
          Link to the Bookmarked Page
        </a>
      </div>
      <div className="bookmark-info">
        <p className="bookmark-date">
          Saved on {new Date(bookmark.date).toLocaleDateString()}
        </p>
        <div className="bookmark-actions">
          <button
            className="bookmark-action copy-action"
            onClick={() => {
              navigator.clipboard.writeText(bookmark.content);
              console.log("Text copied to clipboard!");
            }}
          >
            Copy
          </button>
          <button
            className="bookmark-action delete-action"
            onClick={() => deleteBookmark(bookmark.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    chrome.storage.sync.get(["bookmarks"]).then(function (data) {
      const bookmarks: Bookmark[] = data.bookmarks || [];
      setBookmarks(bookmarks);
    });
  }, []);

  const deleteBookmarkById = (bookmarkId: string) => {
    const currentBookmarks = bookmarks.filter((bmk) => bmk.id !== bookmarkId);
    setBookmarks(currentBookmarks);
  };

  const messageListener = (request: any) => {
    if (request.type === "deleteBookmark") {
      if (request.success) {
        const bookmarkId = request.data.id;

        if (bookmarkId) {
          deleteBookmarkById(bookmarkId);
        }
      }
    }
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  });

  return (
    <div className="container">
      <h2>Your Bookmarks</h2>
      <p>
        View all the sections of web content you have saved using Content Caddy.
      </p>
      {bookmarks.length === 0 ? (
        <p>You have not added any bookmark yet</p>
      ) : (
        bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            deleteBookmark={deleteBookmarkById}
          />
        ))
      )}
    </div>
  );
};

export default Bookmarks;
