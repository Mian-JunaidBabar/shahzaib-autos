import Image from "next/image";

const team = [
  {
    name: "Hammad Ch",
    role: "Website Developer",
    bio: "Designed and developed modern platform to showcase products and services online.",
    image: "/about/team/hammad.png",
  },
  {
    name: "Shahzaib",
    role: "Owner & Founder",
    bio: "Passionate about automotive technology with focus on quality service and customer satisfaction.",
    image: "/about/team/shahzaib.png",
  },
  {
    name: "Abdullah",
    role: "Installation Technician",
    bio: "Skilled specialist in professional installation of car audio systems and electronic accessories.",
    image: "/about/team/abdullah.png",
  },
];

export function TeamGrid() {
  return (
    <section className="px-4 py-20 bg-slate-50 dark:bg-slate-900/40 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-black text-primary mb-4">
            Meet the Team
          </h3>
          <div className="h-1.5 w-16 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center space-y-4 group"
            >
              <div className="size-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl group-hover:scale-105 group-hover:border-primary transition-all duration-300">
                <Image
                  className="w-full h-full object-cover"
                  alt={member.name}
                  src={member.image}
                  width={128}
                  height={128}
                  priority={idx === 0}
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                  {member.name}
                </h4>
                <p className="text-primary text-xs font-black uppercase tracking-widest mt-1 mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-white max-w-50 mx-auto">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
