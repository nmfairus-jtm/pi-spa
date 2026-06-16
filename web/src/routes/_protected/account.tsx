import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'
import { AppSidebar } from '@/components/app-sidebar'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Field,
  FieldContent,
  FieldLabel,
} from '@/components/ui/field'
import { toast } from 'sonner'

export const Route = createFileRoute('/_protected/account')({
  component: AccountPage,
})

function AccountPage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [name, setName] = useState(user?.name ?? '')
  const [avatarUrl, setAvatarUrl] = useState(user?.image ?? '')
  const [saving, setSaving] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  if (!user) return null

  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleSaveProfile = async () => {
    setSaving(true)
    const { error } = await authClient.updateUser({
      name,
      image: avatarUrl || undefined,
    })
    if (error) {
      toast.error(error.message || 'Failed to update profile')
    } else {
      toast.success('Profile updated successfully.')
    }
    setSaving(false)
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setChangingPassword(true)
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    })
    if (error) {
      toast.error(error.message || 'Failed to change password')
    } else {
      toast.success('Password changed successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setChangingPassword(false)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card className="aspect-video" />
            <Card className="aspect-video" />
            <Card className="aspect-video" />
          </div>
          <Card className="flex-1 rounded-xl">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={avatarUrl || undefined} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Field>
                      <FieldLabel>Name</FieldLabel>
                      <FieldContent>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Avatar URL</FieldLabel>
                      <FieldContent>
                        <Input
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <FieldContent>
                        <Input value={user.email} disabled />
                      </FieldContent>
                    </Field>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="password" className="space-y-6">
                  <div className="space-y-4">
                    <Field>
                      <FieldLabel>Current Password</FieldLabel>
                      <FieldContent>
                        <Input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>New Password</FieldLabel>
                      <FieldContent>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Confirm New Password</FieldLabel>
                      <FieldContent>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </FieldContent>
                    </Field>
                    <Button
                      onClick={handleChangePassword}
                      disabled={changingPassword}
                    >
                      {changingPassword ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
