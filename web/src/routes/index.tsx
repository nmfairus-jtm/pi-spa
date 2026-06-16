import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isPending && session) {
      navigate({ to: '/dashboard' })
    }
  }, [session, isPending, navigate])

  if (isPending) return null

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-8">
      <h1 className="text-4xl font-bold">Pi SPA</h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-md text-center">
        A modern single-page application built with TanStack Router and Better Auth.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          to="/signup"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
