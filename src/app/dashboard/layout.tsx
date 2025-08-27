import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/integrations/applauncher/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      {children}
    </div>
  )
}
