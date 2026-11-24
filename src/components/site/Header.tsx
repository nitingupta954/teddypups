"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PawIcon } from "@/components/icons";
import { mainNav, site } from "@/lib/site";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);

  // Solid once scrolled; tuck away while scrolling down, come back on any scroll up.
  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      setScrolled(y > 8);
      setHidden(y > 400 && y > last);
      last = y;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu after navigating.
  useEffect(() => menu.current?.close(), [pathname]);

  const closeMenu = () => {
    const d = menu.current;
    if (!d?.open) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return d.close();
    d.dataset.closing = "";
    d.addEventListener("animationend", () => {
      delete d.dataset.closing;
      d.close();
    }, { once: true });
  };

  return (
    <header
      id="site-header"
      data-scrolled={scrolled}
      data-hidden={hidden}
      data-home={pathname === "/" || undefined}
      className="tp-header fixed inset-x-0 top-0 z-50"
    >
      <div className="tp-header__bar gutter">
        <Link href="/" className="tp-header__brand" aria-label={`${site.name} — home`}>
          <Image src="/brand/logo.png" alt="" width={56} height={56} className="tp-header__logo" priority />
          <span className="font-plush tp-header__name">{site.shortName}</span>
        </Link>

        <nav aria-label="Main" className="tp-header__nav">
          <ul>
            {mainNav.map(({ href, label }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link href={href} className="tp-nav-link" data-active={active} aria-current={active ? "page" : undefined}>
                    <span>{label}</span>
                    <PawIcon className="tp-nav-link__paw" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="tp-header__end">
          <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-header__wa">
            WhatsApp us
          </a>
          <button
            type="button"
            onClick={() => menu.current?.showModal()}
            aria-haspopup="dialog"
            className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-cocoa bg-milk px-4 text-[0.95rem] font-semibold lg:hidden"
          >
            <PawIcon className="size-4" />
            Menu
          </button>
          <dialog
            ref={menu}
            aria-label="Site menu"
            onCancel={(e) => {
              e.preventDefault();
              closeMenu();
            }}
            className="tp-menu m-0 h-dvh max-h-none w-screen max-w-none bg-honey p-0 text-cocoa backdrop:bg-cocoa/40"
          >
            <div className="gutter flex h-full flex-col pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between">
                <span className="font-scrawl text-lg">where to, friend?</span>
                <button type="button" onClick={closeMenu} className="h-11 rounded-full bg-cocoa px-5 font-semibold text-milk">
                  Close
                </button>
              </div>
              <nav aria-label="Mobile" className="mt-10 flex-1">
                <ul className="space-y-1">
                  {mainNav.map(({ href, label }) => {
                    const active = isActive(pathname, href);
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={closeMenu}
                          data-active={active}
                          aria-current={active ? "page" : undefined}
                          className="tp-menu-link font-plush block py-2 text-[clamp(2.4rem,11vw,3.4rem)]"
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="space-y-3">
                <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
                  WhatsApp us
                </a>
                <p className="text-center text-sm font-medium">{site.phoneDisplay}</p>
              </div>
            </div>
          </dialog>
        </div>
      </div>

      {/* Scalloped hem under the bar */}
      <svg aria-hidden className="tp-header__hem" width="100%" height="14" preserveAspectRatio="none">
        <defs>
          <pattern id="tp-hem" width="44" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 0H44V2A22 11 0 0 1 0 2Z" className="tp-header__hem-fill" />
            <path d="M0 2A22 11 0 0 0 44 2" className="tp-header__hem-line" />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#tp-hem)" />
      </svg>
    </header>
  );
}
