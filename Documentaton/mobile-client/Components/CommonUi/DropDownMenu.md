## DropdownMenu

The `DropdownMenu` component provides a dropdown menu functionality for selecting options from a list.

### Props

- **options**: An array of string options to be displayed in the dropdown menu.
- **setOption**: A function to update the selected option.
- **value**: The currently selected option.

### Usage

```tsx
<DropdownMenu
    options={['Option 1', 'Option 2', 'Option 3']}
    setOption={setSelectedOption}
    value={selectedOption}
/>