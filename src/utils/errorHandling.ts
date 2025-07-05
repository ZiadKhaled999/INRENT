// Error handling utilities for InRent application

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
}

export const createAppError = (code: string, message: string, userMessage?: string): AppError => ({
  code,
  message,
  userMessage: userMessage || 'An unexpected error occurred. Please try again.',
});

export const handleSupabaseError = (error: any): AppError => {
  console.error('Supabase error:', error);
  
  // Handle specific Supabase error codes
  switch (error?.code) {
    case 'PGRST116':
      return createAppError('NOT_FOUND', error.message, 'The requested item was not found.');
    
    case '23505':
      return createAppError('DUPLICATE', error.message, 'This item already exists.');
    
    case '23503':
      return createAppError('FOREIGN_KEY', error.message, 'Unable to delete item due to existing dependencies.');
    
    case '42501':
      return createAppError('PERMISSION_DENIED', error.message, 'You do not have permission to perform this action.');
    
    default:
      return createAppError('UNKNOWN', error.message || 'Database error occurred');
  }
};

export const handleAuthError = (error: any): AppError => {
  console.error('Auth error:', error);
  
  switch (error?.message) {
    case 'Invalid login credentials':
      return createAppError('INVALID_CREDENTIALS', error.message, 'Invalid email or password.');
    
    case 'Email not confirmed':
      return createAppError('EMAIL_NOT_CONFIRMED', error.message, 'Please check your email and click the verification link.');
    
    case 'User already registered':
      return createAppError('USER_EXISTS', error.message, 'An account with this email already exists.');
    
    default:
      return createAppError('AUTH_ERROR', error.message || 'Authentication error occurred');
  }
};

export const logError = (error: AppError | Error, context?: string) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    error: error instanceof Error ? error.message : error.message,
    stack: error instanceof Error ? error.stack : undefined,
  };
  
  console.error('Application Error:', errorInfo);
  
  // In production, you would send this to your error tracking service
  // e.g., Sentry, LogRocket, etc.
};

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
};