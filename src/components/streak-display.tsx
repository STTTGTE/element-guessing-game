
import { useStreaks } from "@/hooks/use-streaks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function StreakDisplay() {
  const { userStreak, loading } = useStreaks()
  const { session } = useAuth()
  
  if (loading) {
    return <div className="text-center py-2">Loading streak...</div>
  }
  
  if (!session.user || !userStreak) {
    return null
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
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
