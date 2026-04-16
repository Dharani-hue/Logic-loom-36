export type UserRole = 'ngo' | 'family';

export interface AIPrediction {
  risk: 'Low' | 'Medium' | 'High';
  summary: string;
  recommendations: string[];
  alert?: string;
}
