import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session?.user);
      setLoading(false);
    };
    checkAuth();
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session?.user);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;
  if (!authenticated) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute; 