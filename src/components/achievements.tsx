
import { useAchievements } from "@/hooks/use-achievements"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Award, Star, Calendar, Beaker, Lock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function Achievements() {
  const { achievements, userAchievements, loading } = useAchievements()
  const { session } = useAuth()
  
  if (loading) {
    return <div className="text-center p-4">Loading achievements...</div>
  }
  
  if (!session.user) {
    return null
  }

  const getAchievementIcon = (icon: string | null) => {
    switch (icon) {
      case 'trophy':
        return <Trophy className="h-5 w-5" />
      case 'award':
        return <Award className="h-5 w-5" />
      case 'star':
        return <Star className="h-5 w-5" />
      case 'calendar':
        return <Calendar className="h-5 w-5" />
      case 'flask':
        return <Beaker className="h-5 w-5" />
      default:
        return <Trophy className="h-5 w-5" />
    }
  }

  const isAchievementUnlocked = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Achievements</CardTitle>
        <CardDescription>Unlock achievements by playing the game</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {achievements.map(achievement => {
            const unlocked = isAchievementUnlocked(achievement.id)
            
            return (
              <div 
                key={achievement.id} 
                className={`flex items-center gap-3 p-2 rounded-md border ${
                  unlocked 
                    ? 'bg-accent/30 border-accent' 
                    : 'bg-muted/30 border-muted text-muted-foreground'
                }`}
              >
                <div className={`p-1.5 rounded-full ${
                  unlocked ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {unlocked 
                    ? getAchievementIcon(achievement.icon)
                    : <Lock className="h-5 w-5" />
                  }
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{achievement.name}</h4>
                  <p className="text-xs">{achievement.description}</p>
                </div>
                {unlocked && (
                  <Badge variant="outline" className="bg-primary/10">Unlocked</Badge>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
