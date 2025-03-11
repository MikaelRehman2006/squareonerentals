/**
 * Form Styling Utility
 * 
 * This file provides standardized CSS class names for form elements
 * throughout the application to ensure consistent styling.
 */

export const formStyles = {
  // Container styles
  container: "container mx-auto px-4 py-8 max-w-5xl",
  formCard: "shadow-md",
  formContent: "space-y-8",
  formSection: "space-y-6",
  
  // Form layout styles
  twoColumnGrid: "grid grid-cols-1 md:grid-cols-2 gap-5",
  threeColumnGrid: "grid grid-cols-1 md:grid-cols-3 gap-5",
  amenitiesGrid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
  
  // Typography
  sectionTitle: "text-lg font-medium mb-4",
  label: "text-base font-medium",
  
  // Spacing
  inputSpacing: "mt-1.5",
  sectionDivider: "border-t pt-6 mt-6",
  checkboxContainer: "flex items-center space-x-3",
  
  // Buttons
  buttonContainer: "flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t",
  button: "sm:min-w-28",
  
  // Form elements
  checkbox: "h-5 w-5",
  
  // Utility classes for consistent display
  flexRow: "flex flex-row items-center gap-3",
  flexBetween: "flex justify-between items-center",
};

/**
 * This function combines multiple class names from the formStyles object
 * @param styles - Array of keys from the formStyles object
 * @returns Combined class names string
 */
export const getFormStyles = (...styles: (keyof typeof formStyles)[]) => {
  return styles.map(style => formStyles[style]).join(' ');
}; 