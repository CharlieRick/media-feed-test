import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export function tw(...inputs: any[]): string {
  return twMerge(clsx(inputs));
}
