export type DayBlock = {
  day: string;
  time: Date;
  dropdownValue: number;
  showTimePicker?: boolean;
  scheduleNotificationId?: string;
};

export type DropdownOptions = {
  label: string;
  value: number;
}