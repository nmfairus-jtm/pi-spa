import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { useEffect } from 'react'

export const Route = createFileRoute('/_protected')({
  component: ProtectedLayout,
})

function ProtectedLayout() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isPending && !session) {
      navigate({ to: '/login' })
    }
  }, [session, isPending, navigate])

  if (isPending) return <div>Loading...</div>
  if (!session) return null

  return <Outlet />
}
