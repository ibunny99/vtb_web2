"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logoMain from "@/assets/v1b-logo.png";
import replogo from "@/assets/rep.png";

interface ServerStatus {
  name: string;
  current: number;
  max: number;
  active: boolean;
}

const defaultServers: ServerStatus[] = [
  { name: "VTB RP", current: 242, max: 666, active: true },
  // { name: "VTB RP Server 2", current: 0, max: 300, active: true },
];

const navigateLinks = [
  { label: "About Us", href: "/#about" },
  { label: "Subscriptions", href: "/#subscriptions" },
  // { label: "Applications", href: "/applications" },
  { label: "FAQ", href: "/#faq" },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refunds" },
  { label: "Server Rules", href: "/rules" },
];

function StatusCard({ server }: { server: ServerStatus }) {
  return (
    <div
      className="group relative block w-full overflow-hidden px-3.5 py-2.5"
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(255,255,255,0.02)" }}
      />

      <div
        className="absolute inset-0 transition-colors group-hover:opacity-100"
        style={{
          background: "rgba(255,255,255,0.06)",
        }}
      />

      <div className="relative z-10 flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
          style={{
            background: server.active ? "#00DCFF" : "#FFAA00",
            boxShadow: server.active ? "0 0 6px rgba(0,220,255,0.6)" : "none",
            animation: server.active ? "accentPulse 1.5s infinite" : "none",
          }}
        />

        <span
          className="font-heading text-[0.6875rem] font-bold uppercase tracking-[0.04em]"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          {server.name}
        </span>
        <span className="ms-auto font-heading text-[0.8125rem] font-bold leading-none text-white">
          {server.current}
          <span
            className="text-xs font-normal"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            /{server.max}
          </span>
        </span>
      </div>
    </div>
  );
}

export default function Footer() {
  const [servers, setServers] = useState<ServerStatus[]>(defaultServers);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data && d.data.servers && d.data.servers.length > 0) {
          setServers(d.data.servers);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="relative -mt-px">
      <div style={{ backgroundColor: "#0C0F14", paddingTop: "3rem" }}>
        <div className="container-wide">
          <div className="grid grid-cols-1 gap-10 pb-10 md:grid-cols-[1.4fr_1.2fr_1fr] md:gap-12">
            {/* Brand column */}
            <div className="flex flex-col items-center text-center md:items-start md:text-start">
              <Link href="/" className="mb-4 inline-block no-underline">
                <Image
                  src={logoMain}
                  alt="VTB ROLEPLAY"
                  className="block h-12 w-auto object-contain"
                />
              </Link>
              <p
                className="mb-3 max-w-[320px] text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Server developed and operated by VTB Roleplay, Rep Team, and partners. / ម៉ាស៊ីនមេដំណើរការដោយ VTB Roleplay។
              </p>
              <p
                className="mb-5 text-xs"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                For work:{" "}
                <a
                  href="https://discord.gg/GA8SyesK"
                  className="transition-colors hover:text-[#00DCFF]"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Rep Teams
                </a>
              </p>
              {/* Social icons */}
              <div className="flex gap-2.5">
                {/* Discord */}
                <a
                  href="https://discord.gg/rVDdrg68UA"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Discord"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border transition-[color,background,border-color] duration-300 hover:text-[#00DCFF]"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 -28.5 256 256"
                    fill="currentColor"
                  >
                    <path d="M216.856,16.597C200.285,8.843 182.566,3.208 164.042,0C161.767,4.113 159.109,9.645 157.276,14.046C137.584,11.085 118.073,11.085 98.743,14.046C96.911,9.645 94.193,4.113 91.897,0C73.353,3.208 55.613,8.864 39.042,16.638C5.618,67.147 -3.443,116.401 1.087,164.956C23.256,181.511 44.74,191.568 65.862,198.149C71.077,190.971 75.728,183.341 79.735,175.3C72.104,172.401 64.795,168.822 57.889,164.668C59.721,163.311 61.513,161.891 63.245,160.431C105.367,180.133 151.135,180.133 192.755,160.431C194.506,161.891 196.298,163.311 198.11,164.668C191.184,168.843 183.855,172.421 176.224,175.321C180.23,183.341 184.862,190.992 190.097,198.169C211.239,191.588 232.743,181.532 254.912,164.956C260.228,108.668 245.831,59.866 216.856,16.597ZM85.474,135.095C72.829,135.095 62.459,123.29 62.459,108.915C62.459,94.54 72.608,82.715 85.474,82.715C98.341,82.715 108.71,94.519 108.489,108.915C108.509,123.29 98.341,135.095 85.474,135.095ZM170.525,135.095C157.88,135.095 147.511,123.29 147.511,108.915C147.511,94.54 157.659,82.715 170.525,82.715C183.392,82.715 193.761,94.519 193.54,108.915C193.54,123.29 183.392,135.095 170.525,135.095Z" />
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border transition-[color,background,border-color] duration-300 hover:text-[#00DCFF]"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border transition-[color,background,border-color] duration-300 hover:text-[#00DCFF]"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z" />
                  </svg>
                </a>
                {/* TikTok */}
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border transition-[color,background,border-color] duration-300 hover:text-[#00DCFF]"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.51a8.27 8.27 0 0 0 4.76 1.52V6.59a4.84 4.84 0 0 1-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation columns */}
            <div className="grid grid-cols-2 gap-8 text-center md:text-start">
              <div>
                <h4 className="mb-3.5 font-heading text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-white">
                  Navigation
                </h4>
                <ul className="list-none space-y-2">
                  {navigateLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.8125rem] no-underline transition-colors hover:text-white"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-3.5 font-heading text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-white">
                  Information
                </h4>
                <ul className="list-none space-y-2">
                  {legalLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.8125rem] no-underline transition-colors hover:text-white"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Server status */}
            <div className="text-center md:text-start">
              <h4 className="mb-3.5 font-heading text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-white">
                Server Status / ស្ថានភាព
              </h4>
              <div className="flex flex-col gap-2.5">
                {servers.map((server) => (
                  <StatusCard key={server.name} server={server} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col items-center gap-3 py-5 text-center text-xs md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-4 md:text-start"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            <p>&copy; 2026 VTB ROLEPLAY. All Rights Reserved.</p>
            <a
              href="https://discord.gg/rVDdrg68UA"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs no-underline transition-opacity hover:opacity-70"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              <span>Powered by</span>
              <Image
                src={replogo}
                alt="Rep Team"
                className="block h-5 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
