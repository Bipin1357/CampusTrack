import { useState } from 'react'
import Card from '@/components/common/Card'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Toggle from '@/components/common/Toggle'
import Avatar from '@/components/common/Avatar'
import { cn } from '@/lib/utils'
import { User, Building2, Palette, Bell, Camera } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'institute', label: 'Institute Info', icon: Building2 },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

export default function Settings() {
  const [tab, setTab] = useState('profile')
  const [notif, setNotif] = useState({ email: true, push: false, sms: false, weeklyDigest: true })
  const [theme, setTheme] = useState({ compact: false, animations: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage your account and institute preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-56 shrink-0">
          <Card className="p-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm transition-colors',
                  tab === t.id ? 'bg-[var(--color-accent-soft)] text-white font-medium' : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-white'
                )}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          {tab === 'profile' && (
            <Card>
              <h3 className="font-display font-semibold mb-5">Profile Information</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <Avatar name="Aditi Sharma" size="lg" />
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full accent-gradient-bg flex items-center justify-center border-2 border-[var(--color-bg-raised)]">
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium">Aditi Sharma</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Registrar Admin</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue="Aditi Sharma" />
                <Input label="Email Address" type="email" defaultValue="aditi.sharma@campustrack.edu" />
                <Input label="Phone Number" defaultValue="+1 (555) 204-1187" />
                <Input label="Role" defaultValue="Registrar Admin" disabled />
              </div>
              <div className="flex justify-end mt-6">
                <Button variant="primary">Save Changes</Button>
              </div>
            </Card>
          )}

          {tab === 'institute' && (
            <Card>
              <h3 className="font-display font-semibold mb-5">Institute Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Institute Name" defaultValue="Campus Track University" />
                <Input label="Institute Code" defaultValue="CTU-2026" />
                <Input label="Address" defaultValue="221 Meridian Ave, Springfield" containerClassName="sm:col-span-2" />
                <Input label="Contact Email" type="email" defaultValue="admin@campustrack.edu" />
                <Input label="Contact Phone" defaultValue="+1 (555) 200-0000" />
              </div>
              <div className="flex justify-end mt-6">
                <Button variant="primary">Save Changes</Button>
              </div>
            </Card>
          )}

          {tab === 'theme' && (
            <Card>
              <h3 className="font-display font-semibold mb-5">Appearance</h3>
              <div className="divide-y divide-[var(--color-border)]">
                <Toggle
                  label="Compact layout"
                  description="Reduce spacing across tables and cards"
                  checked={theme.compact}
                  onChange={(v) => setTheme((t) => ({ ...t, compact: v }))}
                />
                <Toggle
                  label="Interface animations"
                  description="Enable motion and transition effects"
                  checked={theme.animations}
                  onChange={(v) => setTheme((t) => ({ ...t, animations: v }))}
                />
              </div>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card>
              <h3 className="font-display font-semibold mb-5">Notification Preferences</h3>
              <div className="divide-y divide-[var(--color-border)]">
                <Toggle label="Email notifications" description="Receive updates via email" checked={notif.email} onChange={(v) => setNotif((n) => ({ ...n, email: v }))} />
                <Toggle label="Push notifications" description="Browser push alerts for urgent items" checked={notif.push} onChange={(v) => setNotif((n) => ({ ...n, push: v }))} />
                <Toggle label="SMS alerts" description="Text messages for critical notices only" checked={notif.sms} onChange={(v) => setNotif((n) => ({ ...n, sms: v }))} />
                <Toggle label="Weekly digest" description="Summary of activity every Monday" checked={notif.weeklyDigest} onChange={(v) => setNotif((n) => ({ ...n, weeklyDigest: v }))} />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
