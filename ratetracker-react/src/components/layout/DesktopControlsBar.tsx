import { useAppStore } from '@/stores/appStore'
import { Monitor, Smartphone, Link, Link2, CheckCircle2 } from 'lucide-react'

export function DesktopControlsBar() {
  const { deviceMode, setDeviceMode, linkMode, setLinkMode } = useAppStore()

  return (
    <header className="desktop-controls-bar">
      <div className="controls-left flex items-center gap-3">
        {/* Cuelinks Status */}
        <div className="cuelinks-status-pill flex items-center gap-2 bg-green-100 border border-green-300 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
          <CheckCircle2 className="w-3 h-3 animate-pulse" />
          <span>Cuelinks Active (CID: 82192)</span>
        </div>

        {/* Link Mode Toggle */}
        <button
          onClick={() => setLinkMode(linkMode === 'cuelinks' ? 'direct' : 'cuelinks')}
          className={`view-btn flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
            linkMode === 'cuelinks'
              ? 'bg-green-100 text-green-700'
              : 'bg-green-600 text-white'
          }`}
        >
          {linkMode === 'cuelinks' ? (
            <>
              <Link className="w-4 h-4" />
              <span>🔗 Cuelinks Monetized (CID: 82192)</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              <span>⚡ Direct Store Links (AdBlock Safe)</span>
            </>
          )}
        </button>
      </div>

      {/* View Mode Toggles */}
      <div className="view-mode-toggles flex bg-slate-800 p-1 rounded-lg border border-slate-700">
        <button
          onClick={() => setDeviceMode('desktop')}
          className={`view-btn flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            deviceMode === 'desktop'
              ? 'bg-primary text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-4 h-4" />
          <span>Desktop View</span>
        </button>
        <button
          onClick={() => setDeviceMode('mobile')}
          className={`view-btn flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            deviceMode === 'mobile'
              ? 'bg-primary text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Mobile App Frame</span>
        </button>
      </div>
    </header>
  )
}