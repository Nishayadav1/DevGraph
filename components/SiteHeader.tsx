'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import NavLink from './NavLink'

const NAV_LINKS = [
  { href: '/developers', label: 'Developers' },
  { href: '/projects', label: 'Projects' },
  { href: '/skills', label: 'Skills' },
  { href: '/technologies', label: 'Technologies' },
  { href: '/graph', label: 'Graph Explorer' },
]

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function Logomark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="5" cy="6" r="2.5" fill="var(--accent)" />
      <circle cx="19" cy="6" r="2.5" fill="var(--accent)" opacity="0.55" />
      <circle cx="12" cy="18" r="2.5" fill="var(--accent)" opacity="0.85" />
      <line x1="5" y1="6" x2="12" y2="18" stroke="var(--accent)" strokeWidth="1.4" opacity="0.4" />
      <line x1="19" y1="6" x2="12" y2="18" stroke="var(--accent)" strokeWidth="1.4" opacity="0.4" />
      <line x1="5" y1="6" x2="19" y2="6" stroke="var(--accent)" strokeWidth="1.4" opacity="0.4" />
    </svg>
  )
}

export default function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  // Close the mobile menu on navigation: React's documented pattern for
  // resetting state when a prop changes, without a setState-in-effect.
  const [renderedPathname, setRenderedPathname] = useState(pathname)
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-4xl items-center gap-4 px-6 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-foreground">
          <Logomark />
          DevGraph
        </Link>

        <nav aria-label="Main" className="hidden min-w-0 flex-1 items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4 sm:ml-0">
          <Link
            href="/search"
            aria-label="Search"
            className="text-muted transition-colors hover:text-foreground"
          >
            <SearchIcon />
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="text-muted transition-colors hover:text-foreground sm:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Main"
          className="flex flex-col gap-1 border-t border-border px-6 py-3 sm:hidden"
        >
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href}>
              <span className="block py-2">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
