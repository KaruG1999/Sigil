"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * All landing-page motion lives here, driven by data attributes in page.tsx:
 *
 * - [data-hero-line] / [data-hero-item]  one orchestrated entrance on load
 * - [data-hero-bg]                       slow drift + parallax while scrolling out
 * - [data-hero-content]                  fades and lifts as the hero leaves
 * - [data-hero-spot]                     soft glow that follows the cursor
 * - [data-steps-line] / [data-step]      the steps connector draws with scroll
 * - [data-reveal]                        staggered entrance in batches
 * - [data-spotlight]                     border glow that tracks the pointer
 * - [data-nav]                           gets `data-scrolled` once you scroll
 *
 * Everything that moves is gated by `prefers-reduced-motion: no-preference`.
 */
export function LandingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Nav: solid background after the first bit of scroll (works for everyone)
      const nav = document.querySelector<HTMLElement>("[data-nav]");
      if (nav) {
        ScrollTrigger.create({
          start: 24,
          end: "max",
          onToggle: (self) => nav.toggleAttribute("data-scrolled", self.isActive),
        });
      }

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // --- Hero entrance: one orchestrated sequence ---
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(q("[data-hero-bg]"), { scale: 1.15, autoAlpha: 0 }, { scale: 1.05, autoAlpha: 1, duration: 2.2, ease: "power2.out" }, 0)
          .fromTo(q("[data-hero-item='badge']"), { y: 12, autoAlpha: 0, filter: "blur(4px)" }, { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.8 }, 0.2)
          .fromTo(q("[data-hero-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.3)
          .fromTo(q("[data-hero-item='copy']"), { y: 12, autoAlpha: 0, filter: "blur(4px)" }, { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.8 }, 0.75)
          .fromTo(q("[data-hero-item='cta']"), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.9)
          .fromTo(q("[data-hero-item='hint']"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.3);

        // Slow "breathing" drift on the background image
        gsap.to(q("[data-hero-bg-img]"), {
          scale: 1.08,
          xPercent: -1.5,
          duration: 18,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // --- Hero parallax as it scrolls out ---
        gsap.to(q("[data-hero-bg]"), {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: q("[data-hero]")[0], start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(q("[data-hero-content]"), {
          yPercent: -12,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: q("[data-hero]")[0], start: "top top", end: "70% top", scrub: true },
        });

        // --- Cursor glow in the hero ---
        const hero = q("[data-hero]")[0] as HTMLElement | undefined;
        const spot = q("[data-hero-spot]")[0] as HTMLElement | undefined;
        let onMove: ((e: PointerEvent) => void) | undefined;
        if (hero && spot && window.matchMedia("(hover: hover)").matches) {
          const xTo = gsap.quickTo(spot, "x", { duration: 0.8, ease: "power3.out" });
          const yTo = gsap.quickTo(spot, "y", { duration: 0.8, ease: "power3.out" });
          gsap.set(spot, { xPercent: -50, yPercent: -50, x: hero.clientWidth / 2, y: hero.clientHeight / 2 });
          onMove = (e) => {
            const r = hero.getBoundingClientRect();
            xTo(e.clientX - r.left);
            yTo(e.clientY - r.top);
          };
          hero.addEventListener("pointermove", onMove);
        }

        // --- Steps: the connector draws as you scroll, steps light up in order ---
        const steps = q("[data-steps]")[0];
        if (steps) {
          const stepTl = gsap.timeline({
            scrollTrigger: { trigger: steps, start: "top 75%", end: "bottom 55%", scrub: 0.6 },
          });
          stepTl.fromTo(q("[data-steps-line]"), { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
          q("[data-step]").forEach((el, i) => {
            stepTl.fromTo(el, { autoAlpha: 0.25, y: 16 }, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.35 }, i * 0.33);
          });
        }

        // --- Section content enters in staggered batches ---
        gsap.set(q("[data-reveal]"), { autoAlpha: 0, y: 24 });
        ScrollTrigger.batch(q("[data-reveal]"), {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.1, overwrite: true }),
        });

        return () => {
          if (hero && onMove) hero.removeEventListener("pointermove", onMove);
        };
      });

      // Reduced motion: show everything at rest
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-hero-bg], [data-hero-item], [data-reveal]"), { autoAlpha: 1 });
      });

      // Pointer-tracking glow on cards (hover-capable devices only; not movement)
      const onCardMove = (e: PointerEvent) => {
        const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      const el = root.current;
      el?.addEventListener("pointermove", onCardMove);
      return () => el?.removeEventListener("pointermove", onCardMove);
    },
    { scope: root }
  );

  return <div ref={root}>{children}</div>;
}
