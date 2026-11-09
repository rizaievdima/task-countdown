import {
  render,
  screen,
  userEvent,
  act,
  fireEvent,
} from "@testing-library/react-native";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import App from "../App";
import { getNextMinuteCurrentTime } from "../utils.js/time";

jest.mock("expo-notifications", (act) => {
  const actual = jest.requireActual("expo-notifications");
  return {
    ...actual,
    getPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted" })),
    scheduleNotificationAsync: jest.fn(() => Promise.resolve("notificationId")),
  };
});

const createDateTimeSetEvtParams = (date) => {
  return [
    {
      type: "set",
      nativeEvent: {
        timestamp: date.getTime(),
      },
    },
    date,
  ];
};

test("Notification sends correctly", async () => {
  jest.useFakeTimers();
  render(<App />);

  const titleInput = screen.getByTestId("input");
  const timePicker = screen.UNSAFE_getByType(DateTimePicker);

  expect(titleInput).toBeOnTheScreen();
  expect(timePicker).toBeDefined();

  const user = userEvent.setup();
  await user.type(titleInput, "Good Day!");

  // Fire the onChange Event
  act(() => {
    fireEvent(
      timePicker,
      "onChange",
      ...createDateTimeSetEvtParams(getNextMinuteCurrentTime())
    );
  });

  const addBtn = screen.getByTestId("addBtn");
  expect(addBtn).toBeOnTheScreen();

  await user.press(addBtn);
  act(jest.runAllTimers);

  expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  const scheduleResult =
    Notifications.scheduleNotificationAsync.mock.results[0].value;
  await expect(scheduleResult).resolves.toEqual("notificationId");
});
