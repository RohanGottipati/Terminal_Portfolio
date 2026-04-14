import { useState } from "react";
import {
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

      {payload.chips?.length ? (
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
          <p className="panel-section-label">Highlights</p>
          <ul className="panel-bullet-list">
            {payload.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function TimelineRenderer({ payload }: { payload: TimelinePayload }) {
  return (
    <div className="panel-stack">
      <p className="panel-muted-copy">{payload.description}</p>

      <div className="panel-timeline">
        {payload.entries.map((entry) => (
          <article key={entry.slug} className="panel-timeline-entry">
            <div className="panel-timeline-head">
              <div>
                <h3>{entry.title}</h3>
                <p>{entry.organization}</p>
              </div>
              <div className="panel-timeline-meta">
                <span>{entry.dateRange}</span>
                {entry.location ? <span>{entry.location}</span> : null}
              </div>
            </div>

            <p className="panel-copy">{entry.summary}</p>

            <ul className="panel-bullet-list">
              {entry.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            <div className="panel-chip-row">
              {entry.techUsed.map((item) => (
                <span key={item} className="panel-chip panel-chip-muted">
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
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
      <p className="panel-muted-copy">{payload.description}</p>

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
            <div className="panel-chip-row">
              {project.stack.map((item) => (
                <span key={item} className="panel-chip panel-chip-muted">
                  {item}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProjectDetailRenderer({ payload }: { payload: ProjectDetailPayload }) {
  const { project } = payload;

  return (
    <div className="panel-stack">
      <div className="panel-meta-grid">
        <div>
          <p className="panel-eyebrow">Project Brief</p>
          <p className="panel-copy">{project.description}</p>
        </div>
        <div className="panel-mini-card">
          <p className="panel-section-label">Role</p>
          <p>{project.role}</p>
          {project.impact ? <p className="panel-muted-copy">{project.impact}</p> : null}
        </div>
      </div>

      <div className="panel-grid">
        <section className="panel-mini-card">
          <p className="panel-section-label">Features</p>
          <ul className="panel-bullet-list">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className="panel-mini-card">
          <p className="panel-section-label">Stack</p>
          <div className="panel-chip-row">
            {project.stack.map((item) => (
              <span key={item} className="panel-chip panel-chip-muted">
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>

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
    </div>
  );
}

function SkillsRenderer({ payload }: { payload: SkillsPayload }) {
  return (
    <div className="panel-stack">
      <p className="panel-muted-copy">{payload.description}</p>

      <div className="panel-grid">
        {payload.groups.map((group) => (
          <section key={group.key} className="panel-mini-card">
            <p className="panel-section-label">{group.label}</p>
            <p className="panel-muted-copy">{group.summary}</p>
            <div className="panel-chip-row">
              {group.items.map((item) => (
                <span key={item} className="panel-chip panel-chip-muted">
                  {item}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function ContactRenderer({ payload }: { payload: ContactPayload }) {
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
      <div className="panel-mini-card">
        <p className="panel-section-label">Email</p>
        <div className="panel-link-row">
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

      <div className="panel-mini-card">
        <p className="panel-section-label">Links</p>
        <div className="panel-link-row">
          {payload.quickLinks.map((link) => {
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

      {payload.commandGroups?.length ? (
        <div className="panel-grid">
          {payload.commandGroups.map((group) => (
            <section key={group.label} className="panel-mini-card">
              <p className="panel-section-label">{group.label}</p>
              <div className="panel-command-list">
                {group.items.map((item) => (
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
            </section>
          ))}
        </div>
      ) : null}

      {payload.examples?.length ? (
        <div className="panel-link-row">
          {payload.examples.map((example) => (
            <button
              key={example}
              type="button"
              className="panel-link-button"
              onClick={() => onRunCommand(example)}
            >
              <span>{example}</span>
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
      return <ProjectDetailRenderer payload={content.payload as ProjectDetailPayload} />;
    case "skillsGroup":
      return <SkillsRenderer payload={content.payload as SkillsPayload} />;
    case "contactPanel":
      return <ContactRenderer payload={content.payload as ContactPayload} />;
    case "linkPanel":
      return <LinkPanelRenderer payload={content.payload as LinkPanelPayload} />;
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
