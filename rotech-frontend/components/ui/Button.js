'use client'

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',   // 'primary' | 'outline' | 'ghost'
  size = 'md',           // 'sm' | 'md' | 'lg'
  fullWidth = false,
  type = 'button',
  className = '',
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-sm',
  }

  const variants = {
    primary: 'text-white font-semibold rounded-lg disabled:opacity-60 disabled:cursor-not-allowed',
    outline: 'font-semibold rounded-lg border border-violet-500/50 text-violet-400 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed',
    ghost:   'font-medium rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-40',
  }

  const primaryStyle = variant === 'primary' ? { backgroundColor: '#6C3FD4' } : {}

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={primaryStyle}
      className={`
        inline-flex items-center justify-center gap-2
        ${sizes[size]}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
