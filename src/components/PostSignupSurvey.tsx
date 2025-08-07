'use client'; // Enable client-side rendering for this component

import { useState, useEffect } from 'react'; // Import React hooks for state management and side effects
import { useSession } from 'next-auth/react'; // Import NextAuth session hook for user authentication
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'; // Import dialog components for modal functionality
import { Button } from '@/components/ui/button'; // Import button component
import { Checkbox } from '@/components/ui/checkbox'; // Import checkbox component for selections
import { Label } from '@/components/ui/label'; // Import label component for form labels
import { Input } from '@/components/ui/input'; // Import input component for text fields
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import select dropdown components
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Import tab components for navigation
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'; // Import command components for searchable dropdowns
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Import popover components for tooltips
import { toast } from 'sonner'; // Import toast notification library
import { CheckCircle2, Info, ChevronsUpDown, Loader2, X, UserCircle, Home, Search, DollarSign, XCircle } from 'lucide-react'; // Import Lucide React icons
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion for animations
import { cn } from '@/lib/utils'; // Import utility function for conditional class names

// User type definitions with icons and descriptions for the survey
const USER_TYPES = [ // Define array of user types with their properties
  { 
    id: 'realtor', // Unique identifier for realtor type
    label: 'Realtor', // Display label for realtor
    description: "I'm a realtor helping people buy, sell, or rent homes.", // Description text
    icon: <UserCircle className="h-6 w-6 text-blue-500" />, // Blue user circle icon for realtor
  },
  { 
    id: 'landlord', // Unique identifier for landlord type
    label: 'Landlord', // Display label for landlord
    description: "I own a property and want to rent it out.", // Description text
    icon: <Home className="h-6 w-6 text-green-500" />, // Green home icon for landlord
  },
  { 
    id: 'renter', // Unique identifier for renter type
    label: 'Looking to Rent', // Display label for renter
    description: "I'm searching for a great place to live.", // Description text
    icon: <Search className="h-6 w-6 text-purple-500" />, // Purple search icon for renter
  },
  { 
    id: 'buyer', // Unique identifier for buyer type
    label: 'Looking to Buy', // Display label for buyer
    description: "I'm looking to buy my next home.", // Description text
    icon: <DollarSign className="h-6 w-6 text-orange-500" />, // Orange dollar sign icon for buyer
  },
  {
    id: 'none', // Unique identifier for none/skip option
    label: 'None', // Display label for none option
    description: 'Skip this step for now (not recommended)', // Description text
    icon: <XCircle className="h-6 w-6 text-gray-400" />, // Gray X circle icon for none option
  }
];

// Canadian cities list for location selection
const CANADIAN_CITIES = [ // Define array of Canadian cities
  'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', // Major Canadian cities
  'Ottawa', 'Mississauga', 'Winnipeg', 'Quebec City', 'Hamilton', // More major cities
  'Brampton', 'Surrey', 'Kitchener', 'London', 'Windsor', 'Victoria', // Additional cities
  'Halifax', 'Oshawa', 'Gatineau', 'Saskatoon', 'Regina', "St. John's", // More cities
  'Barrie', 'Kelowna', 'Abbotsford', 'Sherbrooke', 'Guelph', 'Markham', // Additional cities
  'Kingston', 'Vaughan', 'Burlington', 'Oakville', 'Richmond Hill', // More cities
  'Waterloo', 'Ajax', 'Cambridge', 'Whitby', 'Milton', 'Pickering', // Additional cities
  'Thunder Bay', 'Brantford', 'Lethbridge', 'St. Catharines', 'Niagara Falls', // More cities
  'Coquitlam', 'Scarborough', 'Etobicoke', 'North York', 'Burnaby', 'Richmond', // Additional cities
  'Laval', 'Longueuil', 'Delta', 'Squamish', 'Whistler', 'Muskoka' // Final cities
];

// Form options for property details
const BEDROOM_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+']; // Array of bedroom count options
const BATHROOM_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+']; // Array of bathroom count options
const PRICE_RANGES = [ // Define array of price range objects
  { min: 0, max: 500000, label: 'Under $500,000' }, // Price range for under 500k
  { min: 500000, max: 1000000, label: '$500,000 - $1,000,000' }, // Price range for 500k-1M
  { min: 1000000, max: 2000000, label: '$1,000,000 - $2,000,000' }, // Price range for 1M-2M
  { min: 2000000, max: 5000000, label: '$2,000,000 - $5,000,000' }, // Price range for 2M-5M
  { min: 5000000, max: Infinity, label: 'Over $5,000,000' } // Price range for over 5M
];

// Areas served options for realtors/landlords
const AREAS_SERVED = [ // Define array of area options
  'Downtown', 'West End', 'East End', 'North', 'South', // Core area options
  'Suburbs', 'Metro Area', 'Rural', 'All Areas' // Additional area options
];

// Client types for realtors
const CLIENT_TYPES = [ // Define array of client type options
  'First-time Buyers', // First-time buyer clients
  'Investors', // Investor clients
  'Families', // Family clients
  'Students', // Student clients
  'Professionals', // Professional clients
  'Seniors', // Senior clients
  'All Types' // All client types option
];

// Form data interface for storing user preferences
interface FormData { // Define TypeScript interface for form data structure
  city: string; // City field as string
  customCity: string; // Custom city field as string
  bedrooms: string; // Bedrooms field for renter/buyer
  bathrooms: string; // Bathrooms field for renter/buyer
  bedroomsMin?: string; // Optional minimum bedrooms for realtor/landlord
  bedroomsMax?: string; // Optional maximum bedrooms for realtor/landlord
  bathroomsMin?: string; // Optional minimum bathrooms for realtor/landlord
  bathroomsMax?: string; // Optional maximum bathrooms for realtor/landlord
  priceRange: { // Price range object
    min: string; // Minimum price as string
    max: string; // Maximum price as string
  };
  propertyType: string; // Property type field
  moveInDate: string; // Move-in date field
  additionalRequirements: string; // Additional requirements field
  areasServed: string[]; // Areas served as array of strings
  clientTypes: string[]; // Client types as array of strings
  isAcceptingClients: boolean; // Boolean for accepting clients
  isForSelf: boolean; // Boolean for self-use
  isPreApproved: boolean; // Boolean for pre-approval status
  [key: string]: any; // Index signature for dynamic field access
}

// Default form data template for each user type
const getDefaultRoleForm = (): FormData => ({ // Function that returns default form data object
  city: '', // Empty string for city
  customCity: '', // Empty string for custom city
  bedrooms: '', // Empty string for bedrooms
  bathrooms: '', // Empty string for bathrooms
  bedroomsMin: '', // Empty string for minimum bedrooms
  bedroomsMax: '', // Empty string for maximum bedrooms
  bathroomsMin: '', // Empty string for minimum bathrooms
  bathroomsMax: '', // Empty string for maximum bathrooms
  priceRange: { min: '', max: '' }, // Empty price range object
  propertyType: '', // Empty string for property type
  moveInDate: '', // Empty string for move-in date
  additionalRequirements: '', // Empty string for additional requirements
  areasServed: [] as string[], // Empty array for areas served
  clientTypes: [] as string[], // Empty array for client types
  isAcceptingClients: false, // False for accepting clients
  isForSelf: true, // True for self-use
  isPreApproved: false, // False for pre-approval
});

// Step definitions for realtor/landlord multi-step form
const REALTOR_STEPS = [ // Define array of step names for realtor form
  'Property Details', // First step name
  'Areas Served', // Second step name
  'Preferred Client Types', // Third step name
  'Additional Info', // Fourth step name
];

// Main PostSignupSurvey component
export default function PostSignupSurvey() { // Define the main component function
  // Session management for user authentication
  const { data: session } = useSession(); // Get session data from NextAuth
  
  // Modal visibility state
  const [isOpen, setIsOpen] = useState(false); // State for modal open/close, initialized to false
  
  // User type selection state
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // State for selected user types, initialized as empty array
  const [currentType, setCurrentType] = useState<string>(''); // State for current active type, initialized as empty string
  
  // Form completion tracking
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({}); // State for tracking completed steps, initialized as empty object
  
  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false); // State for submission loading, initialized to false
  
  // City input management
  const [openCityPopover, setOpenCityPopover] = useState(false); // State for city popover open/close, initialized to false
  const [cityInput, setCityInput] = useState(''); // State for city input text, initialized as empty string
  const [cities, setCities] = useState<string[]>([]); // State for cities array, initialized as empty array
  
  // Store form data per role (realtor, landlord, renter, buyer)
  const [roleForms, setRoleForms] = useState<Record<string, FormData>>({}); // State for storing form data per role, initialized as empty object

  // Stepper state for realtor/landlord multi-step form
  const [realtorStep, setRealtorStep] = useState(0); // State for current step, initialized to 0

  // Clear any existing localStorage data when session changes
  useEffect(() => { // Effect hook that runs when session changes
    if (session?.user?.email) { // Check if session has user email
      // Clear any localStorage data that doesn't belong to the current user
      const keys = Object.keys(localStorage); // Get all localStorage keys
      keys.forEach(key => { // Loop through each key
        if (key.startsWith('survey_progress_') && key !== `survey_progress_${session.user.email}`) { // Check if key is survey progress but not for current user
          localStorage.removeItem(key); // Remove the localStorage item
        }
      });
    }
  }, [session?.user?.email]); // Dependency array with session user email

  // Cleanup function to clear all survey localStorage data
  const clearAllSurveyData = () => { // Define function to clear all survey data
    const keys = Object.keys(localStorage); // Get all localStorage keys
    keys.forEach(key => { // Loop through each key
      if (key.startsWith('survey_progress_')) { // Check if key starts with survey_progress_
        localStorage.removeItem(key); // Remove the localStorage item
      }
    });
  };

  // Clear all survey data when component unmounts or user changes
  useEffect(() => { // Effect hook for cleanup
    return () => { // Return cleanup function
      clearAllSurveyData(); // Call clear function
    };
  }, [session?.user?.email]); // Dependency array with session user email

  // Reset component state when user changes
  useEffect(() => { // Effect hook that runs when user changes
    if (session?.user?.email) { // Check if session has user email
      setSelectedTypes([]); // Reset selected types to empty array
      setCurrentType(''); // Reset current type to empty string
      setCompletedSteps({}); // Reset completed steps to empty object
      setRoleForms({}); // Reset role forms to empty object
      setCityInput(''); // Reset city input to empty string
      setCities([]); // Reset cities to empty array
    }
  }, [session?.user?.email]); // Dependency array with session user email

  // Load saved progress from localStorage
  useEffect(() => { // Effect hook to load saved progress
    if (session?.user?.email) { // Check if session has user email
      const savedProgress = localStorage.getItem(`survey_progress_${session.user.email}`); // Get saved progress from localStorage
      if (savedProgress) { // Check if saved progress exists
        try { // Try to parse the saved progress
          const { selectedTypes, currentType, roleForms, savedEmail } = JSON.parse(savedProgress); // Parse JSON and destructure
          // Only load the progress if it belongs to the current user
          if (savedEmail === session.user.email) { // Check if saved email matches current user
            setSelectedTypes(selectedTypes); // Set selected types from saved data
            setCurrentType(currentType); // Set current type from saved data
            setRoleForms(roleForms); // Set role forms from saved data
          } else { // If email doesn't match
            // Clear stale data
            localStorage.removeItem(`survey_progress_${session.user.email}`); // Remove stale localStorage item
          }
        } catch (error) { // Catch parsing errors
          // If parsing fails, clear the corrupted data
          localStorage.removeItem(`survey_progress_${session.user.email}`); // Remove corrupted localStorage item
        }
      }
    }
  }, [session]); // Dependency array with session

  // Save progress to localStorage whenever form state changes
  useEffect(() => { // Effect hook to save progress
    if (session?.user?.email) { // Check if session has user email
      localStorage.setItem(`survey_progress_${session.user.email}`, JSON.stringify({ // Save progress to localStorage
        selectedTypes, // Include selected types
        currentType, // Include current type
        roleForms, // Include role forms
        savedEmail: session.user.email // Add email to the saved data for verification
      }));
    }
  }, [selectedTypes, currentType, roleForms, session]); // Dependency array with form state and session

  // Check onboarding status and show survey if not completed
  useEffect(() => { // Effect hook to check onboarding status
    const checkOnboardingStatus = async () => { // Define async function to check status
      if (session?.user?.email) { // Check if session has user email
        try { // Try to check onboarding status
          console.log('🔍 Checking onboarding status for:', session.user.email);
          const response = await fetch('/api/user/preferences'); // Fetch user preferences from API
          const data = await response.json(); // Parse response as JSON
          console.log('📊 Onboarding status data:', data);
          console.log('✅ onboardingCompleted:', data.onboardingCompleted);
          
          if (!data.onboardingCompleted) { // Check if onboarding is not completed
            console.log('🚀 Opening survey - onboarding not completed');
            // Clear any existing localStorage data before opening the survey
            clearAllSurveyData(); // Clear existing data
            setIsOpen(true); // Open the survey modal
          } else {
            console.log('✅ Onboarding already completed, not opening survey');
          }
        } catch (error) { // Catch any errors
          console.error('Error checking onboarding status:', error); // Log error to console
        }
      }
    };

    checkOnboardingStatus(); // Call the async function
  }, [session]); // Dependency array with session

  // Toggle user type selection (multiple selection allowed)
  const handleTypeToggle = (typeId: string) => { // Define function to toggle user type selection
    setSelectedTypes(prev => // Update selected types state
      prev.includes(typeId) // Check if type is already selected
        ? prev.filter(id => id !== typeId) // If selected, remove it
        : [...prev, typeId] // If not selected, add it
    );
  };

  // When switching tabs, initialize form if not present
  useEffect(() => { // Effect hook for form initialization
    if (currentType && !roleForms[currentType]) { // Check if current type exists but no form data
      setRoleForms(prev => ({ ...prev, [currentType]: getDefaultRoleForm() })); // Initialize form with default data
    }
  }, [currentType]); // Dependency array with current type

  // When a user selects a role, initialize its form state if not present
  useEffect(() => { // Effect hook for role form initialization
    setRoleForms(prev => { // Update role forms state
      let updated = { ...prev }; // Create copy of previous state
      selectedTypes.forEach(type => { // Loop through selected types
        if (!updated[type]) { // Check if form doesn't exist for this type
          updated[type] = getDefaultRoleForm(); // Initialize with default form
        }
      });
      // Optionally, remove forms for unselected types
      Object.keys(updated).forEach(type => { // Loop through all form types
        if (!selectedTypes.includes(type)) { // Check if type is not selected
          delete updated[type]; // Remove form for unselected type
        }
      });
      return updated; // Return updated forms object
    });
  }, [selectedTypes]); // Dependency array with selected types

  // Helper to get/set current role's form data
  const currentForm = currentType ? roleForms[currentType] || getDefaultRoleForm() : getDefaultRoleForm(); // Get current form data or default
  const setCurrentForm = (form: FormData) => { // Define function to set current form
    if (!currentType) return; // Return early if no current type
    setRoleForms(prev => ({ ...prev, [currentType]: form })); // Update role forms with new form data
  };

  // Add city to list for current role
  const handleAddCity = () => { // Define function to add city
    const trimmed = cityInput.trim(); // Trim whitespace from city input
    if (trimmed && !(currentForm.city.split(',').map(c => c.trim()).includes(trimmed))) { // Check if trimmed input exists and is not already in list
      const updatedCities = [...(currentForm.city ? currentForm.city.split(',').map(c => c.trim()).filter(Boolean) : []), trimmed]; // Create updated cities array
      setCurrentForm({ ...currentForm, city: updatedCities.join(', ') }); // Update form with new city list
      setCities(updatedCities); // Update cities state
      setCityInput(''); // Clear city input
    }
  };
  
  // Remove city from list for current role
  const handleRemoveCity = (city: string) => { // Define function to remove city
    const updated = (currentForm.city ? currentForm.city.split(',').map(c => c.trim()).filter(Boolean) : []).filter(c => c !== city); // Filter out the city to remove
    setCurrentForm({ ...currentForm, city: updated.join(', ') }); // Update form with filtered city list
    setCities(updated); // Update cities state
  };

  // On mount or tab switch, load cities for current role
  useEffect(() => { // Effect hook to load cities
    if (currentForm.city) { // Check if current form has city data
      setCities(currentForm.city.split(',').map(c => c.trim()).filter(Boolean)); // Set cities from form data
    } else { // If no city data
      setCities([]); // Set cities to empty array
    }
    setCityInput(''); // Clear city input
  }, [currentType]); // Dependency array with current type

  // Update a field for the current role
  const handleFormChange = (field: string, value: any) => { // Define function to update form field
    setCurrentForm({ ...currentForm, [field]: value }); // Update current form with new field value
  };
  
  // Toggle array fields (areas served, client types)
  const handleArrayToggle = (field: keyof FormData, value: string) => { // Define function to toggle array fields
    const arr = (currentForm[field] as string[]) || []; // Get current array or empty array
    setCurrentForm({ // Update current form
      ...currentForm, // Spread existing form data
      [field]: arr.includes(value) // Check if value exists in array
        ? arr.filter((item: string) => item !== value) // If exists, remove it
        : [...arr, value] // If doesn't exist, add it
    });
  };

  // Check if current step is complete for validation
  const isStepComplete = (type: string) => { // Define function to check step completion
    switch (type) { // Switch based on type
      case 'realtor': // For realtor type
        return currentForm.city && currentForm.propertyType && currentForm.priceRange.min && currentForm.areasServed.length > 0; // Check required fields
      case 'landlord': // For landlord type
        return currentForm.city && currentForm.bedrooms && currentForm.bathrooms && currentForm.priceRange.min; // Check required fields
      case 'renter': // For renter type
        return currentForm.city && currentForm.bedrooms && currentForm.bathrooms && currentForm.priceRange.max && currentForm.moveInDate; // Check required fields
      case 'buyer': // For buyer type
        return currentForm.city && currentForm.bedrooms && currentForm.bathrooms && currentForm.priceRange.max; // Check required fields
      default: // Default case
        return false; // Return false for unknown types
    }
  };

  // Submit all form data to API
  const handleSubmit = async () => { // Define async function to submit form
    setIsSubmitting(true); // Set submitting state to true
    try { // Try to submit
      const preferences: Record<string, any> = {}; // Initialize preferences object
      selectedTypes.forEach(type => { // Loop through selected types
        const form = roleForms[type] || getDefaultRoleForm(); // Get form data for type
        if (["realtor", "landlord"].includes(type)) { // Check if type is realtor or landlord
          preferences[type] = { // Set preferences for realtor/landlord
            ...form, // Spread form data
            bedroomsMin: form.bedroomsMin, // Include min bedrooms
            bedroomsMax: form.bedroomsMax, // Include max bedrooms
            bathroomsMin: form.bathroomsMin, // Include min bathrooms
            bathroomsMax: form.bathroomsMax, // Include max bathrooms
            // Only include relevant fields
            city: form.city, // Include city
            customCity: form.customCity, // Include custom city
            priceRange: form.priceRange, // Include price range
            propertyType: form.propertyType, // Include property type
            additionalRequirements: form.additionalRequirements, // Include additional requirements
            areasServed: form.areasServed, // Include areas served
            clientTypes: form.clientTypes, // Include client types
            isAcceptingClients: form.isAcceptingClients, // Include accepting clients flag
          };
        } else { // For other types (renter, buyer)
          preferences[type] = { // Set preferences for renter/buyer
            ...form, // Spread form data
            bedrooms: form.bedrooms, // Include bedrooms
            bathrooms: form.bathrooms, // Include bathrooms
            // Only include relevant fields
            city: form.city, // Include city
            customCity: form.customCity, // Include custom city
            priceRange: form.priceRange, // Include price range
            propertyType: form.propertyType, // Include property type
            moveInDate: form.moveInDate, // Include move-in date
            additionalRequirements: form.additionalRequirements, // Include additional requirements
            isForSelf: form.isForSelf, // Include self-use flag
            isPreApproved: form.isPreApproved, // Include pre-approval flag
          };
        }
      });
      const requestBody = { // Create request body object
        userTypes: selectedTypes, // Include selected user types
        preferences, // Include preferences object
        onboardingCompleted: true // Mark onboarding as completed
      };
      
      // Debug logging for mobile issues
      console.log('Frontend Request Body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch('/api/user/preferences', { // Send POST request to API
        method: 'POST', // Use POST method
        headers: { 'Content-Type': 'application/json' }, // Set content type header
        body: JSON.stringify(requestBody) // Stringify request body
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to save preferences: ${response.status} ${response.statusText}`);
      }
      if (session?.user?.email) { // Check if session has user email
        localStorage.removeItem(`survey_progress_${session.user.email}`); // Remove saved progress from localStorage
      }
      
      // Dispatch survey completion event to refresh other components
      window.dispatchEvent(new CustomEvent('surveyCompleted'));
      
      toast.success('Preferences saved successfully!'); // Show success toast
      setIsOpen(false); // Close the modal
    } catch (error) { // Catch any errors
      toast.error('Failed to save preferences. Please try again.'); // Show error toast
    } finally { // Finally block
      setIsSubmitting(false); // Set submitting state to false
    }
  };

  // Handle "None" selection - skip survey and mark onboarding complete
  const handleNone = async () => { // Define async function to handle none selection
    setIsSubmitting(true); // Set submitting state to true
    try { // Try to skip survey
      const requestBody = { // Create request body object
        userTypes: [], // Empty user types array
        preferences: {}, // Empty preferences object
        onboardingCompleted: true // Mark onboarding as completed
      };
      
      // Debug logging for mobile issues
      console.log('Frontend None Request Body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch('/api/user/preferences', { // Send POST request to API
        method: 'POST', // Use POST method
        headers: { 'Content-Type': 'application/json' }, // Set content type header
        body: JSON.stringify(requestBody) // Stringify request body
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response (None):', errorText);
        throw new Error(`Failed to skip survey: ${response.status} ${response.statusText}`);
      }
      if (session?.user?.email) { // Check if session has user email
        localStorage.removeItem(`survey_progress_${session.user.email}`); // Remove saved progress from localStorage
      }
      
      // Dispatch survey completion event to refresh other components
      window.dispatchEvent(new CustomEvent('surveyCompleted'));
      
      toast.success('Onboarding complete!'); // Show success toast
      setIsOpen(false); // Close the modal
    } catch (error) { // Catch any errors
      toast.error('Failed to skip survey. Please try again.'); // Show error toast
    } finally { // Finally block
      setIsSubmitting(false); // Set submitting state to false
    }
  };

  // Reset stepper when switching user types
  useEffect(() => { // Effect hook to reset stepper
    setRealtorStep(0); // Reset stepper to step 0
  }, [currentType]); // Dependency array with current type

  // Add event listener for opening survey from dashboard
  useEffect(() => { // Effect hook for event listener
    const openSurvey = () => setIsOpen(true); // Define function to open survey
    window.addEventListener('openSurvey', openSurvey); // Add event listener
    return () => { // Return cleanup function
      window.removeEventListener('openSurvey', openSurvey); // Remove event listener
    };
  }, []); // Empty dependency array

  // Load existing user preferences when survey opens
  useEffect(() => {
    const loadExistingPreferences = async () => {
      if (session?.user?.email && isOpen) {
        try {
          console.log('Loading existing preferences for survey...');
          const response = await fetch('/api/user/preferences');
          if (response.ok) {
            const data = await response.json();
            console.log('Loaded existing preferences:', data);
            
            // Load existing user types
            if (data.userTypes && data.userTypes.length > 0) {
              setSelectedTypes(data.userTypes);
              console.log('Set existing user types:', data.userTypes);
            }
            
            // Load existing form data for each role
            if (data.preferences) {
              const existingRoleForms = { ...roleForms };
              Object.keys(data.preferences).forEach(role => {
                if (data.preferences[role]) {
                  existingRoleForms[role] = data.preferences[role];
                }
              });
              setRoleForms(existingRoleForms);
              console.log('Set existing form data:', existingRoleForms);
            }
          }
        } catch (error) {
          console.error('Error loading existing preferences:', error);
        }
      }
    };

    loadExistingPreferences();
  }, [session, isOpen]);

  // Don't render if no session
  if (!session) return null; // Return null if no session

  return ( // Return JSX
    // Main modal dialog container
    <Dialog open={isOpen} onOpenChange={() => {}}> {/* Dialog component with controlled open state */}
      {/* Modal content with responsive sizing */}
      <DialogContent className={`${['realtor', 'landlord'].includes(currentType) ? 'sm:max-w-3xl' : 'sm:max-w-2xl'} max-h-[80vh] sm:max-h-[95vh] overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 text-black shadow-2xl rounded-2xl border-0`} hideCloseButton> {/* Dialog content with styling - narrower for realtor/landlord */}
        {/* Flex container for header and scrollable content */}
        <div className="flex flex-col h-full"> {/* Flex container div */}
          {/* Close button - top left */}
          <button
            onClick={handleNone}
            className="absolute top-4 left-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Close survey"
          >
            <XCircle className="h-5 w-5 text-gray-600" />
          </button>
          
          {/* Fixed header section */}
          <div className="flex-shrink-0 p-3 sm:p-6 pb-2 sm:pb-4"> {/* Header container with padding */}
            <motion.div // Motion div for animation
              initial={{ opacity: 0, y: 20 }} // Initial animation state
              animate={{ opacity: 1, y: 0 }} // Animated state
              transition={{ duration: 0.3 }} // Animation duration
            >
              {/* Modal header with title and description */}
              <DialogHeader> {/* Dialog header component */}
                <DialogTitle className="text-lg sm:text-2xl font-bold text-center text-black"> {/* Dialog title with responsive text */}
                  Complete Your Profile {/* Title text */}
                </DialogTitle>
                {/* Only show welcome and optionality messages on initial role selection */}
                {!currentType && ( // Conditional rendering for initial screen
                  <>
                    {/* Welcome message */}
                    <div className="text-center mt-2 sm:mt-4 text-black text-xs sm:text-base font-medium"> {/* Welcome message container */}
                      Thanks for signing up! To help us connect you with the right people and listings, we encourage you to complete a short survey. Whether you're looking to rent, buy, or list a property, your answers help us personalize your experience and make things smoother. {/* Welcome text */}
                    </div>
                    {/* Optionality note */}
                    <DialogDescription className="text-center mt-2 sm:mt-4 text-black"> {/* Dialog description container */}
                      <span className="block mt-1 sm:mt-2 text-xs text-blue-700 font-semibold"> {/* Optionality text container */}
                        This quick step is optional—but the more we know, the better we can help you!<br/> {/* Optionality message */}
                        <span className="text-gray-700">If you skip, you can always return to your dashboard and change your preferences later.</span> {/* Additional note */}
                      </span>
                    </DialogDescription>
                  </>
                )}
              </DialogHeader>
            </motion.div>
          </div>

          {/* Scrollable content area */}
          <div // Scrollable content container
            className="flex-1 overflow-y-auto pb-3 sm:pb-6" // Flex grow with scroll and padding - removed horizontal padding
            style={{ // Inline styles
              maxHeight: 'calc(80vh - 100px)', // Maximum height calculation
              overflowY: 'auto', // Enable vertical scrolling
            }}
          >
            {/* Tab navigation for different user types */}
            <Tabs value={currentType} onValueChange={setCurrentType} className="w-full block"> {/* Tabs component with controlled value - added block to override any inline behavior */}
              {/* Tab list with numbered options */}
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4 bg-white/80 rounded-lg shadow-sm w-full !inline-block"> {/* Tab list container with grid layout - added w-full and !inline-block to override inline-flex */}
                {USER_TYPES.map((type, index) => ( // Map through user types
                  <TabsTrigger // Tab trigger component
                    key={type.id} // Unique key for React
                    value={type.id} // Tab value
                    className={cn( // Conditional class names
                      "flex items-center gap-1 sm:gap-1 group relative text-black font-semibold transition-all text-xs sm:text-xs p-1 sm:p-2 border border-gray-200 rounded-sm", // Smaller base classes for desktop
                      !selectedTypes.includes(type.id) && "opacity-50 bg-white", // Disabled state classes
                      currentType === type.id && "bg-gradient-to-r from-blue-100 to-blue-200 shadow-md border border-blue-300" // Active state classes
                    )}
                    disabled={!selectedTypes.includes(type.id)} // Disable if not selected
                    style={{ boxShadow: currentType === type.id ? '0 2px 8px 0 rgba(0,0,0,0.08)' : undefined }} // Conditional shadow style
                  >
                    {/* Tab content with responsive text */}
                    <span className="flex items-center gap-1 sm:gap-2"> {/* Tab content container */}
                      <span className="hidden sm:inline">{index + 1}.</span> {/* Desktop step number */}
                      <span className="sm:hidden">{index + 1}</span> {/* Mobile step number */}
                      <span className="hidden sm:inline">{type.label}</span> {/* Desktop label */}
                      <span className="sm:hidden"> {/* Mobile label with truncation */}
                        {type.label === 'Looking to Rent' ? 'Rent' : // Shortened label for rent
                         type.label === 'Looking to Buy' ? 'Buy' : // Shortened label for buy
                         type.label.length > 8 ? type.label.substring(0, 8) + '...' : type.label} {/* Truncate long labels */}
                      </span>
                      {/* Completion indicator */}
                      {completedSteps[type.id] && ( // Conditional rendering for completion check
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> // Green checkmark icon
                      )}
                    </span>
                    {/* Tooltip for tab description */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"> {/* Tooltip container */}
                      {type.description} {/* Tooltip text */}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tab content area */}
              <div className="space-y-4 sm:space-y-4 py-3 sm:py-4 w-full"> {/* Tab content container with spacing - added w-full */}
                {/* Initial role selection screen */}
                {!currentType ? ( // Conditional rendering for initial screen
                  <motion.div // Motion div for animation
                    initial={{ opacity: 0 }} // Initial animation state
                    animate={{ opacity: 1 }} // Animated state
                    exit={{ opacity: 0 }} // Exit animation state
                    className="space-y-4 sm:space-y-4" // Container with spacing
                  >
                    {/* Section title with spacing */}
                    <div className="mt-6 sm:mt-4"> {/* Title container with responsive margin - increased spacing on desktop */}
                      <Label className="text-sm sm:text-base font-semibold text-black"> {/* Label component with responsive text - smaller on desktop */}
                        Tell us more about what you're looking for! <span className="text-xs sm:text-sm font-normal">(Pick all that apply)</span> {/* Title text with subtitle - smaller on desktop */}
                      </Label>
                    </div>
                    {/* Checkbox options for user types */}
                    <div className="space-y-3 sm:space-y-3"> {/* Checkbox container with spacing */}
                      {USER_TYPES.map(type => ( // Map through user types
                        <div key={type.id} className="flex items-start space-x-3 sm:space-x-3 p-3 sm:p-3 rounded-lg hover:bg-blue-50 transition-colors"> {/* Individual type container */}
                          {/* Checkbox for selection */}
                          <Checkbox // Checkbox component
                            id={type.id} // Unique ID
                            checked={selectedTypes.includes(type.id)} // Checked state
                            onCheckedChange={() => handleTypeToggle(type.id)} // Change handler
                            className="mt-1 border-black" // Styling classes
                          />
                          {/* Icon for each role */}
                          <div className="mt-1">{type.icon}</div> {/* Icon container */}
                          {/* Role description */}
                          <div className="space-y-1 flex-1"> {/* Description container */}
                            <Label htmlFor={type.id} className="font-medium text-black text-sm sm:text-base">{type.label}</Label> {/* Role label */}
                            <p className="text-xs sm:text-sm text-gray-700">{type.description}</p> {/* Role description */}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Continue button */}
                    <Button // Button component
                      className="w-full mt-4 sm:mt-4 bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base" // Button styling
                      onClick={() => { // Click handler
                        if (selectedTypes.length === 0) { // Check if no types selected
                          toast.error('Please select at least one option'); // Show error toast
                          return; // Return early
                        }
                        if (selectedTypes.includes('none')) { // Check if none selected
                          handleNone(); // Handle none selection
                          return; // Return early
                        }
                        setCurrentType(selectedTypes[0]); // Set first selected type as current
                      }}
                      disabled={isSubmitting} // Disable during submission
                    >
                      {isSubmitting ? ( // Conditional rendering for loading state
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* Loading spinner */}
                          Saving... {/* Loading text */}
                        </>
                      ) : ( // Normal state
                        'Continue' // Button text
                      )}
                    </Button>
                    
                    {/* Terms and Conditions Notice */}
                    <div className="mt-4 text-center text-xs text-gray-600">
                      By completing this survey and signing up, you agree to our{' '}
                      <a 
                        href="/terms-and-conditions" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                        onClick={async (e) => {
                          e.preventDefault();
                          // Mark onboarding as completed in both localStorage and database
                          localStorage.setItem(`onboarding_completed_${session.user.email}`, 'true');
                          
                          // Dispatch survey completion event
                          window.dispatchEvent(new CustomEvent('surveyCompleted'));
                          
                          // Close the survey modal
                          setIsOpen(false);
                          
                          // Update user preferences in database to mark onboarding as completed
                          try {
                            await fetch('/api/user/preferences', {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                userTypes: [],
                                preferences: {},
                                onboardingCompleted: true
                              }),
                            });
                          } catch (error) {
                            console.error('Error updating onboarding status:', error);
                          }
                          
                          // Open terms in new tab
                          window.open('/terms-and-conditions', '_blank');
                        }}
                      >
                        Terms and Conditions
                      </a>
                      , which includes consent for us to share your preferences with realtors and property managers to facilitate connections when both parties meet each other's requirements.
                    </div>
                    
                    {/* Extra space below Continue button for mobile scroll bounce */}
                    <div className="h-40 sm:h-40"></div> {/* Extra space div */}
                  </motion.div>
                ) : ( // Conditional rendering for non-initial screen
                  <motion.div // Motion div for animation
                    initial={{ opacity: 0, x: 20 }} // Initial animation state
                    animate={{ opacity: 1, x: 0 }} // Animated state
                    exit={{ opacity: 0, x: -20 }} // Exit animation state
                    className="space-y-4" // Container with spacing
                  >
                    <div className="grid grid-cols-2 gap-4"> {/* Grid container for city/price inputs */}
                      {!['realtor', 'landlord'].includes(currentType) && ( // Conditional rendering for city input
                        <div className="space-y-2 col-span-2"> {/* City input container */}
                          <Label className="font-semibold text-black">City/Cities</Label> {/* Label for city input */}
                          <div className="flex flex-wrap gap-2 mb-2"> {/* Chips container */}
                            {cities.map(city => ( // Map through cities
                              <span key={city} className="flex items-center bg-blue-100 text-black rounded-full px-3 py-1 text-sm"> {/* Individual city chip */}
                                {city} {/* City text */}
                                <button type="button" className="ml-1" onClick={() => handleRemoveCity(city)}> {/* Remove button */}
                                  <X className="h-4 w-4 text-black" /> {/* X icon */}
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2"> {/* Input and Add button container */}
                            <Input // Input component
                              value={cityInput} // Input value
                              onChange={e => setCityInput(e.target.value)} // Change handler
                              onKeyDown={e => { // Key down handler for Enter key
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCity();
                                }
                              }}
                              placeholder="Type a city and press Enter" // Placeholder text
                              className="text-black border-black bg-white" // Styling classes
                            />
                            <Button // Add button
                              type="button" // Button type
                              onClick={handleAddCity} // Click handler
                              className="bg-blue-600 text-white hover:bg-blue-700" // Button styling
                            >
                              Add {/* Button text */}
                            </Button>
                          </div>
                        </div>
                      )}

                      {!['realtor', 'landlord'].includes(currentType) && ( // Conditional rendering for price input
                        <div className="space-y-2"> {/* Price input container */}
                          <Label className="font-semibold text-black">Min Price <span className="text-xs font-normal">($CAD {['renter','landlord'].includes(currentType) ? 'per month' : 'total'})</span></Label> {/* Label for min price */}
                          <div className="flex items-center border rounded-lg px-2 bg-white"> {/* Input container */}
                            <span className="text-black font-semibold mr-1">$CAD</span> {/* Currency symbol */}
                            <Input // Input component
                              type="number" // Input type
                              min={0} // Minimum value
                              value={currentForm.priceRange.min} // Input value
                              onChange={e => handleFormChange('priceRange', { ...currentForm.priceRange, min: e.target.value })} // Change handler
                              className="border-0 focus:ring-0 text-black bg-white" // Styling classes
                              placeholder="0" // Placeholder text
                            />
                          </div>
                        </div>
                      )}
                      {!['realtor', 'landlord'].includes(currentType) && ( // Conditional rendering for max price input
                        <div className="space-y-2"> {/* Price input container */}
                          <Label className="font-semibold text-black">Max Price <span className="text-xs font-normal">($CAD {['renter','landlord'].includes(currentType) ? 'per month' : 'total'})</span></Label> {/* Label for max price */}
                          <div className="flex items-center border rounded-lg px-2 bg-white"> {/* Input container */}
                            <span className="text-black font-semibold mr-1">$CAD</span> {/* Currency symbol */}
                            <Input // Input component
                              type="number" // Input type
                              min={0} // Minimum value
                              value={currentForm.priceRange.max} // Input value
                              onChange={e => handleFormChange('priceRange', { ...currentForm.priceRange, max: e.target.value })} // Change handler
                              className="border-0 focus:ring-0 text-black bg-white" // Styling classes
                              placeholder="" // Placeholder text
                            />
                          </div>
                        </div>
                      )}

                      {/* Realtor/Landlord Multi-Step Form - Fixed Pixel Layout */}
                      {['realtor', 'landlord'].includes(currentType) ? ( // Conditional rendering for realtor/landlord specific fields
                        <div style={{ width: '100%', padding: '0 20px' }}> {/* Main container with fixed padding */}
                          {/* Stepper Progress Bar - Fixed Position */}
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '32px', width: '300px', margin: '0 0 32px 0', marginLeft: 'auto', marginRight: '20px' }} className="sm:mb-8 sm:w-[300px] mb-2 w-[150px]"> {/* Stepper container at the very right edge */}
                            {REALTOR_STEPS.map((step, idx) => ( // Map through steps
                              <div key={step} style={{ display: 'flex', alignItems: 'center' }}> {/* Individual step */}
                                <div style={{ 
                                  borderRadius: '50%', 
                                  width: '40px', 
                                  height: '40px', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  fontWeight: 'bold', 
                                  color: 'white',
                                  backgroundColor: idx === realtorStep ? '#2563eb' : '#d1d5db'
                                }} className="sm:w-10 sm:h-10 w-5 h-5"> {/* Step circle */}
                                  {idx + 1} {/* Step number */}
                                </div>
                                {idx < REALTOR_STEPS.length - 1 && <div style={{ width: '48px', height: '4px', backgroundColor: '#d1d5db', margin: '0 12px' }} className="sm:w-12 sm:h-1 w-6 h-0.5" />} {/* Separator line */}
                              </div>
                            ))}
                          </div>

                          {/* Step Header - Fixed Position */}
                          <div style={{ textAlign: 'center', marginBottom: '32px', width: '300px', margin: '0 0 32px 0', marginLeft: 'auto', marginRight: '20px' }} className="sm:mb-8 sm:w-[300px] mb-2 w-[150px]"> {/* Header container at the very right edge */}
                            <UserCircle style={{ width: '64px', height: '64px', color: '#3b82f6', margin: '0 auto 16px' }} className="sm:w-16 sm:h-16 w-8 h-8" /> {/* Icon */}
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '8px' }} className="sm:text-2xl sm:mb-2 text-sm mb-1">{REALTOR_STEPS[realtorStep]}</h2> {/* Step title */}
                            <p style={{ color: '#6b7280' }}> {/* Step description */}
                              {realtorStep === 0 ? 'Tell us about your properties!' : 
                               realtorStep === 1 ? 'Where do you serve clients?' : 
                               realtorStep === 2 ? 'Who do you work with?' : 
                               'Anything else you want to share?'}
                            </p>
                          </div>

                          {/* Form Content - Fixed Width Container */}
                          <div style={{ width: '100%', maxWidth: '400px', margin: '0 0 0 auto', paddingRight: '16px' }} className="sm:max-w-[400px] max-w-[200px]"> {/* Form container aligned to the right with padding - 20% smaller */}
                            <AnimatePresence mode="wait" initial={false}> {/* Animation wrapper */}
                              <motion.div // Motion container
                                key={realtorStep} // Animation key
                                initial={{ opacity: 0, x: 40 }} // Initial state
                                animate={{ opacity: 1, x: 0 }} // Animated state
                                exit={{ opacity: 0, x: -40 }} // Exit state
                                transition={{ duration: 0.3 }} // Animation duration
                                style={{ width: '100%' }} // Full width
                              >
                                {/* Step 0: Property Details - Fixed Pixel Layout */}
                                {realtorStep === 0 && ( // Property details step
                                  <div style={{ width: '100%' }}> {/* Fixed width container */}
                                    {/* City/Cities Section */}
                                                                          <div style={{ width: '100%', marginBottom: '32px' }} className="sm:mb-8 mb-2"> {/* City section with more spacing - 20% smaller */}
                                                                              <Label style={{ display: 'block', textAlign: 'center', fontSize: '16px', fontWeight: '600', color: 'black', marginBottom: '16px' }} className="sm:text-lg sm:mb-4 text-xs mb-1">City/Cities</Label> {/* Label with larger font - 20% smaller */}
                                                                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px', justifyContent: 'center' }} className="sm:gap-2 sm:mb-4 gap-0.5 mb-1"> {/* City chips - 20% smaller */}
                                        {cities.map(city => ( // Map cities
                                                                                      <span key={city} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#dbeafe', color: 'black', borderRadius: '9999px', padding: '8px 14px', fontSize: '11px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)' }} className="sm:px-4 sm:py-2 sm:text-sm px-1 py-0.5 text-xs"> {/* City chip with better shadow - 20% smaller */}
                                            {city} {/* City name */}
                                                                                          <button type="button" style={{ marginLeft: '8px' }} onClick={() => handleRemoveCity(city)} className="sm:ml-2 ml-0.5"> {/* Remove button - 20% smaller */}
                                                <X style={{ width: '13px', height: '13px', color: 'black' }} className="sm:w-4 sm:h-4 w-2.5 h-2.5" /> {/* X icon - 20% smaller */}
                                            </button>
                                          </span>
                                        ))}
                                      </div>
                                                                              <div style={{ display: 'flex', gap: '13px', width: '100%' }} className="sm:gap-3 gap-1"> {/* Input container with more gap - 20% smaller */}
                                        <Input // City input
                                          value={cityInput} // Value
                                          onChange={e => setCityInput(e.target.value)} // Change handler
                                          onKeyDown={e => { // Enter key handler
                                            if (e.key === 'Enter') {
                                              e.preventDefault();
                                              handleAddCity();
                                            }
                                          }}
                                          placeholder="Type a city and press Enter" // Placeholder
                                          style={{ flex: 1, color: 'black', border: '1px solid black', backgroundColor: 'white', borderRadius: '6px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '13px', padding: '10px 13px' }} className="sm:text-sm sm:px-4 sm:py-3 text-xs px-1 py-0.5" // Fixed styling - 20% smaller
                                        />
                                        <Button // Add button
                                          type="button" // Button type
                                          onClick={handleAddCity} // Click handler
                                          style={{ backgroundColor: '#2563eb', color: 'white', borderRadius: '6px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '13px', padding: '10px 19px', whiteSpace: 'nowrap' }} className="sm:text-sm sm:px-6 sm:py-3 text-xs px-1.5 py-0.5" // Fixed styling - 20% smaller
                                        >
                                          Add {/* Button text */}
                                        </Button>
                                      </div>
                                    </div>

                                    {/* Price Range Section */}
                                    <div style={{ width: '100%', marginBottom: '40px' }}> {/* Price section with more spacing */}
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', width: '100%' }}> {/* Price inputs grid with more gap */}
                                        {/* Min Price */}
                                        <div style={{ width: '100%' }}> {/* Min price container */}
                                          <Label style={{ display: 'block', textAlign: 'center', fontSize: '20px', fontWeight: '600', color: 'black', marginBottom: '16px' }}>
                                            Min {currentType === 'landlord' ? 'Monthly Rent' : 'Price'} 
                                            <span style={{ fontSize: '16px', fontWeight: '400', color: '#6b7280', marginLeft: '6px' }}>($CAD)</span>
                                          </Label> {/* Label with larger font */}
                                          <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #d1d5db', borderRadius: '8px', padding: '0 12px', backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}> {/* Input container */}
                                            <span style={{ color: 'black', fontWeight: '600', marginRight: '8px' }}>$CAD</span> {/* Currency */}
                                            <Input // Min price input
                                              type="number" // Input type
                                              min={0} // Min value
                                              value={currentForm.priceRange.min} // Value
                                              onChange={e => handleFormChange('priceRange', { ...currentForm.priceRange, min: e.target.value })} // Change handler
                                              style={{ flex: 1, border: 'none', outline: 'none', color: 'black', backgroundColor: 'white', fontSize: '16px', padding: '8px 8px' }} // Fixed styling
                                              placeholder="0" // Placeholder
                                            />
                                          </div>
                                        </div>

                                        {/* Max Price */}
                                        <div style={{ width: '100%' }}> {/* Max price container */}
                                          <Label style={{ display: 'block', textAlign: 'center', fontSize: '20px', fontWeight: '600', color: 'black', marginBottom: '16px' }}>
                                            Max {currentType === 'landlord' ? 'Monthly Rent' : 'Price'} 
                                            <span style={{ fontSize: '16px', fontWeight: '400', color: '#6b7280', marginLeft: '6px' }}>($CAD)</span>
                                          </Label> {/* Label with larger font */}
                                          <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #d1d5db', borderRadius: '8px', padding: '0 12px', backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}> {/* Input container */}
                                            <span style={{ color: 'black', fontWeight: '600', marginRight: '8px' }}>$CAD</span> {/* Currency */}
                                            <Input // Max price input
                                              type="number" // Input type
                                              min={0} // Min value
                                              value={currentForm.priceRange.max} // Value
                                              onChange={e => handleFormChange('priceRange', { ...currentForm.priceRange, max: e.target.value })} // Change handler
                                              style={{ flex: 1, border: 'none', outline: 'none', color: 'black', backgroundColor: 'white', fontSize: '16px', padding: '8px 8px' }} // Fixed styling
                                              placeholder="" // Placeholder
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <p style={{ fontSize: '16px', color: '#6b7280', fontStyle: 'italic', textAlign: 'center', width: '100%', marginTop: '16px', lineHeight: '1.5' }}> {/* Helper text with better spacing */}
                                        {currentType === 'landlord' 
                                          ? 'Enter the monthly rent range for your properties, from lowest to highest.'
                                          : 'Enter the price range of properties you represent, from lowest to highest.'}
                                      </p>
                                    </div>

                                    {/* Bedrooms Section */}
                                    <div style={{ width: '100%', marginBottom: '40px' }}> {/* Bedrooms section with more spacing */}
                                                                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', width: '100%' }}> {/* Bedrooms grid with more gap */}
                                        {/* Min Bedrooms */}
                                        <div style={{ width: '100%' }}> {/* Min bedrooms container */}
                                          <Label style={{ display: 'block', textAlign: 'center', fontSize: '18px', fontWeight: '600', color: 'black', marginBottom: '12px' }}>Min Bedrooms</Label> {/* Label */}
                                          <Select // Min bedrooms select
                                            value={currentForm.bedroomsMin} // Value
                                            onValueChange={(value) => handleFormChange('bedroomsMin', value)} // Change handler
                                          >
                                            <SelectTrigger style={{ width: '100%', color: 'black', border: '2px solid #d1d5db', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '16px', padding: '16px' }}> {/* Trigger */}
                                              <SelectValue placeholder="Select min bedrooms" style={{ color: 'black' }} /> {/* Placeholder */}
                                            </SelectTrigger>
                                            <SelectContent style={{ color: 'black', backgroundColor: 'white', border: '1px solid #d1d5db' }}> {/* Content */}
                                              {BEDROOM_OPTIONS.map(bed => ( // Map options
                                                <SelectItem key={bed} value={bed} style={{ color: 'black', backgroundColor: 'white' }}> {/* Item */}
                                                  {bed} {/* Option text */}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* Max Bedrooms */}
                                        <div style={{ width: '100%' }}> {/* Max bedrooms container */}
                                          <Label style={{ display: 'block', textAlign: 'center', fontSize: '18px', fontWeight: '600', color: 'black', marginBottom: '12px' }}>Max Bedrooms</Label> {/* Label */}
                                          <Select // Max bedrooms select
                                            value={currentForm.bedroomsMax} // Value
                                            onValueChange={(value) => handleFormChange('bedroomsMax', value)} // Change handler
                                          >
                                            <SelectTrigger style={{ width: '100%', color: 'black', border: '2px solid #d1d5db', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '16px', padding: '16px' }}> {/* Trigger */}
                                              <SelectValue placeholder="Select max bedrooms" style={{ color: 'black' }} /> {/* Placeholder */}
                                            </SelectTrigger>
                                            <SelectContent style={{ color: 'black', backgroundColor: 'white', border: '1px solid #d1d5db' }}> {/* Content */}
                                              {BEDROOM_OPTIONS.map(bed => ( // Map options
                                                <SelectItem key={bed} value={bed} style={{ color: 'black', backgroundColor: 'white' }}> {/* Item */}
                                                  {bed} {/* Option text */}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <p style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic', textAlign: 'center', width: '100%', marginTop: '12px' }}> {/* Helper text */}
                                        Provide the range of bedrooms in your properties, from the lowest to the highest count.
                                      </p>
                                    </div>

                                    {/* Bathrooms Section */}
                                    <div style={{ width: '100%', marginBottom: '32px' }}> {/* Bathrooms section */}
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%' }}> {/* Bathrooms grid */}
                                        {/* Min Bathrooms */}
                                        <div style={{ width: '100%' }}> {/* Min bathrooms container */}
                                          <Label style={{ display: 'block', textAlign: 'center', fontSize: '18px', fontWeight: '600', color: 'black', marginBottom: '12px' }}>Min Bathrooms</Label> {/* Label */}
                                          <Select // Min bathrooms select
                                            value={currentForm.bathroomsMin} // Value
                                            onValueChange={(value) => handleFormChange('bathroomsMin', value)} // Change handler
                                          >
                                            <SelectTrigger style={{ width: '100%', color: 'black', border: '2px solid #d1d5db', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '16px', padding: '16px' }}> {/* Trigger */}
                                              <SelectValue placeholder="Select min bathrooms" style={{ color: 'black' }} /> {/* Placeholder */}
                                            </SelectTrigger>
                                            <SelectContent style={{ color: 'black', backgroundColor: 'white', border: '1px solid #d1d5db' }}> {/* Content */}
                                              {BATHROOM_OPTIONS.map(bath => ( // Map options
                                                <SelectItem key={bath} value={bath} style={{ color: 'black', backgroundColor: 'white' }}> {/* Item */}
                                                  {bath} {/* Option text */}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {/* Max Bathrooms */}
                                        <div style={{ width: '100%' }}> {/* Max bathrooms container */}
                                          <Label style={{ display: 'block', textAlign: 'center', fontSize: '18px', fontWeight: '600', color: 'black', marginBottom: '12px' }}>Max Bathrooms</Label> {/* Label */}
                                          <Select // Max bathrooms select
                                            value={currentForm.bathroomsMax} // Value
                                            onValueChange={(value) => handleFormChange('bathroomsMax', value)} // Change handler
                                          >
                                            <SelectTrigger style={{ width: '100%', color: 'black', border: '2px solid #d1d5db', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '16px', padding: '16px' }}> {/* Trigger */}
                                              <SelectValue placeholder="Select max bathrooms" style={{ color: 'black' }} /> {/* Placeholder */}
                                            </SelectTrigger>
                                            <SelectContent style={{ color: 'black', backgroundColor: 'white', border: '1px solid #d1d5db' }}> {/* Content */}
                                              {BATHROOM_OPTIONS.map(bath => ( // Map options
                                                <SelectItem key={bath} value={bath} style={{ color: 'black', backgroundColor: 'white' }}> {/* Item */}
                                                  {bath} {/* Option text */}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <p style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic', textAlign: 'center', width: '100%', marginTop: '12px' }}> {/* Helper text */}
                                        Provide the range of bathrooms in your properties, from the lowest to the highest count.
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Step 1: Areas Served - Fixed Pixel Layout */}
                                {realtorStep === 1 && ( // Areas served step
                                  <div style={{ width: '100%' }}> {/* Full width container */}
                                    <div style={{ textAlign: 'center', marginBottom: '24px' }}> {/* Header */}
                                      <Label style={{ fontSize: '20px', fontWeight: '600', color: 'black' }}>Areas Served</Label> {/* Label */}
                                      <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>(optional)</p> {/* Subtitle */}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', width: '100%' }}> {/* Areas grid */}
                                      {AREAS_SERVED.map(area => ( // Map areas
                                        <Button // Area button
                                          key={area} // Key
                                          variant={currentForm.areasServed.includes(area) ? "default" : "outline"} // Variant
                                          size="lg" // Size
                                          onClick={() => handleArrayToggle('areasServed', area)} // Click handler
                                          style={{ 
                                            padding: '12px 24px', 
                                            fontSize: '16px',
                                            backgroundColor: currentForm.areasServed.includes(area) ? '#2563eb' : 'white',
                                            color: currentForm.areasServed.includes(area) ? 'white' : 'black',
                                            border: currentForm.areasServed.includes(area) ? '2px solid #2563eb' : '2px solid #d1d5db',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                          }} // Fixed styling
                                        >
                                          {area} {/* Area text */}
                                        </Button>
                                      ))}
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic', textAlign: 'center', width: '100%', marginTop: '12px' }}> {/* Helper text */}
                                      Select all the areas where you actively serve clients.
                                    </p>
                                  </div>
                                )}

                                {/* Step 2: Client Types - Fixed Pixel Layout */}
                                {realtorStep === 2 && ( // Client types step
                                  <div style={{ width: '100%' }}> {/* Full width container */}
                                    <div style={{ textAlign: 'center', marginBottom: '24px' }}> {/* Header */}
                                      <Label style={{ fontSize: '20px', fontWeight: '600', color: 'black' }}>Preferred Client Types</Label> {/* Label */}
                                      <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>(optional)</p> {/* Subtitle */}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', width: '100%' }}> {/* Types grid */}
                                      {CLIENT_TYPES.map(type => ( // Map types
                                        <Button // Type button
                                          key={type} // Key
                                          variant={currentForm.clientTypes.includes(type) ? "default" : "outline"} // Variant
                                          size="lg" // Size
                                          onClick={() => handleArrayToggle('clientTypes', type)} // Click handler
                                          style={{ 
                                            padding: '12px 24px', 
                                            fontSize: '16px',
                                            backgroundColor: currentForm.clientTypes.includes(type) ? '#2563eb' : 'white',
                                            color: currentForm.clientTypes.includes(type) ? 'white' : 'black',
                                            border: currentForm.clientTypes.includes(type) ? '2px solid #2563eb' : '2px solid #d1d5db',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                          }} // Fixed styling
                                        >
                                          {type} {/* Type text */}
                                        </Button>
                                      ))}
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic', textAlign: 'center', width: '100%', marginTop: '12px' }}> {/* Helper text */}
                                      Let us know which types of clients you prefer to work with.
                                    </p>
                                  </div>
                                )}

                                {/* Step 3: Additional Info - Fixed Pixel Layout */}
                                {realtorStep === 3 && ( // Additional info step
                                  <div style={{ width: '100%' }}> {/* Full width container */}
                                    {/* Accepting Clients */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '32px' }}> {/* Checkbox container */}
                                      <Checkbox // Checkbox
                                        id="accepting-clients" // ID
                                        checked={currentForm.isAcceptingClients} // Checked state
                                        onCheckedChange={(checked) => handleFormChange('isAcceptingClients', checked)} // Change handler
                                        style={{ border: '2px solid #d1d5db' }} // Fixed styling
                                      />
                                      <Label htmlFor="accepting-clients" style={{ fontSize: '18px', color: 'black' }}>I am currently accepting new clients</Label> {/* Label */}
                                    </div>

                                    {/* Additional Requirements */}
                                    <div style={{ width: '100%' }}> {/* Requirements container */}
                                      <Label style={{ display: 'block', fontSize: '18px', fontWeight: '600', color: 'black', marginBottom: '16px' }}>Additional Requirements</Label> {/* Label */}
                                      <Input // Input
                                        placeholder="Any specific requirements or preferences?" // Placeholder
                                        value={currentForm.additionalRequirements} // Value
                                        onChange={(e) => handleFormChange('additionalRequirements', e.target.value)} // Change handler
                                        style={{ width: '100%', color: 'black', border: '2px solid #d1d5db', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '16px', padding: '16px' }} // Fixed styling
                                      />
                                      <p style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic', marginTop: '8px' }}> {/* Helper text */}
                                        Share any special requirements or preferences you have for new clients.
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            </AnimatePresence>
                          </div>

                          {/* Navigation Buttons - Fixed Pixel Layout */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', width: '100%', maxWidth: '500px', margin: '32px 0 0 auto', paddingRight: '20px' }}> {/* Navigation container aligned to the right with padding */}
                            <Button // Back button
                              variant="outline" // Variant
                              onClick={() => { // Click handler
                                if (realtorStep > 0) setRealtorStep(realtorStep - 1); // Go back
                                else setCurrentType(''); // Go to initial selection
                              }}
                              style={{ border: '2px solid #d1d5db', color: 'black', padding: '12px 32px', fontSize: '16px', borderRadius: '8px' }} // Fixed styling
                            >
                              Back {/* Button text */}
                            </Button>
                            <Button // Next/Submit button
                              onClick={() => { // Click handler
                                if (realtorStep < REALTOR_STEPS.length - 1) setRealtorStep(realtorStep + 1); // Next step
                                else { // Submit
                                  setCompletedSteps(prev => ({ ...prev, [currentType]: true })); // Mark complete
                                  const currentIndex = selectedTypes.indexOf(currentType); // Get index
                                  if (currentIndex < selectedTypes.length - 1) { // More types
                                    setCurrentType(selectedTypes[currentIndex + 1]); // Next type
                                    setRealtorStep(0); // Reset step
                                  } else { // Last type
                                    handleSubmit(); // Submit all
                                  }
                                }
                              }}
                              style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 32px', fontSize: '16px', borderRadius: '8px' }} // Fixed styling
                            >
                              {realtorStep < REALTOR_STEPS.length - 1 ? 'Next' : isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : 'Submit'} {/* Button text */}
                            </Button>
                          </div>
                        </div>
                      ) : ( // Conditional rendering for renter/buyer specific fields
                        <>
                          <div className="space-y-2"> {/* Bedrooms container */}
                            <Label className="font-semibold text-black">Bedrooms</Label> {/* Label for bedrooms */}
                            <Select // Select component
                              value={currentForm.bedrooms} // Selected value
                              onValueChange={(value) => handleFormChange('bedrooms', value)} // Change handler
                            >
                              <SelectTrigger className="text-black border-black bg-white"> {/* Select trigger */}
                                <SelectValue placeholder="Select bedrooms" className="text-black bg-white" /> {/* Placeholder text */}
                              </SelectTrigger>
                              <SelectContent className="text-black bg-white border-black"> {/* Select content */}
                                {BEDROOM_OPTIONS.map(bed => ( // Map through bedroom options
                                  <SelectItem key={bed} value={bed} className="text-black bg-white"> {/* Select item */}
                                    {bed} {/* Option text */}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2"> {/* Bathrooms container */}
                            <Label className="font-semibold text-black">Bathrooms</Label> {/* Label for bathrooms */}
                            <Select // Select component
                              value={currentForm.bathrooms} // Selected value
                              onValueChange={(value) => handleFormChange('bathrooms', value)} // Change handler
                            >
                              <SelectTrigger className="text-black border-black bg-white"> {/* Select trigger */}
                                <SelectValue placeholder="Select bathrooms" className="text-black bg-white" /> {/* Placeholder text */}
                              </SelectTrigger>
                              <SelectContent className="text-black bg-white border-black"> {/* Select content */}
                                {BATHROOM_OPTIONS.map(bath => ( // Map through bathroom options
                                  <SelectItem key={bath} value={bath} className="text-black bg-white"> {/* Select item */}
                                    {bath} {/* Option text */}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </div>
                    {!['realtor', 'landlord'].includes(currentType) && ( // Conditional rendering for back/submit button
                      <div className="flex justify-between mt-6 w-full max-w-4xl mx-auto">
                        <Button // Back button
                          variant="outline" // Outline variant
                          onClick={() => setCurrentType('')} // Click handler to go back to initial selection
                          className="border-black text-white hover:bg-gray-200" // Styling classes
                        >
                          Back {/* Button text */}
                        </Button>
                        <Button // Submit button
                          onClick={handleSubmit} // Click handler
                          className="bg-blue-600 text-white hover:bg-blue-700" // Styling classes
                          disabled={isSubmitting} // Disable during submission
                        >
                          {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : 'Submit'} {/* Button text and loading state */}
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 