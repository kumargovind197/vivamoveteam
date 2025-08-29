import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
interface Department {
  name: string;
  avgSteps: number;
}

interface Member {
  id: string;
  firstName: string;
  surname: string;
  avatarUrl: string;
  department: string;
  monthlySteps: number;
}
