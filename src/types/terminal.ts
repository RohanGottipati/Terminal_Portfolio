import type {
  ContactData,
  ExperienceEntry,
  PortfolioData,
  PortfolioLink,
  ProjectEntry,
  SkillGroup,
} from "./portfolio";

export type CommandCategory =
  | "Profile"
  | "Work"
  | "Projects"
  | "Skills"
  | "Contact"
  | "Utility";

export type OutputType =
  | "welcome"
  | "intro"
  | "timeline"
  | "projectList"
  | "projectDetail"
  | "skillsGroup"
  | "contactPanel"
  | "systemMessage"
  | "linkPanel";

export type CommandStatus = "success" | "error" | "info";

export interface ParsedCommand {
  rawInput: string;
  normalizedInput: string;
  command: string;
  args: string[];
  argText: string;
}

export interface CommandMeta {
  clearHistory?: boolean;
  canonicalCommand?: string | null;
}

export interface IntroPayload {
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  highlights?: string[];
  chips?: string[];
}

export interface WelcomePayload {
  heading: string;
  subheading: string;
  quickCommands: string[];
}

export interface TimelinePayload {
  heading: string;
  description: string;
  entries: ExperienceEntry[];
}

export interface ProjectListPayload {
  heading: string;
  description: string;
  projects: ProjectEntry[];
}

export interface ProjectDetailPayload {
  project: ProjectEntry;
}

export interface SkillsPayload {
  heading: string;
  description: string;
  groups: SkillGroup[];
}

export interface ContactPayload {
  heading: string;
  description: string;
  contact: ContactData;
  quickLinks: PortfolioLink[];
}

export interface LinkPanelPayload {
  heading: string;
  description: string;
  links: PortfolioLink[];
}

export interface HelpGroup {
  label: CommandCategory;
  items: Array<{ command: string; description: string }>;
}

export interface SystemMessagePayload {
  message: string;
  hint?: string;
  examples?: string[];
  suggestions?: string[];
  commandGroups?: HelpGroup[];
}

export type OutputPayload =
  | WelcomePayload
  | IntroPayload
  | TimelinePayload
  | ProjectListPayload
  | ProjectDetailPayload
  | SkillsPayload
  | ContactPayload
  | LinkPanelPayload
  | SystemMessagePayload;

export interface CommandResult {
  type: OutputType;
  status: CommandStatus;
  title: string;
  description?: string;
  payload: OutputPayload;
  meta?: CommandMeta;
}

export interface HistoryEntry {
  id: string;
  input: string | null;
  parsed: ParsedCommand | null;
  result: CommandResult;
  createdAt: number;
}

export interface SuggestionItem {
  id: string;
  label: string;
  value: string;
  description: string;
  category: string;
  kind: "command" | "project" | "skill";
  submitOnSelect?: boolean;
}

export interface CommandContext {
  portfolio: PortfolioData;
  registry: CommandDefinition[];
}

export interface CommandDefinition {
  command: string;
  description: string;
  aliases: string[];
  category: CommandCategory;
  args: "none" | "optional" | "required";
  examples?: string[];
  handler: (parsed: ParsedCommand, context: CommandContext) => CommandResult;
}
