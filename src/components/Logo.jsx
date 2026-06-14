const Logo = ({ size = 'md', showText = false, textClass = '' }) => {
  const sizes = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
    '2xl': 'h-44 w-45'
  }

  return (
    <span className="inline-flex items-center gap-2">
      <img
        src="/logo.png"
        alt="PrepNova"
        className={`${sizes[size] || sizes.md} object-contain rounded-xl`}
        style={{ background: 'transparent' }}
      />
      {showText && (
        <span className={`font-extrabold aurora-text ${textClass}`}>PrepNova</span>
      )}
    </span>
  )
}

export default Logo
