import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware wrappers: <Link href="/about"> becomes /es/about when browsing in Spanish.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
