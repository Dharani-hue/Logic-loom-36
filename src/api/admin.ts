export const API_BASE = 'http://localhost:8000';

export interface ProfileInput {
  name: string;
  age: string;
  gender: string;
  location: string;
  familyContact: string;
  appetite: string;
  mood: string;
  mobility: string;
  sleepQuality: string;
  lonelinessScore: number;
  notes: string;
}

export interface ElderlyProfile extends ProfileInput {
  id: string;
  risk: 'Low' | 'Medium' | 'High';
  createdAt: string;
}

export async function fetchProfiles(familyContact?: string): Promise<ElderlyProfile[]> {
  const url = new URL(`${API_BASE}/api/profiles`);
  if (familyContact) {
    url.searchParams.set('familyContact', familyContact);
  }
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to load profiles');
  }
  return response.json();
}

export async function createProfile(profile: ProfileInput): Promise<ElderlyProfile> {
  const response = await fetch(`${API_BASE}/api/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });
  if (!response.ok) {
    throw new Error('Failed to save profile');
  }
  return response.json();
}
