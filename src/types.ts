export type NodeLikeRequest = {
  url?: string;
  headers?: Record<string, string | string[] | undefined>;
  method?: string;
};

export type NodeLikeResponse = {
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
  statusCode: number;
};

export type ResponsePayload = {
  status: number;
  headers: Record<string, string>;
  body: string;
};

export interface GitHubStats {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  company: string;
  location: string;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  totalFollowers: number;
  totalFollowing: number;
  createdAt: string;
  topLanguages: Array<{ name: string; count: number; percentage: number }>;
}
