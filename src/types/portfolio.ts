export type ExperienceCategory =
  | "work"
  | "founder"
  | "leadership"
  | "research"
  | "teaching";

export type SkillCategoryKey =
  | "languages"
  | "frontend"
  | "backend"
  | "ai-data"
  | "tools-platforms"
  | "startup-product";

export interface PortfolioLink {
  label: string;
  href: string;
  kind:
    | "github"
    | "linkedin"
    | "email"
    | "resume"
    | "website"
    | "devpost"
    | "download"
    | "other";
  external?: boolean;
  download?: boolean;
}

export interface PortfolioIdentity {
  name: string;
  shortName: string;
  role: string;
  subtitle: string;
  handle: string;
  avatar: string;
  tagline: string;
  statusLabel: string;
  statusDetail: string;
  location: string;
}

export interface AboutData {
  intro: string;
  studying: string;
  building: string;
  seeking: string;
  currentFocus: string;
  roles: string[];
  highlights: string[];
}

export interface CurrentData {
  building: string;
  learning: string;
  exploring: string;
  workingOn: string[];
}

export interface ExperienceEntry {
  slug: string;
  title: string;
  organization: string;
  dateRange: string;
  location?: string;
  summary: string;
  highlights: string[];
  techUsed: string[];
  category: ExperienceCategory;
  promotedFrom?: string;
}

export interface ProjectEntry {
  slug: string;
  name: string;
  summary: string;
  description: string;
  stack: string[];
  features: string[];
  role: string;
  links: PortfolioLink[];
  impact?: string;
  tags: string[];
}

export interface SkillGroup {
  key: SkillCategoryKey;
  label: string;
  summary: string;
  items: string[];
}

export interface ContactData {
  email: string;
  github: string;
  linkedin: string;
  resume: string;
}

export interface PortfolioData {
  identity: PortfolioIdentity;
  about: AboutData;
  current: CurrentData;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: SkillGroup[];
  contact: ContactData;
  quickLinks: PortfolioLink[];
  pinnedCommands: string[];
}
