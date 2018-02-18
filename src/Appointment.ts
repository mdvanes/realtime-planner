export interface Appointment {
  aptId: string;
  date: number; // in milliseconds
  isAdded?: boolean;
  isLocked?: boolean;
  byClientId?: string;
}
