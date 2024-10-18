import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import AIChatButton from "./AIChatButton";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 dark:from-purple-700 dark:via-indigo-800 dark:to-blue-900 shadow-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

        <nav className="flex font-medium space-x-4 text-black dark:text-white text-lg tracking-wide">
          <Link href="/" className="hover-underline-animation min-w-0 shrink">
            Home
          </Link>
          <Link
            href="/projects"
            className="hover-underline-animation min-w-0 shrink"
          >
            Projects
          </Link>
          <Link
            href="/about"
            className="hover-underline-animation min-w-0 shrink"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover-underline-animation min-w-0 shrink"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <AIChatButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
