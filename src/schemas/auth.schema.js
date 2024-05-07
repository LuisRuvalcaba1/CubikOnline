import {z} from 'zod';

export const registerSchema = z.object({
    username: z.string({
      required_error: 'Username is required',
    }),
    email: z.string({
      required_error: 'Email is required',
    }).email('Invalid email'),
    password: z.string({
      required_error: 'Password is required',
    })
      .min(10, { message: 'Password must be at least 10 characters long' })
      .regex(/^(?=.*[A-Z])(?=.*\d)/, { message: 'Password must contain at least one uppercase letter and one number' }),
    confirmPassword: z.string({
      required_error: 'Confirm password is required',
    }),
    firstName: z.string({
      required_error: 'First name is required',
    })
      .min(3, { message: 'First name must be at least 3 characters long' })
      .max(50, { message: 'First name must be at most 50 characters long' })
      .regex(/^[a-zA-Z\s]*$/, { message: 'First name must contain only letters' }),
    lastName: z.string({
      required_error: 'Last name is required',
    })
      .min(2, { message: 'Last name must be at least 2 characters long' })
      .max(50, { message: 'Last name must be at most 50 characters long' })
      .regex(/^[a-zA-Z\s]*$/, { message: 'Last name must contain only letters' }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required'
    }).email('Email is not valid'),
    password: z.string({
        required_error: 'Password is required'
    }).min(10, {message: 'Password must be at least 10 characters long'})
});
