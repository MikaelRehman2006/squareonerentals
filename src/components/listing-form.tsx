'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ListingFormProps {
  initialData: {
    title: string;
    description: string;
    price: number;
    location: string;
    address: string;
    squareFeet: number;
    images: string[];
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    buildingAmenities: string[];
    propertyType: string;
    listingType: string;
    leaseType: string;
    availableDate: string;
    parking: string;
    featured: boolean;
    status: string;
    features: {
      wifi: boolean;
      airConditioning: boolean;
      laundry: boolean;
      heating: boolean;
      furnished: boolean;
      smartHomeFeatures: boolean;
      walkInCloset: boolean;
    };
    utilities: {
      electricity: boolean;
      gas: boolean;
      water: boolean;
      internet: boolean;
      trashCollection: boolean;
    };
    phoneNumber?: string;
    facebookUrl?: string;
  };
  onSubmit: (data: any) => void;
  showStatusToggle?: boolean;
  isSubmitting?: boolean;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  location: z.string().min(1, "Location is required"),
  images: z.array(z.string()).default([]),
  bedrooms: z.coerce.number().min(0, "Bedrooms must be a positive number"),
  bathrooms: z.coerce.number().min(0, "Bathrooms must be a positive number"),
  squareFeet: z.coerce.number().min(0, "Square feet must be a positive number"),
  amenities: z.array(z.string()).default([]),
  buildingAmenities: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  utilities: z.array(z.string()).default([]),
  propertyType: z.string().min(1, "Property type is required"),
  listingType: z.string().min(1, "Listing type is required"),
  leaseType: z.string().min(1, "Lease type is required"),
  availableDate: z.string().min(1, "Available date is required"),
  status: z.string().min(1, "Status is required"),
  featured: z.boolean().default(false),
  phoneNumber: z.string().optional(),
  facebookUrl: z.string().url("Please enter a valid Facebook URL").optional(),
});

type FormValues = z.infer<typeof formSchema>;

function isPlainObject(obj: unknown): obj is Record<string, boolean> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export const ListingForm = ({
  initialData,
  onSubmit,
  showStatusToggle = false,
  isSubmitting = false,
}: ListingFormProps) => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  console.log('ListingForm initialized with data:', initialData);

  // Convert initialData to match the form schema if needed
  const formattedInitialData: FormValues = {
    ...initialData,
    features: Array.isArray(initialData.features) ? initialData.features : [],
    utilities: Array.isArray(initialData.utilities) ? initialData.utilities : [],
    buildingAmenities: Array.isArray(initialData.buildingAmenities) ? initialData.buildingAmenities : [],
    amenities: Array.isArray(initialData.amenities) ? initialData.amenities : [],
    images: Array.isArray(initialData.images) ? initialData.images : [],
    featured: initialData.featured || false
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formattedInitialData,
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      if (!session?.user?.email) {
        throw new Error('Unauthorized');
      }
      let featuresArray: string[] = [];
      if (isPlainObject(data.features)) {
        const featuresObj = data.features as Record<string, boolean>;
        featuresArray = Object.keys(featuresObj).filter((key: string) => {
          const val: boolean = featuresObj[key];
          return typeof val === 'boolean' && val;
        });
      } else if (Array.isArray(data.features)) {
        featuresArray = data.features;
      }
      let utilitiesArray: string[] = [];
      if (isPlainObject(data.utilities)) {
        const utilitiesObj = data.utilities as Record<string, boolean>;
        utilitiesArray = Object.keys(utilitiesObj).filter((key: string) => {
          const val: boolean = utilitiesObj[key];
          return typeof val === 'boolean' && val;
        });
      } else if (Array.isArray(data.utilities)) {
        utilitiesArray = data.utilities;
      }
      const formattedData = {
        ...data,
        buildingAmenities: Array.isArray(data.buildingAmenities) ? data.buildingAmenities : [],
        features: featuresArray,
        utilities: utilitiesArray,
      };
      await onSubmit(formattedData);
      toast.success('Listing updated successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to submit form');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add new dropdown options
  const PROPERTY_TYPES = [
    'Apartment', 'House', 'Condo', 'Townhouse', 'Studio', 'Loft', 'Basement Suite', 'Tiny Home', 'Garage Unit', 'Other'
  ];
  const PARKING_OPTIONS = [
    'None', 'Street Parking', 'Private Parking', 'Garage Parking', 'Underground Parking', 'Permit Required', 'Shared Driveway', 'Other'
  ];
  const LEASE_TYPES = [
    'Fixed Term (6 months/1 year)', 'Month to Month', 'Short Term (<6 months)', 'Other'
  ];
  const LEASE_OTHER_OPTIONS = [
    'Student Lease (e.g., 8 months)', 'Sublet', 'Flexible Lease'
  ];
  const LISTING_TYPES = [
    'Long Term', 'Short Term', 'Vacation Rental', 'Sublet', 'Rent-to-Own', 'Other'
  ];

  // Add state for 'Other' fields
  const [propertyTypeOther, setPropertyTypeOther] = useState('');
  const [parkingOther, setParkingOther] = useState('');
  const [leaseTypeOther, setLeaseTypeOther] = useState('');
  const [listingTypeOther, setListingTypeOther] = useState('');

  // Add state for 'Available Immediately'
  const [availableImmediately, setAvailableImmediately] = useState(false);

  const handlePreview = () => { /* TODO: Implement preview logic */ };
  const handleSaveDraft = () => { /* TODO: Implement save draft logic */ };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathrooms</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="squareFeet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Square Footage</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h2 className="text-lg font-semibold mb-2">Property Details</h2>
        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-900 text-white border border-gray-700 shadow-lg max-h-60 overflow-y-auto">
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Show 'Other' input if selected */}
              {form.watch('propertyType') === 'Other' && (
                <Input value={propertyTypeOther} onChange={e => setPropertyTypeOther(e.target.value)} placeholder="Please specify" className="mt-2" />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="listingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Listing Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="short_term">Short Term</SelectItem>
                  <SelectItem value="long_term">Long Term</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="e.g., (123) 456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facebookUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook Profile URL (Optional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="e.g., https://facebook.com/username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Information */}
        <h2 className="text-lg font-semibold mb-2 mt-6">Contact Information</h2>
        <div className="bg-[#1F1F1F] border border-[#333333] rounded-xl shadow-md p-6 space-y-4 hover:shadow-lg transition-shadow">
          <div className="space-y-2">
            <p className="text-[#A0A0A0] text-sm">
              Add your contact details below (optional). This information will be displayed on your listing 
              so potential renters can reach out to you directly about the property.
            </p>
          </div>
          
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#CCCCCC] flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3B82F6]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  Phone Number (Optional)
                </FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    placeholder="e.g., (123) 456-7890" 
                    {...field} 
                    className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm"
                  />
                </FormControl>
                <p className="text-sm text-[#A0A0A0]">Add your phone number if you'd like potential renters to call or text you.</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="facebookUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#CCCCCC] flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3B82F6]"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  Facebook Profile URL (Optional)
                </FormLabel>
                <FormControl>
                  <Input 
                    type="url" 
                    placeholder="e.g., https://facebook.com/username" 
                    {...field} 
                    className="bg-[#2A2A2A] text-white border-[#444444] focus:border-[#3B82F6] focus:ring-[#3B82F6] shadow-sm"
                  />
                </FormControl>
                <p className="text-sm text-[#A0A0A0]">Link to your Facebook profile or a relevant Facebook group.</p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="leaseType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lease Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lease type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Term (6 months/1 year)</SelectItem>
                  <SelectItem value="month_to_month">Month to Month</SelectItem>
                  <SelectItem value="short_term">Short Term (less than 6 months)</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availableDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2 mt-2">
          <Checkbox checked={availableImmediately} onCheckedChange={checked => {
            setAvailableImmediately(!!checked);
            if (checked) form.setValue('availableDate', new Date().toISOString().split('T')[0]);
          }} />
          <span>Available Immediately</span>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="ml-2 cursor-pointer text-gray-400">ℹ️</span>
            </TooltipTrigger>
            <TooltipContent>Upload up to 10 images. Max size: 5MB each.</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex gap-2 mt-4">
          <Button type="button" variant="secondary" onClick={handlePreview}>Preview Listing</Button>
          <Button type="button" variant="outline" onClick={handleSaveDraft}>Save as Draft</Button>
          <Button type="submit" disabled={loading || isSubmitting}>Submit</Button>
        </div>
      </form>
    </Form>
  );
}
