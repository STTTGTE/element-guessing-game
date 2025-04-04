import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { type GameHistory as GameHistoryType, supabase } from "@/lib/supabase"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function GameHistory() {
  const { session } = useAuth()
  const [history, setHistory] = useState<GameHistoryType[]>([])
  const [loading, setLoading] = useState(true)

  const fetchHistory = useCallback(async () => {
    try {
      if (!session.user?.id) return
      
      // Use a direct query with explicit type casting to avoid TypeScript issues
      const { data, error } = await supabase
        .from('game_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error

      setHistory(data as unknown as GameHistoryType[])
    } catch (error) {
      console.error('Error fetching game history:', error)
    } finally {
      setLoading(false)
    }
  }, [session.user?.id])

  useEffect(() => {
    if (session.user) {
      fetchHistory()
    }
  }, [session.user, fetchHistory])

  if (loading) {
    return <div className="text-foreground">Loading history...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Recent Games</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Date</TableHead>
              <TableHead className="text-foreground">Mode</TableHead>
              <TableHead className="text-foreground">Score</TableHead>
              <TableHead className="text-foreground">Questions</TableHead>
              <TableHead className="text-foreground">Accuracy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((game) => (
              <TableRow key={game.id}>
                <TableCell className="text-foreground">
                  {new Date(game.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {game.game_type === 'multiplayer' ? (
                    <Badge variant="secondary">Multiplayer</Badge>
                  ) : (
                    <Badge variant="outline">Single</Badge>
                  )}
                </TableCell>
                <TableCell className="text-foreground">{game.score}</TableCell>
                <TableCell className="text-foreground">{game.total_questions}</TableCell>
                <TableCell className="text-foreground">
                  {Math.round((game.score / game.total_questions) * 100)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
