
import { useStreaks } from "@/hooks/use-streaks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, AlertTriangle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export function StreakDisplay() {
  const { userStreak, loading, error } = useStreaks()
  const { session } = useAuth()
  
  if (!session.user) {
    return null
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Daily Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4 text-center gap-2">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <p className="text-muted-foreground">Failed to load streak information</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Daily Streak</CardTitle>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-4 w-36 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!userStreak) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Daily Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Play a game to start your streak!
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Daily Streak</CardTitle>
          <div className="flex items-center gap-1 text-amber-500">
            <Flame className="h-5 w-5 fill-amber-500 text-amber-500" />
            <span className="font-bold text-xl">{userStreak.current_streak}</span>
          </div>
        </div>
        <CardDescription>
          Last played: {formatDate(userStreak.last_played)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current streak</span>
            <span className="font-medium">{userStreak.current_streak} {userStreak.current_streak === 1 ? 'day' : 'days'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Best streak</span>
            <span className="font-medium">{userStreak.max_streak} {userStreak.max_streak === 1 ? 'day' : 'days'}</span>
          </div>
          <div className="pt-2 text-xs text-muted-foreground">
            Play every day to keep your streak going!
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
