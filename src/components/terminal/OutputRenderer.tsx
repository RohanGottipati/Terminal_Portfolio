import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Github,
  Linkedin,
  type LucideIcon,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PortfolioLink } from "@/types/portfolio";
import type {
  ContactPayload,
  IntroPayload,
  LinkPanelPayload,
  ModalContent,
  ProjectDetailPayload,
  ProjectListPayload,
  ResumePanelPayload,
  SkillsPayload,
  SystemMessagePayload,
  TimelinePayload,
} from "@/types/terminal";

interface OutputRendererProps {
  content: ModalContent;
  onRunCommand: (command: string) => void;
}

function linkIcon(kind: PortfolioLink["kind"]) {
  switch (kind) {
    case "github":
      return Github;
    case "linkedin":
      return Linkedin;
    case "email":
      return Mail;
    case "download":
      return Download;
    default:
      return FileText;
  }
}

function ActionButtonContent({
  icon: Icon,
  label,
  trailingIcon,
}: {
  icon: LucideIcon;
  label: string;
  trailingIcon?: ReactNode;
}) {
  return (
    <>
      <span className="inline-flex items-center justify-center transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:scale-105">
        <Icon size={15} aria-hidden="true" />
      </span>
      <span className="relative z-[1]">{label}</span>
      {trailingIcon ? (
        <span className="inline-flex items-center justify-center transition-transform duration-300 group-hover/button:translate-x-1">
          {trailingIcon}
        </span>
      ) : null}
    </>
  );
}

function IntroRenderer({ payload }: { payload: IntroPayload }) {
  return (
    <div className="panel-stack">
      {payload.eyebrow ? <p className="panel-eyebrow">{payload.eyebrow}</p> : null}
      {payload.heading ? <h2 className="panel-heading">{payload.heading}</h2> : null}

      {payload.roleLines?.length ? (
        <div className="panel-role-list">
          {payload.roleLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}

      {payload.chips?.length && !payload.roleLines?.length ? (
        <div className="panel-chip-row">
          {payload.chips.map((chip) => (
            <span key={chip} className="panel-chip">
              {chip}
            </span>
          ))}
        </div>
      ) : null}

      <div className="panel-copy">
        {payload.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {payload.highlights?.length ? (
        <div className="panel-list-block">
          <p className="panel-section-label">Currently</p>
          <ul className="panel-bullet-list">
            {payload.highlights.map((highlight) => (
              <li key={highlight}>
                <ArrowRight className="bullet-arrow-icon" size={13} />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function TimelineEntry({
  entry,
  hideOrg,
}: {
  entry: TimelinePayload["entries"][number];
  hideOrg?: boolean;
}) {
  return (
    <article
      className="panel-timeline-entry"
      tabIndex={0}
      aria-label={`${entry.title} at ${entry.organization}`}
    >
      <div className="panel-timeline-head">
        <div>
          <h3>{entry.title}</h3>
          {!hideOrg ? <p>{entry.organization}</p> : null}
        </div>
        <div className="panel-timeline-meta">
          <span>{entry.dateRange}</span>
          {entry.location ? <span>{entry.location}</span> : null}
        </div>
      </div>

      <ul className="panel-bullet-list">
        {entry.highlights.map((highlight) => (
          <li key={highlight}>
            <ArrowRight className="bullet-arrow-icon" size={13} />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function TimelineRenderer({ payload }: { payload: TimelinePayload }) {
  const rendered = new Set<number>();

  return (
    <div className="panel-stack">
      <h2 className="panel-heading">{payload.heading}</h2>
      {payload.description ? <p className="panel-muted-copy">{payload.description}</p> : null}

      <div className="panel-timeline">
        {payload.entries.map((entry, index) => {
          if (rendered.has(index)) return null;

          const nextEntry = payload.entries[index + 1];
          const isPromotionGroup =
            entry.promotedFrom &&
            nextEntry &&
            nextEntry.organization === entry.organization;

          if (isPromotionGroup) {
            rendered.add(index + 1);

            return (
              <div key={entry.slug} className="panel-promotion-group">
                <div className="panel-promotion-group-header">
                  <span className="panel-promotion-org">{entry.organization}</span>
                </div>
                <div className="panel-promotion-group-entries">
                  <div className="panel-promotion-track" />
                  <div className="panel-promotion-group-stack">
                    <TimelineEntry entry={entry} hideOrg />
                    <TimelineEntry entry={nextEntry} hideOrg />
                  </div>
                </div>
              </div>
            );
          }

          return <TimelineEntry key={entry.slug} entry={entry} />;
        })}
      </div>
    </div>
  );
}

function ProjectListRenderer({
  payload,
  onRunCommand,
}: {
  payload: ProjectListPayload;
  onRunCommand: (command: string) => void;
}) {
  return (
    <div className="panel-stack">
      <h2 className="panel-heading">{payload.heading}</h2>
      {payload.description ? <p className="panel-muted-copy">{payload.description}</p> : null}

      <div className="panel-project-list">
        {payload.projects.map((project) => (
          <Button
            key={project.slug}
            type="button"
            variant="terminalSurface"
            size="none"
            className="panel-project-row before:hidden"
            onClick={() => onRunCommand(`/project ${project.slug}`)}
          >
            <span className="panel-project-row-indicator panel-project-row-indicator-left" aria-hidden="true">
              &gt;
            </span>
            <div className="panel-project-row-content">
              <div className="panel-project-title">/project {project.slug}</div>
              <p>{project.summary}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

function ProjectDetailRenderer({
  payload,
  onRunCommand,
}: {
  payload: ProjectDetailPayload;
  onRunCommand: (command: string) => void;
}) {
  const { project } = payload;

  return (
    <div className="panel-stack panel-stack-tight">
      <Button
        type="button"
        variant="terminalInline"
        size="none"
        onClick={() => onRunCommand("/projects")}
      >
        <ArrowLeft size={14} />
        <span>Back to /projects</span>
      </Button>

      <p className="panel-muted-copy">{project.summary}</p>

      {project.impact ? (
        <div className="panel-detail-strip">
          <div className="panel-detail-item">
            <p className="panel-section-label">Impact</p>
            <p>{project.impact}</p>
          </div>
        </div>
      ) : null}

      <section className="panel-section-stack">
        <p className="panel-section-label">Features</p>
        <ul className="panel-bullet-list">
          {project.features.map((feature) => (
            <li key={feature}>
              <ArrowRight className="bullet-arrow-icon" size={13} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel-section-stack">
        <p className="panel-section-label">Stack</p>
        <p className="panel-muted-copy">{project.stack.join(", ")}</p>
      </section>

      {project.links.length ? (
        <section className="panel-section-stack">
          <p className="panel-section-label">Links</p>
          <div className="panel-link-row">
            {project.links.map((link) => {
              const Icon = linkIcon(link.kind);

              return (
                <Button
                  key={`${project.slug}-${link.label}`}
                  variant="terminalLink"
                  asChild
                >
                  <a
                    href={link.href}
                    tabIndex={0}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                  >
                    <ActionButtonContent
                      icon={Icon}
                      label={link.label}
                      trailingIcon={<ArrowUpRight size={14} aria-hidden="true" />}
                    />
                  </a>
                </Button>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SkillsRenderer({ payload }: { payload: SkillsPayload }) {
  return (
    <div className="panel-stack">
      <h2 className="panel-heading">{payload.heading}</h2>
      <div className="panel-stack">
        {payload.groups.map((group) => (
          <p key={group.key} className="panel-skill-line">
            <span>{`${group.label}:`}</span>{" "}
            <span>{group.items.join(", ")}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function ContactRenderer({
  payload,
  onRunCommand,
}: {
  payload: ContactPayload;
  onRunCommand: (command: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(payload.contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="panel-stack">
      <h2 className="panel-heading">{payload.heading}</h2>
      <p className="panel-muted-copy">{payload.description}</p>
      <div className="panel-mini-card panel-mini-card-centered panel-mini-card-static">
        <p className="panel-section-label">Email</p>
        <div className="panel-link-row panel-link-row-centered">
          <Button variant="terminalLink" asChild>
            <a href={`mailto:${payload.contact.email}`} tabIndex={0}>
              <ActionButtonContent icon={Mail} label={payload.contact.email} />
            </a>
          </Button>
          <Button type="button" variant="terminalLink" onClick={copyEmail}>
            <ActionButtonContent
              icon={copied ? CheckCircle2 : Copy}
              label={copied ? "Copied" : "Copy email"}
            />
          </Button>
        </div>
      </div>

      <div className="panel-mini-card panel-mini-card-centered panel-mini-card-static">
        <p className="panel-section-label">Links</p>
        <div className="panel-link-row panel-link-row-centered">
          {payload.quickLinks.map((link) => {
            const Icon = linkIcon(link.kind);

            if (link.kind === "resume") {
              return (
                <Button
                  key={link.label}
                  type="button"
                  variant="terminalLink"
                  onClick={() => onRunCommand("/resume")}
                >
                  <ActionButtonContent
                    icon={Icon}
                    label={link.label}
                    trailingIcon={<ArrowUpRight size={14} aria-hidden="true" />}
                  />
                </Button>
              );
            }

            return (
              <Button
                key={link.label}
                variant="terminalLink"
                asChild
              >
                <a
                  href={link.href}
                  tabIndex={0}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  download={link.download}
                >
                  <ActionButtonContent
                    icon={Icon}
                    label={link.label}
                    trailingIcon={<ArrowUpRight size={14} aria-hidden="true" />}
                  />
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LinkPanelRenderer({ payload }: { payload: LinkPanelPayload }) {
  return (
    <div className="panel-stack">
      <h2 className="panel-heading">{payload.heading}</h2>
      <p className="panel-muted-copy">{payload.description}</p>
      <div className="panel-link-row">
        {payload.links.map((link) => {
          const Icon = linkIcon(link.kind);

          return (
            <Button
              key={link.label}
              variant="terminalLink"
              asChild
            >
              <a
                href={link.href}
                tabIndex={0}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                download={link.download}
              >
                <ActionButtonContent
                  icon={Icon}
                  label={link.label}
                  trailingIcon={<ArrowUpRight size={14} aria-hidden="true" />}
                />
              </a>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function ResumePanelRenderer({ payload }: { payload: ResumePanelPayload }) {
  return (
    <div className="panel-stack">
      <h2 className="panel-heading">{payload.heading}</h2>
      <div className="panel-link-row panel-link-row-centered">
        {payload.links.map((link) => {
          const Icon = linkIcon(link.kind);

          return (
            <Button
              key={link.label}
              variant="terminalLink"
              asChild
            >
              <a
                href={link.href}
                tabIndex={0}
                target="_blank"
                rel="noreferrer"
                download={link.download || undefined}
              >
                <ActionButtonContent
                  icon={Icon}
                  label={link.label}
                  trailingIcon={<ArrowUpRight size={14} aria-hidden="true" />}
                />
              </a>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function HelpRenderer({
  payload,
  onRunCommand,
}: {
  payload: SystemMessagePayload;
  onRunCommand: (command: string) => void;
}) {
  return (
    <div className="panel-stack">
      {payload.commands?.length ? (
        <div className="panel-navigation-hint" aria-label="Keyboard navigation help">
          <span>Tip: Throughout this site, navigate with</span>
          <kbd>↑</kbd>
          <kbd>↓</kbd>
          <span>and close with</span>
          <kbd>Esc</kbd>
          <span>if you'd like!</span>
        </div>
      ) : null}
      <p className="panel-copy">{payload.message}</p>
      {payload.hint ? <p className="panel-muted-copy">{payload.hint}</p> : null}

      {payload.commands?.length ? (
        <div className="panel-command-list">
          {payload.commands.map((item) => (
            <Button
              key={item.command}
              type="button"
              variant="terminalSurface"
              size="none"
              className="panel-command-row before:hidden"
              onClick={() => onRunCommand(item.command)}
            >
              <span className="panel-command-row-indicator" aria-hidden="true">
                &gt;
              </span>
              <div className="panel-command-row-content">
                <span className="panel-command-row-command">{item.command}</span>
                <span className="panel-command-row-description">{item.description}</span>
              </div>
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function OutputRenderer({ content, onRunCommand }: OutputRendererProps) {
  switch (content.type) {
    case "intro":
      return <IntroRenderer payload={content.payload as IntroPayload} />;
    case "timeline":
      return <TimelineRenderer payload={content.payload as TimelinePayload} />;
    case "projectList":
      return (
        <ProjectListRenderer
          payload={content.payload as ProjectListPayload}
          onRunCommand={onRunCommand}
        />
      );
    case "projectDetail":
      return (
        <ProjectDetailRenderer
          payload={content.payload as ProjectDetailPayload}
          onRunCommand={onRunCommand}
        />
      );
    case "skillsGroup":
      return <SkillsRenderer payload={content.payload as SkillsPayload} />;
    case "contactPanel":
      return (
        <ContactRenderer
          payload={content.payload as ContactPayload}
          onRunCommand={onRunCommand}
        />
      );
    case "linkPanel":
      return <LinkPanelRenderer payload={content.payload as LinkPanelPayload} />;
    case "resumePanel":
      return <ResumePanelRenderer payload={content.payload as ResumePanelPayload} />;
    case "systemMessage":
      return (
        <HelpRenderer
          payload={content.payload as SystemMessagePayload}
          onRunCommand={onRunCommand}
        />
      );
    default:
      return null;
  }
}
