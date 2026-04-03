"use client";

import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import { RevealSection } from "@/components/ui/RevealSection";

type BoardMember = {
  name: string;
  role: string;
  bio: string;
  photo: string;
};

type CrewInfo = {
  crew: string;
  directors: {
    name: string;
    photo: string;
    bio: string;
  }[];
  members: string[];
};

const presidents: BoardMember[] = [
  {
    name: "Jerry Qiu",
    role: "President",
    bio: "Class of 2026",
    photo: "/team/jerry-qiu.jpg",
  },
  {
    name: "Lucy Chen",
    role: "President",
    bio: "Class of 2026",
    photo: "/team/lucy-chen.jpg",
  },
  {
    name: "Vanna Lei",
    role: "President",
    bio: "Class of 2026",
    photo: "/team/vanna-lei.jpg",
  },
];

const vicePresidents: BoardMember[] = [
  {
    name: "Anchine Liu",
    role: "Vice President",
    bio: "Class of 2027",
    photo: "/team/anchine-liu.jpg",
  },
  {
    name: "Hannah Kim",
    role: "VP of Communications",
    bio: "Class of 2027",
    photo: "/team/hannah-kim.jpg",
  },
  {
    name: "Jiewen Huang",
    role: "VP of Web Development",
    bio: "Class of 2026",
    photo: "/team/jiewen-huang.jpg",
  },
  {
    name: "Melanie Xie",
    role: "VP of Operations",
    bio: "Class of 2027",
    photo: "/team/melanie-xie.jpg",
  },
  {
    name: "Melody Qu",
    role: "VP of Internal Affairs",
    bio: "Class of 2027",
    photo: "/team/melody-qu.jpg",
  },
];

const executiveMembers: BoardMember[] = [
  {
    name: "Anders Zernike",
    role: "Editor-in-Chief",
    bio: "StuyCast Leadership",
    photo: "/team/anders-zernike.jpg",
  },
  {
    name: "Anderson Oh",
    role: "Treasurer",
    bio: "StuyCast Leadership",
    photo: "/team/anderson-oh.jpg",
  },
  {
    name: "Ella Lee",
    role: "Editor-in-Chief",
    bio: "Class of 2029",
    photo: "/team/ella-lee.jpg",
  },
  {
    name: "Everett Yu-Dawidowicz",
    role: "Treasurer",
    bio: "Class of 2027",
    photo: "/team/everett-yu-dawidowicz.jpg",
  },
  {
    name: "Kevin Lin",
    role: "Editor-in-Chief",
    bio: "Class of 2027",
    photo: "/team/kevin-lin.jpg",
  },
  {
    name: "Max Yang",
    role: "Editor-in-Chief",
    bio: "StuyCast Leadership",
    photo: "/team/max-yang.jpg",
  },
  {
    name: "Ryan Radwan",
    bio: "Ryan is the founder of StuyCast, having graduated as part of the Stuyvesant Class of 2025. He dedicated his sophomore, junior, and senior years to building the club from the ground up, and now focuses on continuing to support the future generations that will power the premier media production club at Stuyvesant for years to come as the Alumni Relations Coordinator, helping newer members learn from experienced alumni and creating opportunities for them to connect with the broader media industry.",
    role: "Alumni Relations Coordinator",
    photo: "/team/ryan-radwan.jpg",
  },
];

const crews: CrewInfo[] = [
  {
    crew: "Photography",
    directors: [
      { name: "Anders Zernike", photo: "/team/anders-zernike.jpg", bio: "Photography Director" },
      { name: "Caitleen Zheng", photo: "/team/caitleen-zheng.jpg", bio: "Photography Director" },
      { name: "Catherine Chen", photo: "/team/catherine-chen.jpg", bio: "Photography Director" },
      { name: "Timofey Volvovskiy", photo: "/team/timofey-volvovskiy.jpg", bio: "Photography Director" },
    ],
    members: ["Anna Chen", "Epshita Arien", "Hugo Hu", "Megan Li", "Olivia Chen", "Olivia Liu", "Xinyi Chen"],
  },
  {
    crew: "Video Production",
    directors: [
      { name: "Aaron Lu", photo: "/team/aaron-lu.jpg", bio: "Video Production Director" },
      { name: "Clive Wu", photo: "/team/clive-wu.jpg", bio: "Video Production Director" },
      { name: "Emily Johnson", photo: "/team/emily-johnson.jpg", bio: "Video Production Director" },
      { name: "Jerry Qiu", photo: "/team/jerry-qiu.jpg", bio: "Video Production Director" },
      { name: "Mike Yin", photo: "/team/mike-yin.jpg", bio: "Video Production Director" },
    ],
    members: ["Connor Meyer", "Felicity Yu", "Hilda Liang", "Jasmine Liang", "Milan Gittens", "Sofie Chang"],
  },
];

function initialsFromName(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Avatar({
  name,
  photo,
  size,
  align = "center",
}: {
  name: string;
  photo: string;
  size: "large" | "small" | "director";
  align?: "center" | "left";
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const sizeClassName =
    size === "large"
      ? "w-32 h-32 text-3xl"
      : size === "small"
        ? "w-20 h-20 text-lg"
        : "w-8 h-8 text-[10px]";
  const alignmentClassName = align === "center" ? "mx-auto" : "mx-0";

  if (!hasImageError) {
    return (
      <div className={`${sizeClassName} ${alignmentClassName} rounded-full overflow-hidden border border-blue-300/20 bg-blue-400/10`}>
        <Image src={photo} alt={name} width={160} height={160} className="w-full h-full object-cover" onError={() => setHasImageError(true)} />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClassName} ${alignmentClassName} rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-400/20 border border-blue-300/20 flex items-center justify-center text-white font-semibold`}
    >
      {initialsFromName(name)}
    </div>
  );
}

function MemberCard({
  member,
  onOpen,
  iconSize,
}: {
  member: BoardMember;
  onOpen: (member: BoardMember) => void;
  iconSize: "large" | "small";
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(member)}
      className="group w-full text-left bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-blue-400/50 hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
      aria-label={`Open bio for ${member.name}`}
    >
      <div className="mb-4">
        <Avatar name={member.name} photo={member.photo} size={iconSize} />
      </div>
      <h4 className="text-center text-white font-semibold text-base">{member.name}</h4>
      <p className="text-center text-sm text-blue-300 mt-1">{member.role}</p>
      <p className="text-center text-xs text-slate-400 mt-3 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
        Click to read bio
      </p>
    </button>
  );
}

function CrewCard({ crew, onOpen }: { crew: CrewInfo; onOpen: (member: BoardMember) => void }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
      <h4 className="text-white font-semibold text-base mb-2">{crew.crew}</h4>
      <div className="mb-3">
        <p className="text-[11px] uppercase tracking-[1.6px] text-blue-300 mb-1">Directors</p>
        <div className="grid grid-cols-1 gap-2">
          {crew.directors.map((director) => {
            const directorProfile: BoardMember = {
              name: director.name,
              role: `${crew.crew} Director`,
              bio: director.bio,
              photo: director.photo,
            };

            return (
              <button
                key={director.name}
                type="button"
                onClick={() => onOpen(directorProfile)}
                className="group w-full flex items-center gap-3 rounded-lg border border-blue-400/25 bg-blue-500/10 px-3 py-2 text-sm text-blue-100 text-left hover:bg-blue-500/20 hover:border-blue-300/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                aria-label={`Open bio for ${director.name}`}
              >
                <Avatar name={director.name} photo={director.photo} size="director" align="left" />
                <span className="leading-tight whitespace-nowrap">{director.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[1.6px] text-slate-400 mb-1">Members</p>
        <ul className="space-y-1 text-sm text-slate-300">
          {crew.members.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function MeetTeamSection() {
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isMounted = typeof window !== "undefined";

  const openMemberModal = (member: BoardMember) => {
    setSelectedMember(member);
    requestAnimationFrame(() => setIsModalVisible(true));
  };

  const closeMemberModal = () => {
    setIsModalVisible(false);
  };

  const handleModalTransitionEnd = () => {
    if (!isModalVisible) {
      setSelectedMember(null);
    }
  };

  return (
    <RevealSection>
      <section className="mt-2">
        <div className="mb-8 text-center">
          <span className="font-[var(--font-outfit)] text-[11px] uppercase tracking-[4px] text-[var(--color-accent-blue)]">
            Meet the team
          </span>
          <h2 className="text-xl font-bold text-white mt-2">Executive Board</h2>
          <p className="text-sm text-slate-400 mt-2">Tap a card to read each executive board member&apos;s bio.</p>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[2px] text-blue-300 mb-4 text-center">Presidents</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {presidents.map((member) => (
                <div key={member.name} className="w-full md:w-[calc(33.333%-0.75rem)] max-w-sm">
                  <MemberCard member={member} onOpen={openMemberModal} iconSize="large" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[2px] text-blue-300 mb-4 text-center">Vice Presidents</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {vicePresidents.map((member) => (
                <div key={member.name} className="w-full md:w-[calc(33.333%-0.75rem)] max-w-sm">
                  <MemberCard member={member} onOpen={openMemberModal} iconSize="small" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[2px] text-blue-300 mb-4 text-center">Executive Members</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {executiveMembers.map((member) => (
                <div key={member.name} className="w-full md:w-[calc(33.333%-0.75rem)] max-w-sm">
                  <MemberCard member={member} onOpen={openMemberModal} iconSize="small" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-2 text-center">Crews</h3>
          <p className="text-sm text-slate-400 mb-5 text-center">
            Full roster by crew. Director cards are intentionally smaller for quick scanning.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {crews.map((crew) => (
              <div key={crew.crew} className="w-full sm:w-[calc(50%-0.5rem)] xl:w-[calc(45%-0.75rem)] max-w-lg">
                <CrewCard crew={crew} onOpen={openMemberModal} />
              </div>
            ))}
          </div>
        </div>

        {isMounted &&
          selectedMember &&
          createPortal(
            <div
              className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300 ${
                isModalVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeMemberModal}
              onTransitionEnd={handleModalTransitionEnd}
              role="dialog"
              aria-modal="true"
              aria-label={`Bio for ${selectedMember.name}`}
            >
              <div
                className={`w-full max-w-md bg-[#0c1322] border border-white/15 rounded-2xl p-6 transition-all duration-300 ${
                  isModalVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[0.98]"
                }`}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-4">
                  <Avatar name={selectedMember.name} photo={selectedMember.photo} size="large" />
                </div>
                <h4 className="text-center text-white text-lg font-semibold">{selectedMember.name}</h4>
                <p className="text-center text-blue-300 text-sm mt-1">{selectedMember.role}</p>
                <p className="text-slate-300 leading-relaxed text-sm mt-4">{selectedMember.bio}</p>
                <button
                  type="button"
                  onClick={closeMemberModal}
                  className="mt-6 w-full rounded-xl border border-white/15 bg-white/5 text-white py-2.5 text-sm hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                >
                  Close
                </button>
              </div>
            </div>,
            document.body
          )}
      </section>
    </RevealSection>
  );
}