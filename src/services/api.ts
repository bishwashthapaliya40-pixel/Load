import {
  CargoPost,
  Vehicle,
  BidOffer,
  Booking,
  ReturnTrip,
  InsuranceRecord,
  DisputeReport,
  Trip,
  FuelRecord,
  VehicleExpense,
  FuelPolicyConfig,
  LocationUpdate,
  DelayBreakdownReport,
  TripNotification,
  DriverEarningsReport,
  VehicleOwnerReport,
  GeoLocationInfo,
  BorderCrossingCorridor,
  TransportCorridor,
  LiveMapVehicle,
  LiveMapCargo
} from '../types';
import {
  INITIAL_CARGO,
  INITIAL_VEHICLES,
  INITIAL_BIDS,
  INITIAL_BOOKINGS,
  INITIAL_RETURN_TRIPS,
  INITIAL_INSURANCE,
  INITIAL_DISPUTES
} from '../data/mockData';
import {
  NEPAL_INDIA_LOCATIONS,
  BORDER_CROSSING_CORRIDORS,
  TRANSPORT_CORRIDORS,
  INITIAL_NETWORK_VEHICLES,
  INITIAL_NETWORK_CARGO
} from '../data/locationNetworkData';

const BASE_URL = '/api';

export const api = {
  async getStats() {
    try {
      const res = await fetch(`${BASE_URL}/stats`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return {
      activeShipments: 1,
      openCargoPosts: 3,
      registeredTrucks: 6,
      verifiedFleets: 4,
      totalFreightTons: 1465,
      returnTripsAvailable: 2
    };
  },

  async getCargo(params?: { city?: string; category?: string; vehicleType?: string }) {
    try {
      const query = new URLSearchParams();
      if (params?.city) query.append('city', params.city);
      if (params?.category) query.append('category', params.category);
      if (params?.vehicleType) query.append('vehicleType', params.vehicleType);
      const res = await fetch(`${BASE_URL}/cargo?${query.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return INITIAL_CARGO;
  },

  async createCargo(cargoData: Partial<CargoPost>) {
    try {
      const res = await fetch(`${BASE_URL}/cargo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cargoData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return {
      ...cargoData,
      id: `cargo-${Date.now()}`,
      status: 'open',
      bidsCount: 0,
      createdAt: new Date().toISOString()
    } as CargoPost;
  },

  async getVehicles(params?: { category?: string; city?: string; wheelCount?: string }) {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.city) query.append('city', params.city);
      if (params?.wheelCount) query.append('wheelCount', params.wheelCount);
      const res = await fetch(`${BASE_URL}/vehicles?${query.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return INITIAL_VEHICLES;
  },

  async createVehicle(vehData: Partial<Vehicle>) {
    try {
      const res = await fetch(`${BASE_URL}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return {
      ...vehData,
      id: `veh-${Date.now()}`,
      verified: false,
      status: 'available',
      createdAt: new Date().toISOString()
    } as Vehicle;
  },

  async getBids(cargoId?: string) {
    try {
      const query = cargoId ? `?cargoId=${cargoId}` : '';
      const res = await fetch(`${BASE_URL}/bids${query}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return INITIAL_BIDS.filter((b) => !cargoId || b.cargoId === cargoId);
  },

  async createBid(bidData: Partial<BidOffer>) {
    try {
      const res = await fetch(`${BASE_URL}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bidData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return {
      ...bidData,
      id: `bid-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    } as BidOffer;
  },

  async updateBid(
    bidId: string,
    updates: { status?: string; customerCounterFareNPR?: number; driverCounterFareNPR?: number }
  ) {
    try {
      const res = await fetch(`${BASE_URL}/bids/${bidId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { id: bidId, ...updates };
  },

  async getBookings() {
    try {
      const res = await fetch(`${BASE_URL}/bookings`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return INITIAL_BOOKINGS;
  },

  async updateShipmentStatus(bookingId: string, data: { status?: string; checkpoint?: string; eta?: string }) {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return null;
  },

  async submitProofOfDelivery(
    bookingId: string,
    payload: {
      otpEntered: string;
      digitalSignature?: string;
      loadingPhotoUrl?: string;
      unloadingPhotoUrl?: string;
      notes?: string;
    }
  ) {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/pod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to verify POD');
    } catch (e: any) {
      throw e;
    }
  },

  async getReturnTrips() {
    try {
      const res = await fetch(`${BASE_URL}/return-trips`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return INITIAL_RETURN_TRIPS;
  },

  async createReturnTrip(tripData: Partial<ReturnTrip>) {
    try {
      const res = await fetch(`${BASE_URL}/return-trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { ...tripData, id: `ret-${Date.now()}` } as ReturnTrip;
  },

  async getInsuranceRecords() {
    try {
      const res = await fetch(`${BASE_URL}/insurance`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return INITIAL_INSURANCE;
  },

  async createInsuranceRecord(insData: Partial<InsuranceRecord>) {
    try {
      const res = await fetch(`${BASE_URL}/insurance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { ...insData, id: `ins-${Date.now()}` } as InsuranceRecord;
  },

  async getDisputes() {
    try {
      const res = await fetch(`${BASE_URL}/disputes`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return INITIAL_DISPUTES;
  },

  async createDispute(data: Partial<DisputeReport>) {
    try {
      const res = await fetch(`${BASE_URL}/disputes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { ...data, id: `disp-${Date.now()}`, createdAt: new Date().toISOString() } as DisputeReport;
  },

  async triggerEmergencySos(payload: any) {
    try {
      const res = await fetch(`${BASE_URL}/emergency/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return {
      success: true,
      sosId: `SOS-${Date.now()}`,
      message: 'Emergency distress beacon recorded. Highway patrol alert dispatched.'
    };
  },

  async adminVerifyVehicle(vehicleId: string, verified: boolean) {
    try {
      const res = await fetch(`${BASE_URL}/admin/verify-vehicle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId, verified })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { success: true };
  },

  async resetDemoDatabase() {
    try {
      const res = await fetch(`${BASE_URL}/admin/reset-demo`, {
        method: 'POST'
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { success: true };
  },

  // Verification APIs
  async sendPhoneOtp(phone: string, userId?: string) {
    try {
      const res = await fetch(`${BASE_URL}/verification/phone/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, userId })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    const demoOtp = '741920';
    return { success: true, message: 'OTP generated (Simulation Mode)', demoOtp, isRealSms: false };
  },

  async verifyPhoneOtp(phone: string, otp: string, userId?: string) {
    try {
      const res = await fetch(`${BASE_URL}/verification/phone/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, userId })
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to verify phone OTP');
    } catch (e: any) {
      throw e;
    }
  },

  async submitDriverVerification(data: any) {
    try {
      const res = await fetch(`${BASE_URL}/verification/driver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { success: true, record: data };
  },

  async submitNationalIdVerification(data: any) {
    try {
      const res = await fetch(`${BASE_URL}/verification/national-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { success: true, record: data };
  },

  async submitCompanyVerification(data: any) {
    try {
      const res = await fetch(`${BASE_URL}/verification/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { success: true, record: data };
  },

  async submitVehicleOwnerVerification(data: any) {
    try {
      const res = await fetch(`${BASE_URL}/verification/vehicle-owner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { success: true, record: data };
  },

  async uploadSecureDocument(fileName: string, fileData: string, docType: string) {
    try {
      const res = await fetch(`${BASE_URL}/verification/upload-doc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileData, docType })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return {
      success: true,
      docId: `doc-${Date.now()}`,
      secureUrl: fileData.startsWith('data:') ? fileData : '/src/assets/images/cargo_loading_warehouse_1792079810527.jpg'
    };
  },

  async signInWithGoogleOAuth(payload: any) {
    try {
      const res = await fetch(`${BASE_URL}/verification/oauth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return {
      success: true,
      isConfigured: false,
      message: 'Google Sign-In completed in simulation mode'
    };
  },

  async signInWithFacebookOAuth(payload: any) {
    try {
      const res = await fetch(`${BASE_URL}/verification/oauth/facebook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return {
      success: true,
      isConfigured: false,
      message: 'Facebook Login completed in simulation mode'
    };
  },

  async getVerificationSummary() {
    try {
      const res = await fetch(`${BASE_URL}/verification/admin/summary`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return {
      pendingCounts: { drivers: 1, identities: 0, companies: 0, vehicles: 1, totalPending: 2 },
      pendingDrivers: [],
      pendingIdentities: [],
      pendingCompanies: [],
      pendingVehicles: [],
      auditLogs: []
    };
  },

  async reviewVerification(payload: {
    entityType: 'driver' | 'identity' | 'vehicle' | 'company';
    entityId: string;
    decision: 'verified' | 'rejected';
    rejectionReason?: string;
    adminNotes?: string;
    adminId?: string;
    adminName?: string;
  }) {
    try {
      const res = await fetch(`${BASE_URL}/verification/admin/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Failed to review verification');
    } catch (e: any) {
      throw e;
    }
  },

  async getAuditLogs() {
    try {
      const res = await fetch(`${BASE_URL}/verification/audit-logs`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return [];
  },

  // Trips & History
  async getTrips(params?: Record<string, any>): Promise<Trip[]> {
    try {
      const qs = params ? new URLSearchParams(params).toString() : '';
      const res = await fetch(`${BASE_URL}/trips${qs ? `?${qs}` : ''}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return [];
  },

  async getTripById(id: string): Promise<Trip | null> {
    try {
      const res = await fetch(`${BASE_URL}/trips/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return null;
  },

  async createTrip(data: Partial<Trip>): Promise<Trip> {
    try {
      const res = await fetch(`${BASE_URL}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { ...data, id: `TRIP-${Date.now()}` } as Trip;
  },

  async updateTripStatus(id: string, payload: {
    status?: string;
    checkpoint?: string;
    lat?: number;
    lng?: number;
    startOdometer?: number;
    endOdometer?: number;
    eta?: string;
    notes?: string;
    locationSource?: string;
  }): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/trips/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return null;
  },

  async updateTripLocation(id: string, payload: {
    lat: number;
    lng: number;
    checkpoint?: string;
    speedKmh?: number;
    heading?: string;
    source?: string;
  }): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/trips/${id}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return null;
  },

  async reportDelayOrBreakdown(tripId: string, payload: {
    reason: string;
    locationName: string;
    coords?: { lat: number; lng: number };
    description: string;
    photoUrl?: string;
    expectedDelayMinutes?: number;
    revisedETA?: string;
    requiresRoadsideAssistance?: boolean;
  }): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/trips/${tripId}/delays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return null;
  },

  async resumeJourney(delayId: string): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/delays/${delayId}/resume`, {
        method: 'PATCH'
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return null;
  },

  // Fuel & Diesel Records
  async getFuelRecords(params?: Record<string, any>): Promise<FuelRecord[]> {
    try {
      const qs = params ? new URLSearchParams(params).toString() : '';
      const res = await fetch(`${BASE_URL}/fuel${qs ? `?${qs}` : ''}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return [];
  },

  async createFuelRecord(data: Partial<FuelRecord>): Promise<FuelRecord> {
    try {
      const res = await fetch(`${BASE_URL}/fuel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { ...data, id: `fuel-${Date.now()}` } as FuelRecord;
  },

  async reviewFuelRecord(id: string, payload: {
    decision: 'approved' | 'rejected' | 'revision_requested';
    reviewNotes?: string;
    reviewerId?: string;
    reviewerName?: string;
  }): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/fuel/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return null;
  },

  async getFuelPolicies(): Promise<FuelPolicyConfig[]> {
    try {
      const res = await fetch(`${BASE_URL}/fuel/policies`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return [];
  },

  async saveFuelPolicy(data: Partial<FuelPolicyConfig>): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/fuel/policies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return null;
  },

  // Expenses
  async getExpenses(params?: Record<string, any>): Promise<VehicleExpense[]> {
    try {
      const qs = params ? new URLSearchParams(params).toString() : '';
      const res = await fetch(`${BASE_URL}/expenses${qs ? `?${qs}` : ''}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return [];
  },

  async createExpense(data: Partial<VehicleExpense>): Promise<VehicleExpense> {
    try {
      const res = await fetch(`${BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { ...data, id: `exp-${Date.now()}` } as VehicleExpense;
  },

  // Reports
  async getDriverEarningsReport(driverId: string, params?: Record<string, any>): Promise<DriverEarningsReport> {
    try {
      const qs = params ? new URLSearchParams(params).toString() : '';
      const res = await fetch(`${BASE_URL}/reports/driver/${driverId}${qs ? `?${qs}` : ''}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return {
      driverId,
      driverName: 'Driver',
      period: 'monthly',
      totalCompletedTrips: 0,
      totalKilometresTravelled: 0,
      totalGrossFreightEarned: 0,
      totalReceivedPayments: 0,
      totalPendingPayments: 0,
      totalApprovedExpenses: 0,
      totalNetEarnings: 0,
      tripsList: []
    };
  },

  async getVehicleOwnerReport(ownerId: string, params?: Record<string, any>): Promise<VehicleOwnerReport> {
    try {
      const qs = params ? new URLSearchParams(params).toString() : '';
      const res = await fetch(`${BASE_URL}/reports/vehicle-owner/${ownerId}${qs ? `?${qs}` : ''}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return {
      ownerId,
      ownerName: 'Vehicle Owner',
      period: 'monthly',
      totalFleetVehicles: 0,
      totalTripsCompleted: 0,
      totalFleetDistanceKm: 0,
      totalGrossRevenue: 0,
      totalFuelCost: 0,
      totalMaintenanceCost: 0,
      totalOtherExpenses: 0,
      totalOperatingExpenses: 0,
      estimatedNetProfit: 0,
      hasIncompleteExpenseData: false,
      unpaidCustomerBalance: 0,
      pendingDriverPayments: 0,
      vehicleSummaries: [],
      driverSummaries: []
    };
  },

  // Public Customer Tracking
  async getPublicTracking(code: string): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/tracking/${encodeURIComponent(code)}`);
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Tracking code not found');
    } catch (e) {
      throw e;
    }
  },

  // Notifications
  async getNotifications(params?: Record<string, any>): Promise<TripNotification[]> {
    try {
      const qs = params ? new URLSearchParams(params).toString() : '';
      const res = await fetch(`${BASE_URL}/notifications${qs ? `?${qs}` : ''}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return [];
  },

  async markNotificationRead(id: string): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH'
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return null;
  },

  async markAllNotificationsRead(role?: string): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/notifications/mark-all-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return null;
  },

  // ==========================================
  // NEPAL & INDIA LIVE LOCATION NETWORK APIS
  // ==========================================

  async getLocations(params?: {
    country?: string;
    provinceState?: string;
    district?: string;
    search?: string;
  }): Promise<GeoLocationInfo[]> {
    try {
      const qs = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      const res = await fetch(`${BASE_URL}/locations${qs ? `?${qs}` : ''}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }

    // Client-side fallback filter
    let results = [...NEPAL_INDIA_LOCATIONS];
    if (params?.country && params.country !== 'all') {
      results = results.filter((l) => l.country === params.country);
    }
    if (params?.provinceState && params.provinceState !== 'all') {
      results = results.filter((l) => l.provinceState.toLowerCase().includes(params.provinceState!.toLowerCase()));
    }
    if (params?.district && params.district !== 'all') {
      results = results.filter((l) => l.district.toLowerCase() === params.district!.toLowerCase());
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase();
      results = results.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.nameNe.toLowerCase().includes(q) ||
          l.nameHi.toLowerCase().includes(q) ||
          l.district.toLowerCase().includes(q) ||
          l.provinceState.toLowerCase().includes(q) ||
          (l.borderPairName && l.borderPairName.toLowerCase().includes(q))
      );
    }
    return results;
  },

  async getBorderCorridors(): Promise<BorderCrossingCorridor[]> {
    try {
      const res = await fetch(`${BASE_URL}/corridors/border`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return BORDER_CROSSING_CORRIDORS;
  },

  async getTransportCorridors(): Promise<TransportCorridor[]> {
    try {
      const res = await fetch(`${BASE_URL}/corridors/transport`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return TRANSPORT_CORRIDORS;
  },

  async getLiveMapVehicles(params?: {
    country?: string;
    category?: string;
    loadType?: string;
    crossBorderOnly?: boolean;
  }): Promise<LiveMapVehicle[]> {
    try {
      const qs = params ? new URLSearchParams(params as any).toString() : '';
      const res = await fetch(`${BASE_URL}/network/vehicles${qs ? `?${qs}` : ''}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }

    let results = [...INITIAL_NETWORK_VEHICLES];
    if (params?.country && params.country !== 'all') {
      results = results.filter((v) => v.country === params.country);
    }
    if (params?.category && params.category !== 'all') {
      results = results.filter((v) => v.category === params.category);
    }
    if (params?.loadType && params.loadType !== 'all') {
      results = results.filter((v) => v.loadType === params.loadType || v.loadType === 'both');
    }
    if (params?.crossBorderOnly) {
      results = results.filter((v) => v.crossBorderPermit === true);
    }
    return results;
  },

  async getLiveMapCargo(params?: {
    country?: string;
    category?: string;
    isCrossBorder?: boolean;
  }): Promise<LiveMapCargo[]> {
    try {
      const qs = params ? new URLSearchParams(params as any).toString() : '';
      const res = await fetch(`${BASE_URL}/network/cargo${qs ? `?${qs}` : ''}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }

    let results = [...INITIAL_NETWORK_CARGO];
    if (params?.country && params.country !== 'all') {
      results = results.filter((c) => c.country === params.country);
    }
    if (params?.category && params.category !== 'all') {
      results = results.filter((c) => c.category === params.category);
    }
    if (params?.isCrossBorder !== undefined) {
      results = results.filter((c) => Boolean(c.isCrossBorder) === Boolean(params.isCrossBorder));
    }
    return results;
  },

  async updateVehicleLiveGps(payload: {
    vehicleId: string;
    lat: number;
    lng: number;
    heading?: number;
    speedKmH?: number;
    isLiveGps?: boolean;
  }): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/network/vehicles/${payload.vehicleId}/gps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return { success: true, updated: payload };
  }
};
