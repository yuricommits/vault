'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const STEPS = [
  {
    num: '01',
    headline: 'Create an account',
    detail: 'Register with your email. Authentication is handled server-side with secure session management. No OAuth required — just email and password.',
    snippet: `// POST /api/auth/register
{
  "name": "Kim",
  "email": "kim@example.com",
  "password": "••••••••"
}
// ← 200 OK { session: "..." }`,
  },
  {
    num: '02',
    headline: 'Paste your code',
    detail: 'Paste raw code into the editor. Hit "Enhance with AI" — Claude generates a title, description, tags, and improves the code automatically.',
    snippet: `// POST /api/ai/enhance
{
  "code": "function add(a, b) { return a + b }",
  "language": "javascript"
}
// ← {
//     title: "Add Two Numbers",
//     description: "Returns the sum of a and b",
//     tags: ["math", "utility"],
//     improvedCode: "..."
//   }`,
  },
  {
    num: '03',
    headline: 'Tag and search',
    detail: 'Attach tags to categorize snippets. Use the search bar to filter by title or description. Press / to focus search from anywhere.',
    snippet: `// GET /api/search?q=debounce
[
  {
    "id": "snp_01",
    "title": "useDebounce Hook",
    "tags": ["react", "hooks"],
    "language": "typescript"
  }
]`,
  },
  {
    num: '04',
    headline: 'Copy and use',
    detail: 'Open any snippet to see a Shiki syntax-highlighted view. Hit copy to send it to your clipboard — ready to paste instantly.',
    snippet: `// Client-side
navigator.clipboard.writeText(snippet.code)
// → resolves immediately

// Keyboard shortcuts:
// N → new snippet
// / → focus search
// Esc → blur / close`,
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-[80px] max-[820px]:py-[60px] border-t border-border" id="how" ref={ref}>
      <div className="container">
        <motion.div
          className="mb-[40px]"
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
        >
          <span className="label">// how it works</span>
          <h2 className="heading mt-[12px]">Simple workflow,<br />no surprises.</h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 max-[820px]:grid-cols-1 gap-[32px] items-start"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="flex flex-col gap-[2px]">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                className={`w-full grid grid-cols-[32px_1fr_auto] gap-[14px] p-[14px_16px] bg-transparent border border-transparent rounded-sm cursor-pointer text-left font-mono transition-all duration-[0.18s] items-start hover:bg-bg-1 hover:border-border ${i === active ? '!bg-bg-1 !border-border-2' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="text-[10px] text-text-4 pt-[1px] flex-shrink-0 tracking-[0.5px]">{s.num}</span>
                <div className="flex flex-col gap-0">
                  <span className="text-[12.5px] font-semibold text-text-1 tracking-[-0.02em]">{s.headline}</span>
                  {i === active && (
                    <motion.p
                      className="text-[12px] text-text-3 leading-[1.7] mt-[6px] overflow-hidden"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.25 }}
                    >
                      {s.detail}
                    </motion.p>
                  )}
                </div>
                <span className="text-[11px] text-text-4 pt-[2px] flex-shrink-0">{i === active ? '↓' : '→'}</span>
              </button>
            ))}
          </div>

          <div className="bg-bg-1 border border-border-2 rounded-lg overflow-hidden sticky top-[72px] max-[820px]:static">
            <div className="flex items-center gap-[10px] px-[14px] py-[10px] border-b border-border bg-bg-2">
              <span className="flex gap-[4px]">
                <span className="w-[8px] h-[8px] rounded-full bg-bg-3" />
                <span className="w-[8px] h-[8px] rounded-full bg-bg-3" />
                <span className="w-[8px] h-[8px] rounded-full bg-bg-3" />
              </span>
              <span className="text-[11px] text-text-4">step_{STEPS[active].num}.ts</span>
            </div>
            <motion.pre
              key={active}
              className="px-[18px] py-[16px] text-[11.5px] leading-[1.75] text-[#d4d4d8] whitespace-pre overflow-auto max-h-[280px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <code className="font-mono">{STEPS[active].snippet}</code>
            </motion.pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
