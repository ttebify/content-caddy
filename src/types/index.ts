export interface Social {
  name: string;
  characterLimit: number;
  enabled: boolean;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  content: string;
  date: string;
}

export interface ExtensionDefaultState {
  config: {
    isExtensionEnabled: boolean;
    quoteSource: boolean;
  };
  socials: Social[];
  bookmarks: Bookmark[];
}

export type Tab = "welcome" | "bookmarks" | "settings" | "developer";

export type ExtensionConfigAndSocials = Omit<
  ExtensionDefaultState,
  "bookmarks"
>;

export interface WebsiteDetectionOptions {
  href: RegExp;
  classNames: string[];
  selectors: string[];
  attributes: string[];
  threshold: number;
}
