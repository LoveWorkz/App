export type DayBlock = {
  day: string;
  time: Date;
  dropdownValue: string | null;
  showTimePicker?: boolean;
};

export type DropdownOptions = {
  label: string;
  value: string;
}