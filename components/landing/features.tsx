'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Archive, Search, Tag, Copy, Code2, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: Archive,
    tag: '01',
    title: 'Save snippets',
    desc: 'Store code with a title, description, and language. Every snippet lives in your personal vault.',
  },
  {
    icon: Search,
    tag: '02',
    title: 'Full-text search',
    desc: 'Search across snippet titles and descriptions in real time. Find what you saved in seconds.',
  },
  {
    icon: Tag,
    tag: '03',
    title: 'Tag and organize',
    desc: 'Attach any number of tags to a snippet. Organize your library and find snippets by category.',
  },
  {
    icon: Copy,
    tag: '04',
    title: 'One-click copy',
    desc: 'Hit the copy button — the code goes straight to your clipboard. No selecting, no drag.',
  },
  {
    icon: Code2,
    tag: '05',
    title: 'Syntax highlighting',
    desc: 'Snippets are displayed with Shiki syntax highlighting. Looks exactly like your editor.',
  },
  {
    icon: Sparkles,
    tag: '06',
    title: 'AI enhancement',
    desc: 'Paste raw code and let Claude generate a title, description, tags, and improved code automatically.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: 'easeOut' as const },
  }),
};

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-[80px] border-t border-border" id="features" ref={ref}>
      <div className="container">
        <motion.div
          className="mb-[48px] flex flex-col gap-[14px]"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
        >
          <span className="label">// features</span>
          <h2 className="heading mt-[10px]">What's in Vault today.</h2>
          <p className="subtext">
            These are the features currently implemented. More are planned as the project grows.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 max-[820px]:grid-cols-2 max-[520px]:grid-cols-1 border border-border rounded-lg overflow-hidden">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.tag}
                className="p-[26px_24px] border-r border-b border-border bg-bg hover:bg-bg-1 transition-colors duration-[0.18s] flex flex-col [&:nth-child(3n)]:border-r-0 [&:nth-child(n+4)]:border-b-0 max-[820px]:[&:nth-child(3n)]:border-r max-[820px]:[&:nth-child(2n)]:border-r-0 max-[820px]:[&:nth-child(n+4)]:border-b max-[820px]:[&:nth-child(n+5)]:border-b-0 max-[520px]:[&:nth-child(n)]:border-r-0 max-[520px]:[&:nth-child(n)]:border-b max-[520px]:last:border-b-0"
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'show' : 'hidden'}
              >
                <div className="flex items-center justify-between mb-[16px]">
                  <span className="text-[10px] text-text-4 tracking-[0.5px]">{f.tag}</span>
                  <span className="text-[9.5px] px-[6px] py-[2px] border border-green-border rounded-xs tracking-[0.3px] bg-green-dim text-green">stable</span>
                </div>
                <div className="text-text-3 mb-[12px] w-[32px] h-[32px] flex items-center justify-center bg-bg-2 border border-border-2 rounded-sm">
                  <Icon size={17} />
                </div>
                <h3 className="text-[12.5px] font-semibold text-text-1 mb-[7px] tracking-[-0.02em]">{f.title}</h3>
                <p className="text-[12px] text-text-3 leading-[1.65]">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
