import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Cake, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { SHOP } from "@/lib/shop";
const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Shop Owner Sign In — Sweet Crumb" },
      { name: "description", content: "Sign in to manage cakes, categories, reviews and orders at Sweet Crumb." },
      { property: "og:title", content: "Shop Owner Sign In — Sweet Crumb" },
      { property: "og:description", content: "Manage your cake shop products, categories, reviews and orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ]
  }),
  component: AuthPage
});
function AuthPage() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin" });
  }, [user, loading, navigate]);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const { error: error2 } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin }
      });
      setBusy(false);
      if (error2) {
        toast.error(error2.message);
        return;
      }
      toast.success("Account created! You can sign in now.");
      setMode("signin");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/admin" });
  };
  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  };
  return <div className="grid min-h-screen place-items-center bg-blush px-5 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Back to shop
        </Link>
        <div className="rounded-3xl bg-card p-8 shadow-soft">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
              <Cake className="size-5" />
            </span>
            <div>
              <p className="font-display text-xl font-semibold text-chocolate">{SHOP.name}</p>
              <p className="text-xs font-bold tracking-widest text-primary uppercase">Shop Owner Access</p>
            </div>
          </div>

          <h1 className="font-display text-2xl font-semibold text-chocolate">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage cakes, categories, reviews and orders.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
    id="email"
    type="email"
    value={email}
    required
    className="h-11 rounded-xl"
    onChange={(e) => setEmail(e.target.value)}
  />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
    id="password"
    type="password"
    value={password}
    required
    minLength={6}
    className="h-11 rounded-xl"
    onChange={(e) => setPassword(e.target.value)}
  />
            </div>
            <Button type="submit" variant="rose" size="xl" className="w-full" disabled={busy}>
              {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="chocolate-outline" size="xl" className="w-full" onClick={google}>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
            <button
    className="font-bold text-primary hover:underline"
    onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
  >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>;
}
export {
  Route
};
