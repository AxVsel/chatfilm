import Chatfilm from "@/components/chat/Chatfilm";

export default function Home() {
  return (
    <main className="w-full h-dvh flex justify-center items-center bg-slate-950 sm:bg-gradient-to-b sm:from-slate-950 sm:via-[#0b0f19] sm:to-slate-950 sm:p-4 md:p-6 overflow-hidden">
      <div className="w-full h-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl sm:h-[94vh] sm:rounded-2xl sm:shadow-2xl sm:border sm:border-slate-800/80 overflow-hidden flex flex-col relative">
        <Chatfilm />
      </div>
    </main>
  );
}
