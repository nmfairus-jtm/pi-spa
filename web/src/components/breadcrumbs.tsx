import { useMatches, Link } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'

const labels: Record<string, string> = {
  '/': 'Home',
  '/_protected/dashboard': 'Dashboard',
}

export function Breadcrumbs() {
  const matches = useMatches()
  const visible = matches.filter(
    (m, i) => m.routeId !== '__root__' && (i === 0 || m.pathname !== matches[i - 1].pathname),
  )

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {visible.map((m, i) => {
          const isLast = i === visible.length - 1
          const label =
            labels[m.routeId] ||
            (m.routeId.split('/').pop()?.replace(/-/g, ' ') ?? '')

          return (
            <BreadcrumbItem key={m.routeId}>
              {!isLast ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link to={m.pathname}>{label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
