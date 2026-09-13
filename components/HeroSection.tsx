"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import introvideo from "@/assets/LandingHero2.webm";

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

function ClipButton({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
}) {
  const isPrimary = variant === "primary";
  const content = (
    <div className="inline-flex relative cursor-pointer items-center justify-center font-heading font-bold uppercase whitespace-nowrap text-white no-underline active:scale-[0.97] transition-transform duration-150 px-8 py-4 text-sm">
      <div
        className="absolute inset-0 transition-colors bg-transparent"
        style={{
          background: isPrimary ? "rgba(0,56,70,0.5)" : "rgba(17,21,27,0.45)",
        }}
      />
      <div className="absolute inset-0 transition-colors border border-white/20 hover:border-[#00DCFF]" />
      <span className="relative z-10 inline-flex flex-row items-center gap-1.5 whitespace-nowrap transition-colors">
        {children}
      </span>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }
  return <Link href={href}>{content}</Link>;
}

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [servers, setServers] = useState<ServerStatus[]>(defaultServers);
  const [title1, setTitle1] = useState("NEXT-LEVEL ROLEPLAY");
  const [title2, setTitle2] = useState("CLASSIC • RESPECT");
  const [desc, setDesc] = useState(
    "VTB Roleplay starts with you. A world built from the ground up with custom roleplay hubs, authentic civilian life, and interconnected systems creating unscripted, memorable stories. / VTB Roleplay ចាប់ផ្តើមពីអ្នក។ ពិភពលោកដែលបង្កើតឡើងវិញពីដំបូងសម្រាប់ការលេងតួដ៏អស្ចារ្យបំផុត។"
  );

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.data) {
          if (d.data.servers && d.data.servers.length > 0) {
            setServers(d.data.servers);
          }
          if (d.data.home) {
            if (d.data.home.heroTitle1) setTitle1(d.data.home.heroTitle1);
            if (d.data.home.heroTitle2) setTitle2(d.data.home.heroTitle2);
            if (d.data.home.heroDescription) setDesc(d.data.home.heroDescription);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Browser autoplay fallback
      }
    };

    void playVideo();
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-8 pb-24"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={introvideo} type="video/webm" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 50% at 50% 35%, rgba(17,21,27,0.1) 0%, rgba(17,21,27,0.55) 100%), linear-gradient(rgba(17,21,27,0.35) 0%, rgba(17,21,27,0.15) 20%, rgba(17,21,27,0.3) 45%, rgba(17,21,27,0.65) 65%, rgba(17,21,27,0.92) 80%, rgb(17,21,27) 92%, rgb(17,21,27) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex max-w-[1100px] flex-col items-center gap-6 text-center px-5 md:px-8 md:gap-8">
        {/* Server Status Bar */}
        <div
          className="flex w-full max-w-xs flex-col items-stretch gap-2 rounded-2xl border px-4 py-3 backdrop-blur-md animate-fade-in sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-5 sm:rounded-full sm:px-5 sm:py-2"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            animationDelay: "0.2s",
            animationFillMode: "both",
          }}
        >
          {servers.map((server, i) => (
            <div key={server.name} className="flex items-center gap-1.5">
              {i > 0 && (
                <div
                  className="me-5 hidden h-3.5 w-px sm:block"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                />
              )}
              <span
                className="h-1.5 w-1.5 rounded-full animate-accent-pulse"
                style={{
                  background: server.active
                    ? "#00DCFF"
                    : "rgba(255,255,255,0.35)",
                  boxShadow: server.active
                    ? "0 0 6px rgba(0,220,255,0.6)"
                    : "none",
                }}
              />
              <span
                className="font-heading text-[0.6875rem] font-bold uppercase tracking-[0.06em]"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {server.name}
              </span>
              <span className="ms-auto font-heading text-[0.6875rem] font-bold text-white sm:ms-0">
                {server.current}/{server.max}
              </span>
            </div>
          ))}
        </div>

        {/* Heading */}
        <h1
          className="whitespace-nowrap leading-none tracking-[-0.04em] animate-fade-in-up"
          style={{
            fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)",
            animationDelay: "0.4s",
            animationFillMode: "both",
          }}
        >
          <span className="block text-white">{title1}</span>
          <span
            className="block min-h-[1.2em] text-shimmer animate-fade-in-up py-[1.5vh]"
            style={{ animationDelay: "0.5s", animationFillMode: "both" }}
          >
            {title2}
          </span>
        </h1>

        {/* Description */}
        <p
          className="max-w-[800px] leading-[1.7] animate-fade-in-up"
          style={{
            fontSize: "clamp(0.9375rem, 1.8vw, 1.1875rem)",
            color: "rgba(255,255,255,0.75)",
            animationDelay: "0.6s",
            animationFillMode: "both",
          }}
        >
          {desc}
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-wrap justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.7s", animationFillMode: "both" }}
        >
          <ClipButton
            href="https://discord.gg/rVDdrg68UA"
            variant="primary"
            external
          >
            Join Discord
          </ClipButton>
          <ClipButton href="/applications" variant="secondary">
            Join Server / ចូលរួម
          </ClipButton>
          <ClipButton href="/rules" variant="secondary">
            Server Rules / ច្បាប់
          </ClipButton>
        </div>
      </div>
    </section>
  );
}
