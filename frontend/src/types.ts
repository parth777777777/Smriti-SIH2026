import type { ReactElement } from "react";

export type Screen =
  | "splash" | "role" | "elder-setup" | "home"
  | "mr-intro" | "mr-remember" | "mr-recall" | "mr-result"
  | "gr-intro" | "gr-remember" | "gr-recall" | "gr-result"
  | "mm-game" | "mm-result"
  | "caregiver-setup" | "caregiver";

export interface CaregiverProfile { name: string; language: string; selectedPatientId: string; patientThemes: string[]; }
export interface Patient { id: string; name: string; age: string; relation: string; avatar: string; statusNote: string; statusColor: string; statusBg: string; }
export type CGTab = "overview" | "progress" | "care" | "settings";
export interface ElderProfile { name: string; age: string; language: string; pin: string; voice: boolean; }
export interface GameObject { id: string; label: string; correct: boolean; bg: string; accent: string; Illustration: () => ReactElement; }
export interface GroceryItem { id: string; label: string; correct: boolean; bg: string; accent: string; Illustration: () => ReactElement; }
export interface ContentItem { id: string; label: string; bg: string; accent: string; themes: string[]; Illustration: () => ReactElement; }
export interface MMPair { pairId: number; label: string; frontBg: string; Illustration: () => ReactElement; }
export interface MMCard extends MMPair { uid: string; }
