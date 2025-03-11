# CSS Styling Guidelines for Square One Rentals

This document outlines the CSS styling standards for the Square One Rentals application to ensure consistency across all components.

## Form Layout and Styling

### Spacing

- Use `gap-5` for grid layouts
- Use `space-y-6` for vertical spacing between form sections
- Use `mt-1.5` for spacing between labels and inputs
- Use `space-x-3` for horizontal spacing in checkbox/label groups

### Typography

- Form labels must use `className="text-base font-medium"`
- Section headings should use `className="text-lg font-medium mb-4"`

### Layout

- Containers should include max-width constraints: `max-w-5xl`
- Use responsive grid layouts:
  - Two columns: `grid grid-cols-1 md:grid-cols-2 gap-5`
  - Three columns: `grid grid-cols-1 md:grid-cols-3 gap-5`
  - For checkbox groups: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`

### Form Elements

- Checkboxes must use `className="h-5 w-5"` for consistent sizing
- All checkbox/label groups should use `className="flex items-center space-x-3"`
- Section dividers must use `className="border-t pt-6 mt-6"`
- Buttons should use `className="sm:min-w-28"` for consistent width

### Utility Classes

- For consistent reuse, import the `formStyles` object from `src/components/ui/form-styles.tsx`
- Example usage: `className={getFormStyles('label', 'inputSpacing')}`

## Common Patterns

### Checkbox Groups

```jsx
<div className="flex items-center space-x-3">
  <Checkbox
    id="exampleId"
    checked={booleanValue}
    onCheckedChange={(checked) => handleChange(checked)}
    className="h-5 w-5"
  />
  <Label htmlFor="exampleId" className="text-base font-medium">
    Label Text
  </Label>
</div>
```

### Section Dividers

```jsx
<div className="border-t pt-6 mt-6">
  <h3 className="text-lg font-medium mb-4">Section Title</h3>
  {/* Section content */}
</div>
```

### Form Fields with Labels

```jsx
<div>
  <Label htmlFor="fieldId" className="text-base font-medium">
    Field Label
  </Label>
  <Input
    id="fieldId"
    name="fieldName"
    value={value}
    onChange={handleChange}
    className="mt-1.5"
  />
</div>
```

## Component Library Usage

- Always use ShadCN components for UI elements
- Customize ShadCN components through their variants rather than direct CSS overrides
- For any new UI patterns, check if a ShadCN component exists before creating custom solutions

## Responsive Design

- Mobile-first approach is required for all components
- Use standard breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

## Consistency Checklist

Before submitting a PR, check that:

- All labels use `text-base font-medium`
- All inputs include `mt-1.5` for spacing
- All checkboxes use `h-5 w-5` and are in flex containers
- Section dividers use `border-t pt-6 mt-6`
- Grid layouts follow the standard responsive patterns
- Buttons include proper sizing with `sm:min-w-28`

For any new components, consider adding standardized styles to the `formStyles` utility.
