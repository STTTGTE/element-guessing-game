
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

export function DebugPanel() {
  const { session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<Record<string, any>>({});
  const [isChecking, setIsChecking] = useState(false);

  const checkTables = async () => {
    setIsChecking(true);
    const results: Record<string, any> = {};

    try {
      // Check profiles table
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('count')
          .single();
        
        results.profiles = {
          exists: !profilesError,
          count: profilesData?.count ?? 0,
          error: profilesError ? `${profilesError.code}: ${profilesError.message}` : null
        };
      } catch (err) {
        results.profiles = {
          exists: false,
          count: 0,
          error: err instanceof Error ? err.message : String(err)
        };
      }

      // Check matchmaking table
      try {
        const { data: matchmakingData, error: matchmakingError } = await supabase
          .from('matchmaking')
          .select('count')
          .single();
        
        results.matchmaking = {
          exists: !matchmakingError,
          count: matchmakingData?.count ?? 0,
          error: matchmakingError ? `${matchmakingError.code}: ${matchmakingError.message}` : null
        };
      } catch (err) {
        results.matchmaking = {
          exists: false,
          count: 0,
          error: err instanceof Error ? err.message : String(err)
        };
      }

      // Check matches table
      try {
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('count')
          .single();
        
        results.matches = {
          exists: !matchesError,
          count: matchesData?.count ?? 0,
          error: matchesError ? `${matchesError.code}: ${matchesError.message}` : null
        };
      } catch (err) {
        results.matches = {
          exists: false,
          count: 0,
          error: err instanceof Error ? err.message : String(err)
        };
      }

      setDbStatus(results);
    } catch (error) {
      console.error('Error checking tables:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 shadow-lg z-50 opacity-90 hover:opacity-100 transition-opacity">
      <CardHeader className="p-3">
        <CardTitle className="text-sm flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          Debug Panel
          <span>{isOpen ? '▲' : '▼'}</span>
        </CardTitle>
      </CardHeader>
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <CardContent className="p-3 pt-0 text-xs">
            <div className="mb-2">
              <div className="font-bold">Auth Status:</div>
              <div className="ml-2">
                <div>Loading: {session.loading ? 'true' : 'false'}</div>
                <div>User: {session.user ? session.user.id : 'null'}</div>
                <div>Profile: {session.profile ? 'exists' : 'null'}</div>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="font-bold">Database Tables:</div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-6 mt-1"
                onClick={checkTables}
                disabled={isChecking}
              >
                {isChecking ? 'Checking...' : 'Check Tables'}
              </Button>
              
              {Object.keys(dbStatus).length > 0 && (
                <div className="ml-2 mt-2">
                  {Object.entries(dbStatus).map(([table, status]) => (
                    <div key={table} className="mb-1">
                      <div>{table}: {(status as any).exists ? '✅' : '❌'}</div>
                      {(status as any).exists && (
                        <div className="ml-2">Count: {(status as any).count}</div>
                      )}
                      {(status as any).error && (
                        <div className="ml-2 text-red-500">{(status as any).error}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
