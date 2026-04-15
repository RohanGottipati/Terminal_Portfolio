import { portfolioData } from "@/data/portfolio";
import type { SessionLogEntry } from "@/types/terminal";

interface TerminalDashboardProps {
  recentActivity: SessionLogEntry[];
  onRunCommand: (command: string) => void;
  currentLocation: string;
}

const starterCommands = [
  { command: "/help", description: "See all available commands and what they do." },
];

export function TerminalDashboard({
  recentActivity,
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
                  <button
                    key={command}
                    type="button"
                    className="dashboard-command-row"
                    onClick={() => onRunCommand(command)}
                  >
                    <span>{command}</span>
                    <span>{description}</span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="dashboard-section-divider" />

            <div>
              <p className="dashboard-section-label">Recent activity</p>
              {recentActivity.length ? (
                <div className="dashboard-activity-list">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="dashboard-activity-row">
                      <span>{item.input}</span>
                      <span>{item.summary}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="dashboard-empty">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
