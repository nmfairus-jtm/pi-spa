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
import {
  UserIcon,
  LockIcon,
  ShieldIcon,
  MonitorIcon,
  KeyIcon,
  LinkIcon,
  Trash2Icon,
  CopyIcon,
  CheckIcon,
  CalendarDaysIcon,
  MailIcon,
  FingerprintIcon,
  MailPlusIcon,
  Loader2Icon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
  const [copiedId, setCopiedId] = useState(false)
  const [sendingVerification, setSendingVerification] = useState(false)

  if (!user) return null

  const copyId = () => {
    navigator.clipboard.writeText(user.id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

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

  const handleSendVerification = async () => {
    setSendingVerification(true)
    const { error } = await authClient.sendVerificationEmail({
      email: user.email,
      callbackURL: '/account',
    })
    if (error) {
      toast.error(error.message || 'Failed to send verification email')
    } else {
      toast.success('Verification email sent.')
    }
    setSendingVerification(false)
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
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <CalendarDaysIcon className="size-4" />
                  Member Since
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <MailIcon className="size-4" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm truncate">{user.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                    {user.emailVerified ? 'Verified' : 'Not verified'}
                  </Badge>
                  {!user.emailVerified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-6"
                            disabled={sendingVerification}
                            onClick={handleSendVerification}
                          >
                            {sendingVerification ? (
                              <Loader2Icon className="size-3 animate-spin" />
                            ) : (
                              <MailPlusIcon className="size-3" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Send verification email</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <FingerprintIcon className="size-4" />
                  Account ID
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <p className="flex-1 truncate text-xs font-mono text-muted-foreground">
                    {user.id}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={copyId}
                  >
                    {copiedId ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="flex-1 rounded-xl">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile">
                <TabsList variant="line" className="w-full gap-1 overflow-x-auto md:overflow-visible">
                  <TabsTrigger value="profile" className="shrink-0 whitespace-nowrap md:flex-1"><UserIcon /> Profile</TabsTrigger>
                  <TabsTrigger value="password" className="shrink-0 whitespace-nowrap md:flex-1"><LockIcon /> Password</TabsTrigger>
                  <TabsTrigger value="two-factor" className="shrink-0 whitespace-nowrap md:flex-1"><ShieldIcon /> Two-Factor</TabsTrigger>
                  <TabsTrigger value="sessions" className="shrink-0 whitespace-nowrap md:flex-1"><MonitorIcon /> Sessions</TabsTrigger>
                  <TabsTrigger value="passkeys" className="shrink-0 whitespace-nowrap md:flex-1"><KeyIcon /> Passkeys</TabsTrigger>
                  <TabsTrigger value="linking" className="shrink-0 whitespace-nowrap md:flex-1"><LinkIcon /> Account Linking</TabsTrigger>
                  <TabsTrigger value="delete" className="shrink-0 whitespace-nowrap md:flex-1"><Trash2Icon /> Delete</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-6 pt-4">
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
                <TabsContent value="password" className="space-y-6 pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <LockIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">
                        Update your password to keep your account secure.
                      </p>
                    </div>
                  </div>
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
                <TabsContent value="two-factor" className="space-y-6 pt-4">
                  <div className="flex flex-col items-center gap-4 py-8 md:py-16 text-center">
                    <ShieldIcon className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <p className="mt-1 text-sm text-muted-foreground max-w-md">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                    </div>
                    <Button disabled>Enable Two-Factor</Button>
                  </div>
                </TabsContent>
                <TabsContent value="sessions" className="space-y-6 pt-4">
                  <div className="flex flex-col items-center gap-4 py-8 md:py-16 text-center">
                    <MonitorIcon className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">Active Sessions</h3>
                      <p className="mt-1 text-sm text-muted-foreground max-w-md">
                        Manage your active sessions and sign out of other devices.
                      </p>
                    </div>
                    <Button disabled>Manage Sessions</Button>
                  </div>
                </TabsContent>
                <TabsContent value="passkeys" className="space-y-6 pt-4">
                  <div className="flex flex-col items-center gap-4 py-8 md:py-16 text-center">
                    <KeyIcon className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">Passkeys</h3>
                      <p className="mt-1 text-sm text-muted-foreground max-w-md">
                        Use passkeys for a passwordless and secure sign-in experience.
                      </p>
                    </div>
                    <Button disabled>Add Passkey</Button>
                  </div>
                </TabsContent>
                <TabsContent value="linking" className="space-y-6 pt-4">
                  <div className="flex flex-col items-center gap-4 py-8 md:py-16 text-center">
                    <LinkIcon className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">Account Linking</h3>
                      <p className="mt-1 text-sm text-muted-foreground max-w-md">
                        Link your social accounts for quick sign-in without a password.
                      </p>
                    </div>
                    <Button disabled>Link Account</Button>
                  </div>
                </TabsContent>
                <TabsContent value="delete" className="space-y-6 pt-4">
                  <div className="flex flex-col items-center gap-4 py-8 md:py-16 text-center">
                    <Trash2Icon className="h-12 w-12 text-destructive" />
                    <div>
                      <h3 className="text-lg font-medium">Delete Account</h3>
                      <p className="mt-1 text-sm text-muted-foreground max-w-md">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive" disabled>Delete Account</Button>
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
