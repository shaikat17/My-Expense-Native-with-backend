import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
          headerTitleStyle: {
            color: "#fff",
            fontSize: 20,
            fontWeight: "600",
          },
          headerTintColor: "#fff",
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: "#0a7ea4",
          },
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          title: "Change Password",
          headerTitleStyle: {
            color: "#fff",
            fontSize: 20,
            fontWeight: "600",
          },
          headerTintColor: "#fff",
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: "#0a7ea4",
          },
        }}
      />
    </Stack>
  );
}
