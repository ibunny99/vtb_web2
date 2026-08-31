'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

interface RuleSection {
  id: string;
  title: string;
  rules: {
    number?: number;
    title: string;
    shortCode?: string;
    content: string | string[];
    bullets?: string[];
  }[];
}

const SECTIONS_DATA: RuleSection[] = [
  // {
  //   id: 'philosophy',
  //   title: 'PHILOSOPHY',
  //   rules: [
  //     {
  //       title: 'Culture of Fun',
  //       content:
  //         "Our goal is to provide an environment where losing a gun fight or losing a chase doesn't punish the player, but rewards all parties with a fun and engaging RP experience.",
  //     },
  //     {
  //       title: 'Engaging Ruleset',
  //       content: [
  //         'We aren\'t here to micromanage your RP and have set out a clear ruleset that encourages roleplay over rule play. With that in mind we ask you to take every RP situation with an open mind and worry about rule breaks after the fact.',
  //         'The staff will adjudicate rule breaks and punishments based on the actual damage caused by the rule break. This means if something leads to a positive RP experience for all parties, the staff team would see no reason to intervene. We are not here to police every move you make, we are here simply to encourage positive, fun experiences and to protect our players\' rights to have those experiences.',
  //         'You should not feel like the staff is looking over your shoulder at every moment.',
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 'community-rules',
  //   title: 'COMMUNITY RULES',
  //   rules: [
  //     {
  //       number: 1,
  //       title: 'No Racism, Sexism, or Hateful Prejudice',
  //       content:
  //         'This is a community where we hope all players feel safe to play. Hateful conduct will not be accepted on this server.',
  //     },
  //     {
  //       number: 2,
  //       title: 'Harassment',
  //       content:
  //         'No harassing other players, sexual or otherwise. Anything that leads to repeat aggressive pressure or borders on intimidation on an OOC level is against the server rules. This does not pertain to characters engaging in legitimate RP avenues and cannot be used for players to skirt the consequences of their in-character actions.',
  //     },
  //     {
  //       number: 3,
  //       title: 'Roleplay First',
  //       content:
  //         'You must be in character on the server at all times. Roleplay through the encounters in front of you. If there is a rule break, report it after the scenario has completed. (This does not pertain to major rule breaks like racism, sexual abuse, or major harassment).',
  //       bullets: [
  //         'If you are offered roleplay, you should reciprocate that roleplay. Even if you are trying to grind. This is an RP server first and a game server second.',
  //       ],
  //     },
  //     {
  //       number: 4,
  //       title: 'Toxicity',
  //       content:
  //         'Toxicity refers to any behavior that negatively impacts the community by creating a hostile, unfair, or unpleasant environment. It includes disrespect, harassment, power abuse, and actions that disrupt healthy role play or gameplay.',
  //       bullets: [
  //         'Any form of name abuse, including but not limited to derogatory, offensive, or sexually explicit names targeting female characters or players, is strictly prohibited.',
  //       ],
  //     },
  //     {
  //       number: 5,
  //       title: 'No Exploiting',
  //       content:
  //         'If there is a mechanic that does not seem to be working as intended or that is over-tuned, report this to staff and stop using the mechanic. Also, do not undertake actions which would exploit a situation:',
  //       bullets: [
  //         'Combat logging',
  //         'Camping respawn points',
  //         'Major crime mechanics 30 minutes before or after regularly scheduled restarts',
  //         'Forcing cops to drop PD equipment despite game mechanics preventing them from being robbed',
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 'general-rules',
  //   title: 'GENERAL RULES',
  //   rules: [
  //     {
  //       number: 6,
  //       title: 'Abusing Respawn Mechanics',
  //       content:
  //         'You must not use the respawn mechanic unless you are unreachable by PD, medical, or you are glitched. In addition, if you are glitched and police have come to the scene — turn yourself in.',
  //     },
  //     {
  //       number: 7,
  //       title: 'Green Zones',
  //       content:
  //         'Repeated and/or low-effort kidnapping, robbing, or assaulting (with weapons) in and around government buildings is strictly prohibited.',
  //     },
  //     {
  //       number: 8,
  //       title: 'Camping Teleports',
  //       content:
  //         'There are numerous mechanics that "teleport" you to another location (e.g., elevators, housing doors). Holding someone up or immediately attacking someone out of one of these exits is strictly prohibited. Allow any exiting party the ability for counterplay.',
  //     },
  //     {
  //       number: 9,
  //       title: 'Value Your Life',
  //       shortCode: 'NVL',
  //       content:
  //         'Value your life and the lives of those your character would value. This includes when a gun is placed at your back or when you are unarmed. You must surrender unless you are planning to RP out the full consequences of your actions for story reasons.',
  //     },
  //     {
  //       number: 10,
  //       title: 'No Metagaming',
  //       shortCode: 'MG',
  //       content:
  //         'Metagaming is the act of using information your character has not gained in character. This could be information from streams, discord direct messages, or other methods of OOC information consumption. This includes indirectly using the information.',
  //     },
  //     {
  //       number: 11,
  //       title: 'No Stream Sniping',
  //       content:
  //         'Support streamers by subscribing, promoting their streams, and being a positive member of their community. Do not under any circumstance use a stream to gain information about a streamer\'s needs or location. Do not watch streamers while actively playing on the server.',
  //     },
  //     {
  //       number: 12,
  //       title: 'No Powergaming',
  //       shortCode: 'PG',
  //       content:
  //         'Powergaming is the complete removal of a player\'s agency in a situation. You must leave a player with at least some options for counterplay in a scenario.',
  //     },
  //     {
  //       number: 13,
  //       title: 'Consent',
  //       content:
  //         'When it comes to any graphic content (outside of obvious GTA violence and humor), there must be consent between all parties. This includes:',
  //       bullets: [
  //         'Any form of extended torture RP or dismemberment RP',
  //         'Any reference to pregnancy complications, including abortion or miscarriage RP',
  //       ],
  //     },
  //     {
  //       number: 14,
  //       title: 'Copyright Music',
  //       content:
  //         'Do not endanger content creators by playing copyrighted music in public. Make every effort to protect content creators as it could jeopardize their livelihood.',
  //     },
  //     {
  //       number: 15,
  //       title: 'RP Blurring',
  //       content:
  //         'RP blurring refers to when the lines between in-character (IC) and out-of-character (OOC) actions, emotions, or behaviors become unclear. This can cause confusion or discomfort.',
  //     },
  //     {
  //       number: 16,
  //       title: 'Character Mixing',
  //       content:
  //         'Character mixing occurs when a player blends traits, knowledge, or actions between multiple characters they control. Each character should have a distinct personality, background, and knowledge base. You are not allowed to mix character information or money from one character to another.',
  //     },
  //     {
  //       number: 17,
  //       title: 'Character Breaking',
  //       shortCode: 'OOC in IC',
  //       content:
  //         'Character breaking occurs when a player acts or speaks out of character during RP, disrupting the realism of the game. Breaking of character is strictly prohibited.',
  //     },
  //     {
  //       number: 18,
  //       title: 'POV Rule',
  //       content:
  //         'Players involved in PvP or RP situations must have and retain their POV recording for at least 14 days in case it is required for staff investigations. Failure to provide the required POV will result in consequences.',
  //     },
  //     {
  //       number: 19,
  //       title: 'New Life Rule',
  //       shortCode: 'NLR',
  //       content:
  //         'On incapacitation, no memories from the moment of incapacitation until revival can be retained by the character. If the player uses respawn, the character cannot retain any memory leading up to their incapacitation. Permanent death is the sole decision of the character\'s player.',
  //     },
  //     {
  //       number: 20,
  //       title: 'Fail RP',
  //       content:
  //         'If you openly distort the world for others with low RP quality or disrupt other players\' RP experience by being abnormally obnoxious, we reserve the right to remove you from the server. Ensure your character\'s appearance aligns with realistic and immersive standards.',
  //     },
  //   ],
  // },
  // {
  //   id: 'conflict-rules',
  //   title: 'CONFLICT RULES',
  //   rules: [
  //     {
  //       number: 21,
  //       title: 'No Random Deathmatching',
  //       shortCode: 'RDM',
  //       content:
  //         'No attacking or engaging in combat with another player without verbal RP interaction or being initiated into combat first. This includes with vehicles or drive-bys. You must give sufficient RP and counterplay before shooting.',
  //     },
  //     {
  //       number: 22,
  //       title: 'No Vehicle Deathmatching',
  //       shortCode: 'VDM',
  //       content:
  //         'Do not purposefully use your vehicle as a weapon unless you have no other ability to escape. This does not apply to staged executions, just active or freshly initiated conflict.',
  //     },
  //     {
  //       number: 23,
  //       title: 'Heist Limits',
  //       content:
  //         '5 players max to a heist or crime mechanic. Police are limited to 8 unless the encounter has lasted over 30 minutes and is violent.',
  //     },
  //     {
  //       number: 24,
  //       title: 'Conflict Limits',
  //       content:
  //         'Civilian and criminal conflicts are set to 5v5 (police can bring 8). Groups can agree to waive this via OOC chat. If attacked on your turf with more than 5 people present, your group may defend yourselves. You may not lead a conflict to your turf to circumvent numbers limits.',
  //     },
  //     {
  //       number: 25,
  //       title: 'Endless Conflict',
  //       content:
  //         'Every conflict has an expiry date. If you continually engage in a conflict without attempting to end it, this is considered NVL. If you continually harass without giving a reasonable option to end the conflict, this is griefing.',
  //     },
  //     {
  //       number: 26,
  //       title: 'Conflict Cooldown',
  //       content:
  //         'If you continually engage in large mass shootouts with multiple casualties over a short period of time (within hours of one another), this will be considered fail RP.',
  //     },
  //     {
  //       number: 27,
  //       title: 'Pocket Wiping',
  //       content:
  //         'Taking the majority of items from a person when they\'re down with no RP reason is against the rules. Taking someone\'s gun or valuables is okay. Taking everything for no reason is not.',
  //     },
  //     {
  //       number: 28,
  //       title: 'Ocean Dumping',
  //       content:
  //         'Dumping someone\'s body in the ocean is allowed for story purposes but must not be used to force permadeath or memory loss. Ocean dumping vehicles with no prior roleplay is fail RP.',
  //     },
  //   ],
  // },
  // {
  //   id: 'government-rules',
  //   title: 'GOVERNMENT RULES',
  //   rules: [
  //     {
  //       number: 29,
  //       title: 'Government Powers',
  //       content:
  //         'The government as an RP mechanic does innately power game players that commit crime. However, government players should make an effort to offer counterplay wherever possible. Using government powers to consistently target a group without proper RP rationale is fail RP.',
  //     },
  //     {
  //       number: 30,
  //       title: 'COP and EMS Baiting',
  //       content: 'COP and EMS baiting is strictly prohibited.',
  //     },
  //     {
  //       number: 31,
  //       title: 'Rulesplaining',
  //       content:
  //         'You cannot try and explain rules to people in character. Complete the RP scenario and report that person on Discord after it\'s over.',
  //     },
  //   ],
  // },
  // {
  //   id: 'conduct-misc',
  //   title: 'CONDUCT & MISC',
  //   rules: [
  //     {
  //       number: 32,
  //       title: 'Off-Server Conduct',
  //       content:
  //         'We are not here to police your personal relationships. However, we exercise the right to remove anyone from the community for any off-server conduct that threatens player safety.',
  //     },
  //   ],
  // },
];

const SIDEBAR_ITEMS = [
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'community-rules', label: 'Community Rules' },
  { id: 'general-rules', label: 'General Rules' },
  { id: 'conflict-rules', label: 'Conflict Rules' },
  { id: 'government-rules', label: 'Government Rules' },
  { id: 'conduct-misc', label: 'Conduct & Misc' },
];

export default function RulesPage() {
  const [activeSection, setActiveSection] = useState<string>('philosophy');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll spy to update active section in sidebar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 }
    );

    SIDEBAR_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -110;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS_DATA;

    const q = searchQuery.toLowerCase().trim();
    return SECTIONS_DATA.map((sec) => ({
      ...sec,
      rules: sec.rules.filter((r) => {
        const titleMatch = r.title.toLowerCase().includes(q);
        const shortCodeMatch = r.shortCode?.toLowerCase().includes(q);
        const numberMatch = r.number?.toString() === q;
        const contentStr = Array.isArray(r.content) ? r.content.join(' ') : r.content;
        const contentMatch = contentStr.toLowerCase().includes(q);
        const bulletsMatch = r.bullets?.some((b) => b.toLowerCase().includes(q));
        return titleMatch || shortCodeMatch || numberMatch || contentMatch || bulletsMatch;
      }),
    })).filter((sec) => sec.rules.length > 0);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#0F1217] text-white">
      {/* Spacer for sticky navbar */}
      <div className="h-[72px] md:h-[92px]" />

      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Sidebar Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 self-start">
            <div className="text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-white/40 mb-4">
              ON THIS PAGE
            </div>

            <nav className="flex flex-col space-y-3 border-l border-white/10 pl-0">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative text-left font-sans text-sm transition-all duration-150 py-0.5 ${
                      isActive
                        ? 'pl-4 text-[#00DCFF] font-semibold border-l-2 border-[#00DCFF] -ml-[1px]'
                        : 'pl-4 text-white/60 hover:text-white border-l-2 border-transparent -ml-[1px]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Main Content */}
          <main className="lg:col-span-9 space-y-12">
            {/* Header Title */}
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-2">
                Server Rules / ច្បាប់ម៉ាស៊ីនមេ
              </h1>
              <p className="text-xs sm:text-sm text-white/40">
                VTB Roleplay Official Guidelines & Ruleset
              </p>
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <div className="relative flex items-center">
                <svg
                  className="absolute left-4 w-4 h-4 text-white/40 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 100-14 7 7 0 0114 0z"
                  />
                </svg>

                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search rules... / ស្វែងរកច្បាប់ (e.g. metagaming, NVL, conflict)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#161B24]/80 border border-white/10 rounded-lg py-3.5 pl-11 pr-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00DCFF]/60 focus:ring-1 focus:ring-[#00DCFF]/40 transition-colors shadow-inner"
                />

                <div className="absolute right-3.5 flex items-center gap-1.5 pointer-events-none">
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="pointer-events-auto text-xs text-white/40 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-white/30 bg-white/5 border border-white/10 rounded">
                      /
                    </kbd>
                  )}
                </div>
              </div>
            </div>

            {/* Section Items */}
            {filteredSections.length > 0 ? (
              filteredSections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-32 space-y-6 pt-2"
                >
                  {/* Section Title Header */}
                  <div className="border-b border-white/10 pb-3">
                    <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                      {section.title}
                    </h2>
                  </div>

                  {/* Section Rules List */}
                  <div className="space-y-6">
                    {section.rules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="group relative bg-[#161B24]/60 border border-white/10 rounded-xl p-6 sm:p-7 transition-colors hover:border-white/20"
                      >
                        {/* Rule Heading */}
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-wide">
                            {rule.number !== undefined ? `${rule.number}. ` : ''}
                            {rule.title}
                          </h3>

                          {rule.shortCode && (
                            <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 font-mono text-xs font-semibold">
                              {rule.shortCode}
                            </span>
                          )}
                        </div>

                        {/* Rule Content */}
                        {Array.isArray(rule.content) ? (
                          <div className="space-y-3">
                            {rule.content.map((p, pIdx) => (
                              <p
                                key={pIdx}
                                className="text-sm sm:text-[15px] leading-relaxed text-white/70"
                              >
                                {p}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm sm:text-[15px] leading-relaxed text-white/70">
                            {rule.content}
                          </p>
                        )}

                        {/* Rule Bullets */}
                        {rule.bullets && rule.bullets.length > 0 && (
                          <ul className="mt-4 space-y-2 list-disc pl-5 text-sm sm:text-[15px] text-white/70">
                            {rule.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="leading-relaxed">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <div className="text-center py-20 bg-[#161B24]/40 border border-white/10 rounded-xl">
                <p className="font-heading text-lg text-white mb-2">No rules found</p>
                <p className="text-sm text-white/40">
                  Try searching for terms like "metagaming", "NVL", "RDM", or "combat logging".
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
