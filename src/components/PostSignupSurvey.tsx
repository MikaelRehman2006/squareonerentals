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
import { CheckCircle2, Info, ChevronsUpDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const USER_TYPES = [
  { 
    id: 'realtor', 
    label: 'Realtor',
    description: 'I help clients buy, sell, or rent properties'
  },
  { 
    id: 'landlord', 
    label: 'Landlord',
    description: 'I own and rent out properties'
  },
  { 
    id: 'renter', 
    label: 'Looking to Rent',
    description: 'I want to find a place to rent'
  },
  { 
    id: 'buyer', 
    label: 'Looking to Buy',
    description: 'I want to purchase a property'
  }
];

const CANADIAN_CITIES = [
  'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton',
  'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener',
  'London', 'Victoria', 'Halifax', 'Oshawa', 'Windsor'
];

const BEDROOM_OPTIONS = ['1', '2', '3', '4', '5+'];
const BATHROOM_OPTIONS = ['1', '2', '3', '4+'];
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
  bedrooms: string;
  bathrooms: string;
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

export default function PostSignupSurvey() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [currentType, setCurrentType] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openCityPopover, setOpenCityPopover] = useState(false);
  
  // Form state for each user type
  const [formData, setFormData] = useState<FormData>({
    city: '',
    customCity: '',
    bedrooms: '',
    bathrooms: '',
    priceRange: { min: '', max: '' },
    propertyType: '',
    moveInDate: '',
    additionalRequirements: '',
    areasServed: [],
    clientTypes: [],
    isAcceptingClients: false,
    isForSelf: true,
    isPreApproved: false
  });

  // Load saved progress from localStorage
  useEffect(() => {
    if (session?.user?.email) {
      const savedProgress = localStorage.getItem(`survey_progress_${session.user.email}`);
      if (savedProgress) {
        const { selectedTypes, currentType, formData } = JSON.parse(savedProgress);
        setSelectedTypes(selectedTypes);
        setCurrentType(currentType);
        setFormData(formData);
      }
    }
  }, [session]);

  // Save progress to localStorage
  useEffect(() => {
    if (session?.user?.email) {
      localStorage.setItem(`survey_progress_${session.user.email}`, JSON.stringify({
        selectedTypes,
        currentType,
        formData
      }));
    }
  }, [selectedTypes, currentType, formData, session]);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user/preferences');
          const data = await response.json();
          
          if (!data.preferences?.onboardingCompleted) {
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

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field]) && prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value]
    }));
  };

  const isStepComplete = (type: string) => {
    switch (type) {
      case 'realtor':
        return formData.city && formData.propertyType && formData.priceRange.min && formData.areasServed.length > 0;
      case 'landlord':
        return formData.city && formData.bedrooms && formData.bathrooms && formData.priceRange.min;
      case 'renter':
        return formData.city && formData.bedrooms && formData.bathrooms && formData.priceRange.max && formData.moveInDate;
      case 'buyer':
        return formData.city && formData.bedrooms && formData.bathrooms && formData.priceRange.max;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userTypes: selectedTypes,
          preferences: {
            ...formData,
            city: formData.customCity || formData.city
          },
          onboardingCompleted: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      // Clear saved progress
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

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Complete Your Profile
            </DialogTitle>
            <DialogDescription className="text-center mt-4">
              Help us match you with the right properties and clients
            </DialogDescription>
          </DialogHeader>

          <Tabs value={currentType} onValueChange={setCurrentType} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              {USER_TYPES.map((type, index) => (
                <TabsTrigger
                  key={type.id}
                  value={type.id}
                  className={cn(
                    "flex items-center gap-2 group relative",
                    !selectedTypes.includes(type.id) && "opacity-50"
                  )}
                  disabled={!selectedTypes.includes(type.id)}
                >
                  <span className="flex items-center gap-2">
                    {index + 1}. {type.label}
                    {completedSteps[type.id] && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </span>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
                  <Label className="text-lg font-semibold">What best describes you? (Select all that apply)</Label>
                  <div className="space-y-3">
                    {USER_TYPES.map(type => (
                      <div key={type.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox
                          id={type.id}
                          checked={selectedTypes.includes(type.id)}
                          onCheckedChange={() => handleTypeToggle(type.id)}
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <Label htmlFor={type.id} className="font-medium">{type.label}</Label>
                          <p className="text-sm text-gray-500">{type.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => {
                      if (selectedTypes.length === 0) {
                        toast.error('Please select at least one option');
                        return;
                      }
                      setCurrentType(selectedTypes[0]);
                    }}
                  >
                    Continue
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
                    <div className="space-y-2">
                      <Label className="font-semibold">City</Label>
                      <Popover open={openCityPopover} onOpenChange={setOpenCityPopover}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCityPopover}
                            className="w-full justify-between"
                          >
                            {formData.city || formData.customCity || "Select a city..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput 
                              placeholder="Search city..." 
                              value={formData.customCity}
                              onValueChange={(value) => handleFormChange('customCity', value)}
                            />
                            <CommandEmpty>No city found.</CommandEmpty>
                            <CommandGroup>
                              {CANADIAN_CITIES.map((city) => (
                                <CommandItem
                                  key={city}
                                  value={city}
                                  onSelect={() => {
                                    handleFormChange('city', city);
                                    handleFormChange('customCity', '');
                                    setOpenCityPopover(false);
                                  }}
                                >
                                  {city}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {currentType === 'realtor' && (
                      <>
                        <div className="space-y-2">
                          <Label className="font-semibold">Property Type</Label>
                          <Select value={formData.propertyType} onValueChange={(value) => handleFormChange('propertyType', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="residential">Residential</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 col-span-2">
                          <Label className="font-semibold">Areas Served</Label>
                          <div className="flex flex-wrap gap-2">
                            {AREAS_SERVED.map(area => (
                              <Button
                                key={area}
                                variant={formData.areasServed.includes(area) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayToggle('areasServed', area)}
                              >
                                {area}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 col-span-2">
                          <Label className="font-semibold">Preferred Client Types</Label>
                          <div className="flex flex-wrap gap-2">
                            {CLIENT_TYPES.map(type => (
                              <Button
                                key={type}
                                variant={formData.clientTypes.includes(type) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayToggle('clientTypes', type)}
                              >
                                {type}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="accepting-clients"
                              checked={formData.isAcceptingClients}
                              onCheckedChange={(checked) => handleFormChange('isAcceptingClients', checked)}
                            />
                            <Label htmlFor="accepting-clients">I am currently accepting new clients</Label>
                          </div>
                        </div>
                      </>
                    )}

                    {(currentType === 'landlord' || currentType === 'renter' || currentType === 'buyer') && (
                      <>
                        <div className="space-y-2">
                          <Label className="font-semibold">Bedrooms</Label>
                          <Select value={formData.bedrooms} onValueChange={(value) => handleFormChange('bedrooms', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bedrooms" />
                            </SelectTrigger>
                            <SelectContent>
                              {BEDROOM_OPTIONS.map(bed => (
                                <SelectItem key={bed} value={bed}>
                                  {bed}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="font-semibold">Bathrooms</Label>
                          <Select value={formData.bathrooms} onValueChange={(value) => handleFormChange('bathrooms', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bathrooms" />
                            </SelectTrigger>
                            <SelectContent>
                              {BATHROOM_OPTIONS.map(bath => (
                                <SelectItem key={bath} value={bath}>
                                  {bath}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {(currentType === 'renter' || currentType === 'buyer') && (
                      <div className="space-y-2">
                        <Label className="font-semibold">Maximum Price</Label>
                        <Select 
                          value={formData.priceRange.max} 
                          onValueChange={(value) => handleFormChange('priceRange', { ...formData.priceRange, max: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select max price" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRICE_RANGES.map(range => (
                              <SelectItem key={range.label} value={range.max.toString()}>
                                {range.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {currentType === 'renter' && (
                      <div className="space-y-2">
                        <Label className="font-semibold">Desired Move-in Date</Label>
                        <Input
                          type="date"
                          value={formData.moveInDate}
                          onChange={(e) => handleFormChange('moveInDate', e.target.value)}
                        />
                      </div>
                    )}

                    {currentType === 'landlord' && (
                      <div className="space-y-2">
                        <Label className="font-semibold">Minimum Price</Label>
                        <Select 
                          value={formData.priceRange.min} 
                          onValueChange={(value) => handleFormChange('priceRange', { ...formData.priceRange, min: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select min price" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRICE_RANGES.map(range => (
                              <SelectItem key={range.label} value={range.min.toString()}>
                                {range.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {(currentType === 'renter' || currentType === 'buyer') && (
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="for-self"
                            checked={formData.isForSelf}
                            onCheckedChange={(checked) => handleFormChange('isForSelf', checked)}
                          />
                          <Label htmlFor="for-self">This is for myself</Label>
                        </div>
                      </div>
                    )}

                    {currentType === 'buyer' && (
                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="pre-approved"
                            checked={formData.isPreApproved}
                            onCheckedChange={(checked) => handleFormChange('isPreApproved', checked)}
                          />
                          <Label htmlFor="pre-approved">I am pre-approved for a mortgage</Label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Additional Requirements</Label>
                    <Input
                      placeholder="Any specific requirements or preferences?"
                      value={formData.additionalRequirements}
                      onChange={(e) => handleFormChange('additionalRequirements', e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const currentIndex = selectedTypes.indexOf(currentType);
                        if (currentIndex > 0) {
                          setCurrentType(selectedTypes[currentIndex - 1]);
                        } else {
                          setCurrentType('');
                        }
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        if (isStepComplete(currentType)) {
                          setCompletedSteps(prev => ({ ...prev, [currentType]: true }));
                          const currentIndex = selectedTypes.indexOf(currentType);
                          if (currentIndex < selectedTypes.length - 1) {
                            setCurrentType(selectedTypes[currentIndex + 1]);
                          } else {
                            handleSubmit();
                          }
                        } else {
                          toast.error('Please fill in all required fields');
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        selectedTypes.indexOf(currentType) === selectedTypes.length - 1 ? 'Submit' : 'Next'
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 