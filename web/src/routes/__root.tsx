import { TooltipProvider } from '#/components/ui/tooltip'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
      <TanStackRouterDevtools />
    </>
  )
}
