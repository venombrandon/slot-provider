import { Feature } from "./types";
import { bonusTriggerFeature } from "./bonusTrigger";

export const featureRegistry: Record<string, Feature> = {
  bonusTrigger: bonusTriggerFeature,
};
