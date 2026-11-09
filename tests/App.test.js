import { render, screen } from "@testing-library/react-native";
import * as Notifications from "expo-notifications";
import App from "../App";

jest.mock("expo-notifications", (act) => {
  const actual = jest.requireActual("expo-notifications");
  return {
    ...actual,
    getPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted" })),
    scheduleNotificationAsync: () => {
      return Promise.resolve("notificationId");
    },
  };
});

test("Main title is on the screen", () => {
  render(<App />);
  const title = screen.getByText("Countdowns");

  expect(title).toBeOnTheScreen();
});
