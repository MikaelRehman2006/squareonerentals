'use client';

import React, { useState, useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface StableFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void | Promise<void>;
  children: React.ReactNode;
  resetOnSuccess?: boolean;
}

/**
 * StableForm - A wrapper component that provides CSS stability during form submissions
 * Particularly useful for forms that interact with databases and cause re-renders
 */
export function StableForm({
  form,
  onSubmit,
  children,
  resetOnSuccess = true,
}: StableFormProps) {
  // Form key regeneration for forced unmount/remount
  const [formKey, setFormKey] = useState<number>(Date.now());

  // Reset the form key when data changes
  useEffect(() => {
    if (resetOnSuccess) {
      setFormKey(Date.now());
    }
  }, [resetOnSuccess]);

  return (
    <div key={formKey}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {children}
      </form>
    </div>
  );
}