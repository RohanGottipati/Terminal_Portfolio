import { portfolioData } from "@/data/portfolio";
import { Button } from "@/components/ui/button";

interface TerminalDashboardProps {
  onRunCommand: (command: string) => void;
  currentLocation: string;
}

const starterCommands = [
  { command: "/help", description: "See all available commands and what they do." },
];

export function TerminalDashboard({
  onRunCommand,
  currentLocation,
}: TerminalDashboardProps) {
  return (
    <section className="dashboard-card" aria-label="Shell dashboard">
      <div className="dashboard-grid">
        <div className="dashboard-pane">
          <p className="dashboard-heading">Welcome to Rohan's Portfolio</p>
          <figure className="dashboard-avatar-shell">
            <img
              src="/r.png"
              alt="Hacker pixel avatar"
              className="dashboard-avatar-image"
              width={96}
              height={96}
            />
          </figure>
          <p className="dashboard-status">{portfolioData.identity.role}</p>
          <p className="dashboard-location">{currentLocation}</p>
          <p className="dashboard-path">~/portfolio/rohan-shell</p>
        </div>

        <div className="dashboard-pane dashboard-pane-right">
          <div className="dashboard-right-inner">
            <div>
              <p className="dashboard-section-label">Tips for getting started</p>
              <div className="dashboard-command-list">
                {starterCommands.map(({ command, description }) => (
                  <Button
                    key={command}
                    type="button"
                    variant="dashboardRow"
                    size="none"
                    className="dashboard-command-row"
                    onClick={() => onRunCommand(command)}
                  >
                    <span>{command}</span>
                    <span>{description}</span>
                  </Button>
                ))}
              </div>
            </div>

            <hr className="dashboard-section-divider" />

            <div>
              <p className="dashboard-section-label">Most recent achievement</p>
              <div className="dashboard-command-list">
                <Button
                  type="button"
                  variant="dashboardRow"
                  size="none"
                  className="dashboard-command-row"
                  onClick={() => onRunCommand("/project caresync")}
                >
                  <span>Hack Canada Win - CareSync</span>
                  <span>Open project</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
