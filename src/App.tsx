import React, { useEffect, useState, type JSX } from "react";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { getCurrentUser } from "./lib/auth";
import type { MockUser } from "./lib/auth";

type Route = "signin" | "signup" | "dashboard";

export default function App(): JSX.Element {
  const [route, setRoute] = useState<Route>(() => (getCurrentUser() ? "dashboard" : "signin"));
  const [user, setUser] = useState<MockUser | null>(() => getCurrentUser());

  useEffect(() => {
    if (user) setRoute("dashboard");
  }, [user]);

  const handleSignedIn = (u: MockUser) => {
    setUser(u);
    setRoute("dashboard");
  };

  const handleSignOut = () => {
    setUser(null);
    setRoute("signin");
  };

  if (route === "signin") {
    return <SignIn onSignedIn={handleSignedIn} onGoToSignup={() => setRoute("signup")} />;
  }

  if (route === "signup") {
    return <SignUp onSignedUp={handleSignedIn} onBack={() => setRoute("signin")} />;
  }

  return <Dashboard currentUser={user} onLogout={handleSignOut} onLanding={() => setRoute("signin")} />;
}