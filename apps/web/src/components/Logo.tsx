import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Hide the "SIGIL" wordmark and show only the mark */
  markOnly?: boolean;
}

/**
 * Brand lockup: the sigil mark next to the wordmark.
 * The mark is a tightly cropped asset, so it sits on the text's optical
 * center without needing a framed container.
 */
export function Logo({ className, markOnly = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="SIGIL — home"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md text-white",
        className
      )}
    >
      <Image
        src="/img/logo-mark.png"
        alt=""
        width={176}
        height={336}
        priority
        className="h-8 w-auto drop-shadow-[0_0_10px_rgba(165,124,255,0.35)] transition-[filter] duration-200 ease-out group-hover:drop-shadow-[0_0_14px_rgba(165,124,255,0.7)]"
      />
      {!markOnly && (
        <span className="text-lg font-bold leading-none tracking-[0.18em] transition-colors duration-200 ease-out group-hover:text-sigil-purple">
          SIGIL
        </span>
      )}
    </Link>
  );
}
