'use client';

import React, { forwardRef } from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { Label } from './label';

interface StableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  labelClassName?: string;
}

interface StableTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  labelClassName?: string;
}

/**
 * StableInput - A form input component that maintains visual stability
 * during database operations and form submissions
 */
export const StableInput = forwardRef<HTMLInputElement, StableInputProps>(
  ({ className = '', label, error, wrapperClassName = '', labelClassName = '', ...props }, ref) => {
    return (
      <div className={`form-stable ${wrapperClassName}`}>
        {label && (
          <Label 
            htmlFor={props.id} 
            className={`form-label form-stable ${labelClassName}`}
          >
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          className={`w-full form-stable ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500 form-stable">{error}</p>}
      </div>
    );
  }
);

StableInput.displayName = 'StableInput';

/**
 * StableTextarea - A form textarea component that maintains visual stability
 * during database operations and form submissions
 */
export const StableTextarea = forwardRef<HTMLTextAreaElement, StableTextareaProps>(
  ({ className = '', label, error, wrapperClassName = '', labelClassName = '', ...props }, ref) => {
    return (
      <div className={`form-stable ${wrapperClassName}`}>
        {label && (
          <Label 
            htmlFor={props.id} 
            className={`form-label form-stable ${labelClassName}`}
          >
            {label}
          </Label>
        )}
        <Textarea
          ref={ref}
          className={`w-full form-stable ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500 form-stable">{error}</p>}
      </div>
    );
  }
);

StableTextarea.displayName = 'StableTextarea'; 