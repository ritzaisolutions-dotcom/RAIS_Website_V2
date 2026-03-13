import { cn } from "@/lib/utils";
import { Cloud, Workflow, MessageSquare, Wand2, Server, Cpu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Component = () => {
  const { t } = useLanguage();

  return (
    <section
      className={cn(
        "group relative w-full max-w-[880px] mx-auto overflow-hidden",
        "rounded-[36px] border backdrop-blur-xl",
        "dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(9,12,14,0.92),rgba(6,8,10,0.94))]",
        "dark:shadow-[inset_0_2px_0_rgba(255,255,255,0.07),0_50px_130px_-40px_rgba(0,0,0,0.85)]",
        "border-neutral-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(245,246,247,0.9))]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_40px_100px_-40px_rgba(0,0,0,0.1)]"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl",
          "dark:bg-[radial-gradient(closest-side,rgba(6,182,212,0.18),transparent_70%)]",
          "bg-[radial-gradient(closest-side,rgba(14,165,233,0.12),transparent_70%)]"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -bottom-24 -right-28 h-96 w-96 rounded-full blur-3xl",
          "dark:bg-[radial-gradient(closest-side,rgba(30,64,175,0.2),transparent_70%)]",
          "bg-[radial-gradient(closest-side,rgba(37,99,235,0.12),transparent_70%)]"
        )}
      />

      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <FloatingOrb className="top-1/4 left-1/4 animate-pulse" />
        <FloatingOrb className="top-1/3 right-1/3 animate-pulse delay-500" />
        <FloatingOrb className="bottom-1/4 left-1/3 animate-pulse delay-1000" />
        <FloatingOrb className="bottom-1/3 right-1/4 animate-pulse" />
      </div>

      <div className="relative p-12 md:p-16">
        <h2
          className={cn(
            "text-[32px] sm:text-5xl font-extrabold tracking-tight",
            "dark:bg-gradient-to-b dark:from-white dark:to-white/70 dark:bg-clip-text dark:text-transparent",
            "bg-gradient-to-b from-black to-neutral-600 bg-clip-text text-transparent"
          )}
        >
          {t('tech.title')}
        </h2>
        <p
          className={cn(
            "mt-5 max-w-2xl text-lg leading-relaxed",
            "dark:text-slate-300/80 text-neutral-600"
          )}
        >
          {t('tech.subtitle')}
        </p>

        <div
          className={cn(
            "mx-auto mt-14 grid grid-cols-3 gap-6 md:gap-10 place-items-center",
            "max-w-[600px]"
          )}
        >
          <div />
          <IconTile label="Voiceflow">
            <Wand2 className="h-10 w-10 text-blue-600 dark:text-cyan-400" />
          </IconTile>
          <div />

          <IconTile label="n8n">
            <Workflow className="h-10 w-10 text-red-500 dark:text-red-400" />
          </IconTile>

          <IconTile label="OpenAI">
            <Cpu className="h-10 w-10 text-green-600 dark:text-green-400" />
          </IconTile>

          <IconTile label="Make.com">
            <MessageSquare className="h-10 w-10 text-purple-600 dark:text-purple-400" />
          </IconTile>

          <div />
          <IconTile label="Google Cloud">
            <Cloud className="h-10 w-10 text-blue-500 dark:text-blue-400" />
          </IconTile>
          <div />

          <div />
          <IconTile label="Hostinger">
            <Server className="h-10 w-10 text-orange-500 dark:text-orange-400" />
          </IconTile>
          <div />
        </div>
      </div>
    </section>
  );
};

function FloatingOrb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute h-2 w-2 rounded-full",
        "bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-500",
        "blur-[2px] opacity-60",
        "transition-all duration-700 ease-in-out",
        className
      )}
    />
  );
}

function IconTile({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div className="relative group/tile">
      <div
        className={cn(
          "relative h-24 w-24 md:h-28 md:w-28",
          "rounded-[24px] overflow-hidden",
          "backdrop-blur-md border transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:scale-105",
          "dark:bg-[linear-gradient(180deg,rgba(18,24,27,0.92),rgba(10,14,16,0.95))]",
          "dark:border-white/10 dark:shadow-[inset_0_2px_2px_rgba(255,255,255,0.08),inset_0_-2px_1px_rgba(0,0,0,0.55),0_26px_70px_-22px_rgba(0,0,0,0.9)]",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(245,246,247,0.95))]",
          "border-neutral-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_20px_50px_-20px_rgba(0,0,0,0.2)]",
          className
        )}
      >
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {children}
        </div>
      </div>
      {label && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/tile:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
