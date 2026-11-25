import { type ReactNode } from "react";

interface MarkdownTextProps {
  text: string;
}

const LINK_RE = /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/;
const EMAIL_RE = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

const isAllowedHref = (rawUrl: string): boolean => {
  try {
    const { hostname, pathname } = new URL(rawUrl);
    const host = hostname.toLowerCase();
    const path = pathname.toLowerCase();
    if (host === "hisiddharth.github.io" || host === "hisiddharth.medium.com") {
      return true;
    }
    if (host === "github.com" && path.startsWith("/hisiddharth")) {
      return true;
    }
    if (
      (host === "linkedin.com" || host === "www.linkedin.com") &&
      path.startsWith("/in/hisiddharth")
    ) {
      return true;
    }
    if (host === "medium.com" && path.startsWith("/@hisiddharth")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

const renderInline = (line: string, keyPrefix: string): ReactNode[] => {
  const re =
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\)|https?:\/\/[^\s<>()]+|[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,})/gi;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match = re.exec(line);

  while (match) {
    const { index } = match;
    const [token] = match;

    if (index > cursor) {
      nodes.push(line.slice(cursor, index));
    }

    const tokenKey = `${keyPrefix}-${index}`;
    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(<strong key={tokenKey}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(<em key={tokenKey}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(<code key={tokenKey}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("[")) {
      const linkMatch = LINK_RE.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        if (isAllowedHref(href)) {
          nodes.push(
            <a
              key={tokenKey}
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {label}
            </a>
          );
        } else {
          nodes.push(label);
        }
      } else {
        nodes.push(token);
      }
    } else if (token.startsWith("http://") || token.startsWith("https://")) {
      const cleanHref = token.replace(/[.,;:!?]+$/, "");
      const trailing = token.slice(cleanHref.length);
      if (isAllowedHref(cleanHref)) {
        nodes.push(
          <a
            key={tokenKey}
            href={cleanHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            {cleanHref}
          </a>
        );
      } else {
        nodes.push(cleanHref);
      }
      if (trailing) nodes.push(trailing);
    } else if (
      EMAIL_RE.test(token) &&
      token.toLowerCase() === "siddharthrai2468@gmail.com"
    ) {
      nodes.push(
        <a key={tokenKey} href={`mailto:${token}`}>
          {token}
        </a>
      );
    } else {
      nodes.push(token);
    }

    cursor = index + token.length;
    match = re.exec(line);
  }

  if (cursor < line.length) {
    nodes.push(line.slice(cursor));
  }

  return nodes;
};

const MarkdownText: FC<MarkdownTextProps> = ({ text }) => {
  const lines = text.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
    } else if (trimmed.startsWith("```")) {
      const startLine = i;
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push(
        <pre key={`pre-${startLine}`}>
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
    } else if (/^#{1,3}\s+/.test(trimmed)) {
      const heading = trimmed.replace(/^#{1,3}\s+/, "");
      blocks.push(
        <div key={`h-${i}`} className="md-heading">
          {renderInline(heading, `h-${i}`)}
        </div>
      );
      i += 1;
    } else if (/^[-*]\s+/.test(trimmed)) {
      const startLine = i;
      const items: ReactNode[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^[-*]\s+/, "");
        items.push(
          <li key={`li-${i}`}>{renderInline(itemText, `ul-${i}`)}</li>
        );
        i += 1;
      }
      blocks.push(<ul key={`ul-${startLine}`}>{items}</ul>);
    } else if (/^\d+\.\s+/.test(trimmed)) {
      const startLine = i;
      const items: ReactNode[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^\d+\.\s+/, "");
        items.push(
          <li key={`oli-${i}`}>{renderInline(itemText, `ol-${i}`)}</li>
        );
        i += 1;
      }
      blocks.push(<ol key={`ol-${startLine}`}>{items}</ol>);
    } else {
      blocks.push(<p key={`p-${i}`}>{renderInline(trimmed, `p-${i}`)}</p>);
      i += 1;
    }
  }

  return <div className="md-content">{blocks}</div>;
};

export default MarkdownText;
