'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-extrabold text-white mt-8 mb-3 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-white mt-7 mb-2.5 first:mt-0 pb-2"
      style={{ borderBottom: '1px solid rgba(51,65,85,0.6)' }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-bold text-white mt-5 mb-2 first:mt-0">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-bold text-slate-300 mt-4 mb-1.5">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-slate-300 text-sm leading-relaxed mb-4 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-slate-300">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-5 mb-4 space-y-1.5 text-slate-300 text-sm">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-5 mb-4 space-y-1.5 text-slate-300 text-sm">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  code: ({ inline, className, children }) => {
    if (inline) {
      return (
        <code className="px-1.5 py-0.5 rounded text-xs font-mono text-violet-300"
          style={{ backgroundColor: 'rgba(139,92,246,0.15)' }}>
          {children}
        </code>
      )
    }
    return (
      <code className="block p-4 rounded-xl text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre text-slate-300"
        style={{ backgroundColor: '#0F172A' }}>
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="mb-4 rounded-xl overflow-hidden">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="pl-4 py-1 my-4 rounded-r-lg"
      style={{ borderLeft: '4px solid #6C3FD4', backgroundColor: 'rgba(108,63,212,0.1)' }}>
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-violet-400 hover:text-white underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  hr: () => (
    <hr className="my-6" style={{ borderColor: 'rgba(51,65,85,0.5)' }} />
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ backgroundColor: '#0F172A' }}>{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody>{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2.5 text-left text-xs font-bold text-white uppercase tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-slate-300 text-xs">{children}</td>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt}
      className="rounded-xl max-w-full my-4"
      style={{ border: '1px solid rgba(51,65,85,0.4)' }}
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
