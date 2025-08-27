import { notFound } from 'next/navigation'
import { getUserByUsername } from '@/integrations/applauncher/auth'
import { getTheme, listLinks } from '@/integrations/applauncher/db'
import UserProfileClient from './UserProfileClient'
import type { Metadata } from 'next'



export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  try {
    const user = await getUserByUsername(params.username)

    if (!user) {
      return {
        title: 'User Not Found',
        description: 'The requested user profile could not be found.',
      }
    }

    const title = user.displayName ? `${user.displayName} (@${user.username})` : `@${user.username}`
    const description = user.bio || `Check out ${user.displayName || user.username}'s links and connect with them.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'profile',
        images: [
          {
            url: user.avatar || '/default-avatar.png',
            width: 1200,
            height: 630,
            alt: `${user.displayName || user.username}'s profile`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [user.avatar || '/default-avatar.png'],
      },
    }
  } catch {
    return {
      title: 'Profile',
      description: 'User profile page',
    }
  }
}

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  try {
    const user = await getUserByUsername(params.username)

    if (!user) {
      notFound()
    }

    // Load theme and links in parallel
    const [theme, links] = await Promise.all([
      getTheme(user.id),
      listLinks(user.id)
    ])

    const sortedLinks = links.sort((a, b) => a.order - b.order)

    return (
      <UserProfileClient
        user={user}
        theme={theme}
        links={sortedLinks}
        username={params.username}
      />
    )
  } catch (error) {
    console.error('Failed to load user data:', error)
    notFound()
  }
}
