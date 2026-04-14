import type { PortfolioData } from "@/types/portfolio";
import type { CommandDefinition, SuggestionItem } from "@/types/terminal";

function uniqueSuggestions(items: SuggestionItem[]) {
  return items.filter(
    (item, index, all) => all.findIndex((candidate) => candidate.value === item.value) === index
  );
}

function commandMatches(definition: CommandDefinition, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [definition.command, ...definition.aliases, definition.description]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function getCommandSuggestions(
  query: string,
  registry: CommandDefinition[]
): SuggestionItem[] {
  return registry
    .filter((definition) => commandMatches(definition, query))
    .map((definition) => ({
      id: definition.command,
      label: definition.command,
      value: definition.command,
      description: definition.description,
      category: definition.category,
      kind: "command" as const,
      submitOnSelect: definition.args === "none",
    }));
}

function getProjectSuggestions(
  query: string,
  portfolio: PortfolioData
): SuggestionItem[] {
  return portfolio.projects
    .filter((project) => {
      if (!query) {
        return true;
      }

      const haystack = `${project.slug} ${project.name} ${project.summary}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    })
    .map((project) => ({
      id: `project-${project.slug}`,
      label: `/project ${project.slug}`,
      value: `/project ${project.slug}`,
      description: project.summary,
      category: "Projects",
      kind: "project" as const,
      submitOnSelect: true,
    }));
}

function getSkillSuggestions(
  query: string,
  portfolio: PortfolioData
): SuggestionItem[] {
  return portfolio.skills
    .filter((group) => {
      if (!query) {
        return true;
      }

      const haystack = `${group.key} ${group.label} ${group.summary}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    })
    .map((group) => ({
      id: `skill-${group.key}`,
      label: `/skills ${group.key}`,
      value: `/skills ${group.key}`,
      description: group.summary,
      category: "Skills",
      kind: "skill" as const,
      submitOnSelect: true,
    }));
}

export function getSuggestions(
  rawInput: string,
  registry: CommandDefinition[],
  portfolio: PortfolioData
) {
  const trimmedLeft = rawInput.trimStart();

  if (!trimmedLeft.startsWith("/")) {
    return [] as SuggestionItem[];
  }

  const normalized = trimmedLeft.replace(/\s+/g, " ");
  const hasSpace = normalized.includes(" ");
  const endsWithSpace = /\s$/.test(rawInput);
  const [baseCommand = "", ...rest] = normalized.split(" ");
  const argQuery = rest.join(" ").trim();

  const projectAliases = ["/project", "/proj"];
  if (projectAliases.includes(baseCommand.toLowerCase()) && (hasSpace || endsWithSpace)) {
    return uniqueSuggestions(getProjectSuggestions(argQuery, portfolio));
  }

  if (baseCommand.toLowerCase() === "/skills" && (hasSpace || endsWithSpace)) {
    return uniqueSuggestions(getSkillSuggestions(argQuery, portfolio));
  }

  const query = normalized.slice(1).toLowerCase();
  return uniqueSuggestions(getCommandSuggestions(query, registry));
}
