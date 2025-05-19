'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

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
    images: string[];
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    amenities: string[];
    buildingAmenities: string[];
    features: string[];
    utilities: string[];
    propertyType: string;
    listingType: string;
    leaseType: string;
    availableDate: string;
    status: string;
    featured?: boolean;
    phoneNumber?: string;
    facebookUrl?: string;
  };
  onSubmit: (data: any) => void;
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

export const ListingForm = ({
  initialData,
  onSubmit,
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
      console.log('Form submitted with data:', data);
      if (!session?.user?.email) {
        throw new Error('Unauthorized');
      }

      await onSubmit(data);
      console.log('Form submission successful');
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

        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
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
        <div className="bg-[#1F1F1F] border border-[#333333] rounded-xl shadow-md p-6 space-y-4 hover:shadow-lg transition-shadow">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[#E0E0E0] uppercase">Contact Information</h3>
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

        <Button type="submit" className="w-full" disabled={loading || isSubmitting}>
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
