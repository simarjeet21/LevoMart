import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// lib/utils.ts
// export function cn(...classes: (string | false | null | undefined)[]): string {
//   return classes.filter(Boolean).join(" ");
// }
