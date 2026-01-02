// Custom components that can be used in MDX files
// Import these in mdx.tsx to make them available

interface FeatureCardProps {
  title: string
  description: string
  icon?: string
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
      {icon && <div className="text-3xl mb-3">{icon}</div>}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
    </div>
  )
}

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  href?: string
}

export function Button({ children, variant = 'primary', href }: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition inline-block'
  const variantStyles = {
    primary: 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black hover:opacity-90',
    secondary: 'border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800',
  }

  if (href) {
    return (
      <a href={href} className={`${baseStyles} ${variantStyles[variant]}`}>
        {children}
      </a>
    )
  }

  return (
    <button className={`${baseStyles} ${variantStyles[variant]}`}>
      {children}
    </button>
  )
}

interface CardGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
}

export function CardGrid({ children, columns = 3 }: CardGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6 my-8`}>
      {children}
    </div>
  )
}

interface TestimonialProps {
  quote: string
  author: string
  role: string
  company?: string
}

export function Testimonial({ quote, author, role, company }: TestimonialProps) {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6">
      <blockquote className="text-lg mb-4 italic">
        "{quote}"
      </blockquote>
      <div className="font-semibold">{author}</div>
      <div className="text-sm text-neutral-600 dark:text-neutral-400">
        {role}{company && `, ${company}`}
      </div>
    </div>
  )
}

interface CalloutProps {
  children: React.ReactNode
  type?: 'info' | 'warning' | 'success' | 'error'
}

export function Callout({ children, type = 'info' }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
    warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
  }

  return (
    <div className={`border-l-4 p-4 my-4 rounded ${styles[type]}`}>
      {children}
    </div>
  )
}

// Example usage in MDX:
// 
// <CardGrid columns={3}>
//   <FeatureCard 
//     title="Fast" 
//     description="Blazing fast performance"
//     icon="⚡"
//   />
//   <FeatureCard 
//     title="Secure" 
//     description="Enterprise-grade security"
//     icon="🔒"
//   />
//   <FeatureCard 
//     title="Scalable" 
//     description="Grows with your needs"
//     icon="📈"
//   />
// </CardGrid>
//
// <Button variant="primary" href="/signup">
//   Get Started
// </Button>
//
// <Callout type="info">
//   This is an informational callout!
// </Callout>
