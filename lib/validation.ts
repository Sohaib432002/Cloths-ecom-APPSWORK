import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name.'),
  email: z.string().email('Enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Include at least one uppercase letter.')
    .regex(/[0-9]/, 'Include at least one number.'),
  phone: z.string().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Include at least one uppercase letter.')
    .regex(/[0-9]/, 'Include at least one number.'),
})

export const profileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  nextPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
})

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10, 'Tell us a little more so we can help.'),
})

export const newsletterSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
})

export const couponSchema = z.object({
  code: z.string().min(3),
  subtotal: z.number().nonnegative(),
})

export const orderItemSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  image: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  size: z.string().optional(),
  color: z.string().optional(),
})

export const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string().min(7, 'Enter a valid phone number.'),
  address: z.string().min(5, 'Enter your street address.'),
  city: z.string().min(2, 'City is required.'),
  country: z.string().min(2).default('United States'),
  zipCode: z.string().min(3, 'Postal code is required.'),
  paymentMethod: z.enum(['cod', 'card', 'paypal']),
  couponCode: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Your cart is empty.'),
})

export const stylistSchema = z.object({
  message: z.string().min(3, 'Tell the stylist what you need.').max(600),
  occasion: z.string().optional(),
  productSlug: z.string().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .max(8)
    .optional(),
})
