import { portfolioData } from "@/data/portfolio";
import type {
  CommandContext,
  CommandDefinition,
  CommandExecutionResult,
  HelpGroup,
  ModalContent,
  ParsedCommand,
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

function makeHelpGroups(registry: CommandDefinition[]): HelpGroup[] {
  const order: HelpGroup["label"][] = [
    "Profile",
    "Work",
    "Projects",
    "Skills",
    "Contact",
    "Utility",
  ];

  return order.map((label) => ({
    label,
    items: registry
      .filter((command) => command.category === label)
      .map((command) => ({
        command: command.command,
        description: command.description,
      })),
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
      description: "Show who Rohan is, what he studies, and what he builds.",
      aliases: [],
      category: "Profile",
      args: "none",
      showInMenu: true,
      handler: (_parsed, context) =>
        createExecution({
          modal: createModal("intro", "About Rohan", "Profile snapshot", {
            eyebrow: "Profile",
            heading: context.portfolio.identity.name,
            paragraphs: [
              context.portfolio.about.intro,
              context.portfolio.about.studying,
              context.portfolio.about.building,
              context.portfolio.about.seeking,
              context.portfolio.about.currentFocus,
            ],
            highlights: context.portfolio.about.highlights,
            chips: context.portfolio.about.roles,
          }),
          logLine: "Opened /about",
          meta: { canonicalCommand: "/about" },
        }),
    },
    {
      command: "/experience",
      description: "Show the full experience timeline.",
      aliases: [],
      category: "Work",
      args: "none",
      showInMenu: true,
      handler: (_parsed, context) =>
        createExecution({
          modal: createModal(
            "timeline",
            "Experience",
            "Recent roles, research, leadership, and teaching work.",
            {
              heading: "Experience Timeline",
              description:
                "A structured view of software, research, founder, leadership, and teaching experience.",
              entries: context.portfolio.experience,
            }
          ),
          logLine: "Opened /experience",
          meta: { canonicalCommand: "/experience" },
        }),
    },
    {
      command: "/projects",
      description: "Browse selected projects and their stacks.",
      aliases: [],
      category: "Projects",
      args: "none",
      showInMenu: true,
      handler: (_parsed, context) =>
        createExecution({
          modal: createModal(
            "projectList",
            "Projects",
            "Selected builds across AI, healthcare, analytics, and product work.",
            {
              heading: "Project Directory",
              description: "Use /project [slug] to open a full project brief.",
              projects: context.portfolio.projects,
            }
          ),
          logLine: "Opened /projects",
          meta: { canonicalCommand: "/projects" },
        }),
    },
    {
      command: "/project",
      description: "Open a specific project by slug.",
      aliases: ["/proj"],
      category: "Projects",
      args: "optional",
      showInMenu: false,
      handler: (parsed, context) => {
        if (!parsed.argText) {
          return createExecution({
            modal: createModal(
              "projectList",
              "Project Directory",
              "Choose a project slug to inspect the full breakdown.",
              {
                heading: "Available Project Slugs",
                description: "Run /project [slug] to open a full project brief.",
                projects: context.portfolio.projects,
              }
            ),
            logLine: "Opened /project directory",
            meta: { canonicalCommand: "/project" },
          });
        }

        const project = matchesSlug(context.portfolio.projects, parsed.argText);
        if (!project) {
          const suggestions = context.portfolio.projects
            .filter((item) => item.slug.includes(parsed.argText.toLowerCase()))
            .map((item) => `/project ${item.slug}`)
            .slice(0, 4);

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
          modal: createModal("projectDetail", project.name, project.summary, { project }),
          logLine: `Opened /project ${project.slug}`,
          meta: { canonicalCommand: `/project ${project.slug}` },
        });
      },
    },
    {
      command: "/skills",
      description: "Browse skill groups or filter to one category.",
      aliases: [],
      category: "Skills",
      args: "optional",
      showInMenu: true,
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
            "Grouped technical and product-facing capabilities.",
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
      description: "Show the fastest ways to reach Rohan.",
      aliases: [],
      category: "Contact",
      args: "none",
      showInMenu: true,
      handler: (_parsed, context) =>
        createExecution({
          modal: createModal("contactPanel", "Contact", "Best ways to reach Rohan.", {
            heading: "Reach Out",
            description:
              "Email is the fastest path. GitHub, LinkedIn, and the resume are one click away.",
            contact: context.portfolio.contact,
            quickLinks: context.portfolio.quickLinks,
          }),
          logLine: "Opened /contact",
          meta: { canonicalCommand: "/contact" },
        }),
    },
    {
      command: "/resume",
      description: "Open or download the current PDF resume.",
      aliases: ["/cv"],
      category: "Contact",
      args: "none",
      showInMenu: true,
      handler: (_parsed, context) =>
        createExecution({
          modal: createModal("linkPanel", "Resume", "Resume actions", {
            heading: "Resume",
            description: "Open the current PDF in a new tab or download it directly.",
            links: [
              {
                label: "Open PDF",
                href: context.portfolio.contact.resume,
                kind: "resume",
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
      command: "/currently",
      description: "Show what Rohan is building and learning right now.",
      aliases: ["/now"],
      category: "Profile",
      args: "none",
      showInMenu: true,
      handler: (_parsed, context) =>
        createExecution({
          modal: createModal("intro", "Currently", "What is active right now", {
            eyebrow: "Current Focus",
            heading: context.portfolio.identity.statusDetail,
            paragraphs: [
              context.portfolio.current.building,
              context.portfolio.current.learning,
              context.portfolio.current.exploring,
            ],
            highlights: context.portfolio.current.workingOn,
            chips: ["Shipping", "Learning", "Exploring"],
          }),
          logLine: "Opened /currently",
          meta: { canonicalCommand: "/currently" },
        }),
    },
    {
      command: "/help",
      description: "List commands and starter examples.",
      aliases: ["/h"],
      category: "Utility",
      args: "none",
      showInMenu: true,
      handler: (_parsed, context) =>
        createExecution({
          modal: createModal(
            "systemMessage",
            "Command Directory",
            "Everything in the portfolio is discoverable through commands.",
            {
              message: "Available commands",
              hint: "Type / to open the command menu or run a command directly.",
              commandGroups: makeHelpGroups(context.registry),
              examples: ["/about", "/experience", "/project spectra", "/skills frontend"],
            },
            "info"
          ),
          logLine: "Opened /help",
          meta: { canonicalCommand: "/help" },
        }),
    },
    {
      command: "/clear",
      description: "Clear recent terminal activity and close open panels.",
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
  ];
}

export const commandRegistry = createCommandRegistry();

export function createCommandContext(): CommandContext {
  return {
    portfolio: portfolioData,
    registry: commandRegistry,
  };
}
