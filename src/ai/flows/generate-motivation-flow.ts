'use server';
/**
 * @fileOverview A flow for generating motivational step-tracking messages.
 *
 * - generateMotivation - A function that creates a short, encouraging message for a user based on their step progress.
 * - GenerateMotivationInput - The input type for the generateMotivation function.
 * - GenerateMotivationOutput - The return type for the generateMotivation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateMotivationInputSchema = z.object({
  userName: z.string().describe('The first name of the user.'),
  stepGoal: z.number().describe('The user\'s daily step goal.'),
  currentSteps: z.number().describe('The user\'s current step count for the day.'),
});
export type GenerateMotivationInput = z.infer<typeof GenerateMotivationInputSchema>;

const GenerateMotivationOutputSchema = z.object({
  message: z.string().describe('The motivational message to be sent to the user. It should be encouraging and context-aware. Maximum 2-3 sentences.'),
});
export type GenerateMotivationOutput = z.infer<typeof GenerateMotivationOutputSchema>;


export async function generateMotivation(input: GenerateMotivationInput): Promise<GenerateMotivationOutput> {
  return generateMotivationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMotivationPrompt',
  input: {schema: GenerateMotivationInputSchema},
  output: {schema: GenerateMotivationOutputSchema},
  prompt: `You are a friendly and encouraging fitness coach AI. Your task is to generate a short, personalized, and motivational message for a user based on their daily step progress.

User's Name: {{{userName}}}
User's Daily Step Goal: {{{stepGoal}}}
User's Current Steps Today: {{{currentSteps}}}

Analyze the user's progress. The progress percentage is (currentSteps / stepGoal) * 100.
- If currentSteps is 0, provide a friendly "good morning" type of message to start their day.
- If they have made some progress but are less than 50% of the way, give them a light nudge.
- If they are at 50% or more, congratulate them on the milestone.
- If they are at 75% or more, give them a final push to the finish line.
- If they have met or exceeded their goal (100%+), write a congratulatory message.

Keep the message concise (2-3 sentences max) and always positive. Address the user by their name. Do not repeat the same message.`,
});

const generateMotivationFlow = ai.defineFlow(
  {
    name: 'generateMotivationFlow',
    inputSchema: GenerateMotivationInputSchema,
    outputSchema: GenerateMotivationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
