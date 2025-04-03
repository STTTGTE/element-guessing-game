
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export function DebugPanel() {
  const { session } = useAuth();
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'auth' | 'db' | 'config'>('auth');
  const [dbDebugData, setDbDebugData] = useState<Record<string, any>>({});

  // Toggle debug panel visibility
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // Fetch database debug data
  const fetchDbDebugData = async () => {
    if (!session.user) return;

    try {
      // Try to fetch profile data if it exists
      let profileData = null;
      try {
        // Use a generic approach that doesn't rely on typed tables
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${session.user.id}&select=*`,
          {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${session.user.id}`, // Fixed: removed session.session
            },
          }
        );
        if (response.ok) {
          profileData = await response.json();
        }
      } catch (error) {
        console.log('No profiles table or no profile found:', error);
      }

      // Try to fetch matchmaking data if it exists
      let matchmakingData = null;
      try {
        const { data, error } = await supabase
          .from('matchmaking')
          .select('*')
          .eq('user_id', session.user.id);
          
        if (!error) {
          matchmakingData = data;
        }
      } catch (error) {
        console.log('No matchmaking table or no matchmaking data found:', error);
      }

      // Try to fetch active matches if they exist
      let matchesData = null;
      try {
        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .or(`player1_id.eq.${session.user.id},player2_id.eq.${session.user.id}`)
          .eq('status', 'active');
          
        if (!error) {
          matchesData = data;
        }
      } catch (error) {
        console.log('No matches table or no matches found:', error);
      }

      setDbDebugData({
        profile: profileData,
        matchmaking: matchmakingData,
        matches: matchesData
      });
    } catch (error) {
      console.error('Error fetching debug data:', error);
    }
  };

  // Fetch debug data when the component mounts and when the active tab changes
  useEffect(() => {
    if (activeTab === 'db' && session.user) {
      fetchDbDebugData();
    }
  }, [activeTab, session.user]);

  if (!visible) {
    return (
      <Button
        variant="outline"
        className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100"
        onClick={toggleVisibility}
      >
        Debug
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-auto bg-background shadow-lg rounded-lg border">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Debug Panel</h2>
          <Button variant="ghost" size="sm" onClick={toggleVisibility}>
            Close
          </Button>
        </div>

        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === 'auth' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('auth')}
          >
            Auth
          </Button>
          <Button
            variant={activeTab === 'db' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('db')}
          >
            Database
          </Button>
          <Button
            variant={activeTab === 'config' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('config')}
          >
            Config
          </Button>
        </div>

        <Separator className="my-2" />

        {activeTab === 'auth' && (
          <div className="space-y-2">
            <h3 className="font-medium">Authentication State</h3>
            <div className="bg-muted p-2 rounded text-xs overflow-auto max-h-60">
              <pre>{JSON.stringify(session, null, 2)}</pre>
            </div>
          </div>
        )}

        {activeTab === 'db' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Database State</h3>
              <Button size="sm" variant="outline" onClick={fetchDbDebugData}>
                Refresh Data
              </Button>
            </div>

            {Object.entries(dbDebugData).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center">
                  <h4 className="font-medium text-sm">{key}</h4>
                  {value ? (
                    <Badge variant="outline" className="ml-2">
                      {Array.isArray(value) ? value.length : 1} record(s)
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="ml-2 text-muted-foreground">
                      No data
                    </Badge>
                  )}
                </div>
                <div className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
                  <pre>{JSON.stringify(value, null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-2">
            <h3 className="font-medium">Config</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Environment:</span>{' '}
                <Badge variant="outline">
                  {import.meta.env.MODE || 'development'}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">API URL:</span>{' '}
                <span className="text-sm text-muted-foreground">
                  {import.meta.env.VITE_SUPABASE_URL ? '[Set]' : '[Not Set]'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
