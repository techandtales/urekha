const fs = require('fs');
const file = 'app/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<span className="text-sm font-medium tracking-wide">Agent Profile<\/span>\s*<\/button>\s*<div className="grid grid-cols-2 gap-4 w-full">/;

const replacementStr = `<span className="text-sm font-medium tracking-wide">Agent Profile</span>
          </button>

          <Link
            href="/dashboard/settings"
            className={\`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-[#D4AF37] hover:bg-slate-100 dark:hover:bg-[#D4AF37]/5 border border-transparent\`}
          >
            <Settings size={18} className="text-slate-400 dark:text-zinc-500" />
            <span className="text-sm font-medium tracking-wide">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
          <button
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-md"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 pt-4 md:p-8 relative z-10 pb-28 md:pb-8">
        <SocketInitializer />
        {activeTab === "generate" && (
          <div className="max-w-5xl mx-auto w-full">
            {generationStatus === "idle" && (
              <>
                <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold font-serif leading-tight text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)] uppercase md:capitalize">
                      New Report Generation
                    </h2>
                    <p className="text-slate-500 dark:text-white/50 mt-2 font-light tracking-wide transition-colors">
                      Enter client details to generate a comprehensive Kundli
                      report.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                    <div className="flex items-center gap-3 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md shadow-sm dark:shadow-[0_0_15px_rgba(0,255,148,0.1)] transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00FF94] animate-pulse shadow-[0_0_5px_rgba(0,255,148,0.5)] dark:shadow-[0_0_8px_#00FF94]" />
                      <span className="text-sm font-medium text-slate-800 dark:text-white/90 transition-colors">
                        System Online
                      </span>
                    </div>
                    <div className="md:hidden flex items-center gap-2 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md shadow-sm dark:shadow-[0_0_15px_rgba(0,255,148,0.1)] transition-colors">
                      <Clock size={16} className="text-primary" />
                      <span className="text-sm font-mono tracking-widest text-primary">
                        {liveTime
                          ? formatDeterministicTime(liveTime)
                          : "--:--:--"}
                      </span>
                    </div>
                  </div>
                </header>

                {/* Live Metrics HUD */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                  <div className="bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 p-5 md:px-6 md:py-5 rounded-[2.5rem] flex items-center justify-between group overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 shadow-xl transition-all duration-500">
                    <div className="flex-1 w-full relative">
                      <div className="grid grid-cols-2 gap-4 w-full">`;

if (regex.test(content)) {
  content = content.replace(regex, replacementStr);
  fs.writeFileSync(file, content);
  console.log('Successfully recovered the corrupted layout structure!!');
} else {
  console.log('REGEX DID NOT MATCH.');
}
