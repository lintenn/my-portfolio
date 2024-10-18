import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-700 text-white dark:bg-gray-900">
      <nav className="mx-auto flex max-w-3xl gap-3 p-3">
        <Link href="/privacy" className="hover:underline">Privacy</Link>
      </nav>
    </footer>
  );
}
