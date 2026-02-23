export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-lg font-mono text-white">settings</h2>
        <p className="text-white/30 text-xs mt-1">manage your preferences</p>
      </div>

      <div className="space-y-3 max-w-md">
        <div className="bg-[#0d0d0d] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-mono text-white">theme</p>
              <p className="text-xs text-white/30 mt-0.5">appearance of the interface</p>
            </div>
            <span className="text-xs font-mono text-white/20 border border-white/10 px-2 py-1">dark</span>
          </div>
          <div className="border-t border-white/5" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-mono text-white">font</p>
              <p className="text-xs text-white/30 mt-0.5">interface and code font</p>
            </div>
            <span className="text-xs font-mono text-white/20 border border-white/10 px-2 py-1">geist mono</span>
          </div>
          <div className="border-t border-white/5" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-mono text-white">ai enhancement</p>
              <p className="text-xs text-white/30 mt-0.5">auto-fill with claude on new snippets</p>
            </div>
            <span className="text-xs font-mono text-white/20 border border-white/10 px-2 py-1">enabled</span>
          </div>
        </div>

        <p className="text-xs text-white/20">more settings coming soon.</p>
      </div>
    </div>
  );
}
