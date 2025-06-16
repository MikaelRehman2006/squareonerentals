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
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

const USER_TYPES = [
  { id: 'realtor', label: 'Realtor' },
  { id: 'landlord', label: 'Landlord' },
  { id: 'renter', label: 'Looking to Rent' },
  { id: 'buyer', label: 'Looking to Buy' }
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

export default function PostSignupSurvey() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [currentType, setCurrentType] = useState<string>('');
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  
  // Form state for each user type
  const [formData, setFormData] = useState({
    city: '',
    customCity: '',
    bedrooms: '',
    bathrooms: '',
    priceRange: { min: '', max: '' },
    propertyType: '',
    moveInDate: '',
    additionalRequirements: ''
  });

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

  const isStepComplete = (type: string) => {
    switch (type) {
      case 'realtor':
        return formData.city && formData.propertyType && formData.priceRange.min;
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

      toast.success('Preferences saved successfully!');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to save preferences. Please try again.');
    }
  };

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl">
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
                className="flex items-center gap-2"
                disabled={!selectedTypes.includes(type.id)}
              >
                {index + 1}. {type.label}
                {completedSteps[type.id] && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="space-y-6 py-4">
            {!currentType ? (
              <div className="space-y-4">
                <Label>What best describes you? (Select all that apply)</Label>
                <div className="space-y-2">
                  {USER_TYPES.map(type => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={() => handleTypeToggle(type.id)}
                      />
                      <Label htmlFor={type.id}>{type.label}</Label>
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
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Select value={formData.city} onValueChange={(value) => handleFormChange('city', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {CANADIAN_CITIES.map(city => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Or type your city"
                      value={formData.customCity}
                      onChange={(e) => handleFormChange('customCity', e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  {currentType === 'realtor' && (
                    <>
                      <div className="space-y-2">
                        <Label>Property Type</Label>
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
                    </>
                  )}

                  {(currentType === 'landlord' || currentType === 'renter' || currentType === 'buyer') && (
                    <>
                      <div className="space-y-2">
                        <Label>Bedrooms</Label>
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
                        <Label>Bathrooms</Label>
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
                      <Label>Maximum Price</Label>
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
                      <Label>Desired Move-in Date</Label>
                      <Input
                        type="date"
                        value={formData.moveInDate}
                        onChange={(e) => handleFormChange('moveInDate', e.target.value)}
                      />
                    </div>
                  )}

                  {currentType === 'landlord' && (
                    <div className="space-y-2">
                      <Label>Minimum Price</Label>
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
                </div>

                <div className="space-y-2">
                  <Label>Additional Requirements</Label>
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
                  >
                    {selectedTypes.indexOf(currentType) === selectedTypes.length - 1 ? 'Submit' : 'Next'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 