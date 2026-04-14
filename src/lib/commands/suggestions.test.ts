import { portfolioData } from "@/data/portfolio";
import { commandRegistry } from "@/lib/commands/registry";
import { getSuggestions } from "@/lib/commands/suggestions";

describe("command suggestions", () => {
  it("shows the surfaced command menu on slash", () => {
    const suggestions = getSuggestions("/", commandRegistry, portfolioData);

    expect(suggestions.map((item) => item.value)).toEqual([
      "/about",
      "/experience",
      "/projects",
      "/skills",
      "/contact",
      "/resume",
      "/help",
      "/exit",
      "/clear",
    ]);
  });

  it("suggests project subcommands", () => {
    const suggestions = getSuggestions("/project s", commandRegistry, portfolioData);

    expect(suggestions.some((item) => item.value === "/project spectra")).toBe(true);
  });

  it("suggests skill filters", () => {
    const suggestions = getSuggestions("/skills front", commandRegistry, portfolioData);

    expect(suggestions.some((item) => item.value === "/skills frontend")).toBe(true);
  });
});
