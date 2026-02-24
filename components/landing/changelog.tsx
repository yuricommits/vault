import { GitCommitHorizontal } from "lucide-react";

interface Commit {
    sha: string;
    commit: {
        message: string;
        author: {
            date: string;
        };
    };
}

type CommitType =
    | "feat"
    | "fix"
    | "chore"
    | "refactor"
    | "docs"
    | "style"
    | "test"
    | "other";

const TYPE_META: Record<CommitType, { label: string; color: string }> = {
    feat: { label: "feat", color: "#4ade80" },
    fix: { label: "fix", color: "#fbbf24" },
    chore: { label: "chore", color: "#52525b" },
    refactor: { label: "refactor", color: "#7dd3fc" },
    docs: { label: "docs", color: "#52525b" },
    style: { label: "style", color: "#52525b" },
    test: { label: "test", color: "#52525b" },
    other: { label: "other", color: "#52525b" },
};

function parseCommit(message: string): {
    type: CommitType;
    scope: string | null;
    description: string;
} {
    const match = message.match(/^(\w+)(?:\(([^)]+)\))?:\s*(.+)/);
    if (!match)
        return {
            type: "other",
            scope: null,
            description: message.split("\n")[0],
        };
    const type = (
        TYPE_META[match[1] as CommitType] ? match[1] : "other"
    ) as CommitType;
    return { type, scope: match[2] || null, description: match[3] };
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
}

async function getCommits(): Promise<Commit[]> {
    try {
        const res = await fetch(
            "https://api.github.com/repos/yuricommits/vault/commits?per_page=20",
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json",
                },
                next: { revalidate: 3600 },
            },
        );
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export default async function Changelog() {
    const commits = await getCommits();

    return (
        <section className="py-[100px] border-t border-border" id="changelog">
            <div className="container">
                <div className="mb-[48px] flex flex-col gap-[14px]">
                    <span className="label">{"// changelog"}</span>
                    <h2 className="heading mt-[10px]">Shipping in the open.</h2>
                    <p className="subtext">
                        Every commit, every fix, every feature — tracked as it
                        happens.
                    </p>
                </div>

                <div className="border border-border rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-[12px] px-[20px] py-[12px] border-b border-border bg-bg-1 text-[10.5px] font-mono text-text-4">
                        <span className="w-[60px]">type</span>
                        <span className="w-[72px]">sha</span>
                        <span className="flex-1">message</span>
                        <span className="w-[80px] text-right">when</span>
                    </div>

                    {/* Commits */}
                    {commits.length === 0 ? (
                        <div className="px-[20px] py-[40px] text-center text-[12px] text-text-4 font-mono">
                            no commits found
                        </div>
                    ) : (
                        commits.map((commit, i) => {
                            const { type, scope, description } = parseCommit(
                                commit.commit.message,
                            );
                            const meta = TYPE_META[type];
                            const sha = commit.sha.slice(0, 7);
                            const when = timeAgo(commit.commit.author.date);

                            return (
                                <div
                                    key={commit.sha}
                                    className={`flex items-center gap-[12px] px-[20px] py-[13px] font-mono text-[11.5px] transition-colors duration-[0.18s] hover:bg-bg-1 ${i !== commits.length - 1 ? "border-b border-border" : ""}`}
                                >
                                    {/* Type badge */}
                                    <span className="w-[60px] flex-shrink-0">
                                        <span
                                            className="text-[9.5px] px-[6px] py-[2px] border rounded-xs"
                                            style={{
                                                color: meta.color,
                                                borderColor: `${meta.color}30`,
                                                background: `${meta.color}10`,
                                            }}
                                        >
                                            {meta.label}
                                        </span>
                                    </span>

                                    {/* SHA */}
                                    <span className="w-[72px] flex-shrink-0 flex items-center gap-[5px] text-text-4">
                                        <GitCommitHorizontal size={11} />
                                        {sha}
                                    </span>

                                    {/* Message */}
                                    <span className="flex-1 text-text-2 truncate">
                                        {scope && (
                                            <span className="text-text-4 mr-[6px]">
                                                ({scope})
                                            </span>
                                        )}
                                        {description}
                                    </span>

                                    {/* When */}
                                    <span className="w-[80px] text-right text-text-4 flex-shrink-0">
                                        {when}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}
