'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { CheckCircle2, Info, ChevronsUpDown, Loader2, X, UserCircle, Home, Search, DollarSign, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const USER_TYPES = [
  { 
    id: 'realtor', 
    label: 'Realtor',
    description: "I'm a realtor helping people buy, sell, or rent homes.",
    icon: <UserCircle className="h-6 w-6 text-blue-500" />,
  },
  { 
    id: 'landlord', 
    label: 'Landlord',
    description: "I own a property and want to rent it out.",
    icon: <Home className="h-6 w-6 text-green-500" />,
  },
  { 
    id: 'renter', 
    label: 'Looking to Rent',
    description: "I'm searching for a great place to live.",
    icon: <Search className="h-6 w-6 text-purple-500" />,
  },
  { 
    id: 'buyer', 
    label: 'Looking to Buy',
    description: "I'm looking to buy my next home.",
    icon: <DollarSign className="h-6 w-6 text-orange-500" />,
  },
  {
    id: 'none',
    label: 'None',
    description: 'Skip this step for now (not recommended)',
    icon: <XCircle className="h-6 w-6 text-gray-400" />,
  }
];

const CANADIAN_CITIES = [
  'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton',
  'Ottawa', 'Mississauga', 'Winnipeg', 'Quebec City', 'Hamilton',
  'Brampton', 'Surrey', 'Kitchener', 'London', 'Windsor', 'Victoria',
  'Halifax', 'Oshawa', 'Gatineau', 'Saskatoon', 'Regina', "St. John's",
  'Barrie', 'Kelowna', 'Abbotsford', 'Sherbrooke', 'Guelph', 'Markham',
  'Kingston', 'Vaughan', 'Burlington', 'Oakville', 'Richmond Hill',
  'Waterloo', 'Ajax', 'Cambridge', 'Whitby', 'Milton', 'Pickering',
  'Thunder Bay', 'Brantford', 'Lethbridge', 'St. Catharines', 'Niagara Falls',
  'Coquitlam', 'Scarborough', 'Etobicoke', 'North York', 'Burnaby', 'Richmond',
  'Laval', 'Longueuil', 'Delta', 'Squamish', 'Whistler', 'Muskoka'
];

const BEDROOM_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+'];
const BATHROOM_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+'];
const PRICE_RANGES = [
  { min: 0, max: 500000, label: 'Under $500,000' },
  { min: 500000, max: 1000000, label: '$500,000 - $1,000,000' },
  { min: 1000000, max: 2000000, label: '$1,000,000 - $2,000,000' },
  { min: 2000000, max: 5000000, label: '$2,000,000 - $5,000,000' },
  { min: 5000000, max: Infinity, label: 'Over $5,000,000' }
];

const AREAS_SERVED = [
  'Downtown', 'West End', 'East End', 'North', 'South',
  'Suburbs', 'Metro Area', 'Rural', 'All Areas'
];

const CLIENT_TYPES = [
  'First-time Buyers',
  'Investors',
  'Families',
  'Students',
  'Professionals',
  'Seniors',
  'All Types'
];

interface FormData {
  city: string;
  customCity: string;
  bedrooms: string; // for renter/buyer
  bathrooms: string; // for renter/buyer
  bedroomsMin?: string; // for realtor/landlord
  bedroomsMax?: string; // for realtor/landlord
  bathroomsMin?: string; // for realtor/landlord
  bathroomsMax?: string; // for realtor/landlord
  priceRange: {
    min: string;
    max: string;
  };
  propertyType: string;
  moveInDate: string;
  additionalRequirements: string;
  areasServed: string[];
  clientTypes: string[];
  isAcceptingClients: boolean;
  isForSelf: boolean;
  isPreApproved: boolean;
  [key: string]: any; // Add index signature for dynamic field access
}

// --- Define default form data for a role ---
const getDefaultRoleForm = (): FormData => ({
  city: '',
  customCity: '',
  bedrooms: '',
  bathrooms: '',
  bedroomsMin: '',
  bedroomsMax: '',
  bathroomsMin: '',
  bathroomsMax: '',
  priceRange: { min: '', max: '' },
  propertyType: '',
  moveInDate: '',
  additionalRequirements: '',
  areasServed: [] as string[],
  clientTypes: [] as string[],
  isAcceptingClients: false,
  isForSelf: true,
  isPreApproved: false,
});

// Add stepper state for realtor/landlord
const REALTOR_STEPS = [
  'Property Details',
  'Areas Served',
  'Preferred Client Types',
  'Additional Info',
];

export default function PostSignupSurvey() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [currentType, setCurrentType] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openCityPopover, setOpenCityPopover] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  
  // Store form data per role
  const [roleForms, setRoleForms] = useState<Record<string, FormData>>({});

  // Add stepper state for realtor/landlord
  const [realtorStep, setRealtorStep] = useState(0);

  // Clear any existing localStorage data when session changes
  useEffect(() => {
    if (session?.user?.email) {
      // Clear any localStorage data that doesn't belong to the current user
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('survey_progress_') && key !== `survey_progress_${session.user.email}`) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [session?.user?.email]);

  // Cleanup function to clear all survey localStorage data
  const clearAllSurveyData = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('survey_progress_')) {
        localStorage.removeItem(key);
      }
    });
  };

  // Clear all survey data when component unmounts or user changes
  useEffect(() => {
    return () => {
      clearAllSurveyData();
    };
  }, [session?.user?.email]);

  // Reset component state when user changes
  useEffect(() => {
    if (session?.user?.email) {
      setSelectedTypes([]);
      setCurrentType('');
      setCompletedSteps({});
      setRoleForms({});
      setCityInput('');
      setCities([]);
    }
  }, [session?.user?.email]);

  // Load saved progress from localStorage
  useEffect(() => {
    if (session?.user?.email) {
      const savedProgress = localStorage.getItem(`survey_progress_${session.user.email}`);
      if (savedProgress) {
        try {
          const { selectedTypes, currentType, roleForms, savedEmail } = JSON.parse(savedProgress);
          // Only load the progress if it belongs to the current user
          if (savedEmail === session.user.email) {
            setSelectedTypes(selectedTypes);
            setCurrentType(currentType);
            setRoleForms(roleForms);
          } else {
            // Clear stale data
            localStorage.removeItem(`survey_progress_${session.user.email}`);
          }
        } catch (error) {
          // If parsing fails, clear the corrupted data
          localStorage.removeItem(`survey_progress_${session.user.email}`);
        }
      }
    }
  }, [session]);

  // Save progress to localStorage
  useEffect(() => {
    if (session?.user?.email) {
      localStorage.setItem(`survey_progress_${session.user.email}`, JSON.stringify({
        selectedTypes,
        currentType,
        roleForms,
        savedEmail: session.user.email // Add email to the saved data for verification
      }));
    }
  }, [selectedTypes, currentType, roleForms, session]);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user/preferences');
          const data = await response.json();
          
          if (!data.preferences?.onboardingCompleted) {
            // Clear any existing localStorage data before opening the survey
            clearAllSurveyData();
            setIsOpen(true);
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
        }
      }
    };

    checkOnboardingStatus();
  }, [session]);

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  // When switching tabs, initialize if not present
  useEffect(() => {
    if (currentType && !roleForms[currentType]) {
      setRoleForms(prev => ({ ...prev, [currentType]: getDefaultRoleForm() }));
    }
  }, [currentType]);

  // When a user selects a role, initialize its form state if not present
  useEffect(() => {
    setRoleForms(prev => {
      let updated = { ...prev };
      selectedTypes.forEach(type => {
        if (!updated[type]) {
          updated[type] = getDefaultRoleForm();
        }
      });
      // Optionally, remove forms for unselected types
      Object.keys(updated).forEach(type => {
        if (!selectedTypes.includes(type)) {
          delete updated[type];
        }
      });
      return updated;
    });
  }, [selectedTypes]);

  // Helper to get/set current role's form
  const currentForm = currentType ? roleForms[currentType] || getDefaultRoleForm() : getDefaultRoleForm();
  const setCurrentForm = (form: FormData) => {
    if (!currentType) return;
    setRoleForms(prev => ({ ...prev, [currentType]: form }));
  };

  // Add city to list for current role
  const handleAddCity = () => {
    const trimmed = cityInput.trim();
    if (trimmed && !(currentForm.city.split(',').map(c => c.trim()).includes(trimmed))) {
      const updatedCities = [...(currentForm.city ? currentForm.city.split(',').map(c => c.trim()).filter(Boolean) : []), trimmed];
      setCurrentForm({ ...currentForm, city: updatedCities.join(', ') });
      setCities(updatedCities);
      setCityInput('');
    }
  };
  // Remove city from list for current role
  const handleRemoveCity = (city: string) => {
    const updated = (currentForm.city ? currentForm.city.split(',').map(c => c.trim()).filter(Boolean) : []).filter(c => c !== city);
    setCurrentForm({ ...currentForm, city: updated.join(', ') });
    setCities(updated);
  };

  // On mount or tab switch, load cities for current role
  useEffect(() => {
    if (currentForm.city) {
      setCities(currentForm.city.split(',').map(c => c.trim()).filter(Boolean));
    } else {
      setCities([]);
    }
    setCityInput('');
  }, [currentType]);

  // Update a field for the current role
  const handleFormChange = (field: string, value: any) => {
    setCurrentForm({ ...currentForm, [field]: value });
  };
  const handleArrayToggle = (field: keyof FormData, value: string) => {
    const arr = (currentForm[field] as string[]) || [];
    setCurrentForm({
      ...currentForm,
      [field]: arr.includes(value)
        ? arr.filter((item: string) => item !== value)
        : [...arr, value]
    });
  };

  const isStepComplete = (type: string) => {
    switch (type) {
      case 'realtor':
        return currentForm.city && currentForm.propertyType && currentForm.priceRange.min && currentForm.areasServed.length > 0;
      case 'landlord':
        return currentForm.city && currentForm.bedrooms && currentForm.bathrooms && currentForm.priceRange.min;
      case 'renter':
        return currentForm.city && currentForm.bedrooms && currentForm.bathrooms && currentForm.priceRange.max && currentForm.moveInDate;
      case 'buyer':
        return currentForm.city && currentForm.bedrooms && currentForm.bathrooms && currentForm.priceRange.max;
      default:
        return false;
    }
  };

  // On submit, gather all roleForms for selectedTypes
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const preferences: Record<string, any> = {};
      selectedTypes.forEach(type => {
        const form = roleForms[type] || getDefaultRoleForm();
        if (["realtor", "landlord"].includes(type)) {
          preferences[type] = {
            ...form,
            bedroomsMin: form.bedroomsMin,
            bedroomsMax: form.bedroomsMax,
            bathroomsMin: form.bathroomsMin,
            bathroomsMax: form.bathroomsMax,
            // Only include relevant fields
            city: form.city,
            customCity: form.customCity,
            priceRange: form.priceRange,
            propertyType: form.propertyType,
            additionalRequirements: form.additionalRequirements,
            areasServed: form.areasServed,
            clientTypes: form.clientTypes,
            isAcceptingClients: form.isAcceptingClients,
          };
        } else {
          preferences[type] = {
            ...form,
            bedrooms: form.bedrooms,
            bathrooms: form.bathrooms,
            // Only include relevant fields
            city: form.city,
            customCity: form.customCity,
            priceRange: form.priceRange,
            propertyType: form.propertyType,
            moveInDate: form.moveInDate,
            additionalRequirements: form.additionalRequirements,
            isForSelf: form.isForSelf,
            isPreApproved: form.isPreApproved,
          };
        }
      });
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userTypes: selectedTypes,
          preferences,
          onboardingCompleted: true
        })
      });
      if (!response.ok) throw new Error('Failed to save preferences');
      if (session?.user?.email) {
        localStorage.removeItem(`survey_progress_${session.user.email}`);
      }
      toast.success('Preferences saved successfully!');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // When 'None' is selected and user clicks Continue, skip the survey and mark onboarding as complete
  const handleNone = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userTypes: [],
          preferences: {},
          onboardingCompleted: true
        })
      });
      if (!response.ok) throw new Error('Failed to skip survey');
      if (session?.user?.email) {
        localStorage.removeItem(`survey_progress_${session.user.email}`);
      }
      toast.success('Onboarding complete!');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to skip survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ensure switching user types resets stepper and form state:
  useEffect(() => {
    setRealtorStep(0);
  }, [currentType]);

  // Add event listener for opening survey from dashboard
  useEffect(() => {
    const openSurvey = () => setIsOpen(true);
    window.addEventListener('openSurvey', openSurvey);
    return () => {
      window.removeEventListener('openSurvey', openSurvey);
    };
  }, []);

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 text-black shadow-2xl rounded-2xl border-0" hideCloseButton>
        <div className="w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-black">
                Complete Your Profile
              </DialogTitle>
              {/* Only show welcome and optionality messages on initial role selection */}
              {!currentType && (
                <>
                  <div className="text-center mt-4 text-black text-base font-medium">
                    Thanks for signing up! To help us connect you with the right people and listings, we encourage you to complete a short survey. Whether you're looking to rent, buy, or list a property, your answers help us personalize your experience and make things smoother.
                  </div>
                  <DialogDescription className="text-center mt-4 text-black">
                    <span className="block mt-2 text-sm text-blue-700 font-semibold">
                      This quick step is optional—but the more we know, the better we can help you!<br/>
                      <span className="text-gray-700">If you skip, you can always return to your dashboard and change your preferences later.</span>
                    </span>
                  </DialogDescription>
                </>
              )}
            </DialogHeader>

            <Tabs value={currentType} onValueChange={setCurrentType} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4 bg-white/80 rounded-lg shadow-sm">
                {USER_TYPES.map((type, index) => (
                  <TabsTrigger
                    key={type.id}
                    value={type.id}
                    className={cn(
                      "flex items-center gap-2 group relative text-black font-semibold transition-all",
                      !selectedTypes.includes(type.id) && "opacity-50",
                      currentType === type.id && "bg-gradient-to-r from-blue-100 to-blue-200 shadow-md border border-blue-300"
                    )}
                    disabled={!selectedTypes.includes(type.id)}
                    style={{ boxShadow: currentType === type.id ? '0 2px 8px 0 rgba(0,0,0,0.08)' : undefined }}
                  >
                    <span className="flex items-center gap-2">
                      {index + 1}. {type.label}
                      {completedSteps[type.id] && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </span>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {type.description}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="space-y-4 py-4">
                {!currentType ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <Label className="text-lg font-semibold text-black">
                      Tell us more about what you're looking for! <span className="text-base font-normal">(Pick all that apply)</span>
                    </Label>
                    <div className="space-y-3">
                      {USER_TYPES.map(type => (
                        <div key={type.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                          <Checkbox
                            id={type.id}
                            checked={selectedTypes.includes(type.id)}
                            onCheckedChange={() => handleTypeToggle(type.id)}
                            className="mt-1 border-black"
                          />
                          {/* Icon for each role */}
                          <div className="mt-1">{type.icon}</div>
                          <div className="space-y-1">
                            <Label htmlFor={type.id} className="font-medium text-black">{type.label}</Label>
                            <p className="text-sm text-gray-700">{type.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => {
                        if (selectedTypes.length === 0) {
                          toast.error('Please select at least one option');
                          return;
                        }
                        if (selectedTypes.includes('none')) {
                          handleNone();
                          return;
                        }
                        setCurrentType(selectedTypes[0]);
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Continue'
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {!['realtor', 'landlord'].includes(currentType) && (
                        <div className="space-y-2 col-span-2">
                          <Label className="font-semibold text-black">City/Cities</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {cities.map(city => (
                              <span key={city} className="flex items-center bg-blue-100 text-black rounded-full px-3 py-1 text-sm">
                                {city}
                                <button type="button" className="ml-1" onClick={() => handleRemoveCity(city)}>
                                  <X className="h-4 w-4 text-black" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              value={cityInput}
                              onChange={e => setCityInput(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCity(); }}}
                              placeholder="Type a city and press Enter"
                              className="text-black border-black bg-white"
                            />
                            <Button type="button" onClick={handleAddCity} className="bg-blue-600 text-white hover:bg-blue-700">Add</Button>
                          </div>
                        </div>
                      )}

                      {!['realtor', 'landlord'].includes(currentType) && (
                        <div className="space-y-2">
                          <Label className="font-semibold text-black">Min Price <span className="text-xs font-normal">($CAD {['renter','landlord'].includes(currentType) ? 'per month' : 'total'})</span></Label>
                          <div className="flex items-center border rounded-lg px-2 bg-white">
                            <span className="text-black font-semibold mr-1">$CAD</span>
                            <Input
                              type="number"
                              min={0}
                              value={currentForm.priceRange.min}
                              onChange={e => handleFormChange('priceRange', { ...currentForm.priceRange, min: e.target.value })}
                              className="border-0 focus:ring-0 text-black bg-white"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      )}
                      {!['realtor', 'landlord'].includes(currentType) && (
                        <div className="space-y-2">
                          <Label className="font-semibold text-black">Max Price <span className="text-xs font-normal">($CAD {['renter','landlord'].includes(currentType) ? 'per month' : 'total'})</span></Label>
                          <div className="flex items-center border rounded-lg px-2 bg-white">
                            <span className="text-black font-semibold mr-1">$CAD</span>
                            <Input
                              type="number"
                              min={0}
                              value={currentForm.priceRange.max}
                              onChange={e => handleFormChange('priceRange', { ...currentForm.priceRange, max: e.target.value })}
                              className="border-0 focus:ring-0 text-black bg-white"
                              placeholder=""
                            />
                          </div>
                        </div>
                      )}

                      {/* Bedrooms and Bathrooms */}
                      {['realtor', 'landlord'].includes(currentType) ? (
                        <div className="w-full flex flex-col items-center">
                          {/* Stepper Progress Bar */}
                          <div className="flex items-center justify-center mb-6">
                            {REALTOR_STEPS.map((step, idx) => (
                              <div key={step} className="flex items-center">
                                <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white ${idx === realtorStep ? 'bg-blue-600' : 'bg-gray-300'}`}>{idx + 1}</div>
                                {idx < REALTOR_STEPS.length - 1 && <div className="w-8 h-1 bg-gray-300 mx-2" />}
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-col items-center mb-4">
                            <UserCircle className="w-12 h-12 text-blue-500 mb-2" />
                            <div className="text-lg font-semibold text-blue-700 mb-1">{REALTOR_STEPS[realtorStep]}</div>
                            <div className="text-sm text-gray-500 mb-2">{realtorStep === 0 ? 'Tell us about your properties!' : realtorStep === 1 ? 'Where do you serve clients?' : realtorStep === 2 ? 'Who do you work with?' : 'Anything else you want to share?'}</div>
                          </div>
                          {/* Center the form card/content */}
                          <div className="w-full max-w-[900px] mx-auto mb-4">
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.div
                                key={realtorStep}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                              >
                                {realtorStep === 0 && (
                                  <div className="flex flex-col gap-8 w-full max-w-lg mx-auto items-center">
                                    {/* City/Cities input and chips */}
                                    <div className="w-full flex flex-col items-center">
                                      <Label className="font-semibold text-black mb-1 block text-center">City/Cities</Label>
                                      <div className="flex flex-wrap gap-2 mb-2 justify-center">
                                        {cities.map(city => (
                                          <span key={city} className="flex items-center bg-blue-100 text-black rounded-full px-3 py-1 text-sm shadow-sm">
                                            {city}
                                            <button type="button" className="ml-1" onClick={() => handleRemoveCity(city)}>
                                              <X className="h-4 w-4 text-black" />
                                            </button>
                                          </span>
                                        ))}
                                      </div>
                                      <div className="flex gap-2 w-full justify-center">
                                        <Input
                                          value={cityInput}
                                          onChange={e => setCityInput(e.target.value)}
                                          onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                              e.preventDefault();
                                              handleAddCity();
                                            }
                                          }}
                                          placeholder="Type a city and press Enter"
                                          className="text-black border-black bg-white max-w-md rounded-lg shadow-sm text-base px-4 py-3"
                                        />
                                        <Button
                                          type="button"
                                          onClick={handleAddCity}
                                          className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm text-base px-6 py-3 max-w-[120px]"
                                        >
                                          Add
                                        </Button>
                                      </div>
                                    </div>
                                    {/* Single column for all fields */}
                                    <div className="flex flex-col gap-6 w-full items-center">
                                      {/* Min Price */}
                                      <div className="w-full flex flex-col items-center">
                                        <Label className="font-semibold text-black text-center">Min {currentType === 'landlord' ? 'Monthly Rent' : 'Price'} <span className="text-xs font-normal">($CAD)</span></Label>
                                        <div className="flex items-center border rounded-lg px-2 bg-white shadow-sm max-w-md w-full">
                                          <span className="text-black font-semibold mr-1">$CAD</span>
                                          <Input
                                            type="number"
                                            min={0}
                                            value={currentForm.priceRange.min}
                                            onChange={e => handleFormChange('priceRange', { ...currentForm.priceRange, min: e.target.value })}
                                            className="border-0 focus:ring-0 text-black bg-white max-w-md w-full text-base px-4 py-3"
                                            placeholder="0"
                                          />
                                        </div>
                                      </div>
                                      {/* Max Price */}
                                      <div className="w-full flex flex-col items-center">
                                        <Label className="font-semibold text-black text-center">Max {currentType === 'landlord' ? 'Monthly Rent' : 'Price'} <span className="text-xs font-normal">($CAD)</span></Label>
                                        <div className="flex items-center border rounded-lg px-2 bg-white shadow-sm max-w-md w-full">
                                          <span className="text-black font-semibold mr-1">$CAD</span>
                                          <Input
                                            type="number"
                                            min={0}
                                            value={currentForm.priceRange.max}
                                            onChange={e => handleFormChange('priceRange', { ...currentForm.priceRange, max: e.target.value })}
                                            className="border-0 focus:ring-0 text-black bg-white max-w-md w-full text-base px-4 py-3"
                                            placeholder=""
                                          />
                                        </div>
                                      </div>
                                      <p className="text-xs text-gray-500 italic text-center w-full">
                                        {currentType === 'landlord' 
                                          ? 'Enter the monthly rent range for your properties, from lowest to highest.'
                                          : 'Enter the price range of properties you represent, from lowest to highest.'}
                                      </p>
                                      {/* Min Bedrooms */}
                                      <div className="w-full flex flex-col items-center">
                                        <Label className="font-semibold text-black text-center">Min Bedrooms</Label>
                                        <Select value={currentForm.bedroomsMin} onValueChange={(value) => handleFormChange('bedroomsMin', value)}>
                                          <SelectTrigger className="text-black border-black bg-white max-w-md w-full rounded-lg shadow-sm text-base px-4 py-3">
                                            <SelectValue placeholder="Select min bedrooms" className="text-black" />
                                          </SelectTrigger>
                                          <SelectContent className="text-black bg-white border-black">
                                            {BEDROOM_OPTIONS.map(bed => (
                                              <SelectItem key={bed} value={bed} className="text-black bg-white">
                                                {bed}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {/* Max Bedrooms */}
                                      <div className="w-full flex flex-col items-center">
                                        <Label className="font-semibold text-black text-center">Max Bedrooms</Label>
                                        <Select value={currentForm.bedroomsMax} onValueChange={(value) => handleFormChange('bedroomsMax', value)}>
                                          <SelectTrigger className="text-black border-black bg-white max-w-md w-full rounded-lg shadow-sm text-base px-4 py-3">
                                            <SelectValue placeholder="Select max bedrooms" className="text-black" />
                                          </SelectTrigger>
                                          <SelectContent className="text-black bg-white border-black">
                                            {BEDROOM_OPTIONS.map(bed => (
                                              <SelectItem key={bed} value={bed} className="text-black bg-white">
                                                {bed}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <p className="text-xs text-gray-500 italic text-center w-full">
                                        Provide the range of bedrooms in your properties, from the lowest to the highest count.
                                      </p>
                                      {/* Min Bathrooms */}
                                      <div className="w-full flex flex-col items-center">
                                        <Label className="font-semibold text-black text-center">Min Bathrooms</Label>
                                        <Select value={currentForm.bathroomsMin} onValueChange={(value) => handleFormChange('bathroomsMin', value)}>
                                          <SelectTrigger className="text-black border-black bg-white max-w-md w-full rounded-lg shadow-sm text-base px-4 py-3">
                                            <SelectValue placeholder="Select min bathrooms" className="text-black" />
                                          </SelectTrigger>
                                          <SelectContent className="text-black bg-white border-black">
                                            {BATHROOM_OPTIONS.map(bath => (
                                              <SelectItem key={bath} value={bath} className="text-black bg-white">
                                                {bath}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {/* Max Bathrooms */}
                                      <div className="w-full flex flex-col items-center">
                                        <Label className="font-semibold text-black text-center">Max Bathrooms</Label>
                                        <Select value={currentForm.bathroomsMax} onValueChange={(value) => handleFormChange('bathroomsMax', value)}>
                                          <SelectTrigger className="text-black border-black bg-white max-w-md w-full rounded-lg shadow-sm text-base px-4 py-3">
                                            <SelectValue placeholder="Select max bathrooms" className="text-black" />
                                          </SelectTrigger>
                                          <SelectContent className="text-black bg-white border-black">
                                            {BATHROOM_OPTIONS.map(bath => (
                                              <SelectItem key={bath} value={bath} className="text-black bg-white">
                                                {bath}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <p className="text-xs text-gray-500 italic text-center w-full">
                                        Provide the range of bathrooms in your properties, from the lowest to the highest count.
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {realtorStep === 1 && (
                                  <div className="flex flex-col gap-8 max-w-2xl mx-auto">
                                    <Label className="font-semibold text-black mb-1">Areas Served <span className="text-xs font-normal">(optional)</span></Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {AREAS_SERVED.map(area => (
                                        <Button
                                          key={area}
                                          variant={currentForm.areasServed.includes(area) ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => handleArrayToggle('areasServed', area)}
                                          className={currentForm.areasServed.includes(area) ? "bg-blue-200 text-black border-blue-400" : "bg-white text-black border-black"}
                                        >
                                          {area}
                                        </Button>
                                      ))}
                                    </div>
                                    <p className="text-xs text-gray-500 italic mt-2">Select all the areas where you actively serve clients.</p>
                                  </div>
                                )}
                                {realtorStep === 2 && (
                                  <div className="flex flex-col gap-8 max-w-2xl mx-auto">
                                    <Label className="font-semibold text-black mb-1">Preferred Client Types <span className="text-xs font-normal">(optional)</span></Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {CLIENT_TYPES.map(type => (
                                        <Button
                                          key={type}
                                          variant={currentForm.clientTypes.includes(type) ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => handleArrayToggle('clientTypes', type)}
                                          className={currentForm.clientTypes.includes(type) ? "bg-blue-200 text-black border-blue-400" : "bg-white text-black border-black"}
                                        >
                                          {type}
                                        </Button>
                                      ))}
                                    </div>
                                    <p className="text-xs text-gray-500 italic mt-2">Let us know which types of clients you prefer to work with.</p>
                                  </div>
                                )}
                                {realtorStep === 3 && (
                                  <div className="flex flex-col gap-8 max-w-2xl mx-auto">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Checkbox
                                        id="accepting-clients"
                                        checked={currentForm.isAcceptingClients}
                                        onCheckedChange={(checked) => handleFormChange('isAcceptingClients', checked)}
                                        className="border-black"
                                      />
                                      <Label htmlFor="accepting-clients" className="text-black">I am currently accepting new clients</Label>
                                    </div>
                                    <div>
                                      <Label className="font-semibold text-black mb-1">Additional Requirements</Label>
                                      <Input
                                        placeholder="Any specific requirements or preferences?"
                                        value={currentForm.additionalRequirements}
                                        onChange={(e) => handleFormChange('additionalRequirements', e.target.value)}
                                        className="text-black border-black bg-white rounded-lg shadow-sm"
                                      />
                                      <p className="text-xs text-gray-500 italic mt-2">Share any special requirements or preferences you have for new clients.</p>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            </AnimatePresence>
                          </div>
                          <div className="flex justify-between mt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                if (realtorStep > 0) setRealtorStep(realtorStep - 1);
                                else setCurrentType('');
                              }}
                              className="border-black text-white hover:bg-gray-200"
                            >
                              Back
                            </Button>
                            <Button
                              onClick={() => {
                                if (realtorStep < REALTOR_STEPS.length - 1) setRealtorStep(realtorStep + 1);
                                else {
                                  setCompletedSteps(prev => ({ ...prev, [currentType]: true }));
                                  const currentIndex = selectedTypes.indexOf(currentType);
                                  if (currentIndex < selectedTypes.length - 1) {
                                    setCurrentType(selectedTypes[currentIndex + 1]);
                                    setRealtorStep(0);
                                  } else {
                                    handleSubmit();
                                  }
                                }
                              }}
                              className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                              {realtorStep < REALTOR_STEPS.length - 1 ? 'Next' : isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : 'Submit'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label className="font-semibold text-black">Bedrooms</Label>
                            <Select value={currentForm.bedrooms} onValueChange={(value) => handleFormChange('bedrooms', value)}>
                              <SelectTrigger className="text-black border-black bg-white">
                                <SelectValue placeholder="Select bedrooms" className="text-black bg-white" />
                              </SelectTrigger>
                              <SelectContent className="text-black bg-white border-black">
                                {BEDROOM_OPTIONS.map(bed => (
                                  <SelectItem key={bed} value={bed} className="text-black bg-white">
                                    {bed}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="font-semibold text-black">Bathrooms</Label>
                            <Select value={currentForm.bathrooms} onValueChange={(value) => handleFormChange('bathrooms', value)}>
                              <SelectTrigger className="text-black border-black bg-white">
                                <SelectValue placeholder="Select bathrooms" className="text-black bg-white" />
                              </SelectTrigger>
                              <SelectContent className="text-black bg-white border-black">
                                {BATHROOM_OPTIONS.map(bath => (
                                  <SelectItem key={bath} value={bath} className="text-black bg-white">
                                    {bath}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </div>
                    {!['realtor', 'landlord'].includes(currentType) && (
                      <div className="flex justify-between mt-6 w-full max-w-4xl mx-auto">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentType('')}
                          className="border-black text-white hover:bg-gray-200"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : 'Submit'}
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </Tabs>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 