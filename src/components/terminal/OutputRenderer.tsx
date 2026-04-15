import { useState } from "react";
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
  Mail,
} from "lucide-react";

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

function IntroRenderer({ payload }: { payload: IntroPayload }) {
  return (
    <div className="panel-stack">
      {payload.eyebrow ? <p className="panel-eyebrow">{payload.eyebrow}</p> : null}
      {payload.heading ? <p className="panel-heading">{payload.heading}</p> : null}

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
    <article className="panel-timeline-entry" tabIndex={0}>
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
      {payload.description ? <p className="panel-muted-copy">{payload.description}</p> : null}

      <div className="panel-project-list">
        {payload.projects.map((project) => (
          <button
            key={project.slug}
            type="button"
            className="panel-project-row"
            onClick={() => onRunCommand(`/project ${project.slug}`)}
          >
            <div className="panel-project-title">
              <span>{project.name}</span>
              <span className="panel-project-slug">/project {project.slug}</span>
            </div>
            <p>{project.summary}</p>
          </button>
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
      <button
        type="button"
        className="panel-inline-action"
        onClick={() => onRunCommand("/projects")}
      >
        <ArrowLeft size={14} />
        <span>Back to /projects</span>
      </button>

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
        <div className="panel-chip-row">
          {project.stack.map((item) => (
            <span key={item} className="panel-chip panel-chip-muted">
              {item}
            </span>
          ))}
        </div>
      </section>

      {project.links.length ? (
        <section className="panel-section-stack">
          <p className="panel-section-label">Links</p>
          <div className="panel-link-row">
            {project.links.map((link) => {
              const Icon = linkIcon(link.kind);

              return (
                <a
                  key={`${project.slug}-${link.label}`}
                  href={link.href}
                  className="panel-link-button"
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                >
                  <Icon size={15} />
                  <span>{link.label}</span>
                  <ArrowUpRight size={14} />
                </a>
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
      <div className="panel-mini-card panel-mini-card-centered">
        <p className="panel-section-label">Email</p>
        <div className="panel-link-row panel-link-row-centered">
          <a href={`mailto:${payload.contact.email}`} className="panel-link-button">
            <Mail size={15} />
            <span>{payload.contact.email}</span>
          </a>
          <button type="button" className="panel-link-button" onClick={copyEmail}>
            {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
            <span>{copied ? "Copied" : "Copy email"}</span>
          </button>
        </div>
      </div>

      <div className="panel-mini-card panel-mini-card-centered">
        <p className="panel-section-label">Links</p>
        <div className="panel-link-row panel-link-row-centered">
          {payload.quickLinks.map((link) => {
            const Icon = linkIcon(link.kind);

            if (link.kind === "resume") {
              return (
                <button
                  key={link.label}
                  type="button"
                  className="panel-link-button"
                  onClick={() => onRunCommand("/resume")}
                >
                  <Icon size={15} />
                  <span>{link.label}</span>
                  <ArrowUpRight size={14} />
                </button>
              );
            }

            return (
              <a
                key={link.label}
                href={link.href}
                className="panel-link-button"
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                download={link.download}
              >
                <Icon size={15} />
                <span>{link.label}</span>
                <ArrowUpRight size={14} />
              </a>
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
      <p className="panel-muted-copy">{payload.description}</p>
      <div className="panel-link-row">
        {payload.links.map((link) => {
          const Icon = linkIcon(link.kind);

          return (
            <a
              key={link.label}
              href={link.href}
              className="panel-link-button"
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              download={link.download}
            >
              <Icon size={15} />
              <span>{link.label}</span>
              <ArrowUpRight size={14} />
            </a>
          );
        })}
      </div>
    </div>
  );
}

function ResumePanelRenderer({ payload }: { payload: ResumePanelPayload }) {
  return (
    <div className="panel-stack">
      <div className="panel-link-row panel-link-row-centered">
        {payload.links.map((link) => {
          const Icon = linkIcon(link.kind);

          return (
            <a
              key={link.label}
              href={link.href}
              className="panel-link-button"
              target="_blank"
              rel="noreferrer"
              download={link.download || undefined}
            >
              <Icon size={15} />
              <span>{link.label}</span>
              <ArrowUpRight size={14} />
            </a>
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
      <p className="panel-copy">{payload.message}</p>
      {payload.hint ? <p className="panel-muted-copy">{payload.hint}</p> : null}

      {payload.commands?.length ? (
        <div className="panel-command-list">
          {payload.commands.map((item) => (
            <button
              key={item.command}
              type="button"
              className="panel-command-row"
              onClick={() => onRunCommand(item.command)}
            >
              <span>{item.command}</span>
              <span>{item.description}</span>
            </button>
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
