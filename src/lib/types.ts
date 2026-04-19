export interface Customer {
  customerId: number;
  name: string;
  email: string;
  telephone: string;
  customerType: string;
  companyName: string | null;
  emailVerified: boolean;
}

export interface Vehicle {
  vehicleId: number;
  modelNumber: string;
  name: string;
  description: string;
  pictureUrl: string;
  unitPrice: number;
  vehicleType: string;
  rangeKm: number | null;
  batteryCapacityKwh: number | null;
  chargingTimeMin: number | null;
  horsepower: number | null;
  topSpeedKmh: number | null;
  seatingCapacity: number | null;
  warrantyYears: number | null;
  features: string[];
  colors: string[];
  seminars?: Seminar[];
}

export interface Seminar {
  seminarId: number;
  vehicleId: number;
  vehicleName: string;
  vehicleModelNumber: string;
  seminarDate: string;
  venue: string;
  maxSeats: number;
  bookedSeats: number;
  availableSeats: number;
  description: string | null;
  speakerName: string | null;
  language: string;
  seminarType: string;
  registrationDeadline: string | null;
}

export interface Registration {
  registrationId: number;
  customerId: number;
  customerName: string;
  seminarId: number;
  vehicleName: string;
  vehicleModelNumber: string;
  seminarDate: string;
  venue: string;
  numSeats: number;
  status: 'SUCCESS' | 'CANCEL' | 'WAIT';
  specialRequests: string | null;
  attended: boolean;
  checkInTime: string | null;
  registeredAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
