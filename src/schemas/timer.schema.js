import {z} from 'zod'

export const createTimerSchema = z.object({
    time: z.string({required_error: "Time is required"}).min(3).max(255),
    scramble: z.string({required_error: "Scramble is required"}).min(3).max(255),
    session: z.number({required_error: "Session is required"}).min(1).max(255),
});
