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

jest.mock("expo-notifications", () => {
  const actual = jest.requireActual("expo-notifications");
  return {
    ...actual,
    getPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted" })),
    cancelScheduledNotificationAsync: jest.fn(),
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

test("Notification removes correctly", async () => {
  jest.useFakeTimers();
  render(<App />);

  const titleInput = screen.getByTestId("input");
  const timePicker = screen.UNSAFE_getByType(DateTimePicker);
  const addBtn = screen.getByTestId("addBtn");

  const user = userEvent.setup();
  await user.type(titleInput, "Good Day!");
  act(() => {
    fireEvent(
      timePicker,
      "onChange",
      ...createDateTimeSetEvtParams(getNextMinuteCurrentTime())
    );
  });

  await user.press(addBtn);

  const removeBtn = screen.getByTestId("removeBtn");
  await user.press(removeBtn);

  expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalled();
});
