"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Terminal, Key, List, Search, Clipboard, FilePlus,
    Trash2, Upload, ArrowRight, Github, ChevronRight,
    CheckCircle, AlertCircle, Settings, BookOpen, Zap
} from "lucide-react";

const sections = [
    { id: "getting-started", label: "Getting Started" },
    { id: "installation", label: "Installation" },
    { id: "authentication", label: "Authentication" },
    { id: "commands", label: "Commands Reference" },
    { id: "configuration", label: "Configuration" },
    { id: "examples", label: "Examples" },
    { id: "troubleshooting", label: "Troubleshooting" },
    { id: "github", label: "GitHub" },
];

function Code({ children }: { children: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <div className="relative group border border-border rounded-sm bg-[#0d0d0d] overflow-hidden my-[16px]">
            <div className="flex items-center justify-between px-[16px] py-[8px] border-b border-border">
                <span className="text-[10px] text-text-4 font-mono">terminal</span>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(children);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-[10px] text-text-4 hover:text-text-1 transition-colors font-mono"
                >
                    {copied ? "copied!" : "copy"}
                </button>
            </div>
            <pre className="px-[20px] py-[16px] overflow-x-auto">
                <code className="text-[12.5px] text-text-1 font-mono leading-[1.8]">{children}</code>
            </pre>
        </div>
    );
}

function InlineCode({ children }: { children: string }) {
    return (
        <code className="text-text-2 bg-bg-1 px-[5px] py-[1px] border border-border rounded-xs text-[11.5px] font-mono">
            {children}
        </code>
    );
}

function SectionHeader({ id, children }: { id: string; children: string }) {
    return (
        <h2 id={id} className="text-[20px] font-semibold text-text-1 tracking-[-0.03em] mb-[8px] scroll-mt-[80px] flex items-center gap-[8px] group">
            {children}
            <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-text-4 text-[14px]">#</a>
        </h2>
    );
}

function SubHeader({ children }: { children: string }) {
    return (
        <h3 className="text-[13px] font-semibold text-text-1 mb-[8px] mt-[24px]">{children}</h3>
    );
}

function P({ children }: { children: React.ReactNode }) {
    return <p className="text-[12.5px] text-text-3 leading-[1.85] mb-[12px]">{children}</p>;
}

function CommandCard({ icon: Icon, cmd, description, flags }: {
    icon: React.ElementType;
    cmd: string;
    description: string;
    flags?: { flag: string; desc: string; default?: string }[];
}) {
    return (
        <div className="border border-border rounded-sm overflow-hidden mb-[12px]">
            <div className="px-[20px] py-[14px] bg-bg-1 flex items-start gap-[12px] border-b border-border">
                <Icon size={13} className="text-text-3 flex-shrink-0 mt-[2px]" />
                <div>
                    <code className="text-[13px] text-text-1 font-mono">{cmd}</code>
                    <p className="text-[11.5px] text-text-4 mt-[4px] leading-[1.6]">{description}</p>
                </div>
            </div>
            {flags && flags.length > 0 && (
                <div className="px-[20px] py-[12px] bg-bg divide-y divide-border">
                    {flags.map(({ flag, desc, default: def }) => (
                        <div key={flag} className="flex items-start gap-[12px] py-[8px] first:pt-0 last:pb-0">
                            <code className="text-[11px] text-text-2 flex-shrink-0 w-[180px]">{flag}</code>
                            <span className="text-[11px] text-text-4 flex-1">{desc}</span>
                            {def && <span className="text-[10px] text-text-4 font-mono flex-shrink-0">{def}</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("getting-started");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -70% 0px" }
        );

        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-bg text-text-1 font-mono">
            <div className="grid-bg fixed inset-0 pointer-events-none" />

            {/* Top nav */}
            <nav className="relative z-20 border-b border-border px-[24px] flex items-center h-[56px] gap-[16px] bg-bg/80 backdrop-blur-sm sticky top-0">
                <Link href="/" className="flex items-center gap-[7px] text-[13px] font-semibold text-text-1 tracking-[-0.3px] flex-shrink-0">
                    <span className="text-[16px] text-text-3">◈</span>
                    vault
                </Link>
                <span className="text-text-4 text-[12px]">/</span>
                <span className="text-[12px] text-text-3">cli docs</span>
                <div className="ml-auto flex items-center gap-[16px]">
                    <a href="https://github.com/yuricommits/vault-cli" target="_blank" rel="noreferrer" className="text-text-4 hover:text-text-1 transition-colors">
                        <Github size={15} />
                    </a>
                    <Link href="/login" className="text-[11.5px] text-text-4 hover:text-text-1 transition-colors">sign in</Link>
                    <Link href="/register" className="btn btn-solid text-[11.5px] px-[12px] py-[6px]">get started</Link>
                </div>
            </nav>

            <div className="relative z-10 flex max-w-[1100px] mx-auto">
                {/* Sidebar */}
                <aside className="w-[220px] flex-shrink-0 sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto border-r border-border py-[32px] px-[20px]">
                    <div className="mb-[24px]">
                        <span className="text-[9px] text-text-4 tracking-widest uppercase">vault-cli</span>
                    </div>
                    <nav className="flex flex-col gap-[2px]">
                        {sections.map(({ id, label }) => (
                            <a
                                key={id}
                                href={`#${id}`}
                                className={`flex items-center gap-[8px] px-[10px] py-[7px] text-[12px] rounded-sm transition-all border-l-2 ${
                                    activeSection === id
                                        ? "text-text-1 bg-white/5 border-l-white"
                                        : "text-text-4 hover:text-text-2 border-l-transparent hover:bg-white/[0.02]"
                                }`}
                            >
                                {label}
                            </a>
                        ))}
                    </nav>

                    <div className="mt-[40px] pt-[20px] border-t border-border">
                        <a
                            href="https://github.com/yuricommits/vault-cli/issues"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-[6px] text-[11px] text-text-4 hover:text-text-2 transition-colors"
                        >
                            <AlertCircle size={11} />
                            Report an issue
                        </a>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 min-w-0 px-[56px] py-[48px] max-w-[720px]">

                    {/* Hero */}
                    <div className="mb-[56px] pb-[48px] border-b border-border">
                        <div className="flex items-center gap-[8px] mb-[16px]">
                            <Terminal size={14} className="text-text-3" />
                            <span className="text-[10px] text-text-4 tracking-widest uppercase">CLI Documentation</span>
                        </div>
                        <h1 className="text-[36px] font-semibold text-text-1 tracking-[-0.04em] leading-[1.1] mb-[16px]">vault-cli</h1>
                        <p className="text-[13.5px] text-text-3 leading-[1.85] max-w-[500px] mb-[24px]">
                            Manage your code snippets from the terminal. List, search, copy, create, push, and delete snippets without leaving your editor.
                        </p>
                        <div className="flex items-center gap-[10px]">
                            <a href="#installation" className="btn btn-solid text-[11.5px] px-[14px] py-[7px] flex items-center gap-[6px]">
                                <Zap size={12} /> Quick install
                            </a>
                            <a href="#commands" className="flex items-center gap-[6px] text-[11.5px] text-text-3 hover:text-text-1 transition-colors border border-border px-[14px] py-[7px] rounded-sm hover:bg-bg-1">
                                <BookOpen size={12} /> Commands <ArrowRight size={11} />
                            </a>
                        </div>
                    </div>

                    {/* Getting Started */}
                    <section className="mb-[56px] pb-[48px] border-b border-border">
                        <SectionHeader id="getting-started">Getting Started</SectionHeader>
                        <P>vault-cli is a Go binary that talks directly to your Vault instance. You need a Vault account and a CLI access token to get started.</P>

                        <div className="grid grid-cols-3 gap-[12px] my-[24px]">
                            {[
                                { step: "01", title: "Install", desc: "Download the binary via go install" },
                                { step: "02", title: "Get a token", desc: "Generate a CLI token in settings" },
                                { step: "03", title: "Authenticate", desc: "Run vault auth login --token" },
                            ].map(({ step, title, desc }) => (
                                <div key={step} className="border border-border rounded-sm p-[16px] bg-bg-1">
                                    <span className="text-[10px] text-text-4 mb-[8px] block">{step}</span>
                                    <p className="text-[12.5px] text-text-1 font-semibold mb-[4px]">{title}</p>
                                    <p className="text-[11px] text-text-4 leading-[1.6]">{desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border border-border border-dashed rounded-sm px-[20px] py-[14px] flex items-start gap-[10px] bg-bg-1/50">
                            <Key size={13} className="text-text-4 flex-shrink-0 mt-[1px]" />
                            <p className="text-[11.5px] text-text-3 leading-[1.7]">
                                You need a Vault account to generate a CLI token.{" "}
                                <Link href="/register" className="text-text-1 underline underline-offset-2 hover:text-text-2 transition-colors">Sign up for free</Link>
                                {" "}then go to{" "}
                                <Link href="/dashboard/settings" className="text-text-1 underline underline-offset-2 hover:text-text-2 transition-colors">settings → CLI access tokens</Link>.
                            </p>
                        </div>
                    </section>

                    {/* Installation */}
                    <section className="mb-[56px] pb-[48px] border-b border-border">
                        <SectionHeader id="installation">Installation</SectionHeader>
                        <P>Install via <InlineCode>go install</InlineCode> — requires Go 1.21 or later.</P>

                        <Code>go install github.com/yuricommits/vault-cli@latest</Code>

                        <P>The binary is installed to <InlineCode>$GOPATH/bin</InlineCode>. Make sure this is in your <InlineCode>$PATH</InlineCode>.</P>

                        <SubHeader>Build from source</SubHeader>
                        <Code>{`git clone https://github.com/yuricommits/vault-cli
cd vault-cli
go build -o vault .
sudo mv vault /usr/local/bin/`}</Code>

                        <SubHeader>Verify installation</SubHeader>
                        <Code>vault --help</Code>

                        <div className="border border-border rounded-sm bg-bg-1 px-[20px] py-[14px] flex items-start gap-[10px] mt-[16px]">
                            <CheckCircle size={13} className="text-green-400 flex-shrink-0 mt-[1px]" />
                            <p className="text-[11.5px] text-text-3 leading-[1.7]">
                                Supported platforms: <strong className="text-text-1">Linux</strong>, <strong className="text-text-1">macOS</strong>, <strong className="text-text-1">Windows</strong>. Clipboard support requires <InlineCode>xclip</InlineCode> on Linux.
                            </p>
                        </div>
                    </section>

                    {/* Authentication */}
                    <section className="mb-[56px] pb-[48px] border-b border-border">
                        <SectionHeader id="authentication">Authentication</SectionHeader>
                        <P>vault-cli uses token-based authentication. Tokens are generated from your Vault settings page and stored locally in <InlineCode>~/.config/vault/config.json</InlineCode>.</P>

                        <SubHeader>Generate a token</SubHeader>
                        <ol className="flex flex-col gap-[8px] mb-[16px]">
                            {[
                                <>Go to <Link href="/dashboard/settings" className="text-text-1 underline underline-offset-2">vault settings</Link></>,
                                "Scroll to CLI Access Tokens",
                                "Enter a name (e.g. macbook, work-pc)",
                                "Click create — copy the token immediately, it won't be shown again",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-[10px] text-[12px] text-text-3">
                                    <span className="text-text-4 flex-shrink-0 w-[16px]">{i + 1}.</span>
                                    <span className="leading-[1.7]">{item}</span>
                                </li>
                            ))}
                        </ol>

                        <SubHeader>Login</SubHeader>
                        <Code>vault auth login --token vlt_yourtoken</Code>

                        <SubHeader>Login with custom URL (self-hosted)</SubHeader>
                        <Code>vault auth login --token vlt_yourtoken --url https://your-vault.com</Code>

                        <SubHeader>Check status</SubHeader>
                        <Code>vault auth status</Code>

                        <SubHeader>Logout</SubHeader>
                        <Code>vault auth logout</Code>
                    </section>

                    {/* Commands */}
                    <section className="mb-[56px] pb-[48px] border-b border-border">
                        <SectionHeader id="commands">Commands Reference</SectionHeader>
                        <P>All commands require authentication. Run <InlineCode>vault auth login</InlineCode> first.</P>

                        <SubHeader>List snippets</SubHeader>
                        <CommandCard
                            icon={List}
                            cmd="vault list"
                            description="List all your snippets showing ID, language, and title."
                            flags={[]}
                        />

                        <SubHeader>Search snippets</SubHeader>
                        <CommandCard
                            icon={Search}
                            cmd="vault search <query>"
                            description="Search snippets by title, description, language, or code content."
                            flags={[]}
                        />
                        <Code>vault search "debounce"</Code>

                        <SubHeader>Copy to clipboard</SubHeader>
                        <CommandCard
                            icon={Clipboard}
                            cmd="vault copy <id>"
                            description="Copy a snippet's code directly to your system clipboard. Falls back to printing to stdout if clipboard is unavailable."
                            flags={[]}
                        />
                        <Code>vault copy a1b2c3d4-...</Code>

                        <SubHeader>Create a snippet</SubHeader>
                        <CommandCard
                            icon={FilePlus}
                            cmd="vault new"
                            description="Interactively create a new snippet from the terminal. Prompts for title, language, description, and code. Type END on a new line to finish entering code."
                            flags={[]}
                        />

                        <SubHeader>Push a file</SubHeader>
                        <CommandCard
                            icon={Upload}
                            cmd="vault push <file>"
                            description="Push a local file as a snippet. Language is auto-detected from the file extension."
                            flags={[
                                { flag: "--title", desc: "Snippet title", default: "filename" },
                                { flag: "--language", desc: "Language override", default: "auto-detect" },
                                { flag: "--description", desc: "Snippet description", default: "—" },
                            ]}
                        />
                        <Code>{`vault push ./hooks/useDebounce.ts
vault push ./hooks/useDebounce.ts --title "useDebounce" --description "Debounce hook for React"`}</Code>

                        <SubHeader>Delete a snippet</SubHeader>
                        <CommandCard
                            icon={Trash2}
                            cmd="vault delete <id>"
                            description="Delete a snippet. Prompts for confirmation unless --force is passed."
                            flags={[
                                { flag: "--force", desc: "Skip confirmation prompt", default: "false" },
                            ]}
                        />
                        <Code>{`vault delete a1b2c3d4-...
vault delete a1b2c3d4-... --force`}</Code>
                    </section>

                    {/* Configuration */}
                    <section className="mb-[56px] pb-[48px] border-b border-border">
                        <SectionHeader id="configuration">Configuration</SectionHeader>
                        <P>Config is stored at <InlineCode>~/.config/vault/config.json</InlineCode>. You can edit it directly or use the CLI commands.</P>

                        <div className="border border-border rounded-sm overflow-hidden my-[16px]">
                            <div className="px-[20px] py-[10px] border-b border-border bg-bg-1 flex items-center gap-[6px]">
                                <Settings size={11} className="text-text-4" />
                                <span className="text-[10px] text-text-4">~/.config/vault/config.json</span>
                            </div>
                            <div className="divide-y divide-border">
                                {[
                                    { key: "token", type: "string", desc: "CLI access token", default: "—" },
                                    { key: "base_url", type: "string", desc: "Base URL of your Vault instance", default: "vault-two-lovat.vercel.app" },
                                ].map(({ key, type, desc, default: def }) => (
                                    <div key={key} className="px-[20px] py-[12px] flex items-center gap-[16px]">
                                        <code className="text-[11.5px] text-text-2 w-[100px] flex-shrink-0">{key}</code>
                                        <code className="text-[10px] text-text-4 w-[50px] flex-shrink-0">{type}</code>
                                        <span className="text-[11.5px] text-text-4 flex-1">{desc}</span>
                                        <span className="text-[10px] text-text-4 font-mono flex-shrink-0">{def}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <SubHeader>Example config</SubHeader>
                        <div className="border border-border rounded-sm bg-[#0d0d0d] overflow-hidden">
                            <pre className="px-[20px] py-[16px] text-[12px] text-text-2 leading-[1.8]">{`{
  "token": "vlt_abc123...",
  "base_url": "https://vault-two-lovat.vercel.app"
}`}</pre>
                        </div>
                    </section>

                    {/* Examples */}
                    <section className="mb-[56px] pb-[48px] border-b border-border">
                        <SectionHeader id="examples">Examples</SectionHeader>

                        <SubHeader>Push all TypeScript files in a folder</SubHeader>
                        <Code>{`for f in ./utils/*.ts; do
  vault push "$f"
done`}</Code>

                        <SubHeader>Search and copy in one step</SubHeader>
                        <Code>{`# Find the snippet ID
vault search "debounce"

# Copy it
vault copy <id>`}</Code>

                        <SubHeader>Quickly save a script you just wrote</SubHeader>
                        <Code>{`vault push ./cleanup.sh --title "DB cleanup script" --description "Removes stale sessions"`}</Code>

                        <SubHeader>Delete multiple snippets</SubHeader>
                        <Code>{`vault delete <id1> --force
vault delete <id2> --force`}</Code>
                    </section>

                    {/* Troubleshooting */}
                    <section className="mb-[56px] pb-[48px] border-b border-border">
                        <SectionHeader id="troubleshooting">Troubleshooting</SectionHeader>

                        {[
                            {
                                problem: "command not found: vault",
                                solution: "Make sure $GOPATH/bin is in your $PATH. Add export PATH=$PATH:$(go env GOPATH)/bin to your shell profile.",
                            },
                            {
                                problem: "not authenticated",
                                solution: "Run vault auth login --token <token>. Generate a token from vault settings → CLI access tokens.",
                            },
                            {
                                problem: "request failed: 401",
                                solution: "Your token may be revoked or expired. Generate a new one from settings and run vault auth login again.",
                            },
                            {
                                problem: "clipboard not working on Linux",
                                solution: "Install xclip: sudo apt install xclip. The copy command falls back to printing to stdout if xclip is unavailable.",
                            },
                            {
                                problem: "vault: command not found after go install",
                                solution: "Run go env GOPATH to find your Go binary path, then add it to PATH.",
                            },
                        ].map(({ problem, solution }) => (
                            <div key={problem} className="border border-border rounded-sm overflow-hidden mb-[8px]">
                                <div className="px-[20px] py-[12px] bg-bg-1 border-b border-border flex items-center gap-[8px]">
                                    <AlertCircle size={12} className="text-text-4 flex-shrink-0" />
                                    <code className="text-[12px] text-text-2">{problem}</code>
                                </div>
                                <div className="px-[20px] py-[12px]">
                                    <p className="text-[11.5px] text-text-3 leading-[1.7]">{solution}</p>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* GitHub */}
                    <section className="mb-[56px]">
                        <SectionHeader id="github">GitHub</SectionHeader>
                        <P>vault-cli is open source. Contributions, bug reports, and feature requests are welcome.</P>

                        <div className="grid grid-cols-2 gap-[10px] mt-[20px]">
                            {[
                                { label: "Source code", href: "https://github.com/yuricommits/vault-cli", desc: "Browse the repository" },
                                { label: "Report a bug", href: "https://github.com/yuricommits/vault-cli/issues", desc: "Open an issue" },
                                { label: "Releases", href: "https://github.com/yuricommits/vault-cli/releases", desc: "View changelog" },
                                { label: "Pull requests", href: "https://github.com/yuricommits/vault-cli/pulls", desc: "Contribute" },
                            ].map(({ label, href, desc }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between px-[16px] py-[14px] border border-border rounded-sm bg-bg-1 hover:bg-bg-2 transition-colors group"
                                >
                                    <div>
                                        <p className="text-[12px] text-text-1 mb-[2px]">{label}</p>
                                        <p className="text-[10px] text-text-4">{desc}</p>
                                    </div>
                                    <ChevronRight size={12} className="text-text-4 group-hover:text-text-1 transition-colors" />
                                </a>
                            ))}
                        </div>

                        <div className="mt-[24px] border border-border rounded-sm px-[20px] py-[16px] flex items-center justify-between bg-bg-1">
                            <div className="flex items-center gap-[10px]">
                                <Github size={14} className="text-text-3" />
                                <span className="text-[12px] text-text-2">yuricommits/vault-cli</span>
                            </div>
                            <a
                                href="https://github.com/yuricommits/vault-cli"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-[5px] text-[11px] text-text-4 hover:text-text-1 transition-colors"
                            >
                                view on github <ArrowRight size={10} />
                            </a>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
