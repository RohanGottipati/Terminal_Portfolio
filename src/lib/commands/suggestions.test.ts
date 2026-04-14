import { portfolioData } from "@/data/portfolio";
import { commandRegistry } from "@/lib/commands/registry";
import { getSuggestions } from "@/lib/commands/suggestions";

describe("command suggestions", () => {
  it("shows the full command menu on slash", () => {
    const suggestions = getSuggestions("/", commandRegistry, portfolioData);

    expect(suggestions.some((item) => item.value === "/about")).toBe(true);
    expect(suggestions.some((item) => item.value === "/project")).toBe(true);
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
