export type UserRole = "customer" | "owner" | "admin";

export interface DashboardUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  address?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Equipment {
  _id: string;
  equipmentName: string;
  description?: string;
  category: string;
  location?: string;
  rentalPrice: number;
  rentalType: "hourly" | "daily" | "weekly" | "monthly";
  availableQuantity: number;
  condition?: string;
  brand?: string;
  model?: string;
  imageUrl?: string;
  rentalTerms?: string;
  status: "pending" | "approved" | "rejected";
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  _id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage?: string;
  rentalStartDate: string;
  rentalEndDate: string;
  duration: number;
  requiredQuantity: number;
  pricePerUnit: number;
  totalAmount: number;
  contactNumber?: string;
  deliveryAddress?: string;
  additionalNotes?: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  bookingStatus:
    | "pending"
    | "confirmed"
    | "ongoing"
    | "completed"
    | "cancelled"
    | "rejected";
  bookingDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Favorite {
  _id: string;
  userId: string;
  equipmentId: string;
  equipment: Equipment;
  createdAt?: string;
}

export interface MonthlyPoint {
  label: string;
  value: number;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalEquipment: number;
  totalBookings: number;
  pendingApprovals: number;
  completedRentals: number;
  totalRevenue: number;
  customers: number;
  owners: number;
  admins: number;
  monthlyBookings: MonthlyPoint[];
  monthlyRevenue: MonthlyPoint[];
  recentBookings: Booking[];
  recentUsers: DashboardUser[];
  pendingEquipment: Equipment[];
}

export interface OwnerAnalytics {
  totalEquipment: number;
  pendingApprovals: number;
  completedRentals: number;
  activeRentals: number;
  totalEarnings: number;
  monthlyEarnings: MonthlyPoint[];
  recentBookings: Booking[];
  topEquipment: {
    name: string;
    bookings: number;
    revenue: number;
  }[];
  equipmentList: Equipment[];
}

export interface CustomerAnalytics {
  totalRentals: number;
  activeRentals: number;
  completedRentals: number;
  favorites: number;
  totalSpent: number;
  monthlyBookings: MonthlyPoint[];
  recentBookings: Booking[];
  recommendedEquipment: Equipment[];
}

export interface ApiListResponse<T> {
  success: boolean;
  count?: number;
  message?: string;
  [key: string]: unknown;
  data?: T;
}
