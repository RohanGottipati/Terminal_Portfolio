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

export type ModalType =
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

export type ModalPayload =
  | IntroPayload
  | TimelinePayload
  | ProjectListPayload
  | ProjectDetailPayload
  | SkillsPayload
  | ContactPayload
  | LinkPanelPayload
  | SystemMessagePayload;

export interface ModalContent {
  type: ModalType;
  status: CommandStatus;
  title: string;
  description?: string;
  payload: ModalPayload;
}

export interface CommandExecutionResult {
  status: CommandStatus;
  title: string;
  description?: string;
  logLine: string;
  modal: ModalContent | null;
  meta?: CommandMeta;
}

export interface SessionLogEntry {
  id: string;
  input: string;
  summary: string;
  status: CommandStatus;
  createdAt: number;
}

export interface SuggestionItem {
  id: string;
  label: string;
  value: string;
  description: string;
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
  showInMenu?: boolean;
  examples?: string[];
  handler: (parsed: ParsedCommand, context: CommandContext) => CommandExecutionResult;
}
