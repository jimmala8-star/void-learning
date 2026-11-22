import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
export function usePageAnimation(
  pageRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const elements = page.querySelectorAll("[data-animate]");

    gsap.fromTo(
      elements,
      { opacity: 0, y: 12 },
  {
    opacity: 1,
    y: 0,
    duration: 0.4,
    stagger: 0.05,
    clearProps: "all",
  }
);
  }, [pageRef]);
}
