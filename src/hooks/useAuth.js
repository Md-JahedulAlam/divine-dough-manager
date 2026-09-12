import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
function useAuth() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const checkRole = async (u) => {
      if (!u) {
        if (active) setIsAdmin(false);
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.id).eq("role", "admin").maybeSingle();
      if (active) setIsAdmin(!!data);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setTimeout(() => checkRole(s?.user ?? null).finally(() => active && setLoading(false)), 0);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      checkRole(s?.user ?? null).finally(() => active && setLoading(false));
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);
  const signOut = () => supabase.auth.signOut();
  return { session, user, isAdmin, loading, signOut };
}
export {
  useAuth
};
