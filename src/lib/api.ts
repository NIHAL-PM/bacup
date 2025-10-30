// API Configuration - Update BASE_URL to your MongoDB backend endpoint
const BASE_URL = 'http://localhost:3000/api'; // REPLACE WITH YOUR BACKEND URL

export interface RegistrationData {
  fullName: string;
  contactNumber: string;
  email: string;
  linkedinProfile?: string;
  designation: string;
  business: string;
  sectors: string[];
  otherSector?: string;
  experience: string;
  achievements?: string;
  futurePlan: string;
  dateOfBirth: string;
}

export interface Attendee extends RegistrationData {
  _id: string;
  registrationDate: string;
  attended: boolean;
  attendedAt?: string;
  qrCode: string;
}

export interface LoginCredentials {
  fullName: string;
  dateOfBirth: string;
}

// Register a new attendee
export const registerAttendee = async (data: RegistrationData): Promise<Attendee> => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
};

// Login with name and DOB
export const loginAttendee = async (credentials: LoginCredentials): Promise<Attendee> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};

// Get all attendees (admin)
export const getAllAttendees = async (adminKey: string): Promise<Attendee[]> => {
  const response = await fetch(`${BASE_URL}/admin/attendees`, {
    headers: { 'Authorization': `Bearer ${adminKey}` },
  });
  if (!response.ok) throw new Error('Failed to fetch attendees');
  return response.json();
};

// Mark attendance (staff)
export const markAttendance = async (qrCode: string, staffKey: string): Promise<Attendee> => {
  const response = await fetch(`${BASE_URL}/staff/attendance`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${staffKey}`
    },
    body: JSON.stringify({ qrCode }),
  });
  if (!response.ok) throw new Error('Failed to mark attendance');
  return response.json();
};

// Delete attendee (admin)
export const deleteAttendee = async (id: string, adminKey: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/admin/attendees/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminKey}` },
  });
  if (!response.ok) throw new Error('Failed to delete attendee');
};
