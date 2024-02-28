import {z} from 'zod';

export const createTaskSchema = z.object({
    title: z.string({required_error: "Title is required"}).min(3).max(255),
    description: z.string({required_error:"Description must be a string"}).min(3).max(255),
    date: z.string().datetime().optional()
});