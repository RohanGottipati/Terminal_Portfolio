import { portfolioData } from "@/data/portfolio";
import type {
  CommandContext,
  CommandDefinition,
  CommandResult,
  HelpGroup,
  ParsedCommand,
} from "@/types/terminal";

function makeResult(
  type: CommandResult["type"],
  title: string,
  description: string,
  payload: CommandResult["payload"],
  status: CommandResult["status"] = "success"
): CommandResult {
  return {
    type,
    title,
    description,
    payload,
    status,
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

function canonicalize(definition: CommandDefinition, parsed: ParsedCommand) {
  return [definition.command, parsed.argText.trim()].filter(Boolean).join(" ");
}

export function createCommandRegistry(): CommandDefinition[] {
  return [
    {
      command: "/help",
      description: "List commands, categories, and starter examples.",
      aliases: ["/h"],
      category: "Utility",
      args: "none",
      examples: ["/about", "/project spectra", "/skills frontend"],
      handler: (_parsed, context) =>
        ({
          ...makeResult(
            "systemMessage",
            "Command Directory",
            "Everything in the portfolio is discoverable through commands.",
            {
              message: "Available commands",
              hint: "Type / to open the menu or run a command directly.",
              commandGroups: makeHelpGroups(context.registry),
              examples: ["/about", "/experience", "/project spectra", "/skills backend"],
            },
            "info"
          ),
          meta: { canonicalCommand: "/help" },
        }) as CommandResult,
    },
    {
      command: "/about",
      description: "Show who Rohan is, what he studies, and what he builds.",
      aliases: ["/bio"],
      category: "Profile",
      args: "none",
      handler: (_parsed, context) =>
        ({
          ...makeResult(
            "intro",
            "About Rohan",
            "Profile snapshot",
            {
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
            }
          ),
          meta: { canonicalCommand: "/about" },
        }) as CommandResult,
    },
    {
      command: "/currently",
      description: "Show what Rohan is currently building and learning.",
      aliases: ["/now"],
      category: "Profile",
      args: "none",
      handler: (_parsed, context) =>
        ({
          ...makeResult(
            "intro",
            "Currently",
            "What is active right now",
            {
              eyebrow: "Current Focus",
              heading: context.portfolio.identity.statusDetail,
              paragraphs: [
                context.portfolio.current.building,
                context.portfolio.current.learning,
                context.portfolio.current.exploring,
              ],
              highlights: context.portfolio.current.workingOn,
              chips: ["Shipping", "Learning", "Exploring"],
            }
          ),
          meta: { canonicalCommand: "/currently" },
        }) as CommandResult,
    },
    {
      command: "/experience",
      description: "Show the full experience timeline.",
      aliases: ["/exp"],
      category: "Work",
      args: "none",
      handler: (_parsed, context) =>
        ({
          ...makeResult(
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
          meta: { canonicalCommand: "/experience" },
        }) as CommandResult,
    },
    {
      command: "/timeline",
      description: "Alternate view of the experience timeline.",
      aliases: [],
      category: "Work",
      args: "none",
      handler: (_parsed, context) =>
        ({
          ...makeResult(
            "timeline",
            "Timeline",
            "Chronological view of recent work and leadership.",
            {
              heading: "Career Timeline",
              description:
                "The same core experience feed, optimized for scanning by date and scope.",
              entries: context.portfolio.experience,
            }
          ),
          meta: { canonicalCommand: "/timeline" },
        }) as CommandResult,
    },
    {
      command: "/projects",
      description: "List selected projects with stacks and detail prompts.",
      aliases: ["/work"],
      category: "Projects",
      args: "none",
      handler: (_parsed, context) =>
        ({
          ...makeResult(
            "projectList",
            "Projects",
            "Selected builds across AI, healthcare, analytics, and product work.",
            {
              heading: "Project Directory",
              description:
                "Use /project [slug] for the full brief on any individual build.",
              projects: context.portfolio.projects,
            }
          ),
          meta: { canonicalCommand: "/projects" },
        }) as CommandResult,
    },
    {
      command: "/project",
      description: "Open a specific project by slug.",
      aliases: ["/proj"],
      category: "Projects",
      args: "optional",
      handler: (parsed, context) => {
        if (!parsed.argText) {
          return {
            ...makeResult(
              "projectList",
              "Project Directory",
              "Choose a project slug to inspect the full breakdown.",
              {
                heading: "Available Project Slugs",
                description: "Run /project [slug] to open a full project brief.",
                projects: context.portfolio.projects,
              }
            ),
            meta: { canonicalCommand: "/project" },
          } as CommandResult;
        }

        const project = matchesSlug(context.portfolio.projects, parsed.argText);
        if (!project) {
          const suggestions = context.portfolio.projects
            .filter((item) => item.slug.includes(parsed.argText.toLowerCase()))
            .map((item) => `/project ${item.slug}`)
            .slice(0, 4);

          return {
            ...makeResult(
              "systemMessage",
              "Project Not Found",
              "That project slug does not exist in the portfolio.",
              {
                message: `No project matched "${parsed.argText}".`,
                hint: "Type /project and use the menu, or inspect /projects first.",
                suggestions: suggestions.length ? suggestions : ["/projects", "/project spectra"],
              },
              "error"
            ),
            meta: {
              canonicalCommand: ["/project", parsed.argText.trim()].filter(Boolean).join(" "),
            },
          } as CommandResult;
        }

        return {
          ...makeResult(
            "projectDetail",
            project.name,
            project.summary,
            {
              project,
            }
          ),
          meta: { canonicalCommand: `/project ${project.slug}` },
        } as CommandResult;
      },
    },
    {
      command: "/skills",
      description: "Show skill groups or filter to one category.",
      aliases: [],
      category: "Skills",
      args: "optional",
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
          return {
            ...makeResult(
              "systemMessage",
              "Skill Filter Not Found",
              "That skill group is not defined.",
              {
                message: `No skill group matched "${parsed.argText}".`,
                hint: "Try languages, frontend, backend, ai-data, tools-platforms, or startup-product.",
                suggestions: context.portfolio.skills.map((group) => `/skills ${group.key}`),
              },
              "error"
            ),
            meta: {
              canonicalCommand: ["/skills", parsed.argText.trim()].filter(Boolean).join(" "),
            },
          } as CommandResult;
        }

        const groups = selectedGroup ? [selectedGroup] : context.portfolio.skills;
        return {
          ...makeResult(
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
          meta: {
            canonicalCommand: selectedGroup
              ? `/skills ${selectedGroup.key}`
              : "/skills",
          },
        } as CommandResult;
      },
    },
    {
      command: "/contact",
      description: "Show contact methods and quick links.",
      aliases: [],
      category: "Contact",
      args: "none",
      handler: (_parsed, context) =>
        ({
          ...makeResult(
            "contactPanel",
            "Contact",
            "Best ways to reach Rohan.",
            {
              heading: "Reach Out",
              description:
                "Email is the fastest path. GitHub, LinkedIn, and the resume are one click away.",
              contact: context.portfolio.contact,
              quickLinks: context.portfolio.quickLinks,
            }
          ),
          meta: { canonicalCommand: "/contact" },
        }) as CommandResult,
    },
    {
      command: "/resume",
      description: "Open or download the current PDF resume.",
      aliases: ["/cv"],
      category: "Contact",
      args: "none",
      handler: (_parsed, context) =>
        ({
          ...makeResult(
            "linkPanel",
            "Resume",
            "Resume actions",
            {
              heading: "Resume",
              description:
                "Open the current PDF in a new tab or download it directly.",
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
            }
          ),
          meta: { canonicalCommand: "/resume" },
        }) as CommandResult,
    },
    {
      command: "/clear",
      description: "Reset visible terminal history to the welcome state.",
      aliases: [],
      category: "Utility",
      args: "none",
      handler: () =>
        ({
          ...makeResult(
            "systemMessage",
            "History Cleared",
            "Resetting visible terminal output.",
            {
              message: "Terminal history cleared.",
              hint: "Type / to explore the command menu again.",
            },
            "info"
          ),
          meta: { clearHistory: true, canonicalCommand: null },
        }) as CommandResult,
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
