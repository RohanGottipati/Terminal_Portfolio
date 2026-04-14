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
  const visibleDefinitions = query
    ? registry.filter((definition) => definition.showInMenu !== false || definition.command.startsWith(`/${query}`))
    : registry.filter((definition) => definition.showInMenu !== false);

  return visibleDefinitions
    .filter((definition) => commandMatches(definition, query))
    .map((definition) => ({
      id: definition.command,
      label: definition.command,
      value: definition.command,
      description: definition.description,
      kind: "command" as const,
      submitOnSelect: definition.submitOnMenuSelect ?? (definition.args === "none"),
    }));
}

function getProjectSuggestions(query: string, portfolio: PortfolioData): SuggestionItem[] {
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
      kind: "project" as const,
      submitOnSelect: true,
    }));
}

function getSkillSuggestions(query: string, portfolio: PortfolioData): SuggestionItem[] {
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
  const lowerBase = baseCommand.toLowerCase();

  if (["/project", "/proj"].includes(lowerBase) && (hasSpace || endsWithSpace)) {
    return uniqueSuggestions(getProjectSuggestions(argQuery, portfolio));
  }

  if (lowerBase === "/skills" && (hasSpace || endsWithSpace)) {
    return uniqueSuggestions(getSkillSuggestions(argQuery, portfolio));
  }

  const query = normalized.slice(1).toLowerCase();
  return uniqueSuggestions(getCommandSuggestions(query, registry));
}
