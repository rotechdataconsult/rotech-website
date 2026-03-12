'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// ── Custom renderers tuned for the Rotech dark-purple theme ──────────────────
const components = {
  // Headings
  h1: ({ children }) => (
    <h1 className="text-2xl font-extrabold text-white mt-8 mb-3 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-white mt-7 mb-2.5 first:mt-0 border-b border-[#9B4FDE]/20 pb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-bold text-white mt-5 mb-2 first:mt-0">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-bold text-[#E8E0F0] mt-4 mb-1.5">{children}</h4>
  ),

  // Paragraphs & text
  p: ({ children }) => (
    <p className="text-[#E8E0F0] text-sm leading-relaxed mb-4 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-[#E8E0F0]">{children}</em>
  ),

  // Lists
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-5 mb-4 space-y-1.5 text-[#E8E0F0] text-sm">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-5 mb-4 space-y-1.5 text-[#E8E0F0] text-sm">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),

  // Code
  code: ({ inline, className, children }) => {
    if (inline) {
      return (
        <code className="bg-[#4a1580] text-[#C8D4E8] px-1.5 py-0.5 rounded text-xs font-mono">
          {children}
        </code>
      )
    }
    return (
      <code className="block bg-[#2d0d5c] text-[#C8D4E8] p-4 rounded-xl text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre">
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="mb-4 rounded-xl overflow-hidden">{children}</pre>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-[#9B4FDE] pl-4 py-1 my-4 bg-[#6B28A8]/30 rounded-r-lg">
      {children}
    </blockquote>
  ),

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[#9B4FDE] hover:text-white underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),

  // Horizontal rule
  hr: () => (
    <hr className="my-6 border-[#9B4FDE]/30" />
  ),

  // Tables (GFM)
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[#6B28A8]">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody>{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-[#9B4FDE]/20">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2.5 text-left text-xs font-bold text-white uppercase tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-[#E8E0F0] text-xs">{children}</td>
  ),

  // Images
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      className="rounded-xl max-w-full my-4 border border-[#9B4FDE]/20"
    />
  ),
}

export default function MarkdownContent({ content }) {
  return (
    <div className="min-w-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
