import { portfolioData } from "@/data/portfolio";
import type { SessionLogEntry } from "@/types/terminal";

interface TerminalDashboardProps {
  recentActivity: SessionLogEntry[];
  onRunCommand: (command: string) => void;
  currentLocation: string;
}

const starterCommands = ["/about", "/experience", "/projects", "/contact"];

export function TerminalDashboard({
  recentActivity,
  onRunCommand,
  currentLocation,
}: TerminalDashboardProps) {
  return (
    <section className="dashboard-card" aria-label="Shell dashboard">
      <div className="dashboard-shell-header">
        <span className="dashboard-shell-label">rohan shell v1.0.0</span>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-pane">
          <p className="dashboard-heading">Welcome to Rohan</p>
          <p className="dashboard-status">{portfolioData.identity.role}</p>
          <p className="dashboard-location">{currentLocation}</p>
          <p className="dashboard-path">~/portfolio/rohan-shell</p>
        </div>

        <div className="dashboard-pane dashboard-pane-right">
          <div>
            <p className="dashboard-section-label">Tips for getting started</p>
            <div className="dashboard-command-list">
              {starterCommands.map((command) => (
                <button
                  key={command}
                  type="button"
                  className="dashboard-command-row"
                  onClick={() => onRunCommand(command)}
                >
                  <span>{command}</span>
                  <span>Open {command.replace("/", "")}</span>
                </button>
              ))}
            </div>
          </div>

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
    </section>
  );
}
