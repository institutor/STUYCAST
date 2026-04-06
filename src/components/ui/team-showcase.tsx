"use client";

import { useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Twitter, Linkedin, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Jerry Qiu",
    role: "PRESIDENT, ENGAGEMENT",
    image: "/team/jerry-qiu.jpg",
    bio: "Jerry is a senior at Stuyvesant with a passion for aviation, music, and media. During Junior SING! 2025, he rediscovered a lifelong love for storytelling and has since dedicated himself to capturing moments that matter. He regularly creates content for StuyCast, other clubs, and the broader school community, from short-form videos to photo collages on Instagram. As a President, he is excited to keep filming and photographing at Stuyvesant while helping the next generation of StuyCast members grow in their creative journeys.",
    social: { instagram: "https://www.instagram.com/jerryqiu.co/" },
  },
  {
    id: "2",
    name: "Lucy Chen",
    role: "PRESIDENT, SUPERVISORY",
    image: "/team/lucy-chen.jpg",
    bio: "Class of 2026",
    social: { instagram: "https://www.instagram.com/ehycul_/" },
  },
  {
    id: "3",
    name: "Vanna Lei",
    role: "PRESIDENT, ADMINISTRATIVE",
    image: "/team/vanna-lei.jpg",
    bio: "Class of 2026",
    social: { instagram: "https://www.instagram.com/vannalovesfood/" },
  },
];

interface TeamShowcaseProps {
  members?: TeamMember[];
}

export default function TeamShowcase({ members = DEFAULT_MEMBERS }: TeamShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isMounted = typeof window !== "undefined";

  const col1 = members.filter((_, i) => i % 3 === 0);
  const col2 = members.filter((_, i) => i % 3 === 1);
  const col3 = members.filter((_, i) => i % 3 === 2);

  const openMemberModal = (member: TeamMember) => {
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
    <>
      <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10 lg:gap-14 select-none w-full max-w-5xl mx-auto py-8 px-4 md:px-6">
        {/* Photo grid */}
        <div className="flex gap-2 md:gap-3 flex-shrink-0 overflow-x-auto pb-1 md:pb-0">
          <div className="flex flex-col gap-2 md:gap-3">
            {col1.map((member) => (
              <PhotoCard
                key={member.id}
                member={member}
                className="w-[110px] h-[120px] sm:w-[130px] sm:h-[140px] md:w-[155px] md:h-[165px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onClick={openMemberModal}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2 md:gap-3 mt-[48px] sm:mt-[56px] md:mt-[68px]">
            {col2.map((member) => (
              <PhotoCard
                key={member.id}
                member={member}
                className="w-[122px] h-[132px] sm:w-[145px] sm:h-[155px] md:w-[172px] md:h-[182px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onClick={openMemberModal}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2 md:gap-3 mt-[22px] sm:mt-[26px] md:mt-[32px]">
            {col3.map((member) => (
              <PhotoCard
                key={member.id}
                member={member}
                className="w-[115px] h-[125px] sm:w-[136px] sm:h-[146px] md:w-[162px] md:h-[172px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onClick={openMemberModal}
              />
            ))}
          </div>
        </div>

        {/* Member name list */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-col gap-4 md:gap-5 pt-0 md:pt-2 flex-1 w-full">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
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
              <div className="w-28 h-28 rounded-xl overflow-hidden mx-auto border border-white/10 mb-4 relative">
                <Image src={selectedMember.image} alt={selectedMember.name} fill className="object-cover" sizes="112px" />
              </div>
              <h4 className="text-center text-white text-lg font-semibold">{selectedMember.name}</h4>
              <p className="text-center text-blue-300 text-xs uppercase tracking-[0.2em] mt-1">{selectedMember.role}</p>
              <p className="text-slate-300 leading-relaxed text-sm mt-4">
                {selectedMember.bio ?? "Bio coming soon."}
              </p>
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
    </>
  );
}

function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
  onClick,
}: {
  member: TeamMember;
  className: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onClick: (member: TeamMember) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;

  return (
    <button
      type="button"
      className={cn(
        "overflow-hidden rounded-xl cursor-pointer flex-shrink-0 transition-opacity duration-400 relative",
        className,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80",
        isDimmed ? "opacity-60" : "opacity-100",
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(member)}
      aria-label={`Open bio for ${member.name}`}
    >
      <Image
        src={member.image}
        alt={member.name}
        fill
        sizes="(max-width: 640px) 130px, (max-width: 768px) 145px, 172px"
        className="object-cover transition-[filter] duration-500"
        style={{
          filter: isActive ? "grayscale(0) brightness(1)" : "grayscale(1) brightness(0.77)",
        }}
      />
    </button>
  );
}

function MemberRow({
  member,
  hoveredId,
  onHover,
}: {
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  const hasSocial =
    member.social?.twitter ?? member.social?.linkedin ?? member.social?.instagram;

  return (
    <div
      className={cn(
        "cursor-pointer transition-opacity duration-300",
        isDimmed ? "opacity-50" : "opacity-100",
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "w-4 h-3 rounded-[5px] flex-shrink-0 transition-all duration-300",
            isActive ? "bg-white w-5" : "bg-white/25",
          )}
        />
        <span
          className={cn(
            "text-base md:text-[18px] font-semibold leading-none tracking-tight transition-colors duration-300",
            isActive ? "text-white" : "text-white/80",
          )}
        >
          {member.name}
        </span>

        {hasSocial && (
          <div
            className={cn(
              "flex items-center gap-1.5 ml-0.5 transition-all duration-200",
              isActive
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 pointer-events-none",
            )}
          >
            {member.social?.twitter && (
              <a
                href={member.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110"
                title="X / Twitter"
              >
                <Twitter size={10} />
              </a>
            )}
            {member.social?.linkedin && (
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110"
                title="LinkedIn"
              >
                <Linkedin size={10} />
              </a>
            )}
            {member.social?.instagram && (
              <a
                href={member.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110"
                title="Instagram"
              >
                <Instagram size={10} />
              </a>
            )}
          </div>
        )}
      </div>

      <p className="mt-1.5 pl-[27px] text-[7px] md:text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
        {member.role}
      </p>
    </div>
  );
}
