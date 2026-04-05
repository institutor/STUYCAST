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

type PersonInfo = {
  name: string;
  roles: string[];
  permission: 0 | 1 | 2 | 3 | 4;
  bio: string;
  photo: string;
  crews: string[];
  customTitle: string;
};

const roster: PersonInfo[] = [
  { name: "Anchine Liu", roles: ["Board", "Director"], permission: 3, bio: "Anchine has developed extensive outreach experience through her leadership in a tutoring club, where she partnered with elementary and middle schools across New York City to connect tutors with students. She also cultivated a passion for documenting school events as a writer for the news department of The Spectator. She is committed to expanding StuyCast's coverage to highlight events and lesser-known clubs and developing StuyCast's publication, fostering greater connection and awareness within the Stuyvesant community. In her free time, she enjoys running and dancing.", photo: "/team/anchine-liu.jpg", crews: ["Vice President", "Journalism"], customTitle: "VP of Outreach" },
  { name: "Aidan Zeleniy", roles: ["Director"], permission: 1, bio: "Web Development Director", photo: "/team/aidan-zeleniy.jpg", crews: ["Web Development"], customTitle: "" },
  { name: "Anderson Oh", roles: ["Vice President", "Director"], permission: 3, bio: "StuyCast Leadership", photo: "/team/anderson-oh.jpg", crews: ["Vice President", "Treasury"], customTitle: "VP of Finance" },
  { name: "Anders Zernike", roles: ["Director"], permission: 1, bio: "StuyCast Leadership", photo: "/team/anders-zernike.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Angela Yee", roles: ["Director"], permission: 1, bio: "Visual Design Director", photo: "/team/angela-yee.jpg", crews: ["Visual Design"], customTitle: "" },
  { name: "Angelica Pan", roles: ["Member"], permission: 0, bio: "Community Engagement Member", photo: "/team/angelica-pan.jpg", crews: ["Community Engagement"], customTitle: "" },
  { name: "Annika Vaysman", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/annika-vaysman.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Anna Chen", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/anna-chen.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Andy Trinh", roles: ["Member"], permission: 0, bio: "Journalism Member", photo: "/team/andy-trinh.jpg", crews: ["Journalism"], customTitle: "" },
  { name: "Aaron Lu", roles: ["Director"], permission: 1, bio: "Video Production Director", photo: "/team/aaron-lu.jpg", crews: ["Video Production"], customTitle: "" },
  { name: "Ashley Mui", roles: ["Director"], permission: 1, bio: "Treasury Director", photo: "/team/ashley-mui.jpg", crews: ["Treasury"], customTitle: "" },
  { name: "Austin Wang", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/austin-wang.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Belal Hasan", roles: ["Director"], permission: 1, bio: "Web Development Director", photo: "/team/belal-hasan.jpg", crews: ["Web Development"], customTitle: "" },
  { name: "Caitleen Zheng", roles: ["Director"], permission: 1, bio: "Raised in Iowa before moving to New York, Caitleen discovered her passion for photography last summer while photographing squirrels in a local park. Since then, she has grown rapidly as a photographer and is excited to keep developing her craft while helping newcomers find their footing.", photo: "/team/caitleen-zheng.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Catherine Chen", roles: ["Director"], permission: 1, bio: "Photography Director", photo: "/team/catherine-chen.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Christina Chen", roles: ["Board"], permission: 2, bio: "Lead Content Coordinator", photo: "/team/christina-chen.jpg", crews: ["Board"], customTitle: "Lead Content Coordinator" },
  { name: "Claire Man", roles: ["Member", "Member"], permission: 0, bio: "Treasury Member", photo: "/team/claire-man.jpg", crews: ["Treasury", "Visual Design"], customTitle: "" },
  { name: "Claire Zeng", roles: ["Director"], permission: 1, bio: "Community Engagement Director", photo: "/team/claire-zeng.jpg", crews: ["Community Engagement"], customTitle: "" },
  { name: "Chloe Tseng", roles: ["Member"], permission: 0, bio: "Visual Design Member", photo: "/team/chloe-tseng.jpg", crews: ["Visual Design"], customTitle: "" },
  { name: "Chloe Zhou", roles: ["Member"], permission: 0, bio: "Journalism Member", photo: "/team/chloe-zhou.jpg", crews: ["Journalism"], customTitle: "" },
  { name: "Clive Wu", roles: ["Director", "Director", "Member"], permission: 1, bio: "Video Production Director", photo: "/team/clive-wu.jpg", crews: ["Video Production", "Treasury", "Visual Design"], customTitle: "" },
  { name: "Connor Meyer", roles: ["Member"], permission: 0, bio: "Video Production Member", photo: "/team/connor-meyer.jpg", crews: ["Video Production"], customTitle: "" },
  { name: "Daniel Li", roles: ["Member"], permission: 0, bio: "Journalism Member", photo: "/team/daniel-li.jpg", crews: ["Journalism"], customTitle: "" },
  { name: "Dylan Galati", roles: ["Board"], permission: 2, bio: "Social Media Manager", photo: "/team/dylan-galati.jpg", crews: ["Board"], customTitle: "Lead Content Coordinator" },
  { name: "Edwin Gelman", roles: ["Director"], permission: 1, bio: "Treasury Director", photo: "/team/edwin-gelman.jpg", crews: ["Treasury"], customTitle: "" },
  { name: "Ella Lee", roles: ["Board", "Member"], permission: 2, bio: "Class of 2029", photo: "/team/ella-lee.jpg", crews: ["Board", "Photography"], customTitle: "Vice President-in-Training" },
  { name: "Emily Johnson", roles: ["Director"], permission: 1, bio: "Emily developed her foundation in video production through a digital media course, where she gained hands-on experience with industry-standard software. She has since produced and edited multiple school video projects, and as a Video Production Director, she is excited to keep filming and creating new work. In her free time, she enjoys watching movies and writing.", photo: "/team/emily-johnson.jpg", crews: ["Video Production"], customTitle: "" },
  { name: "Epshita Arien", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/epshita-arien.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Eric Zheng", roles: ["Director"], permission: 1, bio: "Visual Design Director", photo: "/team/eric-zheng.jpg", crews: ["Visual Design"], customTitle: "" },
  { name: "Ethan Zheng", roles: ["Member", "Member"], permission: 0, bio: "Community Engagement Member", photo: "/team/ethan-zheng.jpg", crews: ["Community Engagement", "Treasury"], customTitle: "" },
  { name: "Evan Hu", roles: ["Member", "Member"], permission: 0, bio: "Journalism Member", photo: "/team/evan-hu.jpg", crews: ["Journalism", "Visual Design"], customTitle: "" },
  { name: "Everett Yu-Dawidowicz", roles: ["Board", "Director"], permission: 2, bio: "Class of 2027", photo: "/team/everett-yu-dawidowicz.jpg", crews: ["Board", "Treasury"], customTitle: "Associate VP of Finance" },
  { name: "Felicity Yu", roles: ["Member"], permission: 0, bio: "Video Production Member", photo: "/team/felicity-yu.jpg", crews: ["Video Production"], customTitle: "" },
  { name: "Felipe Marín Bautista", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/felipe-marin-bautista.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Gunjori Saha", roles: ["Member"], permission: 0, bio: "Community Engagement Member", photo: "/team/gunjori-saha.jpg", crews: ["Community Engagement"], customTitle: "" },
  { name: "Hannah Kim", roles: ["Board"], permission: 3, bio: "Class of 2027", photo: "/team/hannah-kim.jpg", crews: ["Vice President"], customTitle: "VP of Community Engagement" },
  { name: "Hilda Liang", roles: ["Member"], permission: 0, bio: "Video Production Member", photo: "/team/hilda-liang.jpg", crews: ["Video Production"], customTitle: "" },
  { name: "Hugo Hu", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/hugo-hu.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Humaira Porso", roles: ["Member"], permission: 0, bio: "Journalism Member", photo: "/team/humaira-porso.jpg", crews: ["Journalism"], customTitle: "" },
  { name: "Iason Lin", roles: ["Member"], permission: 0, bio: "Community Engagement Member", photo: "/team/iason-lin.jpg", crews: ["Community Engagement"], customTitle: "" },
  { name: "Ikenna Chukwu", roles: ["Member"], permission: 0, bio: "Visual Design Member", photo: "/team/ikenna-chukwu.jpg", crews: ["Visual Design"], customTitle: "" },
  { name: "Jasmine Liang", roles: ["Member"], permission: 0, bio: "Video Production Member", photo: "/team/jasmine-liang.jpg", crews: ["Video Production"], customTitle: "" },
  { name: "Jerry Qiu", roles: ["President", "Director"], permission: 4, bio: "Jerry is a senior at Stuyvesant with a passion for aviation, music, and media. During Junior SING! 2025, he rediscovered a lifelong love for storytelling and has since dedicated himself to capturing moments that matter. He regularly creates content for StuyCast, other clubs, and the broader school community, from short-form videos to photo collages on Instagram. As a President, he is excited to keep filming and photographing at Stuyvesant while helping the next generation of StuyCast members grow in their creative journeys.", photo: "/team/jerry-qiu.jpg", crews: ["Board", "Video Production"], customTitle: "President, Engagement" },
  { name: "Jiewen Huang", roles: ["Board", "Director"], permission: 3, bio: "jiewen is cool", photo: "/team/jiewen-huang.jpg", crews: ["Vice President", "Web Development"], customTitle: "VP of Web Development" },
  { name: "John Nan", roles: ["Member", "Member"], permission: 0, bio: "Web Development Member", photo: "/team/john-nan.jpg", crews: ["Web Development", "Journalism"], customTitle: "" },
  { name: "Junling Gao", roles: ["Director"], permission: 1, bio: "Community Engagement Director", photo: "/team/junling-gao.jpg", crews: ["Community Engagement"], customTitle: "" },
  { name: "Justin Luo", roles: ["Member"], permission: 0, bio: "Web Development Member", photo: "/team/justin-luo.jpg", crews: ["Web Development"], customTitle: "" },
  { name: "Keqing Li", roles: ["Member"], permission: 0, bio: "Visual Design Member", photo: "/team/keqing-li.jpg", crews: ["Visual Design"], customTitle: "" },
  { name: "Kevin Lin", roles: ["Board", "Member", "Member"], permission: 2, bio: "Class of 2027", photo: "/team/kevin-lin.jpg", crews: ["Board", "Photography", "Treasury"], customTitle: "Editorial Officer" },
  { name: "Leyan Cai", roles: ["Member"], permission: 0, bio: "Community Engagement Member", photo: "/team/leyan-cai.jpg", crews: ["Community Engagement"], customTitle: "" },
  { name: "Liliia Shagdurova", roles: ["Member"], permission: 0, bio: "Community Engagement Member", photo: "/team/liliia-shagdurova.jpg", crews: ["Community Engagement"], customTitle: "" },
  { name: "Livia Aguirre", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/livia-aguirre.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Lucy Chen", roles: ["President"], permission: 4, bio: "Class of 2026", photo: "/team/lucy-chen.jpg", crews: ["Board"], customTitle: "President, Supervisory" },
  { name: "Lucia Fajardo", roles: ["Member"], permission: 0, bio: "Journalism Member", photo: "/team/lucia-fajardo.jpg", crews: ["Journalism"], customTitle: "" },
  { name: "Max Yang", roles: ["Board"], permission: 2, bio: "StuyCast Leadership", photo: "/team/max-yang.jpg", crews: ["Board"], customTitle: "Chief Editorial Officer" },
  { name: "Maximiliano Pettica", roles: ["Director"], permission: 1, bio: "Web Development Director", photo: "/team/maximiliano-pettica.jpg", crews: ["Web Development"], customTitle: "" },
  { name: "Megan Li", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/megan-li.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Melanie Xie", roles: ["Board"], permission: 3, bio: "Class of 2027", photo: "/team/melanie-xie.jpg", crews: ["Vice President"], customTitle: "VP of Operations" },
  { name: "Melody Qu", roles: ["Board"], permission: 3, bio: "Class of 2027", photo: "/team/melody-qu.jpg", crews: ["Vice President"], customTitle: "VP of Internal Affairs" },
  { name: "Mike Yin", roles: ["Director"], permission: 1, bio: "Video Production Director", photo: "/team/mike-yin.jpg", crews: ["Video Production"], customTitle: "" },
  { name: "Milan Gittens", roles: ["Member", "Member"], permission: 0, bio: "Video Production Member", photo: "/team/milan-gittens.jpg", crews: ["Video Production", "Visual Design"], customTitle: "" },
  { name: "Miya Zheng", roles: ["Member"], permission: 0, bio: "Journalism Member", photo: "/team/miya-zheng.jpg", crews: ["Journalism"], customTitle: "" },
  { name: "Nhima Lama", roles: ["Board"], permission: 2, bio: "Social Media Manager", photo: "/team/nhima-lama.jpg", crews: ["Board"], customTitle: "Content Coordinator" },
  { name: "Olivia Chen", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/olivia-chen.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Olivia Liu", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/olivia-liu.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Pema Buza", roles: ["Member"], permission: 0, bio: "Community Engagement Member", photo: "/team/pema-buza.jpg", crews: ["Community Engagement"], customTitle: "" },
  { name: "Ray Lattapongpisut", roles: ["Director"], permission: 1, bio: "Journalism Director", photo: "/team/ray-lattapongpisut.jpg", crews: ["Journalism"], customTitle: "" },
  { name: "Rhys Black", roles: ["Member", "Member"], permission: 0, bio: "Journalism Member", photo: "/team/rhys-black.jpg", crews: ["Journalism", "Community Engagement"], customTitle: "" },
  { name: "Ryan Radwan", roles: ["Board"], permission: 2, bio: "Ryan is the founder of StuyCast, having graduated as part of the Stuyvesant Class of 2025. He dedicated his sophomore, junior, and senior years to building the club from the ground up, and now focuses on continuing to support the future generations that will power the premier media production club at Stuyvesant for years to come. As the Alumni Relations Coordinator, he helps newer members learn from experienced alumni and creates opportunities for them to connect with the broader media industry.", photo: "/team/ryan-radwan.jpg", crews: ["Board"], customTitle: "Alumni Relations Coordinator" },
  { name: "Samiha Azad", roles: ["Member"], permission: 0, bio: "Community Engagement Member", photo: "/team/samiha-azad.jpg", crews: ["Community Engagement"], customTitle: "" },
  { name: "Samir Ahmed", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/samir-ahmed.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Sean Chen", roles: ["Member", "Member"], permission: 0, bio: "Web Development Member", photo: "/team/sean-chen.jpg", crews: ["Web Development", "Community Engagement"], customTitle: "" },
  { name: "Sebastian Lee", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/sebastian-lee.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Shirley Ke", roles: ["Member"], permission: 0, bio: "Visual Design Member", photo: "/team/shirley-ke.jpg", crews: ["Visual Design"], customTitle: "" },
  { name: "Sofie Chang", roles: ["Member", "Member", "Member"], permission: 0, bio: "Video Production Member", photo: "/team/sofie-chang.jpg", crews: ["Video Production", "Community Engagement", "Visual Design"], customTitle: "" },
  { name: "Stanley Zheng", roles: ["Member"], permission: 0, bio: "Community Engagement Member", photo: "/team/stanley-zheng.jpg", crews: ["Community Engagement"], customTitle: "" },
  { name: "Steven Wu", roles: ["Member"], permission: 0, bio: "Web Development Member", photo: "/team/steven-wu.jpg", crews: ["Web Development"], customTitle: "" },
  { name: "Teo Woodward", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/teo-woodward.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Tiffany Xu", roles: ["Member"], permission: 0, bio: "Treasury Member", photo: "/team/tiffany-xu.jpg", crews: ["Treasury"], customTitle: "" },
  { name: "Timofey Volvovskiy", roles: ["Director"], permission: 1, bio: "Photography Director", photo: "/team/timofey-volvovskiy.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Vanna Lei", roles: ["President"], permission: 4, bio: "Class of 2026", photo: "/team/vanna-lei.jpg", crews: ["Board"], customTitle: "President, Administrative" },
  { name: "William Chen", roles: ["Director"], permission: 1, bio: "Journalism Director", photo: "/team/william-chen.jpg", crews: ["Journalism"], customTitle: "" },
  { name: "William Li", roles: ["Member"], permission: 0, bio: "Community Engagement Member", photo: "/team/william-li.jpg", crews: ["Community Engagement"], customTitle: "" },
  { name: "Wynston Liemford", roles: ["Member"], permission: 0, bio: "Video Production Member", photo: "/team/wynston-liemford.jpg", crews: ["Video Production"], customTitle: "" },
  { name: "Xiang (Shawn) Li", roles: ["Member"], permission: 0, bio: "Treasury Member", photo: "/team/xiang-shawn-li.jpg", crews: ["Treasury"], customTitle: "" },
  { name: "Xinyi Chen", roles: ["Member"], permission: 0, bio: "Photography Member", photo: "/team/xinyi-chen.jpg", crews: ["Photography"], customTitle: "" },
  { name: "Yuxuan Che", roles: ["Member"], permission: 0, bio: "Community Engagement Member", photo: "/team/yuxuan-che.jpg", crews: ["Community Engagement"], customTitle: "" },
];

function getPresidents(): BoardMember[] {
  return roster
    .filter((person) => person.permission === 4)
    .map((person) => ({
      name: person.name,
      role: person.customTitle || person.roles[0] || "President",
      bio: person.bio,
      photo: person.photo,
    }));
}

function getVicePresidents(): BoardMember[] {
  return roster
    .filter((person) => person.customTitle.startsWith("VP of"))
    .map((person) => ({
      name: person.name,
      role: person.customTitle,
      bio: person.bio,
      photo: person.photo,
    }));
}

function getExecutiveMembers(): BoardMember[] {
  return roster
    .filter((person) => person.permission === 2 && !person.customTitle.startsWith("VP of"))
    .map((person) => ({
      name: person.name,
      role: person.customTitle || person.roles[0] || "Executive Member",
      bio: person.bio,
      photo: person.photo,
    }));
}

function getAllCrews(): string[] {
  const crewSet = new Set<string>();
  roster.forEach((person) => {
    person.crews.forEach((crew) => {
      if (crew !== "Board" && crew !== "Vice President" && crew !== "President") {
        crewSet.add(crew);
      }
    });
  });
  return Array.from(crewSet).sort();
}

function getCrewDirectors(crewName: string): PersonInfo[] {
  return roster.filter((person) => {
    const crewIndex = person.crews.indexOf(crewName);
    return crewIndex !== -1 && person.roles[crewIndex] === "Director";
  });
}

function getCrewMembers(crewName: string): PersonInfo[] {
  return roster.filter((person) => {
    const crewIndex = person.crews.indexOf(crewName);
    return crewIndex !== -1 && person.roles[crewIndex] === "Member";
  });
}

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

function CrewCard({ crewName, onOpen }: { crewName: string; onOpen: (member: BoardMember) => void }) {
  const directors = getCrewDirectors(crewName);
  const members = getCrewMembers(crewName);

  const midpoint = Math.ceil(members.length / 2);
  const leftMembers = members.slice(0, midpoint);
  const rightMembers = members.slice(midpoint);

  return (
    <div className="bg-white/[0.03] border border-cyan-300/50 rounded-xl p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.24),0_0_16px_rgba(34,211,238,0.18),0_0_28px_rgba(59,130,246,0.12)] hover:shadow-[0_0_0_1px_rgba(34,211,238,0.34),0_0_20px_rgba(34,211,238,0.24),0_0_34px_rgba(59,130,246,0.18)] transition-shadow duration-300">
      <h4 className="text-white font-semibold text-base mb-2">{crewName}</h4>
      <div className="mb-3">
        <p className="text-[11px] uppercase tracking-[1.6px] text-blue-300 mb-1">Directors</p>
        <div className="grid grid-cols-1 gap-2">
          {directors.map((director) => {
            const directorProfile: BoardMember = {
              name: director.name,
              role: `Director of ${crewName}`,
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
        <div className="grid grid-cols-2 gap-3">
          <ul className="space-y-1 text-sm text-slate-300">
            {leftMembers.map((member) => (
              <li key={member.name}>{member.name}</li>
            ))}
          </ul>
          <ul className="space-y-1 text-sm text-slate-300">
            {rightMembers.map((member) => (
              <li key={member.name}>{member.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function MeetTeamSection() {
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isMounted = typeof window !== "undefined";

  const presidents = getPresidents();
  const vicePresidents = getVicePresidents();
  const executiveMembers = getExecutiveMembers();
  const allCrews = getAllCrews();

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
          <div className="columns-1 sm:columns-2 xl:columns-2 [column-gap:1rem]">
            {allCrews.map((crew) => (
              <div key={crew} className="mb-4 break-inside-avoid">
                <CrewCard crewName={crew} onOpen={openMemberModal} />
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
