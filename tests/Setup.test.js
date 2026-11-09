import { render } from "@testing-library/react-native";
import * as Notifications from "expo-notifications";
import App from "../App";

jest.mock("expo-notifications", () => {
  const actual = jest.requireActual("expo-notifications");
  return {
    ...actual,
    getPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted" })),
    setNotificationHandler: jest.fn(),
  };
});

test("Setup notifications invokes", () => {
  render(<App />);
  expect(Notifications.setNotificationHandler).toHaveBeenCalledTimes(1);
});
