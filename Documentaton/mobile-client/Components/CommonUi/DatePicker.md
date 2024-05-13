## DatePickerComponent

The `DatePickerComponent` component is used to display a date picker for selecting dates. It utilizes the `DateTimePicker` component from `@react-native-community/datetimepicker` library.

### Props

- **value**: The current selected date value.
- **setDate**: A function to update the selected date value.

### Usage

```tsx
<DatePickerComponent
    value={selectedDate}
    setDate={setSelectedDate}
/>