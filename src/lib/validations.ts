import { z } from 'zod';

// Cost detail schema
export const CostDetailSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required')
});

// Package validation schema
export const PackageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  duration: z.string().min(1, 'Duration is required'),
  departureCities: z.array(z.string()).min(1, 'At least one departure city is required'),
  fixedDepartures: z.array(z.string()).min(1, 'At least one departure date is required'),
  costDetails: z.array(CostDetailSchema).min(1, 'At least one cost detail is required'),
  inclusions: z.array(z.string()).min(1, 'At least one inclusion is required'),
  notes: z.array(z.string()),
  itemsToCarry: z.array(z.string()),
  paymentTerms: z.array(z.string()),
  cancellationTerms: z.array(z.string()),
  images: z.array(z.string()).min(1, 'At least one image is required')
});

// Destination validation schema
export const DestinationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required'),
  images: z.array(z.string()).min(1, 'At least one image is required')
});

// Enquiry validation schema
export const EnquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters')
});

// Admin login schema
export const AdminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

// Helper function to format validation errors
export function formatValidationErrors(error: z.ZodError) {
  return {
    error: 'Validation failed',
    fields: error.issues.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }))
  };
}

// Helper function to validate and return formatted errors
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false as const,
      error: formatValidationErrors(result.error)
    };
  }
  
  return {
    success: true as const,
    data: result.data
  };
}
