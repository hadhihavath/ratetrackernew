import { type ReactNode, useEffect, useState } from 'react'
import { useAppStore } from '@/stores/appStore'
import { AppHeader } from './AppHeader'
import { BottomNav } from './BottomNav'
import { DesktopControlsBar } from './DesktopControlsBar'

interface DeviceFrameProps {
  children: ReactNode
}

export function DeviceFrame({ children }: DeviceFrameProps) {
  const { deviceMode } = useAppStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="min-h-screen bg-bg-page" />
  }

  return (
    <div className="relative min-h-screen">
      {/* Desktop Controls Bar - only visible in desktop mode */}
      {deviceMode === 'desktop' && <DesktopControlsBar />}

      {/* Main Viewport */}
      <main className="app-viewport-wrapper">
        <div className="device-frame" id="app-frame">
          {/* Mobile Status Bar / Notch - only visible in mobile mode */}
          {deviceMode === 'mobile' && (
            <div className="status-bar-notch">
              <span className="status-time">9:41</span>
              <div className="status-icons flex items-center gap-1.5">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" className="text-text-main">
                  <rect x="0" y="8" width="3" height="4" rx="1" />
                  <rect x="4" y="6" width="3" height="6" rx="1" />
                  <rect x="8" y="3" width="3" height="9" rx="1" />
                  <rect x="12" y="0" width="3" height="12" rx="1" />
                </svg>
                <svg width="15" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-text-main">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                <svg width="22" height="11" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-main">
                  <rect x="1" y="1" width="18" height="10" rx="3" />
                  <rect x="3" y="3" width="12" height="6" rx="1.5" fill="currentColor" />
                  <path d="M21 4v4" />
                </svg>
              </div>
            </div>
          )}

          {/* App Screen Container */}
          <div className="app-screen-container">
            {/* App Header */}
            <AppHeader />

            {/* Main Content - Pages render here */}
            <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
              {children}
            </div>

            {/* Bottom Navigation - only visible in mobile mode */}
            {deviceMode === 'mobile' && <BottomNav />}
          </div>
        </div>
      </main>
    </div>
  )
}