import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

import { portfolioData } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import type { PortfolioLink } from "@/types/portfolio";
import type {
  ContactPayload,
  HistoryEntry,
  IntroPayload,
  LinkPanelPayload,
  ProjectDetailPayload,
  ProjectListPayload,
  SkillsPayload,
  SystemMessagePayload,
  TimelinePayload,
  WelcomePayload,
} from "@/types/terminal";

interface OutputRendererProps {
  entry: HistoryEntry;
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

function ResultSurface({
  status,
  children,
}: {
  status: HistoryEntry["result"]["status"];
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "result-surface",
        status === "error" && "result-surface-error",
        status === "info" && "result-surface-info"
      )}
    >
      {children}
    </div>
  );
}

function QuickCommand({
  command,
  onRunCommand,
}: {
  command: string;
  onRunCommand: (command: string) => void;
}) {
  return (
    <button type="button" className="quick-command" onClick={() => onRunCommand(command)}>
      {command}
    </button>
  );
}

function WelcomeRenderer({
  payload,
  onRunCommand,
}: {
  payload: WelcomePayload;
  onRunCommand: (command: string) => void;
}) {
  return (
    <ResultSurface status="info">
      <div className="space-y-5">
        <div>
          <p className="result-eyebrow">Welcome</p>
          <h2 className="result-heading">{payload.heading}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-400">{payload.subheading}</p>
        </div>

        <div className="space-y-2 text-sm leading-7 text-zinc-400">
          <p>{portfolioData.about.intro}</p>
          <p>{portfolioData.current.building}</p>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
            Try
          </p>
          <div className="flex flex-wrap gap-2">
            {payload.quickCommands.map((command) => (
              <QuickCommand key={command} command={command} onRunCommand={onRunCommand} />
            ))}
          </div>
        </div>
      </div>
    </ResultSurface>
  );
}

function IntroRenderer({ payload }: { payload: IntroPayload }) {
  return (
    <ResultSurface status="success">
      <div className="space-y-5">
        <div>
          {payload.eyebrow ? (
            <p className="result-eyebrow">{payload.eyebrow}</p>
          ) : null}
          <h2 className="result-heading">{payload.heading}</h2>
        </div>

        {payload.chips?.length ? (
          <div className="flex flex-wrap gap-2">
            {payload.chips.map((chip) => (
              <span key={chip} className="result-chip">
                {chip}
              </span>
            ))}
          </div>
        ) : null}

        <div className="space-y-4 text-zinc-300">
          {payload.paragraphs.map((paragraph) => (
            <p key={paragraph} className="leading-7">
              {paragraph}
            </p>
          ))}
        </div>

        {payload.highlights?.length ? (
          <div className="result-grid">
            {payload.highlights.map((highlight) => (
              <div key={highlight} className="result-callout">
                <p>{highlight}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </ResultSurface>
  );
}

function TimelineRenderer({ payload }: { payload: TimelinePayload }) {
  return (
    <ResultSurface status="success">
      <div className="space-y-6">
        <div>
          <h2 className="result-heading">{payload.heading}</h2>
          <p className="mt-2 text-zinc-400">{payload.description}</p>
        </div>

        <div className="space-y-4">
          {payload.entries.map((entry) => (
            <article key={entry.slug} className="timeline-entry">
              <div className="timeline-meta">
                <span className="result-chip capitalize">{entry.category}</span>
                <span className="text-sm text-zinc-500">{entry.dateRange}</span>
              </div>

              <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{entry.title}</h3>
                  <p className="text-zinc-400">{entry.organization}</p>
                </div>
                {entry.location ? (
                  <p className="text-sm text-zinc-500">{entry.location}</p>
                ) : null}
              </div>

              <p className="mt-4 leading-7 text-zinc-300">{entry.summary}</p>

              <ul className="mt-4 grid gap-2 text-sm text-zinc-300 md:grid-cols-2">
                {entry.highlights.map((highlight) => (
                  <li key={highlight} className="sidebar-list-item">
                    <span className="sidebar-list-marker" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {entry.techUsed.map((item) => (
                  <span key={item} className="result-chip-muted">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </ResultSurface>
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
    <ResultSurface status="success">
      <div className="space-y-6">
        <div>
          <h2 className="result-heading">{payload.heading}</h2>
          <p className="mt-2 text-zinc-400">{payload.description}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {payload.projects.map((project) => (
            <article key={project.slug} className="project-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{project.summary}</p>
                </div>
                <button
                  type="button"
                  className="quick-command whitespace-nowrap"
                  onClick={() => onRunCommand(`/project ${project.slug}`)}
                >
                  /project {project.slug}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="result-chip-muted">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </ResultSurface>
  );
}

function ProjectDetailRenderer({ payload }: { payload: ProjectDetailPayload }) {
  const { project } = payload;

  return (
    <ResultSurface status="success">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="result-eyebrow">Project Brief</p>
            <h2 className="result-heading">{project.name}</h2>
            <p className="mt-2 max-w-2xl text-zinc-300">{project.summary}</p>
          </div>

          <div className="result-callout min-w-[180px]">
            <p className="result-callout-label">Role</p>
            <p className="text-white">{project.role}</p>
            {project.impact ? <p className="mt-3 text-zinc-300">{project.impact}</p> : null}
          </div>
        </div>

        <p className="leading-7 text-zinc-300">{project.description}</p>

        <div className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="result-callout">
            <p className="result-callout-label">Key Features</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {project.features.map((feature) => (
                <li key={feature} className="sidebar-list-item">
                  <span className="sidebar-list-marker" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="result-callout">
            <p className="result-callout-label">Stack</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span key={item} className="result-chip-muted">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {project.links.map((link) => {
            const Icon = linkIcon(link.kind);

            return (
              <a
                key={`${project.slug}-${link.label}`}
                href={link.href}
                className="action-link"
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
              >
                <Icon size={16} />
                <span>{link.label}</span>
                <ArrowUpRight size={14} />
              </a>
            );
          })}
        </div>
      </div>
    </ResultSurface>
  );
}

function SkillsRenderer({ payload }: { payload: SkillsPayload }) {
  return (
    <ResultSurface status="success">
      <div className="space-y-6">
        <div>
          <h2 className="result-heading">{payload.heading}</h2>
          <p className="mt-2 text-zinc-400">{payload.description}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {payload.groups.map((group) => (
            <article key={group.key} className="project-card">
              <p className="result-callout-label">{group.label}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{group.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="result-chip-muted">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </ResultSurface>
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
    <ResultSurface status="success">
      <div className="space-y-6">
        <div>
          <h2 className="result-heading">{payload.heading}</h2>
          <p className="mt-2 text-zinc-400">{payload.description}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="result-callout">
            <p className="result-callout-label">Email</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a href={`mailto:${payload.contact.email}`} className="action-link">
                <Mail size={16} />
                <span>{payload.contact.email}</span>
              </a>
              <button type="button" className="quick-command" onClick={copyEmail}>
                {copied ? (
                  <>
                    <CheckCircle2 size={14} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy email
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="result-callout">
            <p className="result-callout-label">Links</p>
            <div className="mt-3 flex flex-col gap-3">
              {payload.quickLinks.map((link) => {
                const Icon = linkIcon(link.kind);

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="action-link"
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    download={link.download}
                  >
                    <Icon size={16} />
                    <span>{link.label}</span>
                    <ArrowUpRight size={14} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ResultSurface>
  );
}

function LinkPanelRenderer({ payload }: { payload: LinkPanelPayload }) {
  return (
    <ResultSurface status="success">
      <div className="space-y-6">
        <div>
          <h2 className="result-heading">{payload.heading}</h2>
          <p className="mt-2 text-zinc-400">{payload.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {payload.links.map((link) => {
            const Icon = link.kind === "download" ? Download : ExternalLink;

            return (
              <a
                key={link.label}
                href={link.href}
                className="action-link"
                target={link.download ? undefined : "_blank"}
                rel={link.download ? undefined : "noreferrer"}
                download={link.download}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </ResultSurface>
  );
}

function SystemMessageRenderer({
  payload,
  status,
  onRunCommand,
}: {
  payload: SystemMessagePayload;
  status: HistoryEntry["result"]["status"];
  onRunCommand: (command: string) => void;
}) {
  return (
    <ResultSurface status={status}>
      <div className="space-y-5">
        <div>
          <h2 className="result-heading">{payload.message}</h2>
          {payload.hint ? <p className="mt-2 text-zinc-400">{payload.hint}</p> : null}
        </div>

        {payload.commandGroups?.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {payload.commandGroups.map((group) => (
              <div key={group.label} className="result-callout">
                <p className="result-callout-label">{group.label}</p>
                <div className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <button
                      key={item.command}
                      type="button"
                      className="help-command"
                      onClick={() => onRunCommand(item.command)}
                    >
                      <span className="font-medium text-cyan-300">{item.command}</span>
                      <span className="text-zinc-400">{item.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {payload.examples?.length ? (
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">Examples</p>
            <div className="flex flex-wrap gap-2">
              {payload.examples.map((example) => (
                <QuickCommand key={example} command={example} onRunCommand={onRunCommand} />
              ))}
            </div>
          </div>
        ) : null}

        {payload.suggestions?.length ? (
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">
              Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {payload.suggestions.map((suggestion) => (
                <QuickCommand
                  key={suggestion}
                  command={suggestion}
                  onRunCommand={onRunCommand}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </ResultSurface>
  );
}

export function OutputRenderer({ entry, onRunCommand }: OutputRendererProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      {entry.result.type === "welcome" ? (
        <WelcomeRenderer
          payload={entry.result.payload as WelcomePayload}
          onRunCommand={onRunCommand}
        />
      ) : null}

      {entry.result.type === "intro" ? (
        <IntroRenderer payload={entry.result.payload as IntroPayload} />
      ) : null}

      {entry.result.type === "timeline" ? (
        <TimelineRenderer payload={entry.result.payload as TimelinePayload} />
      ) : null}

      {entry.result.type === "projectList" ? (
        <ProjectListRenderer
          payload={entry.result.payload as ProjectListPayload}
          onRunCommand={onRunCommand}
        />
      ) : null}

      {entry.result.type === "projectDetail" ? (
        <ProjectDetailRenderer payload={entry.result.payload as ProjectDetailPayload} />
      ) : null}

      {entry.result.type === "skillsGroup" ? (
        <SkillsRenderer payload={entry.result.payload as SkillsPayload} />
      ) : null}

      {entry.result.type === "contactPanel" ? (
        <ContactRenderer payload={entry.result.payload as ContactPayload} />
      ) : null}

      {entry.result.type === "linkPanel" ? (
        <LinkPanelRenderer payload={entry.result.payload as LinkPanelPayload} />
      ) : null}

      {entry.result.type === "systemMessage" ? (
        <SystemMessageRenderer
          payload={entry.result.payload as SystemMessagePayload}
          status={entry.result.status}
          onRunCommand={onRunCommand}
        />
      ) : null}
    </motion.div>
  );
}
