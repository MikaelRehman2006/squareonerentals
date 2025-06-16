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
import { CheckCircle2, Info, ChevronsUpDown, Loader2, X } from 'lucide-react';
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
  const [cityInput, setCityInput] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  
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

  // Add city to list
  const handleAddCity = () => {
    const trimmed = cityInput.trim();
    if (trimmed && !cities.includes(trimmed)) {
      setCities([...cities, trimmed]);
      setCityInput('');
      handleFormChange('city', [...cities, trimmed].join(', '));
    }
  };
  // Remove city from list
  const handleRemoveCity = (city: string) => {
    const updated = cities.filter(c => c !== city);
    setCities(updated);
    handleFormChange('city', updated.join(', '));
  };

  // On mount, load from formData if present
  useEffect(() => {
    if (formData.city) {
      setCities(formData.city.split(',').map(c => c.trim()).filter(Boolean));
    }
  }, []);

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 text-black shadow-2xl rounded-2xl border-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-black">
              Complete Your Profile
            </DialogTitle>
            <DialogDescription className="text-center mt-4 text-black">
              Help us match you with the right properties and clients
            </DialogDescription>
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
                  <Label className="text-lg font-semibold text-black">What best describes you? (Select all that apply)</Label>
                  <div className="space-y-3">
                    {USER_TYPES.map(type => (
                      <div key={type.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                        <Checkbox
                          id={type.id}
                          checked={selectedTypes.includes(type.id)}
                          onCheckedChange={() => handleTypeToggle(type.id)}
                          className="mt-1 border-black"
                        />
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
                    {/* City input as chips */}
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

                    {/* Min/Max Price fields with $CAD prefix, typeable, and period note */}
                    <div className="space-y-2">
                      <Label className="font-semibold text-black">Min Price <span className="text-xs font-normal">($CAD {['renter','landlord'].includes(currentType) ? 'per month' : 'total'})</span></Label>
                      <div className="flex items-center border rounded-lg px-2 bg-white">
                        <span className="text-black font-semibold mr-1">$CAD</span>
                        <Input
                          type="number"
                          min={0}
                          value={formData.priceRange.min}
                          onChange={e => handleFormChange('priceRange', { ...formData.priceRange, min: e.target.value })}
                          className="border-0 focus:ring-0 text-black bg-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-black">Max Price <span className="text-xs font-normal">($CAD {['renter','landlord'].includes(currentType) ? 'per month' : 'total'})</span></Label>
                      <div className="flex items-center border rounded-lg px-2 bg-white">
                        <span className="text-black font-semibold mr-1">$CAD</span>
                        <Input
                          type="number"
                          min={0}
                          value={formData.priceRange.max}
                          onChange={e => handleFormChange('priceRange', { ...formData.priceRange, max: e.target.value })}
                          className="border-0 focus:ring-0 text-black bg-white"
                          placeholder=""
                        />
                      </div>
                    </div>

                    {/* Bedrooms and Bathrooms */}
                    <div className="space-y-2">
                      <Label className="font-semibold text-black">Bedrooms</Label>
                      <Select value={formData.bedrooms} onValueChange={(value) => handleFormChange('bedrooms', value)}>
                        <SelectTrigger className="text-black border-black bg-white">
                          <SelectValue placeholder="Select bedrooms" />
                        </SelectTrigger>
                        <SelectContent className="text-black bg-white border-black">
                          {BEDROOM_OPTIONS.map(bed => (
                            <SelectItem key={bed} value={bed} className="text-black">
                              {bed}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-black">Bathrooms</Label>
                      <Select value={formData.bathrooms} onValueChange={(value) => handleFormChange('bathrooms', value)}>
                        <SelectTrigger className="text-black border-black bg-white">
                          <SelectValue placeholder="Select bathrooms" />
                        </SelectTrigger>
                        <SelectContent className="text-black bg-white border-black">
                          {BATHROOM_OPTIONS.map(bath => (
                            <SelectItem key={bath} value={bath} className="text-black">
                              {bath}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Realtor/Landlord specific fields */}
                    {['realtor', 'landlord'].includes(currentType) && (
                      <>
                        <div className="space-y-2 col-span-2">
                          <Label className="font-semibold text-black">Areas Served <span className="text-xs font-normal">(optional)</span></Label>
                          <div className="flex flex-wrap gap-2">
                            {AREAS_SERVED.map(area => (
                              <Button
                                key={area}
                                variant={formData.areasServed.includes(area) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayToggle('areasServed', area)}
                                className={formData.areasServed.includes(area) ? "bg-blue-200 text-black border-blue-400" : "bg-white text-black border-black"}
                              >
                                {area}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label className="font-semibold text-black">Preferred Client Types <span className="text-xs font-normal">(optional)</span></Label>
                          <div className="flex flex-wrap gap-2">
                            {CLIENT_TYPES.map(type => (
                              <Button
                                key={type}
                                variant={formData.clientTypes.includes(type) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleArrayToggle('clientTypes', type)}
                                className={formData.clientTypes.includes(type) ? "bg-blue-200 text-black border-blue-400" : "bg-white text-black border-black"}
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
                              className="border-black"
                            />
                            <Label htmlFor="accepting-clients" className="text-black">I am currently accepting new clients</Label>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Renter/Buyer specific fields */}
                    {['renter', 'buyer'].includes(currentType) && (
                      <>
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="for-self"
                              checked={formData.isForSelf}
                              onCheckedChange={(checked) => handleFormChange('isForSelf', checked)}
                              className="border-black"
                            />
                            <Label htmlFor="for-self" className="text-black">This is for myself</Label>
                          </div>
                        </div>
                        {currentType === 'buyer' && (
                          <div className="col-span-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="pre-approved"
                                checked={formData.isPreApproved}
                                onCheckedChange={(checked) => handleFormChange('isPreApproved', checked)}
                                className="border-black"
                              />
                              <Label htmlFor="pre-approved" className="text-black">I am pre-approved for a mortgage</Label>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold text-black">Additional Requirements</Label>
                    <Input
                      placeholder="Any specific requirements or preferences?"
                      value={formData.additionalRequirements}
                      onChange={(e) => handleFormChange('additionalRequirements', e.target.value)}
                      className="text-black border-black bg-white"
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
                      className="border-black text-black hover:bg-gray-200"
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
                      className="bg-blue-600 text-white hover:bg-blue-700"
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