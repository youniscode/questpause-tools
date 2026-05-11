import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const OFFSET = 100;

function scrollToHash(hash) {
  if (!hash) return;
  const id = hash.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export default function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      const timer = setTimeout(() => {
        const retryEl = document.getElementById(id);
        if (retryEl) {
          const top = retryEl.getBoundingClientRect().top + window.scrollY - OFFSET;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  useEffect(() => {
    const handler = () => scrollToHash(window.location.hash);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return null;
}
