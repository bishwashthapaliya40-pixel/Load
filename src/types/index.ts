export type UserRole = 'customer' | 'driver' | 'courier' | 'fleet_company' | 'admin';

export type Language = 'ne' | 'en' | 'hi' | 'zh';

export type VehicleCategory =
  | 'three_wheel'
  | 'four_wheel_pickup'
  | 'cargo_van'
  | 'mini_truck'
  | 'six_wheel_truck'
  | 'eight_wheel_truck'
  | 'ten_wheel_truck'
  | 'twelve_wheel_truck'
  | 'fourteen_wheel_truck'
  | 'heavy_freight_trailer';

export type CargoCategory =
  | 'fmcg'
  | 'construction'
  | 'agricultural'
  | 'perishable'
  | 'furniture'
  | 'machinery'
  | 'electronics'
  | 'courier_parcels'
  | 'timber_minerals'
  | 'other';

export type BodyType =
  | 'open_body'
  | 'covered_container'
  | 'tarpaulin_high_side'
  | 'refrigerated_reefer'
  | 'flatbed_trailer'
  | 'liquid_tanker';

export type ShipmentStatus =
  | 'open'
  | 'bidding'
  | 'assigned'
  | 'at_pickup'
  | 'loaded'
  | 'in_transit'
  | 'at_destination'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod =
  | 'esewa'
  | 'khalti'
  | 'connectips'
  | 'bank_transfer'
  | 'cash_on_delivery';

export type PaymentStatus = 'unpaid' | 'advance_paid' | 'fully_paid';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface DriverLicenseVerification {
  licenseNumber: string;
  category: string; // e.g. 'B - Light', 'F - Medium Freight', 'G - Heavy Freight Multi-Axle'
  expiryDate: string;
  frontDocUrl: string;
  backDocUrl: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface NationalIdVerification {
  idType: 'national_id' | 'citizenship' | 'passport';
  idNumber: string;
  issuedDistrict: string;
  issuedDate: string;
  frontDocUrl: string;
  backDocUrl: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface VehicleOwnerVerification {
  vehicleId: string;
  vehiclePlate: string;
  bluebookNumber: string;
  bluebookExpiry: string;
  bluebookDocUrl: string;
  taxTokenExpiry: string;
  taxTokenDocUrl: string;
  routePermitNumber?: string;
  routePermitExpiry?: string;
  routePermitDocUrl?: string;
  ownershipDeedDocUrl?: string;
  insuranceDocUrl?: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface CompanyVerification {
  companyName: string;
  panNumber: string;
  vatNumber?: string;
  registrationNumber: string;
  registrationDocUrl: string;
  panVatDocUrl: string;
  authorizedRepName: string;
  authorizedRepDesignation: string;
  authorizedRepPhone: string;
  authorizedRepIdDocUrl: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface VerificationAuditLog {
  id: string;
  entityType: 'driver' | 'identity' | 'vehicle' | 'company' | 'phone';
  entityId: string;
  entityName: string;
  adminId: string;
  adminName: string;
  previousStatus: VerificationStatus | boolean;
  newStatus: VerificationStatus | boolean;
  reason?: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  panVatNumber?: string;
  preferredLanguage?: Language;
  verified: boolean; // general composite status
  phoneVerified: boolean;
  identityVerified: VerificationStatus;
  driverVerified: VerificationStatus;
  companyVerified: VerificationStatus;
  vehicleVerified?: VerificationStatus;
  driverLicenseRecord?: DriverLicenseVerification;
  nationalIdRecord?: NationalIdVerification;
  companyVerificationRecord?: CompanyVerification;
  rating: number;
  totalTrips: number;
  location: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  plateNumber: string; // e.g., 'Ba 2 Kha 4892'
  category: VehicleCategory;
  modelName: string; // e.g., 'Mahindra Bolero Maxi Truck Plus'
  wheelCount: number;
  payloadCapacityKg: number;
  dimensions: {
    lengthFt: number;
    widthFt: number;
    heightFt: number;
  };
  bodyType: BodyType;
  photoUrl: string;
  bluebookNumber: string;
  bluebookExpiry: string;
  routePermitNumber: string;
  routePermitExpiry: string;
  pollutionExpiry: string;
  verified: boolean;
  vehicleVerified: VerificationStatus;
  vehicleOwnerVerificationRecord?: VehicleOwnerVerification;
  status: 'available' | 'on_trip' | 'maintenance';
  currentCity: string;
  hasGps: boolean;
  lat?: number;
  lng?: number;
}

export interface CargoPost {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerCompany?: string;
  title: string;
  category: CargoCategory;
  weightKg: number;
  volumeCft?: number;
  pickupLocation: {
    city: string;
    district: string;
    address: string;
    contactPerson: string;
    contactPhone: string;
  };
  destinationLocation: {
    city: string;
    district: string;
    address: string;
    contactPerson: string;
    contactPhone: string;
  };
  requiredVehicleCategory?: VehicleCategory;
  pickupDate: string;
  deliveryDeadline: string;
  declaredValueNPR: number;
  photos: string[];
  laborRequired: number; // Helpers required for loading
  specialInstructions?: string;
  status: ShipmentStatus;
  initialBudgetNPR: number;
  bidsCount: number;
  isReturnTripMatch?: boolean;
  createdAt: string;
}

export interface BidOffer {
  id: string;
  cargoId: string;
  cargoTitle: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  vehicleId: string;
  vehiclePlate: string;
  vehicleCategory: VehicleCategory;
  offeredFareNPR: number;
  customerCounterFareNPR?: number;
  driverCounterFareNPR?: number;
  pickupETA: string;
  message?: string;
  status: 'pending' | 'countered_by_customer' | 'countered_by_driver' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Booking {
  id: string;
  cargoId: string;
  cargoTitle: string;
  cargoWeightKg: number;
  customerId: string;
  customerName: string;
  customerPhone: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleCategory: VehicleCategory;
  pickupCity: string;
  destinationCity: string;
  pickupAddress: string;
  destinationAddress: string;
  distanceKm: number;
  agreedFareNPR: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  advanceAmountNPR: number;
  balanceAmountNPR: number;
  status: ShipmentStatus;
  currentCheckpoint: string;
  eta: string;
  otpCode: string;
  challanNumber: string;
  tripId?: string;
  trackingCode?: string;
  proofOfDelivery?: {
    loadingPhotoUrl?: string;
    unloadingPhotoUrl?: string;
    consigneeName: string;
    consigneePhone: string;
    otpVerified: boolean;
    digitalSignature?: string;
    deliveredAt: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReturnTrip {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleCategory: VehicleCategory;
  fromCity: string;
  toCity: string;
  departureDate: string;
  availableCapacityKg: number;
  standardFareNPR: number;
  discountedFareNPR: number; // Up to 35% discount to avoid empty run
  notes?: string;
  status: 'available' | 'matched' | 'completed';
  createdAt: string;
}

export interface InsuranceRecord {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  insuranceType: 'third_party' | 'comprehensive' | 'goods_in_transit';
  policyNumber: string;
  insurerName: string; // e.g., 'Shikhar Insurance', 'Siddhartha Premier', 'Rastriya Beema'
  coverageAmountNPR: number;
  issueDate: string;
  expiryDate: string;
  documentUrl?: string;
  verified: boolean;
  status: 'valid' | 'expiring_soon' | 'expired';
}

export interface DisputeReport {
  id: string;
  bookingId: string;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  category: 'damaged_cargo' | 'missing_items' | 'delay' | 'fare_dispute' | 'fraud_suspicion' | 'unprofessional_behavior';
  description: string;
  photos: string[];
  claimedAmountNPR?: number;
  status: 'pending_review' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface EmergencyService {
  id: string;
  name: string;
  nameNe: string;
  category: 'police' | 'traffic_police' | 'ambulance' | 'highway_patrol' | 'heavy_crane_towing' | 'fuel_station' | 'rest_stop';
  location: string;
  highway: string; // e.g., 'Prithvi Highway', 'Mahendra Highway', 'Tribhuvan Highway'
  contactPhone: string;
  lat: number;
  lng: number;
  is24x7: boolean;
}

export interface ChallanDetails {
  challanNumber: string;
  biltyNumber: string;
  bookingId: string;
  consignor: {
    name: string;
    company: string;
    pan: string;
    phone: string;
    address: string;
  };
  consignee: {
    name: string;
    company: string;
    pan: string;
    phone: string;
    address: string;
  };
  carrier: {
    driverName: string;
    driverPhone: string;
    licenseNumber: string;
    vehiclePlate: string;
    vehicleType: string;
    transportCompany?: string;
  };
  goods: {
    description: string;
    packageCount: number;
    weightKg: number;
    declaredValueNPR: number;
  };
  financials: {
    totalFreightNPR: number;
    advancePaidNPR: number;
    balancePayableNPR: number;
    paymentMode: string;
  };
  issuedAt: string;
  qrPayload: string;
}

export type TripStatus = 'assigned' | 'accepted' | 'in_transit' | 'delayed' | 'delivered' | 'cancelled';
export type TripPaymentStatus = 'pending' | 'partially_paid' | 'paid' | 'cancelled';
export type FuelType = 'diesel' | 'petrol' | 'cng' | 'ev';
export type FuelRecordStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested';
export type FuelPolicy = 'optional' | 'required_every_trip' | 'required_selected_drivers';
export type ExpenseCategory =
  | 'repairs_servicing'
  | 'tyres_parts'
  | 'parking_tolls'
  | 'loading_unloading'
  | 'road_permits_taxes'
  | 'driver_allowance'
  | 'other';
export type DelayReason =
  | 'mechanical_breakdown'
  | 'tyre_puncture'
  | 'traffic_jam'
  | 'road_closure'
  | 'landslide'
  | 'weather'
  | 'checkpoint'
  | 'fuel_stop'
  | 'loading_delay'
  | 'driver_rest'
  | 'accident_emergency'
  | 'other';
export type LocationSource = 'browser_gps' | 'mobile_device' | 'manual_driver_update' | 'hardware_gps';

export interface LocationUpdate {
  id: string;
  tripId: string;
  vehicleId: string;
  timestamp: string;
  lat: number;
  lng: number;
  checkpoint: string;
  speedKmh?: number;
  heading?: string;
  source: LocationSource;
  isLive: boolean;
}

export interface DelayBreakdownReport {
  id: string;
  tripId: string;
  bookingId: string;
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  reportedAt: string;
  reason: DelayReason;
  locationName: string;
  coords?: { lat: number; lng: number };
  description: string;
  photoUrl?: string;
  expectedDelayMinutes: number;
  revisedETA: string;
  requiresRoadsideAssistance: boolean;
  resumedAt?: string;
  status: 'active' | 'resumed' | 'assistance_dispatched';
}

export interface FuelRecord {
  id: string;
  tripId: string;
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  refuelDate: string;
  fuelType: FuelType;
  litres: number;
  pricePerLitreNPR: number;
  totalCostNPR: number;
  odometerKm: number;
  stationName: string;
  stationLocation: string;
  receiptPhotoUrl?: string;
  notes?: string;
  submittedBy: string;
  submittedAt: string;
  status: FuelRecordStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface VehicleExpense {
  id: string;
  tripId?: string;
  vehicleId: string;
  vehiclePlate: string;
  driverId?: string;
  driverName?: string;
  category: ExpenseCategory;
  amountNPR: number;
  expenseDate: string;
  description: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface FuelPolicyConfig {
  vehicleId: string;
  vehiclePlate: string;
  policy: FuelPolicy;
  assignedDriverIds?: string[];
  updatedAt: string;
}

export interface Trip {
  id: string; // e.g., 'TRIP-2026-101'
  shipmentId: string; // cargoId or bookingId
  bookingId: string;
  trackingCode: string; // e.g., 'TRK-LM-2026-8819'
  vehicleId: string;
  vehiclePlate: string;
  vehicleCategory: VehicleCategory;
  driverId: string;
  driverName: string;
  driverPhone: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  cargoTitle: string;
  cargoWeightKg: number;
  pickupCity: string;
  pickupAddress: string;
  destinationCity: string;
  destinationAddress: string;
  pickupDateTime: string;
  actualDepartureTime?: string;
  deliveryDateTime?: string;
  distanceKm: number; // planned/corridor distance
  startOdometer?: number;
  endOdometer?: number;
  actualOdometerKm?: number; // endOdometer - startOdometer when both available
  agreedFreightNPR: number; // Gross agreed freight
  additionalChargesNPR: number;
  tollParkingNPR: number;
  loadingUnloadingNPR: number;
  fuelExpensesNPR: number;
  maintenanceExpensesNPR: number;
  platformCommissionNPR: number; // Commission charged by platform
  netEarningsNPR: number; // Agreed freight + additional - commission - driver expenses
  grossRevenueNPR: number; // Agreed freight + additional
  paymentStatus: TripPaymentStatus;
  tripStatus: TripStatus;
  currentCheckpoint?: string;
  currentLat?: number;
  currentLng?: number;
  lastLocationUpdateTime?: string;
  locationSource?: LocationSource;
  isLocationLive?: boolean;
  eta: string;
  revisedEta?: string;
  hasActiveDelay?: boolean;
  latestDelayReport?: DelayBreakdownReport;
  deliveryOtp?: string;
  proofOfDelivery?: Booking['proofOfDelivery'];
  fuelRecords?: FuelRecord[];
  expenses?: VehicleExpense[];
  createdAt: string;
  updatedAt: string;
}

export interface TripNotification {
  id: string;
  tripId: string;
  recipientRole: 'customer' | 'driver' | 'fleet_company' | 'admin' | 'all';
  recipientId?: string;
  type:
    | 'trip_started'
    | 'delay_reported'
    | 'breakdown_emergency'
    | 'eta_changed'
    | 'journey_resumed'
    | 'destination_reached'
    | 'delivery_confirmed'
    | 'fuel_logged'
    | 'expense_submitted'
    | 'pod_submitted';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface DriverEarningsReport {
  driverId: string;
  driverName: string;
  period: string; // 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  totalCompletedTrips: number;
  totalKilometresTravelled: number;
  totalGrossFreightEarned: number;
  totalReceivedPayments: number;
  totalPendingPayments: number;
  totalApprovedExpenses: number;
  totalNetEarnings: number;
  tripsList: {
    tripId: string;
    date: string;
    route: string;
    vehiclePlate: string;
    distanceKm: number;
    grossFreight: number;
    netEarned: number;
    paymentStatus: TripPaymentStatus;
    tripStatus: TripStatus;
  }[];
}

export interface VehicleOwnerReport {
  ownerId: string;
  ownerName: string;
  period: string;
  totalFleetVehicles: number;
  totalTripsCompleted: number;
  totalFleetDistanceKm: number;
  totalGrossRevenue: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalOtherExpenses: number;
  totalOperatingExpenses: number;
  estimatedNetProfit: number;
  hasIncompleteExpenseData: boolean;
  incompleteDataReason?: string;
  unpaidCustomerBalance: number;
  pendingDriverPayments: number;
  vehicleSummaries: {
    vehicleId: string;
    vehiclePlate: string;
    model: string;
    tripsCount: number;
    totalKm: number;
    revenueNPR: number;
    fuelCostNPR: number;
    maintenanceNPR: number;
    estimatedProfitNPR: number;
    averageKmpl?: number;
    costPerKmNPR?: number;
  }[];
  driverSummaries: {
    driverId: string;
    driverName: string;
    tripsCount: number;
    revenueNPR: number;
    netPaidNPR: number;
    pendingNPR: number;
  }[];
}

// ==========================================
// NEPAL & INDIA LIVE LOCATION NETWORK TYPES
// ==========================================

export type CountryCode = 'nepal' | 'india';

export interface GeoLocationInfo {
  id: string;
  name: string;
  nameNe: string;
  nameHi: string;
  nameZh: string;
  country: CountryCode;
  provinceState: string;
  provinceStateNe: string;
  district: string;
  districtNe: string;
  municipalityCity: string;
  type: 'city' | 'border_crossing' | 'industrial_hub' | 'dry_port' | 'highway_checkpoint' | 'market';
  lat: number;
  lng: number;
  isBorderHub?: boolean;
  borderPairName?: string;
  highwayCorridor?: string;
  customsStatus?: 'operational_24_7' | 'daytime_only' | 'congested';
}

export interface BorderCrossingCorridor {
  id: string;
  name: string;
  nameNe: string;
  nameHi: string;
  nameZh: string;
  nepalPoint: string;
  nepalPointNe: string;
  indiaPoint: string;
  indiaPointHi: string;
  nepalDistrict: string;
  indiaState: string;
  lat: number;
  lng: number;
  customsOfficeName: string;
  status: 'normal' | 'congested' | 'fast_track';
  averageClearanceHours: number;
  operationalHours: string;
  tradeVolumeShare: string;
  requiredDocuments: string[];
  exportCargoTypes: string[];
  importCargoTypes: string[];
  returnCargoOpportunity: string;
  contactEmergency: string;
}

export interface TransportCorridor {
  id: string;
  name: string;
  nameNe: string;
  nameHi: string;
  nameZh: string;
  origin: string;
  originCountry: CountryCode;
  destination: string;
  destinationCountry: CountryCode;
  distanceKm: number;
  estimatedHours: number;
  highwayNumber: string;
  isCrossBorder: boolean;
  borderCrossingId?: string;
  waypoints: { name: string; lat: number; lng: number }[];
  activeVehiclesCount: number;
  availableCargoCount: number;
  returnTripsCount: number;
  pathCoordinates: [number, number][];
}

export interface LiveMapVehicle extends Vehicle {
  country?: CountryCode;
  provinceState?: string;
  district?: string;
  crossBorderPermit?: boolean;
  privacyMode?: boolean;
  availableCapacityKg?: number;
  loadType?: 'full_load' | 'partial_load' | 'both';
  destinationPreference?: string;
  availableFrom?: string;
  heading?: number;
  speedKmH?: number;
  lastReportedTime?: string;
  isLiveGps?: boolean;
}

export interface LiveMapCargo extends CargoPost {
  country?: CountryCode;
  isCrossBorder?: boolean;
  borderCrossingPoint?: string;
  pickupLat: number;
  pickupLng: number;
  deliveryLat: number;
  deliveryLng: number;
  customsClearanceRequired?: boolean;
  currency?: 'NPR' | 'INR';
  fareOfferedINR?: number;
}
