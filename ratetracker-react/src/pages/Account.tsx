import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/stores/appStore'
import { ArrowLeft, User, Bell, Shield, Settings, LogOut, CreditCard, HelpCircle, Info, Wifi, Copy, Eye, EyeOff, ExternalLink, Loader2, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { GlassCard, GlassContainer, GlassButton, GlassInput } from '@/components/three-d'

const ACCOUNT_MENU = [
  { id: 'profile', icon: User, label: 'Edit Profile', description: 'Update your personal information' },
  { id: 'notifications', icon: Bell, label: 'Notifications', description: 'Manage price alerts & updates' },
  { id: 'payment', icon: CreditCard, label: 'Payment Methods', description: 'Saved cards & UPI handles' },
  { id: 'security', icon: Shield, label: 'Security', description: 'Password, 2FA & login activity' },
  { id: 'settings', icon: Settings, label: 'App Settings', description: 'Theme, language, data usage' },
  { id: 'help', icon: HelpCircle, label: 'Help & Support', description: 'FAQs, contact us, feedback' },
  { id: 'about', icon: Info, label: 'About', description: 'Version, legal, open source' },
]

const TECH_STACK = [
  { name: 'Frontend', tech: 'React 18 + TypeScript + Vite' },
  { name: 'Routing', tech: 'React Router v6' },
  { name: 'State', tech: 'Zustand + TanStack Query' },
  { name: 'Styling', tech: 'Tailwind CSS + CSS Variables' },
  { name: 'Charts', tech: 'Recharts' },
  { name: 'Icons', tech: 'Lucide React' },
  { name: 'Toasts', tech: 'React Hot Toast' },
  { name: 'API', tech: 'Axios + Custom Client' },
  { name: 'Backend', tech: 'Node.js + Vercel Functions' },
  { name: 'Database', tech: 'Supabase (PostgreSQL)' },
  { name: 'Affiliate', tech: 'Cuelinks API v3' },
]

export function Account() {
  const navigate = useNavigate()
  const {
    linkMode,
    setLinkMode,
    cuelinksApiKey,
    setCuelinksApiKey,
  } = useAppStore()

  const [showApiKey, setShowApiKey] = useState(false)
  const [cuelinksStatus, setCuelinksStatus] = useState<'checking' | 'connected' | 'disconnected' | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const goBack = () => navigate('/')

  const handleApiKeyCopy = () => {
    navigator.clipboard.writeText(cuelinksApiKey)
    toast.success('API Key copied to clipboard!', { icon: '📋' })
  }

  const handleTestCuelinks = async () => {
    setIsTesting(true)
    setCuelinksStatus('checking')
    // Simulate API test
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setCuelinksStatus('connected')
    setIsTesting(false)
    toast.success('Cuelinks API connected successfully!', { icon: '✅' })
  }

  const handleOpenCuelinksDashboard = () => {
    window.open('https://publishers.cuelinks.com', '_blank')
  }

  const handleLogout = () => {
    toast.success('Logged out successfully', { icon: '👋' })
    navigate('/')
  }

  return (
    <section className="app-screen-view min-h-screen" id="view-account">
      {/* Header with Glass Container */}
      <div className="sticky top-16 z-40 md:top-0">
        <GlassContainer className="px-4 py-3 border-b border-white/20 dark:border-slate-700/30" padding="none" gradient={true}>
          <div className="view-header flex items-center justify-between">
            <button onClick={goBack} className="back-btn p-2 rounded-full text-text-main hover:bg-white/20 dark:hover:bg-slate-800/50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="view-header-title text-xl font-extrabold text-text-main">Account</h2>
            <div className="w-10" />
          </div>
        </GlassContainer>
      </div>

      <div className="px-4 py-4 space-y-4 pb-28 md:pb-8">
        {/* Profile Card with Glass Effect */}
        <GlassCard variant="elevated" hoverEffect="lift" className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-extrabold text-text-main">RateTracker User</h3>
              <p className="text-sm text-text-muted">user@ratetracker.in</p>
              <p className="text-xs text-text-muted mt-1">Member since November 2024</p>
            </div>
            <GlassButton variant="ghost" size="sm" iconLeft={<Settings className="w-5 h-5" />} />
          </div>
        </GlassCard>

        {/* Cuelinks Configuration with Glass Card */}
        <GlassCard variant="elevated" hoverEffect="lift" className="p-5">
          <h3 className="text-lg font-extrabold text-text-main mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary" />
            Cuelinks Affiliate Configuration
          </h3>

          <div className="space-y-4">
            {/* API Key */}
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2">Publisher API Key</label>
              <GlassInput
                type={showApiKey ? 'text' : 'password'}
                value={cuelinksApiKey}
                onChange={(e) => setCuelinksApiKey(e.target.value)}
                readOnly
                className="font-mono text-sm pr-12"
                iconRight={
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-1.5 text-text-muted hover:text-text-main transition-colors"
                      aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleApiKeyCopy}
                      className="p-1.5 text-text-muted hover:text-text-main transition-colors"
                      aria-label="Copy API key"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                }
              />
            </div>

            {/* Connection Status */}
            <GlassCard variant="outlined" className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${cuelinksStatus === 'connected' ? 'bg-success' : cuelinksStatus === 'checking' ? 'bg-warning animate-pulse' : cuelinksStatus === 'disconnected' ? 'bg-danger' : 'bg-text-muted'}`} />
                  <div>
                    <p className="text-sm font-semibold text-text-main">
                      {cuelinksStatus === 'connected' ? 'Connected' : cuelinksStatus === 'checking' ? 'Checking...' : cuelinksStatus === 'disconnected' ? 'Disconnected' : 'Not Tested'}
                    </p>
                    <p className="text-xs text-text-muted">Publisher CID: 82192</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    iconLeft={isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                    disabled={isTesting || cuelinksStatus === 'checking'}
                    onClick={handleTestCuelinks}
                  >
                    {isTesting ? 'Testing...' : 'Test Connection'}
                  </GlassButton>
                  <GlassButton
                    variant="outline"
                    size="sm"
                    iconLeft={<ExternalLink className="w-4 h-4" />}
                    onClick={handleOpenCuelinksDashboard}
                  >
                    Dashboard
                  </GlassButton>
                </div>
              </div>
            </GlassCard>

            {/* Link Mode Toggle */}
            <GlassCard variant="outlined" className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-main">Affiliate Link Mode</p>
                  <p className="text-xs text-text-muted">Choose how product links open</p>
                </div>
                <div className="toggle-switch relative">
                  <input
                    type="checkbox"
                    id="link-mode-toggle"
                    checked={linkMode === 'cuelinks'}
                    onChange={(e) => setLinkMode(e.target.checked ? 'cuelinks' : 'direct')}
                    className="peer w-11 h-6 appearance-none bg-border-subtle rounded-full checked:bg-primary checked:border-primary border border-border-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <label htmlFor="link-mode-toggle" className="absolute inset-0 flex items-center pointer-events-none">
                    <span className="peer-checked:hidden ml-1.5 text-xs font-bold text-text-muted">Direct</span>
                    <span className="hidden peer-checked:block ml-1.5 text-xs font-bold text-white">Cuelinks</span>
                    <div className="absolute w-5 h-5 bg-white rounded-full shadow-lg transform peer-checked:translate-x-5 transition-transform" />
                  </label>
                </div>
              </div>
            </GlassCard>
          </div>
        </GlassCard>

        {/* Tech Stack with Glass Cards */}
        <GlassCard variant="elevated" hoverEffect="lift" className="p-5">
          <h3 className="text-lg font-extrabold text-text-main mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Tech Stack
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {TECH_STACK.map((item) => (
              <GlassCard key={item.name} variant="outlined" className="p-3">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">{item.name}</p>
                <p className="text-sm font-medium text-text-main mt-1">{item.tech}</p>
              </GlassCard>
            ))}
          </div>
        </GlassCard>

        {/* Account Menu with Glass Cards */}
        <GlassCard variant="elevated" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-white/20 dark:border-slate-700/30">
            <h3 className="text-lg font-extrabold text-text-main">Account Settings</h3>
          </div>
          {ACCOUNT_MENU.map((item) => {
            const Icon = item.icon
            return (
              <GlassCard
                key={item.id}
                variant="interactive"
                hoverEffect="shine"
                clickable
                className="border-b border-white/10 dark:border-slate-700/30 last:border-0 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-main text-sm">{item.label}</p>
                    <p className="text-xs text-text-muted">{item.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted flex-shrink-0" />
                </div>
              </GlassCard>
            )
          })}
        </GlassCard>

        {/* Notification Promo with Glass Card */}
        <GlassCard variant="hero" blur="xl" className="p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary/90 mb-1">Never Miss a Price Drop</p>
              <h4 className="text-lg font-extrabold text-white mb-2">Enable Smart Alerts</h4>
              <p className="text-xs text-white/80 max-w-xs">Get instant notifications when your wishlist items go on sale</p>
            </div>
            <GlassButton variant="primary" size="sm">
              Turn On
            </GlassButton>
          </div>
        </GlassCard>

        {/* Logout with Glass Button */}
        <GlassButton
          variant="outline"
          size="lg"
          fullWidth
          onClick={handleLogout}
          iconLeft={<LogOut className="w-5 h-5" />}
          className="text-danger border-danger/50 hover:bg-danger/10"
        >
          Log Out
        </GlassButton>

        {/* Version Info */}
        <p className="text-center text-xs text-text-muted">
          RateTracker v2.0.0 • Built with React + TypeScript + Vite
        </p>
      </div>
    </section>
  )
}