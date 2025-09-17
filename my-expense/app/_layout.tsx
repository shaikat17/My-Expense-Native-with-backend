import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";

function RootLayoutInner() {
  const { loading, auth: { user } } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Are we in the /auth/* segment?
  const inAuthGroup = segments[0] === "auth";

  useEffect(() => {
    if (!loading && !user && !inAuthGroup) {
      // if not logged in & not on /auth/* page → redirect to login
      router.replace("/auth/login");
    }
  }, [loading, user, inAuthGroup]);

  // While loading user from storage
  if (loading) return <Loading />;

  // Show loading placeholder while redirecting
  if (!user && !inAuthGroup) return <Loading />;

  // Otherwise render normal app
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This tells Expo Router to render all nested screens */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* The auth group automatically handled at /auth/* */}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}
