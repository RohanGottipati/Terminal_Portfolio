import { portfolioData } from "@/data/portfolio";
import type {
  CommandContext,
  CommandDefinition,
  CommandExecutionResult,
  CommandListItem,
  ModalContent,
} from "@/types/terminal";

function createModal(
  type: ModalContent["type"],
  title: string,
  description: string,
  payload: ModalContent["payload"],
  status: ModalContent["status"] = "success"
): ModalContent {
  return {
    type,
    title,
    description,
    payload,
    status,
  };
}

function createExecution({
  modal,
  logLine,
  status,
  meta,
}: {
  modal: ModalContent | null;
  logLine: string;
  status?: CommandExecutionResult["status"];
  meta?: CommandExecutionResult["meta"];
}): CommandExecutionResult {
  return {
    status: status ?? modal?.status ?? "success",
    title: modal?.title ?? logLine,
    description: modal?.description,
    logLine,
    modal,
    meta,
  };
}

function makeHelpCommands(registry: CommandDefinition[]): CommandListItem[] {
  return registry
    .filter((command) => command.showInMenu !== false || command.command === "/project")
    .map((command) => ({
      command: command.command,
      description: command.description,
    }));
}

function matchesSlug<T extends { slug?: string; key?: string; label?: string }>(
  collection: T[],
  value: string
) {
  const normalized = value.trim().toLowerCase();
  return collection.find((item) => {
    const haystack = [item.slug, item.key, item.label].filter(Boolean).join(" ").toLowerCase();
    return haystack === normalized;
  });
}

export function createCommandRegistry(): CommandDefinition[] {
  return [
    {
      command: "/about",
      description: "Learn a bit about who I am and what I do.",
      aliases: [],
      category: "Profile",
      args: "none",
      showInMenu: true,
      handler: (_parsed, context) =>
        createExecution({
          modal: createModal("intro", "Profile", "", {
            roleLines: context.portfolio.about.roles,
            paragraphs: [
              context.portfolio.about.intro,
              context.portfolio.about.studying,
              context.portfolio.about.building,
              context.portfolio.about.seeking,
              context.portfolio.about.currentFocus,
            ].filter((paragraph) => paragraph.trim().length > 0),
            highlights: context.portfolio.about.highlights,
          }),
          logLine: "Opened /about",
          meta: { canonicalCommand: "/about" },
        }),
    },
    {
      command: "/experience",
      description: "Browse my work experience and roles.",
      aliases: [],
      category: "Work",
      args: "none",
      showInMenu: true,
      handler: (_parsed, context) =>
        createExecution({
          modal: createModal("timeline", "Experience", "", {
            heading: "Experience Timeline",
            entries: context.portfolio.experience,
          }),
          logLine: "Opened /experience",
          meta: { canonicalCommand: "/experience" },
        }),
    },
    {
      command: "/projects",
      description: "See all the projects I've built.",
      aliases: [],
      category: "Projects",
      args: "none",
      showInMenu: true,
      handler: (_parsed, context) =>
        createExecution({
          modal: createModal("projectList", "Projects", "", {
            heading: "Project Directory",
            projects: context.portfolio.projects,
          }),
          logLine: "Opened /projects",
          meta: { canonicalCommand: "/projects" },
        }),
    },
    {
      command: "/project",
      description: "Open a specific project by name for details and links.",
      aliases: ["/proj"],
      category: "Projects",
      args: "optional",
      showInMenu: false,
      handler: (parsed, context) => {
        if (!parsed.argText) {
          return createExecution({
            modal: createModal("projectList", "Projects", "", {
              heading: "Available Project Slugs",
              projects: context.portfolio.projects,
            }),
            logLine: "Opened /project directory",
            meta: { canonicalCommand: "/project" },
          });
        }

        const project = matchesSlug(context.portfolio.projects, parsed.argText);
        if (!project) {

          return createExecution({
            modal: null,
            logLine: `Project "${parsed.argText}" not found.`,
            status: "error",
            meta: {
              canonicalCommand: ["/project", parsed.argText.trim()].filter(Boolean).join(" "),
            },
          });
        }

        return createExecution({
          modal: createModal("projectDetail", project.name, "", { project }),
          logLine: `Opened /project ${project.slug}`,
          meta: { canonicalCommand: `/project ${project.slug}` },
        });
      },
    },
    {
      command: "/skills",
      description: "Check out my technical skills and tools.",
      aliases: [],
      category: "Skills",
      args: "optional",
      showInMenu: true,
      submitOnMenuSelect: true,
      handler: (parsed, context) => {
        const normalized = parsed.argText.trim().toLowerCase();
        const selectedGroup = normalized
          ? context.portfolio.skills.find(
              (group) =>
                group.key === normalized ||
                group.label.toLowerCase() === normalized ||
                group.label.toLowerCase().includes(normalized)
            )
          : null;

        if (normalized && !selectedGroup) {
          return createExecution({
            modal: null,
            logLine: `Skill group "${parsed.argText}" not found.`,
            status: "error",
            meta: {
              canonicalCommand: ["/skills", parsed.argText.trim()].filter(Boolean).join(" "),
            },
          });
        }

        const groups = selectedGroup ? [selectedGroup] : context.portfolio.skills;
        return createExecution({
          modal: createModal(
            "skillsGroup",
            selectedGroup ? `${selectedGroup.label} Skills` : "Skills",
            "",
            {
              heading: selectedGroup ? `${selectedGroup.label} Skills` : "Skill Stack",
              description: selectedGroup
                ? selectedGroup.summary
                : "Languages, frameworks, tooling, and startup/product strengths.",
              groups,
            }
          ),
          logLine: selectedGroup ? `Opened /skills ${selectedGroup.key}` : "Opened /skills",
          meta: {
            canonicalCommand: selectedGroup ? `/skills ${selectedGroup.key}` : "/skills",
          },
        });
      },
    },
    {
      command: "/contact",
      description: "Find my email, GitHub, LinkedIn, and resume.",
      aliases: [],
      category: "Contact",
      args: "none",
      showInMenu: true,
      handler: (_parsed, context) =>
        createExecution({
          modal: createModal("contactPanel", "Contact", "Best ways to reach me.", {
            heading: "Reach Out",
            description:
              "Email is the fastest path. GitHub, LinkedIn, and my resume are one click away.",
            contact: context.portfolio.contact,
            quickLinks: context.portfolio.quickLinks,
          }),
          logLine: "Opened /contact",
          meta: { canonicalCommand: "/contact" },
        }),
    },
    {
      command: "/resume",
      description: "View and download my resume.",
      aliases: ["/cv"],
      category: "Contact",
      args: "none",
      showInMenu: true,
      handler: (_parsed, context) =>
        createExecution({
          modal: createModal("resumePanel", "Resume", "", {
            heading: "Resume",
            resumeHref: context.portfolio.contact.resume,
            links: [
              {
                label: "Open in new page",
                href: context.portfolio.contact.resume,
                kind: "resume",
                external: true,
              },
              {
                label: "Download PDF",
                href: context.portfolio.contact.resume,
                kind: "download",
                download: true,
              },
            ],
          }),
          logLine: "Opened /resume",
          meta: { canonicalCommand: "/resume" },
        }),
    },
    {
      command: "/help",
      description: "See all available commands and what they do.",
      aliases: ["/h"],
      category: "Utility",
      args: "none",
      showInMenu: true,
      handler: (_parsed, context) =>
        createExecution({
          modal: createModal(
            "systemMessage",
            "Command Directory",
            "",
            {
              message: "Commands",
              hint: "Type / to browse.",
              commands: makeHelpCommands(context.registry),
            },
            "info"
          ),
          logLine: "Opened /help",
          meta: { canonicalCommand: "/help" },
        }),
    },
    {
      command: "/clear",
      description: "Clear your session history and start fresh.",
      aliases: [],
      category: "Utility",
      args: "none",
      showInMenu: true,
      handler: () =>
        createExecution({
          modal: null,
          logLine: "Session cleared.",
          status: "info",
          meta: { clearHistory: true, canonicalCommand: null },
        }),
    },
    {
      command: "/exit",
      description: "End the session and return to start.",
      aliases: [],
      category: "Utility",
      args: "none",
      showInMenu: true,
      handler: () =>
        createExecution({
          modal: createModal(
            "systemMessage",
            "Goodbye!",
            "Thanks for stopping by!",
            {
              message: "Thanks for visiting my portfolio! Hope you enjoyed exploring.",
              hint: "Returning to start in 10 seconds...",
            },
            "info"
          ),
          logLine: "Session ended.",
          meta: { canonicalCommand: "/exit", endSession: true, exitAfterMs: 10_000 },
        }),
    },
  ];
}

export const commandRegistry = createCommandRegistry();

export function createCommandContext(): CommandContext {
  return {
    portfolio: portfolioData,
    registry: commandRegistry,
  };
}
