"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import logoMain from "@/assets/v1b-logo.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Rules", href: "/rules" },
  // { label: "Applications", href: "/applications" },
  { label: "Discord", href: "https://discord.gg/rVDdrg68UA" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className="fixed inset-x-0 border-b transition-all duration-300 top-0"
        style={{
          zIndex: 40,
          backgroundColor: scrolled ? "rgba(17,21,27,0.98)" : "#11151b",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-12">
          <nav className="flex h-[72px] items-center justify-between md:h-[92px]">
            {/* Logo */}
            <Link
              href="/"
              className="flex flex-shrink-0 items-center no-underline"
            >
              <Image
                src={logoMain}
                alt="VTB ROLEPLAY"
                className="block h-12 md:h-14 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="flex items-center gap-3 sm:gap-4 xl:gap-6">
              <ul className="me-6 hidden items-center list-none xl:flex h-full">
                {navLinks.map((link) => {
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname?.startsWith(link.href);
                  return (
                    <li
                      key={link.href}
                      className="relative flex justify-center px-[2vh] h-full min-h-[9vh]"
                    >
                      <Link
                        href={link.href}
                        className={`group relative flex items-center py-1 no-underline${active ? " is-active" : ""}`}
                      >
                        <span
                          className="font-heading text-[14px] font-bold uppercase leading-none whitespace-nowrap transition-colors duration-200"
                          style={{
                            color: active ? "#00DCFF" : "#fff",
                            textShadow: active
                              ? "0 0 12px rgba(0,220,255,0.4)"
                              : "none",
                          }}
                        >
                          {link.label}
                        </span>
                        {active && (
                          <div className="absolute left-1/2 w-full min-w-[10vh] h-full py-[2vh] overflow-visible -translate-x-1/2 bgtopbar border-b-[0.2vh] border-[#00DCFF]">
                            {/* <NavDiamond /> */}
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Studios link */}
              <a
                href="https://rep.tebex.io/"
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-1.5 font-heading text-sm font-bold uppercase transition-colors hover:text-[#00DCFF] xl:inline-flex"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span>Store</span>
              </a>

              {/* Cart Drawer Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Cart"
                className="relative inline-flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-[#00DCFF] border border-white/10 transition-all active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#00DCFF] text-black font-mono font-black text-[10px] flex items-center justify-center shadow-[0_0_10px_rgba(0,220,255,0.7)] animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Login */}
              <Link
                href="/login"
                aria-label="Login"
                className="inline-flex items-center justify-center transition-colors hover:text-[#00DCFF]"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>

              {/* Join VTB RP CTA */}
              <Link href="/applications" className="hidden xl:inline-flex">
                <div
                  className="inline-flex relative cursor-pointer items-center justify-center px-6 py-[14px] no-underline active:scale-[0.97] transition-transform duration-150"
                  style={
                    {
                      "--dentSize-tl": "9px",
                      "--dentSize-tr": "9px",
                      "--dentSize-bl": "9px",
                      "--dentSize-br": "9px",
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "rgba(0,56,70,0.5)",
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-[1vh] border-2 border-[#52F0FF]"
                    style={{
                      background: "#00DCFF",
                    }}
                  />
                  <span className="relative z-10 whitespace-nowrap font-heading text-sm font-bold uppercase leading-none text-black">
                    Join VTB RP
                  </span>
                </div>
              </Link>

              {/* Mobile hamburger */}
              <button
                className="flex flex-col gap-[5px] p-1 xl:hidden"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <span
                  className="h-0.5 w-6 rounded-[1px] bg-white transition-transform duration-300 origin-center"
                  style={{
                    transform: mobileOpen
                      ? "rotate(45deg) translateY(7px)"
                      : "none",
                  }}
                />
                <span
                  className="h-0.5 w-6 rounded-[1px] bg-white transition-opacity duration-300"
                  style={{ opacity: mobileOpen ? 0 : 1 }}
                />
                <span
                  className="h-0.5 w-6 rounded-[1px] bg-white transition-transform duration-300 origin-center"
                  style={{
                    transform: mobileOpen
                      ? "rotate(-45deg) translateY(-7px)"
                      : "none",
                  }}
                />
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="xl:hidden border-t"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(17,21,27,0.98)",
            }}
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-heading text-sm font-bold uppercase py-3 px-2 transition-colors hover:text-[#00DCFF] border-b"
                    style={{
                      color: active ? "#00DCFF" : "rgba(255,255,255,0.8)",
                      borderColor: "rgba(255,255,255,0.06)",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href="https://rep.tebex.io/"
                target="_blank"
                rel="noreferrer"
                className="font-heading text-sm font-bold uppercase py-3 px-2 transition-colors hover:text-[#00DCFF]"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Store
              </a>
              <Link
                href="/applications"
                className="mt-2 block text-center font-heading text-sm font-bold uppercase py-3 px-6 text-black"
                style={{
                  background: "#00DCFF",
                  border: "1px solid #52F0FF",
                }}
                onClick={() => setMobileOpen(false)}
              >
                Join VTB Roleplay
              </Link>
            </div>
          </div>
        )}
      </header>
      <div className="h-[72px] md:h-[92px]" />
    </>
  );
}
