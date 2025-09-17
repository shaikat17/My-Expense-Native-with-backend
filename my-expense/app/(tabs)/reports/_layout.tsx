

import { Stack } from "expo-router";
export default function ReportsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Reports Overview", headerShown: false }
        }
      />
      <Stack.Screen
        name="monthly-report"
        options={{ title: "Monthly Report" }}
      />
      <Stack.Screen
        name="yearly-report"
        options={{ title: "Yearly Report" }}
      />
    </Stack>
  );
}

