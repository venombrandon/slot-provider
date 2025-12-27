import { slot001 } from "./slot001";

export const slots = {
  slot001,
} as const;

export type SlotId = keyof typeof slots;
