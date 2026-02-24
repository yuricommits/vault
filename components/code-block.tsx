import { codeToHtml } from "shiki";

const LANGUAGE_MAP: Record<string, string> = {
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    rust: "rust",
    go: "go",
    java: "java",
    css: "css",
    html: "html",
    bash: "bash",
    sql: "sql",
    json: "json",
    markdown: "markdown",
};

export default async function CodeBlock({
    code,
    language,
}: {
    code: string;
    language: string;
}) {
    const lang = LANGUAGE_MAP[language] ?? "plaintext";

    const html = await codeToHtml(code, {
        lang,
        theme: "vesper",
    });

    return (
        <div
            className="p-6 overflow-x-auto text-sm leading-relaxed [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:whitespace-pre-wrap [&>pre]:break-words"
            style={{
                backgroundColor: "#0d0d0d",
                fontFamily: "var(--font-geist-mono), monospace",
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
