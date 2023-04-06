export type Tab = "welcome" | "bookmarks" | "settings" | "developer";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  content: string;
  date: string;
}
