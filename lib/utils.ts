import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAvatarUrl(seed?: string): string {
  const id = seed || Math.floor(Math.random() * 1000);
  return `https://picsum.photos/seed/${id}/200/200`;
}
