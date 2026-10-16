import { Language } from '../types';

export interface TranslationDictionary {
  // Brand & General
  brandTitle: string;
  brandCompany: string;
  tagline: string;
  subtitle: string;
  demoBadge: string;
  demoBannerDesc: string;
  legalDisclaimer: string;

  // Language display
  langNepali: string;
  langEnglish: string;
  langHindi: string;
  langChinese: string;
  selectLanguage: string;

  // Navigation
  navMarketplace: string;
  navVehicles: string;
  navPostCargo: string;
  navReturnTrips: string;
  navActiveShipments: string;
  navInsurance: string;
  navEmergency: string;
  navAdmin: string;
  switchRole: string;
  loginText: string;
  logoutText: string;
  registerText: string;
  profileText: string;

  // Roles
  role_customer: string;
  role_driver: string;
  role_courier: string;
  role_fleet_company: string;
  role_admin: string;

  // Vehicle Categories
  cat_three_wheel: string;
  cat_four_wheel_pickup: string;
  cat_cargo_van: string;
  cat_mini_truck: string;
  cat_six_wheel_truck: string;
  cat_eight_wheel_truck: string;
  cat_ten_wheel_truck: string;
  cat_twelve_wheel_truck: string;
  cat_fourteen_wheel_truck: string;
  cat_heavy_freight_trailer: string;

  // Cargo Categories
  cargo_fmcg: string;
  cargo_construction: string;
  cargo_agricultural: string;
  cargo_perishable: string;
  cargo_furniture: string;
  cargo_machinery: string;
  cargo_electronics: string;
  cargo_courier_parcels: string;
  cargo_timber_minerals: string;
  cargo_other: string;

  // Body Types
  body_open_body: string;
  body_covered_container: string;
  body_tarpaulin_high_side: string;
  body_refrigerated_reefer: string;
  body_flatbed_trailer: string;
  body_liquid_tanker: string;

  // Shipment & Booking Statuses
  status_open: string;
  status_bidding: string;
  status_assigned: string;
  status_at_pickup: string;
  status_loaded: string;
  status_in_transit: string;
  status_at_destination: string;
  status_delivered: string;
  status_cancelled: string;

  // Actions & Buttons
  postCargoBtn: string;
  registerVehicleBtn: string;
  makeOfferBtn: string;
  counterOfferBtn: string;
  acceptOfferBtn: string;
  declineOfferBtn: string;
  viewChallanBtn: string;
  downloadBiltyBtn: string;
  submitPodBtn: string;
  verifyDeliveryOtpBtn: string;
  triggerSosBtn: string;
  fileDisputeBtn: string;
  searchBtn: string;
  filterBtn: string;
  saveBtn: string;
  cancelBtn: string;
  confirmBtn: string;
  callDriverBtn: string;
  trackLiveBtn: string;

  // Form Fields & Labels
  pickupPoint: string;
  destinationPoint: string;
  cargoWeight: string;
  declaredValue: string;
  targetBudget: string;
  offeredFare: string;
  distanceKm: string;
  estimatedTransitTime: string;
  laborCount: string;
  specialInstructions: string;
  vehiclePlate: string;
  bluebookNumber: string;
  routePermit: string;
  insurancePolicy: string;
  driverName: string;
  consigneeName: string;
  consigneePhone: string;
  deliveryOtp: string;
  digitalSignature: string;
  clearSignature: string;
  paymentMethod: string;
  paymentStatus: string;
  advanceAmount: string;
  balancePayable: string;

  // Negotiation & Bidding
  negotiationTitle: string;
  negotiationSubtitle: string;
  yourCounterOffer: string;
  originalOffer: string;
  enterFareAmount: string;

  // Return Load Saver
  returnSaverTitle: string;
  returnSaverSubtitle: string;
  returnDiscountBadge: string;
  postReturnRouteBtn: string;
  emptyTruckAlert: string;

  // Challan & Bilty
  challanTitle: string;
  biltyTitle: string;
  consignorDetails: string;
  consigneeDetails: string;
  carrierDetails: string;
  goodsSummary: string;
  freightBreakdown: string;
  officialQrValidation: string;
  printDocument: string;

  // Insurance
  insuranceTitle: string;
  insuranceSubtitle: string;
  vehicleComprehensive: string;
  vehicleThirdParty: string;
  goodsInTransitGIT: string;
  expiryDateLabel: string;
  statusValid: string;
  statusExpiringSoon: string;
  statusExpired: string;
  addInsurancePolicy: string;

  // Disputes
  disputeTitle: string;
  disputeSubtitle: string;
  damageCargo: string;
  missingItems: string;
  transitDelay: string;
  fareDispute: string;
  fraudReport: string;
  disputeDescription: string;
  claimedAmount: string;
  submitDispute: string;

  // Emergency & SOS
  emergencyTitle: string;
  emergencySubtitle: string;
  sosBannerWarning: string;
  nepalPolice100: string;
  trafficPolice103: string;
  ambulance102: string;
  heavyCraneTowing: string;
  highwayCheckpoints: string;
  fuelStops247: string;
  safeTruckRest: string;

  // Admin Dashboard
  adminOverviewTitle: string;
  adminOverviewSubtitle: string;
  totalFreightHandled: string;
  registeredTrucksCount: string;
  activeShipmentsCount: string;
  pendingVerifications: string;
  disputeArbitration: string;
  approveVehicle: string;
  rejectVehicle: string;
  resetDemoDatabase: string;

  // Comprehensive Verification System
  verificationNav: string;
  verificationStatusUnverified: string;
  verificationStatusPending: string;
  verificationStatusVerified: string;
  verificationStatusRejected: string;
  phoneVerificationTitle: string;
  phoneVerificationSubtitle: string;
  sendOtpBtn: string;
  verifyOtpBtn: string;
  otpSentNotice: string;
  enter6DigitOtp: string;
  driverVerificationTitle: string;
  driverVerificationSubtitle: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  uploadLicenseFront: string;
  uploadLicenseBack: string;
  nationalIdTitle: string;
  nationalIdSubtitle: string;
  idType: string;
  idNumber: string;
  issuedDistrict: string;
  issuedDate: string;
  uploadIdFront: string;
  uploadIdBack: string;
  companyVerificationTitle: string;
  companyVerificationSubtitle: string;
  registeredCompanyName: string;
  panNumber: string;
  vatNumber: string;
  registrationNumber: string;
  uploadRegistrationCert: string;
  uploadPanVatCert: string;
  authorizedRepDetails: string;
  vehicleOwnerVerificationTitle: string;
  vehicleOwnerVerificationSubtitle: string;
  taxTokenNumber: string;
  taxTokenExpiry: string;
  uploadBluebookDoc: string;
  uploadTaxTokenDoc: string;
  uploadRoutePermitDoc: string;
  uploadOwnershipDeed: string;
  googleSignIn: string;
  facebookLogin: string;
  oauthConfigNotice: string;
  adminVerificationQueue: string;
  adminApproveAction: string;
  adminRejectAction: string;
  rejectionReasonPrompt: string;
  rejectionReasonLabel: string;
  reasonBlurry: string;
  reasonExpired: string;
  reasonMismatch: string;
  reasonTaxUnpaid: string;
  reasonIncomplete: string;
  auditLogTitle: string;
  expiryReminders: string;
  secureStorageNotice: string;

  // Feature 1: Trip History, Earnings, Fuel & Expenses
  tripsHistoryNav: string;
  liveTrackingNav: string;
  driverEarningsNav: string;
  vehicleOwnerReportsNav: string;
  fuelExpensesNav: string;
  customerTrackingPortalNav: string;

  filterDaily: string;
  filterWeekly: string;
  filterMonthly: string;
  filterYearly: string;
  filterCustomDate: string;
  startDateLabel: string;
  endDateLabel: string;
  filterAllStatus: string;

  plannedDistance: string;
  actualDistanceKm: string;
  startOdometerLabel: string;
  endOdometerLabel: string;
  actualOdometerDiff: string;
  odometerReadingMissing: string;

  agreedFreight: string;
  additionalCharges: string;
  tollAndParking: string;
  loadingUnloadingFee: string;
  platformCommission: string;
  grossRevenue: string;
  netEarnings: string;
  pendingPayments: string;
  receivedPayments: string;
  unpaidCustomerBalances: string;
  pendingDriverPayments: string;

  tripStatusAssigned: string;
  tripStatusAccepted: string;
  tripStatusInTransit: string;
  tripStatusDelayed: string;
  tripStatusDelivered: string;
  tripStatusCancelled: string;

  fuelLogTitle: string;
  logFuelBtn: string;
  fuelTypeDiesel: string;
  fuelTypePetrol: string;
  fuelTypeCng: string;
  fuelLitres: string;
  fuelCostPerLitre: string;
  fuelTotalCost: string;
  fuelStationName: string;
  fuelStationLocation: string;
  fuelOdometerAtRefuel: string;
  fuelReceiptPhoto: string;
  fuelEconomyKmpl: string;
  fuelCostPerKm: string;
  fuelPolicyTitle: string;
  fuelPolicyOptional: string;
  fuelPolicyRequiredAll: string;
  fuelPolicyRequiredSelected: string;
  fuelReviewApprove: string;
  fuelReviewReject: string;
  fuelReviewRevision: string;
  fuelApprovalPending: string;
  fuelApprovalApproved: string;
  fuelApprovalRejected: string;

  maintenanceTitle: string;
  logExpenseBtn: string;
  expenseRepairs: string;
  expenseTyresParts: string;
  expenseTollsParking: string;
  expenseLoadingUnloading: string;
  expenseRoadPermitsTaxes: string;
  expenseDriverAllowance: string;
  expenseOther: string;
  expenseAmount: string;
  expenseDescription: string;
  incompleteExpenseWarning: string;

  // Feature 2: Live Location, Delays, Breakdowns & Customer Tracking
  gpsStatusLive: string;
  gpsStatusReported: string;
  gpsStatusUnavailable: string;
  permissionRequestGps: string;
  updateCheckpointManually: string;
  lastUpdated: string;
  currentCheckpointLabel: string;
  estimatedArrivalLabel: string;
  revisedEtaLabel: string;

  driverControlTripStarted: string;
  driverControlOnTheWay: string;
  driverControlStopped: string;
  driverControlDelayed: string;
  driverControlBreakdown: string;
  driverControlResumed: string;
  driverControlArrived: string;
  driverControlDelivered: string;

  reportDelayBreakdownTitle: string;
  delayReasonBreakdown: string;
  delayReasonTyre: string;
  delayReasonTraffic: string;
  delayReasonClosure: string;
  delayReasonLandslide: string;
  delayReasonWeather: string;
  delayReasonCheckpoint: string;
  delayReasonFuel: string;
  delayReasonLoading: string;
  delayReasonRest: string;
  delayReasonAccident: string;
  delayReasonOther: string;
  expectedDelayDuration: string;
  requestRoadsideAssistance: string;
  resumeJourneyBtn: string;
  delayReportedAlert: string;

  trackShipmentTitle: string;
  enterTrackingCode: string;
  searchTrackingBtn: string;
  trackingCodePlaceholder: string;
  permittedDriverDetails: string;
  secureTrackingNotice: string;
  deliveryOtpPrompt: string;

  exportCsvBtn: string;
  printReportBtn: string;
  vehicleSummaryTitle: string;
  driverSummaryTitle: string;
  estimatedProfit: string;
  notificationsTitle: string;
  markAllReadBtn: string;
  noNotifications: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  ne: {
    brandTitle: 'LoadMitra',
    brandCompany: 'LM Logistics & Cargo',
    tagline: 'नेपालको विश्वसनीय मालसामान ढुवानी तथा डिजिटल कार्गो बजार',
    subtitle: 'व्यापारी, पिकअप, मिनिट्रक र हेभी कन्टेनर ट्रकलाई सिधै जोड्ने मञ्च',
    demoBadge: 'प्रमाणीकरण तथा प्रदर्शन नमुना डाटा',
    demoBannerDesc: 'नेपालका प्रमुख राजमार्ग र ढुवानी साधनहरूको वास्तविक ढाँचामा आधारित। जीपीएस, अनलाइन भुक्तानी र कागजात प्रमाणीकरण परीक्षण योग्य।',
    legalDisclaimer: 'सवारी दर्ता नम्बर, सरकारी रुट परमिट, OTP कोड र कानुनी कागजातहरू आधिकारिक ढाँचामा रहन्छन्। बहुभाषिक सुविधा सहज प्रयोगका लागि प्रदान गरिएको हो।',

    langNepali: 'नेपाली',
    langEnglish: 'English',
    langHindi: 'हिन्दी',
    langChinese: '中文',
    selectLanguage: 'भाषा छनौट गर्नुहोस्',

    navMarketplace: 'भाडा खोज्नुहोस्',
    navVehicles: 'गाडी सूची',
    navPostCargo: 'सामान पोस्ट गर्नुहोस्',
    navReturnTrips: 'फिर्ता भाडा (खालि गाडी)',
    navActiveShipments: 'मेरो ढुवानी',
    navInsurance: 'बिमा तथा कागजात',
    navEmergency: 'आपतकालीन तथा SOS',
    navAdmin: 'एडमिन ड्यासबोर्ड',
    switchRole: 'भूमिका परिवर्तन',
    loginText: 'लगइन',
    logoutText: 'लगआउट',
    registerText: 'नयाँ दर्ता',
    profileText: 'मेरो प्रोफाइल',

    role_customer: 'ग्राहक / सामान पठाउने व्यापारी',
    role_driver: 'चालक / गाडीधनी',
    role_courier: 'कुरियर तथा पार्सल अपरेटर',
    role_fleet_company: 'यातायात कम्पनी (धेरै गाडी)',
    role_admin: 'प्लेटफर्म व्यवस्थापक (एडमिन)',

    cat_three_wheel: '३-पांग्रे कार्गो (अटो/टेम्पो/ई-रिक्सा)',
    cat_four_wheel_pickup: '४-पांग्रे पिकअप (बोलेरो/हिलक्स)',
    cat_cargo_van: 'कार्गो भ्यान (इको/डेलिभरी भ्यान)',
    cat_mini_truck: 'मिनी ट्रक (टाटा एस/दोस्त)',
    cat_six_wheel_truck: '६-पांग्रे ट्रक (टाटा ४०७/११०९)',
    cat_eight_wheel_truck: '८-पांग्रे हेभी ट्रक',
    cat_ten_wheel_truck: '१०-पांग्रे हेभी क्यारियर',
    cat_twelve_wheel_truck: '१२-पांग्रे मल्टि-एक्सेल ट्रक',
    cat_fourteen_wheel_truck: '१४-पांग्रे ठूलो ढुवानी ट्रक',
    cat_heavy_freight_trailer: 'फ्ल्याटबेड / कन्टेनर ट्रेलर',

    cargo_fmcg: 'खाद्यान्न तथा दैनिक उपभोग्य वस्तु (FMCG)',
    cargo_construction: 'निर्माण सामग्री (सिमेन्ट, छड, गिट्टी)',
    cargo_agricultural: 'कृषि उपज, धान, मकै तथा फलफूल',
    cargo_perishable: 'फलफूल, तरकारी तथा चिस्यान सामग्री',
    cargo_furniture: 'फर्निचर तथा कोठा/कार्यालय सार्ने',
    cargo_machinery: 'औद्योगिक उपकरण तथा मेसिनरी',
    cargo_electronics: 'इलेक्ट्रोनिक्स तथा घरायसी सामान',
    cargo_courier_parcels: 'कुरियर पार्सल तथा एक्सप्रेस प्याकेट',
    cargo_timber_minerals: 'काठ, बालुवा तथा खनिज सामग्री',
    cargo_other: 'सामान्य व्यावसायिक मालसामान',

    body_open_body: 'खुला डाला (Open Body)',
    body_covered_container: 'बन्द कन्टेनर (Covered Container)',
    body_tarpaulin_high_side: 'त्रिपाल हाई-साइड (Tarpaulin High-Side)',
    body_refrigerated_reefer: 'रेफ्रिजरेटेड कोल्ड भ्यान (Reefer)',
    body_flatbed_trailer: 'फ्ल्याटबेड ट्रेलर (Flatbed)',
    body_liquid_tanker: 'लिक्विड ट्याङ्कर (Tanker)',

    status_open: 'भाडा अफर खुला',
    status_bidding: 'मोलमोलाई भइरहेको',
    status_assigned: 'गाडी निश्चित भयो',
    status_at_pickup: 'लोडिङ ठाउँमा पुग्यो',
    status_loaded: 'सामान लोड भयो',
    status_in_transit: 'राजमार्गमा ढुवानी हुँदै',
    status_at_destination: 'गन्तव्यमा पुग्यो',
    status_delivered: 'सामान बुझाइयो (POD प्रमाणित)',
    status_cancelled: 'रद्द गरियो',

    postCargoBtn: 'नयाँ सामान पठाउन पोस्ट गर्नुहोस्',
    registerVehicleBtn: 'नयाँ गाडी दर्ता गर्नुहोस्',
    makeOfferBtn: 'भाडा अफर गर्नुहोस्',
    counterOfferBtn: 'काउन्टर अफर पठाउनुहोस्',
    acceptOfferBtn: 'स्वीकार गरी बुकिङ पक्का गर्नुहोस्',
    declineOfferBtn: 'अस्वीकार गर्नुहोस्',
    viewChallanBtn: 'ढुवानी चलानी हेर्नुहोस्',
    downloadBiltyBtn: 'चलानी / बिल्टी प्रिन्ट गर्नुहोस्',
    submitPodBtn: 'डेलिभरी प्रमाण (POD) बुझाउनुहोस्',
    verifyDeliveryOtpBtn: 'प्रापकको OTP प्रमाणीकरण',
    triggerSosBtn: 'आपतकालीन SOS सुरु गर्नुहोस्',
    fileDisputeBtn: 'सामान क्षति / विवाद दर्ता',
    searchBtn: 'खोज्नुहोस्',
    filterBtn: 'फिल्टर',
    saveBtn: 'सुरक्षित गर्नुहोस्',
    cancelBtn: 'रद्द गर्नुहोस्',
    confirmBtn: 'निश्चित गर्नुहोस्',
    callDriverBtn: 'चालकलाई कल गर्नुहोस्',
    trackLiveBtn: 'प्रत्यक्ष ट्र्याक गर्नुहोस्',

    pickupPoint: 'उठाउने ठाउँ (लोडिङ ठेगाना)',
    destinationPoint: 'पुर्‍याउने ठाउँ (अनलोडिङ ठेगाना)',
    cargoWeight: 'सामानको तौल (के.जी.)',
    declaredValue: 'घोषित मूल्य (रू.)',
    targetBudget: 'अनुमानित बजेट (रू.)',
    offeredFare: 'अफर गरिएको भाडा (रू.)',
    distanceKm: 'दूरी (कि.मी.)',
    estimatedTransitTime: 'लाग्ने अनुमानित समय',
    laborCount: 'लोडिङ/अनलोडिङ कामदार संख्या',
    specialInstructions: 'विशेष निर्देशन तथा सावधानी',
    vehiclePlate: 'गाडी नम्बर',
    bluebookNumber: 'सवारी दर्ता किताब (बिलबुक नम्बर)',
    routePermit: 'रुट परमिट नम्बर',
    insurancePolicy: 'बिमा पोलिसी नम्बर',
    driverName: 'चालकको नाम',
    consigneeName: 'सामान बुझ्ने व्यक्तिको नाम',
    consigneePhone: 'सामान बुझ्नेको फोन नम्बर',
    deliveryOtp: '४-अङ्कको डेलिभरी OTP',
    digitalSignature: 'सामान बुझेको डिजिटल हस्ताक्षर',
    clearSignature: 'हस्ताक्षर मेट्नुहोस्',
    paymentMethod: 'भुक्तानी माध्यम',
    paymentStatus: 'भुक्तानी अवस्था',
    advanceAmount: 'अग्रिम भुक्तानी (रू.)',
    balancePayable: 'अनलोडिङमा बाँकी रकम (रू.)',

    negotiationTitle: 'भाडा मोलमोलाई तथा काउन्टर अफर',
    negotiationSubtitle: 'inDrive ढाँचामा चालक र व्यापारीबीच सिधै पारदर्शी भाडा तय गर्नुहोस्',
    yourCounterOffer: 'तपाईंको काउन्टर अफर (रू.)',
    originalOffer: 'सुरुवाती अफर',
    enterFareAmount: 'नयाँ भाडा रकम प्रविष्ट गर्नुहोस्',

    returnSaverTitle: 'फिर्ता भाडा बचत (खालि गाडी बचाउ)',
    returnSaverSubtitle: 'सामान झारेर फर्किने गाडीसँग सामान मिलाउनुहोस् र ३०-३५% सम्म भाडा बचत गर्नुहोस्',
    returnDiscountBadge: '३०-३५% सम्म भारी छुट',
    postReturnRouteBtn: 'फिर्ता रुट पोस्ट गर्नुहोस्',
    emptyTruckAlert: 'खालि गाडी फर्किँदैछ',

    challanTitle: 'नेपाल सरकार यातायात व्यवस्था नियमानुसार ढुवानी चलानी फारम',
    biltyTitle: 'कन्सोर्टियम बिल्टी (Bill of Lading / Bilty)',
    consignorDetails: 'सामान पठाउने (कन्साइनर)',
    consigneeDetails: 'सामान बुझ्ने (कन्साइनी)',
    carrierDetails: 'ढुवानीकर्ता तथा सवारी साधन (क्यारियर)',
    goodsSummary: 'मालसामानको विवरण तथा तौल',
    freightBreakdown: 'भाडा हिसाब किताब',
    officialQrValidation: 'आधिकारिक डिजिटल प्रमाणीकरण QR',
    printDocument: 'कागजात प्रिन्ट गर्नुहोस्',

    insuranceTitle: 'सवारी साधन तथा मालसामान ढुवानी बिमा (GIT)',
    insuranceSubtitle: 'राजमार्गमा ढुवानी गर्दा जोखिम न्यूनिकरणका लागि प्रमाणित बिमा अभिलेख',
    vehicleComprehensive: 'सवारी व्यापक बिमा (Comprehensive)',
    vehicleThirdParty: 'तेस्रो पक्ष बिमा (Third Party)',
    goodsInTransitGIT: 'मालसामान ढुवानी बिमा (GIT Insurance)',
    expiryDateLabel: 'म्याद सकिने मिति',
    statusValid: 'प्रमाणित तथा मान्य',
    statusExpiringSoon: 'चाँडै म्याद सकिँदै',
    statusExpired: 'म्याद समाप्त',
    addInsurancePolicy: 'नयाँ बिमा विवरण थप्नुहोस्',

    disputeTitle: 'सामान क्षति, हराएको वा ठगी सम्बन्धी उजुरी',
    disputeSubtitle: 'पारदर्शी छानबिन तथा क्षतिपूर्ति सहजीकरण',
    damageCargo: 'सामान टुटफुट वा क्षति',
    missingItems: 'सामान हराएको वा नपुगेको',
    transitDelay: 'अस्वाभाविक ढिलाइ',
    fareDispute: 'भाडा सम्बन्धी विवाद',
    fraudReport: 'ठगीको आशंका वा शंकास्पद गतिविधि',
    disputeDescription: 'उजुरीको पूर्ण विवरण लेख्नुहोस्',
    claimedAmount: 'दाबी गरिएको रकम (रू.)',
    submitDispute: 'उजुरी दर्ता गर्नुहोस्',

    emergencyTitle: 'नेपाल राजमार्ग आपतकालीन सहायता तथा SOS',
    emergencySubtitle: 'प्रहरी, ट्राफिक, एम्बुलेन्स, हेभी क्रेन र विश्रामस्थलको सिधा सम्पर्क',
    sosBannerWarning: 'आपतकालीन अवस्थामा १-ट्यापमा प्रहरी तथा नजिकका उद्धार टोलीलाई स्थान पठाइन्छ।',
    nepalPolice100: 'नेपाल प्रहरी (१००)',
    trafficPolice103: 'नेपाल ट्राफिक प्रहरी हटलाइन (१०३)',
    ambulance102: 'एम्बुलेन्स सेवा (१०२)',
    heavyCraneTowing: 'हेभी क्रेन तथा टोइङ सेवा',
    highwayCheckpoints: 'राजमार्ग सुरक्षा चेकपोइन्ट',
    fuelStops247: '२४/७ डिजेल स्टेशन',
    safeTruckRest: 'सुरक्षित ट्रक विश्रामस्थल तथा पार्किङ',

    adminOverviewTitle: 'प्लेटफर्म केन्द्रीय व्यवस्थापन ड्यासबोर्ड',
    adminOverviewSubtitle: 'प्रयोगकर्ता, सवारी साधन कागजात, चलानी, भुक्तानी तथा उजुरीहरूको सुपरीवेक्षण',
    totalFreightHandled: 'कुल ढुवानी परिमाण (टन)',
    registeredTrucksCount: 'दर्ता भएका व्यावसायिक गाडीहरू',
    activeShipmentsCount: 'हाल राजमार्गमा रहेका ढुवानीहरू',
    pendingVerifications: 'प्रमाणीकरण पर्खिरहेका कागजातहरू',
    disputeArbitration: 'विवाद समाधान कक्ष',
    approveVehicle: 'कागजात स्वीकृत गर्नुहोस्',
    rejectVehicle: 'अस्वीकृत गर्नुहोस्',
    resetDemoDatabase: 'नमुना डाटा पुनः लोड गर्नुहोस्',

    // Comprehensive Verification
    verificationNav: 'प्रमाणीकरण तथा KYC',
    verificationStatusUnverified: 'अप्रमाणित',
    verificationStatusPending: 'प्रमाणीकरण प्रक्रियामा',
    verificationStatusVerified: 'प्रमाणित (Verified)',
    verificationStatusRejected: 'अस्वीकृत (Rejected)',
    phoneVerificationTitle: 'मोबाइल नम्बर तथा SMS OTP प्रमाणीकरण',
    phoneVerificationSubtitle: 'वास्तविक ६-अङ्कको SMS OTP कोड मार्फत मोबाइल प्रमाणीकरण गर्नुहोस्',
    sendOtpBtn: 'SMS OTP पठाउनुहोस्',
    verifyOtpBtn: 'OTP प्रमाणीकरण गर्नुहोस्',
    otpSentNotice: 'तपाईंको फोनमा ६-अङ्कको प्रमाणीकरण कोड पठाइएको छ।',
    enter6DigitOtp: '६-अङ्कको OTP कोड प्रविष्ट गर्नुहोस्',
    driverVerificationTitle: 'चालक अनुमतिपत्र (लाइसेन्स) प्रमाणीकरण',
    driverVerificationSubtitle: 'यातायात व्यवस्था विभाग (DoTM) अनुसार लाइसेन्स नम्बर र वर्ग',
    licenseNumber: 'सवारी चालक अनुमतिपत्र नम्बर',
    licenseCategory: 'लाइसेन्स वर्ग (Category)',
    licenseExpiry: 'लाइसेन्स म्याद सकिने मिति',
    uploadLicenseFront: 'लाइसेन्सको अगाडिको भाग अपलोड गर्नुहोस्',
    uploadLicenseBack: 'लाइसेन्सको पछाडिको भाग अपलोड गर्नुहोस्',
    nationalIdTitle: 'राष्ट्रिय परिचयपत्र / नागरिकता प्रमाणीकरण',
    nationalIdSubtitle: 'नेपाल सरकारद्वारा जारी नागरिकता वा राष्ट्रिय परिचयपत्र विवरण',
    idType: 'परिचयपत्र प्रकार',
    idNumber: 'परिचयपत्र नम्बर',
    issuedDistrict: 'जारी भएको जिल्ला',
    issuedDate: 'जारी भएको मिति',
    uploadIdFront: 'परिचयपत्रको अगाडिको फोटो',
    uploadIdBack: 'परिचयपत्रको पछाडिको फोटो',
    companyVerificationTitle: 'यातायात तथा ढुवानी कम्पनी प्रमाणीकरण',
    companyVerificationSubtitle: 'कम्पनी रजिष्ट्रारको कार्यालय (OCR) तथा आन्तरिक राजस्व विभाग (IRD) दर्ता',
    registeredCompanyName: 'दर्ता भएको कम्पनीको नाम',
    panNumber: 'स्थायी लेखा नम्बर (PAN)',
    vatNumber: 'मूल्य अभिवृद्धि कर नम्बर (VAT)',
    registrationNumber: 'कम्पनी दर्ता नम्बर',
    uploadRegistrationCert: 'कम्पनी दर्ता प्रमाण-पत्र अपलोड',
    uploadPanVatCert: 'PAN/VAT दर्ता प्रमाण-पत्र अपलोड',
    authorizedRepDetails: 'अधिकृत प्रतिनिधि विवरण (Authorized Rep)',
    vehicleOwnerVerificationTitle: 'सवारी धनी तथा बिलबुक प्रमाणीकरण',
    vehicleOwnerVerificationSubtitle: 'सवारी दर्ता किताब (बिलबुक), वार्षिक कर चुक्ता तथा रुट परमिट',
    taxTokenNumber: 'सवारी कर चुक्ता रसिद नम्बर',
    taxTokenExpiry: 'सवारी कर म्याद सकिने मिति',
    uploadBluebookDoc: 'बिलबुक (Bluebook) फोटो अपलोड',
    uploadTaxTokenDoc: 'कर चुक्ता रसिद अपलोड',
    uploadRoutePermitDoc: 'रुट परमिट कागजात अपलोड',
    uploadOwnershipDeed: 'स्वामित्व हस्तान्तरण / नामसारी कागजात',
    googleSignIn: 'Google मार्फत लगइन गर्नुहोस्',
    facebookLogin: 'Facebook मार्फत लगइन गर्नुहोस्',
    oauthConfigNotice: 'सुरक्षित Google तथा Meta OAuth प्रणाली। कुञ्जीहरू उपलब्ध नहुँदा परीक्षण मोडमा चल्नेछ।',
    adminVerificationQueue: 'केन्द्रीय प्रमाणीकरण डेस्क तथा अडिट',
    adminApproveAction: 'स्वीकृत गर्नुहोस् (Approve)',
    adminRejectAction: 'अस्वीकृत गर्नुहोस् (Reject)',
    rejectionReasonPrompt: 'अस्वीकृत गर्नुको कारण अनिवार्य लेख्नुहोस्',
    rejectionReasonLabel: 'अस्वीकृतिको कारण',
    reasonBlurry: 'फोटो स्पष्ट नभएको वा नबुझिने (Blurry Photo)',
    reasonExpired: 'कागजातको म्याद सकिएको (Expired Document)',
    reasonMismatch: 'नाम वा विवरण नमिलेको (Details Mismatch)',
    reasonTaxUnpaid: 'सवारी कर चुक्ता नभएको (Vehicle Tax Unpaid)',
    reasonIncomplete: 'अपूर्ण कागजात पेश गरिएको (Incomplete Documents)',
    auditLogTitle: 'प्रमाणीकरण अडिट लग तथा इतिहास',
    expiryReminders: 'म्याद समाप्तिका सूचनाहरू',
    secureStorageNotice: 'सबै नागरिकता, लाइसेन्स र बिलबुक गोप्य र सुरक्षित प्रणालीमा मात्र राखिन्छ।',

    // Feature 1: Trip History, Earnings, Fuel & Expenses
    tripsHistoryNav: 'यात्रा इतिहास (Trip History)',
    liveTrackingNav: 'प्रत्यक्ष जीपीएस तथा ETA',
    driverEarningsNav: 'चालकको आम्दानी तथा हिसाब',
    vehicleOwnerReportsNav: 'सवारी धनी तथा यातायात रिपोर्ट',
    fuelExpensesNav: 'डिजेल तथा मर्मत खर्च',
    customerTrackingPortalNav: 'ग्राहक ढुवानी ट्र्याकिङ पोर्टल',

    filterDaily: 'दैनिक (आज)',
    filterWeekly: 'साप्ताहिक',
    filterMonthly: 'मासिक',
    filterYearly: 'वार्षिक',
    filterCustomDate: 'आफ्नो मिति छान्नुहोस्',
    startDateLabel: 'सुरु मिति',
    endDateLabel: 'अन्तिम मिति',
    filterAllStatus: 'सबै अवस्था',

    plannedDistance: 'योजनाबद्ध राजमार्ग दुरी (कि.मि.)',
    actualDistanceKm: 'वास्तविक यात्रा दुरी (कि.मि.)',
    startOdometerLabel: 'सुरु ओडोमिटर रिडिङ (कि.मि.)',
    endOdometerLabel: 'अन्तिम ओडोमिटर रिडिङ (कि.मि.)',
    actualOdometerDiff: 'ओडोमिटर अनुसार चलेको दुरी',
    odometerReadingMissing: 'ओडोमिटर विवरण पेश हुन बाँकी',

    agreedFreight: 'सहमति भएको कुल ढुवानी भाडा',
    additionalCharges: 'थप शुल्कहरू',
    tollAndParking: 'टोल तथा पार्किङ खर्च',
    loadingUnloadingFee: 'लोडिङ / अनलोडिङ ज्याला',
    platformCommission: 'लोडमित्र सेवा कमिसन',
    grossRevenue: 'कुल संकलित रकम (Gross)',
    netEarnings: 'खुद बचत / आम्दानी (Net)',
    pendingPayments: 'भुक्तानी हुन बाँकी',
    receivedPayments: 'प्राप्त भइसकेको भुक्तानी',
    unpaidCustomerBalances: 'ग्राहकबाट असुल हुन बाँकी भाडा',
    pendingDriverPayments: 'चालकलाई भुक्तानी दिन बाँकी रकम',

    tripStatusAssigned: 'तोकिएको (Assigned)',
    tripStatusAccepted: 'स्वीकार गरिएको',
    tripStatusInTransit: 'राजमार्गमा ढुवानी हुँदै (In Transit)',
    tripStatusDelayed: 'ढिलाइ भएको (Delayed)',
    tripStatusDelivered: 'गन्तव्यमा डेलिभरी सम्पन्न',
    tripStatusCancelled: 'रद्द गरिएको',

    fuelLogTitle: 'डिजेल / इन्धन भरिएको अभिलेख',
    logFuelBtn: 'इन्धन भरिएको दर्ता गर्नुहोस्',
    fuelTypeDiesel: 'डिजेल (Diesel)',
    fuelTypePetrol: 'पेट्रोल (Petrol)',
    fuelTypeCng: 'सिएनजी (CNG)',
    fuelLitres: 'भरिएको परिमाण (लिटर)',
    fuelCostPerLitre: 'प्रति लिटर मूल्य (रु.)',
    fuelTotalCost: 'कुल इन्धन खर्च (रु.)',
    fuelStationName: 'पेट्रोल पम्पको नाम',
    fuelStationLocation: 'पम्पको स्थान / राजमार्ग',
    fuelOdometerAtRefuel: 'इन्धन भर्दाको मिटर (कि.मि.)',
    fuelReceiptPhoto: 'पम्पको बिल / रसिद फोटो',
    fuelEconomyKmpl: 'इन्धन माइलेज (कि.मि. / लिटर)',
    fuelCostPerKm: 'प्रति कि.मि. इन्धन खर्च (रु.)',
    fuelPolicyTitle: 'गाडी अनुसार इन्धन दर्ता नीति',
    fuelPolicyOptional: 'ऐच्छिक (इच्छा अनुसार)',
    fuelPolicyRequiredAll: 'प्रत्येक यात्रामा अनिवार्य',
    fuelPolicyRequiredSelected: 'छानिएका चालकहरूका लागि मात्र अनिवार्य',
    fuelReviewApprove: 'इन्धन बिल स्वीकृत गर्नुहोस्',
    fuelReviewReject: 'अस्वीकृत गर्नुहोस्',
    fuelReviewRevision: 'सच्याउन अनुरोध गर्नुहोस्',
    fuelApprovalPending: 'समीक्षा पर्खिरहेको',
    fuelApprovalApproved: 'स्वीकृत भएको',
    fuelApprovalRejected: 'अस्वीकृत भएको',

    maintenanceTitle: 'सवारी साधन मर्मत तथा सञ्चालन खर्च',
    logExpenseBtn: 'नयाँ खर्च दर्ता गर्नुहोस्',
    expenseRepairs: 'गाडी मर्मत तथा सर्भिसिङ',
    expenseTyresParts: 'टायर तथा पार्टपुर्जा',
    expenseTollsParking: 'टोल ट्याक्स तथा पार्किङ',
    expenseLoadingUnloading: 'लोडिङ र अनलोडिङ ज्याला',
    expenseRoadPermitsTaxes: 'सवारी कर तथा रुट परमिट दस्तुर',
    expenseDriverAllowance: 'चालक / सहचालक दैनिक भत्ता',
    expenseOther: 'अन्य आकस्मिक खर्च',
    expenseAmount: 'खर्च रकम (रु.)',
    expenseDescription: 'खर्चको विवरण',
    incompleteExpenseWarning: 'अपूर्ण खर्च अभिलेख: केही यात्रामा इन्धन वा मर्मत विवरण नभरिएकाले खुद नाफा अनुमानित मात्र हो।',

    // Feature 2: Live Location, Delays, Breakdowns & Customer Tracking
    gpsStatusLive: 'प्रत्यक्ष जीपीएस जडित (Live GPS)',
    gpsStatusReported: 'चालकद्वारा प्रविष्ट गरिएको चेकपोइन्ट',
    gpsStatusUnavailable: 'स्थान विवरण उपलब्ध छैन',
    permissionRequestGps: 'वास्तविक स्थान ट्र्याकिङका लागि चालकको डिभाइस अनुमति आवश्यक छ',
    updateCheckpointManually: 'म्यानुअल स्थान चेकपोइन्ट अद्यावधिक',
    lastUpdated: 'पछिल्लो अपडेट',
    currentCheckpointLabel: 'हालको चेकपोइन्ट / स्थान',
    estimatedArrivalLabel: 'अनुमानित आगमन समय (ETA)',
    revisedEtaLabel: 'संशोधित ETA',

    driverControlTripStarted: 'यात्रा सुरु भयो (Trip Started)',
    driverControlOnTheWay: 'बाटोमा छु (On The Way)',
    driverControlStopped: 'गाडी रोकिएको छ (Stopped)',
    driverControlDelayed: 'ढिलाइ भएको छ (Delayed)',
    driverControlBreakdown: 'गाडी बिग्रियो / आपतकालीन',
    driverControlResumed: 'यात्रा पुनः सुरु भयो',
    driverControlArrived: 'गन्तव्यमा आइपुग्यो',
    driverControlDelivered: 'सामान बुझाइयो (POD)',

    reportDelayBreakdownTitle: 'राजमार्ग ढिलाइ वा गाडी खराबीको रिपोर्ट',
    delayReasonBreakdown: 'इन्जिन / मेकानिकल खराबी',
    delayReasonTyre: 'टायर पञ्चर / ट्युब समस्या',
    delayReasonTraffic: 'राजमार्गमा अत्यधिक जाम',
    delayReasonClosure: 'सडक बन्द वा मर्मत कार्य',
    delayReasonLandslide: 'पहिरो / लेदो (Landslide)',
    delayReasonWeather: 'खराब मौसम / हुस्सु / भारी वर्षा',
    delayReasonCheckpoint: 'ट्राफिक / सुरक्षा चेकपोइन्ट जाँच',
    delayReasonFuel: 'डिजेल स्टेशन लाइन / अभाव',
    delayReasonLoading: 'सामान लोड / अनलोडमा ढिलाइ',
    delayReasonRest: 'चालक आराम / खाना विश्राम',
    delayReasonAccident: 'राजमार्ग दुर्घटना / अवरोध',
    delayReasonOther: 'अन्य कारण',
    expectedDelayDuration: 'अनुमानित ढिलाइ हुने समय (मिनेट)',
    requestRoadsideAssistance: 'राजमार्ग क्रेन वा आपतकालीन सहयोग आवश्यक छ',
    resumeJourneyBtn: 'यात्रा सुरु भएको जनाउ दिनुहोस्',
    delayReportedAlert: 'चालकले राजमार्गमा ढिलाइ भएको सूचना पठाउनुभएको छ।',

    trackShipmentTitle: 'ग्राहक कार्गो प्रत्यक्ष ट्र्याकिङ',
    enterTrackingCode: 'ट्र्याकिङ कोड वा चलानी नम्बर प्रविष्ट गर्नुहोस्',
    searchTrackingBtn: 'खोज्नुहोस्',
    trackingCodePlaceholder: 'उदा: TRK-LM-2026-8819 वा TRIP-2026-101',
    permittedDriverDetails: 'ढुवानी गर्ने चालक तथा गाडी विवरण',
    secureTrackingNotice: 'यो पृष्ठ केवल अधिकृत ढुवानीकर्ता र ग्राहकका लागि सुरक्षित गरिएको छ। व्यक्तिगत कागजातहरू पूर्ण गोप्य राखिन्छन्।',
    deliveryOtpPrompt: 'सामान सुरक्षित बुझ्नका लागि चालकलाई OTP कोड देखाउनुहोस्।',

    exportCsvBtn: 'CSV डाउनलोड गर्नुहोस्',
    printReportBtn: 'रिपोर्ट प्रिन्ट / PDF',
    vehicleSummaryTitle: 'गाडी अनुसार ढुवानी तथा खर्च सारांश',
    driverSummaryTitle: 'चालक अनुसार आम्दानी तथा भुक्तानी सारांश',
    estimatedProfit: 'अनुमानित खुद नाफा',
    notificationsTitle: 'सूचना तथा अलर्टहरू',
    markAllReadBtn: 'सबै पढिएको जनाउनुहोस्',
    noNotifications: 'कुनै नयाँ सूचना छैन।'
  },

  en: {
    brandTitle: 'LoadMitra',
    brandCompany: 'LM Logistics & Cargo',
    tagline: "Nepal's Premier Goods Transportation & Freight Marketplace",
    subtitle: 'Connecting Shippers, Mini-Trucks, Pickups & Heavy Commercial Fleets',
    demoBadge: 'DEMONSTRATION LOGISTICS DATA',
    demoBannerDesc: 'Simulated with authentic Nepal freight corridors and vehicle categories. Real GPS tracking, payment gateways and verification workflows fully active.',
    legalDisclaimer: 'Vehicle registration plates, official route permits, OTP codes, and government tax identifiers remain standard. Multilingual translation is provided for operational convenience.',

    langNepali: 'नेपाली',
    langEnglish: 'English',
    langHindi: 'हिन्दी',
    langChinese: '中文',
    selectLanguage: 'Select Language',

    navMarketplace: 'Find Loads',
    navVehicles: 'Truck Fleets',
    navPostCargo: 'Post Cargo',
    navReturnTrips: 'Return Loads',
    navActiveShipments: 'My Shipments',
    navInsurance: 'Insurance & Docs',
    navEmergency: 'Emergency & SOS',
    navAdmin: 'Admin Console',
    switchRole: 'Switch Role',
    loginText: 'Login',
    logoutText: 'Logout',
    registerText: 'Register',
    profileText: 'My Profile',

    role_customer: 'Customer / Cargo Shipper',
    role_driver: 'Driver / Truck Owner',
    role_courier: 'Courier & Parcel Operator',
    role_fleet_company: 'Transport & Fleet Company',
    role_admin: 'Platform Admin',

    cat_three_wheel: '3-Wheel Cargo (Auto/Tempo)',
    cat_four_wheel_pickup: '4-Wheel Pickup (Bolero/Hilux)',
    cat_cargo_van: 'Cargo Van (Eeco/Delivery Van)',
    cat_mini_truck: 'Mini Truck (Tata Ace/Dost)',
    cat_six_wheel_truck: '6-Wheel Truck (Tata 407/1109)',
    cat_eight_wheel_truck: '8-Wheel Heavy Freight Truck',
    cat_ten_wheel_truck: '10-Wheel Heavy Carrier',
    cat_twelve_wheel_truck: '12-Wheel Multi-Axle Hauler',
    cat_fourteen_wheel_truck: '14-Wheel Heavy Freight',
    cat_heavy_freight_trailer: 'Flatbed / Container Trailer',

    cargo_fmcg: 'FMCG & Packaged Goods',
    cargo_construction: 'Construction Materials (Cement, Steel)',
    cargo_agricultural: 'Agricultural Produce & Grains',
    cargo_perishable: 'Perishable Produce & Cold Chain',
    cargo_furniture: 'Furniture & Home/Office Relocation',
    cargo_machinery: 'Industrial Machinery & Equipment',
    cargo_electronics: 'Electronics & Appliances',
    cargo_courier_parcels: 'Courier Parcels & Express Consignments',
    cargo_timber_minerals: 'Timber & Industrial Raw Materials',
    cargo_other: 'General Commercial Freight',

    body_open_body: 'Open Body',
    body_covered_container: 'Covered Container Box',
    body_tarpaulin_high_side: 'Tarpaulin High-Side',
    body_refrigerated_reefer: 'Refrigerated Reefer',
    body_flatbed_trailer: 'Flatbed Trailer',
    body_liquid_tanker: 'Liquid Tanker',

    status_open: 'Open for Bids',
    status_bidding: 'Negotiating Fares',
    status_assigned: 'Vehicle Assigned',
    status_at_pickup: 'At Loading Bay',
    status_loaded: 'Goods Loaded & Sealed',
    status_in_transit: 'In Transit on Highway',
    status_at_destination: 'At Destination Point',
    status_delivered: 'Delivered (POD Verified)',
    status_cancelled: 'Cancelled',

    postCargoBtn: 'Post New Cargo Shipment',
    registerVehicleBtn: 'Register Commercial Vehicle',
    makeOfferBtn: 'Make Fare Offer',
    counterOfferBtn: 'Send Counter Offer',
    acceptOfferBtn: 'Accept Offer & Confirm',
    declineOfferBtn: 'Decline Offer',
    viewChallanBtn: 'View Transport Challan',
    downloadBiltyBtn: 'Print Challan / Bilty',
    submitPodBtn: 'Submit Proof of Delivery',
    verifyDeliveryOtpBtn: 'Verify Consignee OTP',
    triggerSosBtn: 'TRIGGER EMERGENCY SOS',
    fileDisputeBtn: 'Report Damage / Dispute',
    searchBtn: 'Search',
    filterBtn: 'Filter',
    saveBtn: 'Save Changes',
    cancelBtn: 'Cancel',
    confirmBtn: 'Confirm Booking',
    callDriverBtn: 'Call Driver',
    trackLiveBtn: 'Live GPS Tracking',

    pickupPoint: 'Pickup Location',
    destinationPoint: 'Destination Location',
    cargoWeight: 'Cargo Weight (kg)',
    declaredValue: 'Declared Value (NPR)',
    targetBudget: 'Target Budget (NPR)',
    offeredFare: 'Offered Fare (NPR)',
    distanceKm: 'Distance (km)',
    estimatedTransitTime: 'Estimated Transit Time',
    laborCount: 'Loading / Unloading Helpers Needed',
    specialInstructions: 'Special Handling Instructions',
    vehiclePlate: 'Vehicle Registration Plate',
    bluebookNumber: 'Bluebook (Bilbook) Number',
    routePermit: 'Route Permit Number',
    insurancePolicy: 'Insurance Policy Number',
    driverName: 'Driver Name',
    consigneeName: 'Consignee Name',
    consigneePhone: 'Consignee Phone',
    deliveryOtp: '4-Digit Delivery OTP',
    digitalSignature: 'Consignee Digital Signature',
    clearSignature: 'Clear Signature',
    paymentMethod: 'Payment Method',
    paymentStatus: 'Payment Status',
    advanceAmount: 'Advance Paid (NPR)',
    balancePayable: 'Balance at Unloading (NPR)',

    negotiationTitle: 'inDrive-Style Fare Negotiation',
    negotiationSubtitle: 'Direct, transparent price bidding between shippers and truck drivers without middlemen',
    yourCounterOffer: 'Your Counter Offer (NPR)',
    originalOffer: 'Initial Offer',
    enterFareAmount: 'Enter proposed fare amount',

    returnSaverTitle: 'Return Load Matching (Empty Run Saver)',
    returnSaverSubtitle: 'Match empty backhaul trips on highway corridors to cut shipping costs by 30-35%',
    returnDiscountBadge: 'Save 30-35% on Return Trips',
    postReturnRouteBtn: 'Post Return Route',
    emptyTruckAlert: 'Empty Truck Returning',

    challanTitle: 'Official Nepal Transport Challan Form (चलानी फारम)',
    biltyTitle: 'Consignment Note & Bill of Lading (बिल्टी)',
    consignorDetails: 'Consignor (Shipper) Information',
    consigneeDetails: 'Consignee (Receiver) Information',
    carrierDetails: 'Carrier & Vehicle Credentials',
    goodsSummary: 'Consignment Description & Weight',
    freightBreakdown: 'Freight Financial Breakdown',
    officialQrValidation: 'Official QR Code Verification',
    printDocument: 'Print Document',

    insuranceTitle: 'Vehicle & Goods-In-Transit (GIT) Insurance',
    insuranceSubtitle: 'Verified underwriting records to protect cargo against highway hazards',
    vehicleComprehensive: 'Comprehensive Vehicle Insurance',
    vehicleThirdParty: 'Third-Party Liability Insurance',
    goodsInTransitGIT: 'Goods-In-Transit (GIT) Insurance',
    expiryDateLabel: 'Policy Expiry Date',
    statusValid: 'Verified & Active',
    statusExpiringSoon: 'Expiring Soon',
    statusExpired: 'Policy Expired',
    addInsurancePolicy: 'Add Insurance Policy',

    disputeTitle: 'Cargo Claims, Damage & Dispute Center',
    disputeSubtitle: 'Formal reporting and claim arbitration for freight transport',
    damageCargo: 'Damaged Cargo',
    missingItems: 'Missing / Shortage of Goods',
    transitDelay: 'Excessive Transit Delay',
    fareDispute: 'Fare / Rate Discrepancy',
    fraudReport: 'Suspected Fraud or Violation',
    disputeDescription: 'Detailed Incident Description',
    claimedAmount: 'Claimed Compensation (NPR)',
    submitDispute: 'Submit Dispute Claim',

    emergencyTitle: 'Nepal Highway Emergency & Roadside SOS',
    emergencySubtitle: 'Direct access to Nepal Police, Traffic Desks, Heavy Cranes, and Rest Stops',
    sosBannerWarning: 'In case of emergency on the highway, press SOS to broadcast coordinates to police operations.',
    nepalPolice100: 'Nepal Police Central (100)',
    trafficPolice103: 'Traffic Police Highway Desk (103)',
    ambulance102: 'Emergency Ambulance (102)',
    heavyCraneTowing: 'Heavy Vehicle Crane & Towing',
    highwayCheckpoints: 'Highway Security Checkpoints',
    fuelStops247: '24/7 Diesel Depots',
    safeTruckRest: 'Designated Secure Truck Rest Areas',

    adminOverviewTitle: 'Platform Master Administration Console',
    adminOverviewSubtitle: 'Manage users, fleet documents, active freight, disputes, and compliance',
    totalFreightHandled: 'Total Freight Carried (Tons)',
    registeredTrucksCount: 'Commercial Trucks Registered',
    activeShipmentsCount: 'Active Shipments En Route',
    pendingVerifications: 'Documents Pending Verification',
    disputeArbitration: 'Dispute Arbitration Desk',
    approveVehicle: 'Approve Documents',
    rejectVehicle: 'Reject Documents',
    resetDemoDatabase: 'Reset Demo Database',

    // Comprehensive Verification
    verificationNav: 'Verification & KYC',
    verificationStatusUnverified: 'Unverified',
    verificationStatusPending: 'Pending Review',
    verificationStatusVerified: 'Verified',
    verificationStatusRejected: 'Rejected',
    phoneVerificationTitle: 'Phone Number & SMS OTP Verification',
    phoneVerificationSubtitle: 'Verify your mobile identity via real 6-digit cryptographic SMS OTP',
    sendOtpBtn: 'Send SMS OTP',
    verifyOtpBtn: 'Verify OTP Code',
    otpSentNotice: 'A 6-digit verification code has been dispatched to your mobile number.',
    enter6DigitOtp: 'Enter 6-Digit OTP Code',
    driverVerificationTitle: 'Driver License Verification',
    driverVerificationSubtitle: 'Official Department of Transport Management (DoTM) license verification',
    licenseNumber: 'Driver License Number',
    licenseCategory: 'License Category',
    licenseExpiry: 'License Expiry Date',
    uploadLicenseFront: 'Upload License Front Side',
    uploadLicenseBack: 'Upload License Back Side',
    nationalIdTitle: 'National ID / Citizenship Verification',
    nationalIdSubtitle: 'Government-issued Citizenship Card, National ID or Passport credentials',
    idType: 'Identity Document Type',
    idNumber: 'Document Identification Number',
    issuedDistrict: 'Issued District',
    issuedDate: 'Issued Date',
    uploadIdFront: 'Upload Identity Card Front',
    uploadIdBack: 'Upload Identity Card Back',
    companyVerificationTitle: 'Transport & Freight Company Verification',
    companyVerificationSubtitle: 'Office of the Company Registrar (OCR) & Inland Revenue Dept (PAN/VAT)',
    registeredCompanyName: 'Registered Legal Company Name',
    panNumber: 'Permanent Account Number (PAN)',
    vatNumber: 'Value Added Tax (VAT) Number',
    registrationNumber: 'Company Registration Number',
    uploadRegistrationCert: 'Upload Company Registration Certificate',
    uploadPanVatCert: 'Upload PAN/VAT Certificate',
    authorizedRepDetails: 'Authorized Representative Credentials',
    vehicleOwnerVerificationTitle: 'Vehicle Ownership & Bluebook Verification',
    vehicleOwnerVerificationSubtitle: 'Bluebook (सवारी दर्ता किताब), Annual Tax Token & Route Permit',
    taxTokenNumber: 'Vehicle Tax Clearance Receipt Number',
    taxTokenExpiry: 'Annual Vehicle Tax Expiry Date',
    uploadBluebookDoc: 'Upload Bluebook (Bilbook) Pages',
    uploadTaxTokenDoc: 'Upload Annual Tax Token Receipt',
    uploadRoutePermitDoc: 'Upload Route Permit Certificate',
    uploadOwnershipDeed: 'Upload Ownership Deed / Transfer Document',
    googleSignIn: 'Sign in with Google',
    facebookLogin: 'Log in with Facebook',
    oauthConfigNotice: 'Configured with Google Identity Services & Meta Facebook Login OAuth 2.0.',
    adminVerificationQueue: 'Central Verification & KYC Audit Console',
    adminApproveAction: 'Approve & Verify',
    adminRejectAction: 'Reject Submission',
    rejectionReasonPrompt: 'Mandatory Rejection Rationale',
    rejectionReasonLabel: 'Reason for Rejection',
    reasonBlurry: 'Document image is blurry or illegible',
    reasonExpired: 'Submitted document or license is expired',
    reasonMismatch: 'Identity details mismatch legal record',
    reasonTaxUnpaid: 'Annual vehicle tax token overdue or unpaid',
    reasonIncomplete: 'Incomplete document pages or back side missing',
    auditLogTitle: 'Verification Audit Trail & Regulatory Log',
    expiryReminders: 'Document Expiry Alerts & Notices',
    secureStorageNotice: 'Identity documents are encrypted and kept in access-controlled private vaults.',

    // Feature 1: Trip History, Earnings, Fuel & Expenses
    tripsHistoryNav: 'Trip History',
    liveTrackingNav: 'Live GPS & Route Tracking',
    driverEarningsNav: 'Driver Earnings & Ledger',
    vehicleOwnerReportsNav: 'Fleet Owner & Transport Reports',
    fuelExpensesNav: 'Fuel & Operating Expenses',
    customerTrackingPortalNav: 'Customer Cargo Tracking Portal',

    filterDaily: 'Daily (Today)',
    filterWeekly: 'Weekly',
    filterMonthly: 'Monthly',
    filterYearly: 'Yearly',
    filterCustomDate: 'Custom Date Range',
    startDateLabel: 'Start Date',
    endDateLabel: 'End Date',
    filterAllStatus: 'All Statuses',

    plannedDistance: 'Planned Highway Distance (km)',
    actualDistanceKm: 'Actual Travelled Distance (km)',
    startOdometerLabel: 'Start Odometer Reading (km)',
    endOdometerLabel: 'End Odometer Reading (km)',
    actualOdometerDiff: 'Distance via Odometer',
    odometerReadingMissing: 'Odometer reading not submitted',

    agreedFreight: 'Agreed Freight Amount',
    additionalCharges: 'Additional Charges',
    tollAndParking: 'Tolls & Parking Charges',
    loadingUnloadingFee: 'Loading / Unloading Helpers',
    platformCommission: 'LoadMitra Service Commission',
    grossRevenue: 'Gross Freight Revenue',
    netEarnings: 'Net Driver Earnings',
    pendingPayments: 'Pending Payments',
    receivedPayments: 'Received Payments',
    unpaidCustomerBalances: 'Unpaid Customer Receivables',
    pendingDriverPayments: 'Pending Driver Disbursements',

    tripStatusAssigned: 'Assigned',
    tripStatusAccepted: 'Accepted',
    tripStatusInTransit: 'In Transit',
    tripStatusDelayed: 'Delayed',
    tripStatusDelivered: 'Delivered',
    tripStatusCancelled: 'Cancelled',

    fuelLogTitle: 'Fuel & Diesel Refuelling Record',
    logFuelBtn: 'Log Fuel Purchase',
    fuelTypeDiesel: 'Diesel',
    fuelTypePetrol: 'Petrol',
    fuelTypeCng: 'CNG',
    fuelLitres: 'Volume (Litres)',
    fuelCostPerLitre: 'Price per Litre (NPR)',
    fuelTotalCost: 'Total Fuel Expense (NPR)',
    fuelStationName: 'Petrol Pump / Station Name',
    fuelStationLocation: 'Station Location / Highway',
    fuelOdometerAtRefuel: 'Odometer at Refuel (km)',
    fuelReceiptPhoto: 'Receipt / Fuel Bill Photo',
    fuelEconomyKmpl: 'Fuel Economy (km/L)',
    fuelCostPerKm: 'Fuel Cost per km (NPR)',
    fuelPolicyTitle: 'Vehicle Fuel Logging Policy',
    fuelPolicyOptional: 'Optional for trips',
    fuelPolicyRequiredAll: 'Mandatory on every trip',
    fuelPolicyRequiredSelected: 'Mandatory for designated drivers only',
    fuelReviewApprove: 'Approve Fuel Log',
    fuelReviewReject: 'Reject Fuel Log',
    fuelReviewRevision: 'Request Revision',
    fuelApprovalPending: 'Pending Review',
    fuelApprovalApproved: 'Approved',
    fuelApprovalRejected: 'Rejected',

    maintenanceTitle: 'Vehicle Maintenance & Operating Expenses',
    logExpenseBtn: 'Log New Expense',
    expenseRepairs: 'Vehicle Repairs & Servicing',
    expenseTyresParts: 'Tyres & Spare Parts',
    expenseTollsParking: 'Highway Tolls & Parking Cess',
    expenseLoadingUnloading: 'Loading & Unloading Labor',
    expenseRoadPermitsTaxes: 'Road Permits & Annual Tax Tokens',
    expenseDriverAllowance: 'Driver Daily Allowance',
    expenseOther: 'Other Incidentals',
    expenseAmount: 'Expense Amount (NPR)',
    expenseDescription: 'Expense Description & Notes',
    incompleteExpenseWarning: 'Incomplete Expense Records: Some trips have unlogged fuel purchases or missing receipts. Estimated profit is an indicative projection.',

    // Feature 2: Live Location, Delays, Breakdowns & Customer Tracking
    gpsStatusLive: 'Live GPS Connected',
    gpsStatusReported: 'Driver Reported Checkpoint',
    gpsStatusUnavailable: 'Location Data Unavailable',
    permissionRequestGps: 'Real-time GPS tracking requires browser location permission on driver device',
    updateCheckpointManually: 'Manual Checkpoint Location Update',
    lastUpdated: 'Last Updated',
    currentCheckpointLabel: 'Current Checkpoint / Landmark',
    estimatedArrivalLabel: 'Estimated Time of Arrival (ETA)',
    revisedEtaLabel: 'Revised ETA',

    driverControlTripStarted: 'Trip Started',
    driverControlOnTheWay: 'On The Way',
    driverControlStopped: 'Vehicle Stopped',
    driverControlDelayed: 'Delayed',
    driverControlBreakdown: 'Breakdown / Emergency',
    driverControlResumed: 'Resumed Journey',
    driverControlArrived: 'Arrived at Destination',
    driverControlDelivered: 'Delivered (Submit POD)',

    reportDelayBreakdownTitle: 'Report Highway Delay or Vehicle Breakdown',
    delayReasonBreakdown: 'Engine / Mechanical Breakdown',
    delayReasonTyre: 'Tyre Puncture / Blowout',
    delayReasonTraffic: 'Heavy Traffic Congestion',
    delayReasonClosure: 'Road Closure / Maintenance',
    delayReasonLandslide: 'Landslide / Mudslide (Mugling/Highway)',
    delayReasonWeather: 'Adverse Weather / Heavy Fog / Rain',
    delayReasonCheckpoint: 'Police / Traffic / Customs Checkpoint',
    delayReasonFuel: 'Refuelling Delay / Fuel Shortage',
    delayReasonLoading: 'Shipper Loading / Unloading Delay',
    delayReasonRest: 'Driver Fatigue Rest Stop',
    delayReasonAccident: 'Road Traffic Accident / Obstruction',
    delayReasonOther: 'Other Reason',
    expectedDelayDuration: 'Expected Delay Duration (minutes)',
    requestRoadsideAssistance: 'Roadside Recovery / Heavy Crane Assistance Needed',
    resumeJourneyBtn: 'Resume Journey',
    delayReportedAlert: 'Driver has logged a delay report on highway corridor.',

    trackShipmentTitle: 'Customer Cargo Tracking Portal',
    enterTrackingCode: 'Enter 10-Digit Tracking Code or Trip ID',
    searchTrackingBtn: 'Track Shipment',
    trackingCodePlaceholder: 'e.g., TRK-LM-2026-8819 or TRIP-2026-101',
    permittedDriverDetails: 'Assigned Driver & Transport Vehicle',
    secureTrackingNotice: 'This tracking page is private and restricted to authorized consignor, consignee, and carrier parties. Sensitive credentials remain secured.',
    deliveryOtpPrompt: 'Provide your 4-digit Delivery OTP to the driver upon cargo inspection to confirm delivery.',

    exportCsvBtn: 'Export CSV',
    printReportBtn: 'Print / Save PDF',
    vehicleSummaryTitle: 'Vehicle Fleet Performance & Expense Summary',
    driverSummaryTitle: 'Driver Earnings & Settlement Summary',
    estimatedProfit: 'Estimated Net Operating Profit',
    notificationsTitle: 'Notifications & Alerts',
    markAllReadBtn: 'Mark All Read',
    noNotifications: 'No unread notifications at this time.'
  },

  hi: {
    brandTitle: 'LoadMitra',
    brandCompany: 'LM Logistics & Cargo',
    tagline: 'नेपाल का अग्रणी माल ढुलाई और डिजिटल कार्गो मार्केटप्लेस',
    subtitle: 'व्यापारियों, पिकअप, मिनी-ट्रक और भारी मालवाहक ट्रकों को सीधा जोड़ने वाला मंच',
    demoBadge: 'प्रमाणीकरण एवं प्रदर्शन डेमो डेटा',
    demoBannerDesc: 'नेपाल के प्रमुख राजमार्गों और वाणिज्यिक वाहनों के वास्तविक प्रारूप पर आधारित। जीपीएस और ऑनलाइन भुगतान परीक्षण योग्य।',
    legalDisclaimer: 'वाहन पंजीकरण संख्या, आधिकारिक रूट परमिट, ओटीपी कोड और कर पहचान संख्या मानक प्रारूप में रहेंगे। बहुभाषी सुविधा आपकी सुविधा के लिए है।',

    langNepali: 'नेपाली',
    langEnglish: 'English',
    langHindi: 'हिन्दी',
    langChinese: '中文',
    selectLanguage: 'भाषा चुनें',

    navMarketplace: 'भाड़ा खोजें',
    navVehicles: 'वाहन बेड़ा',
    navPostCargo: 'सामान पोस्ट करें',
    navReturnTrips: 'वापसी भाड़ा (खाली ट्रक)',
    navActiveShipments: 'मेरी ढुलाई',
    navInsurance: 'बीमा एवं दस्तावेज',
    navEmergency: 'आपातकालीन एवं SOS',
    navAdmin: 'एडमिन कंसोल',
    switchRole: 'भूमिका बदलें',
    loginText: 'लॉग इन',
    logoutText: 'लॉग आउट',
    registerText: 'नया पंजीकरण',
    profileText: 'मेरी प्रोफाइल',

    role_customer: 'ग्राहक / व्यापारी',
    role_driver: 'चालक / वाहन मालिक',
    role_courier: 'कूरियर एवं पार्सल संचालक',
    role_fleet_company: 'ट्रांसपोर्ट एवं फ्लीट कंपनी',
    role_admin: 'प्लेटफॉर्म व्यवस्थापक',

    cat_three_wheel: '३-पहिया कार्गो (ऑटो/टेम्पो/ई-रिक्शा)',
    cat_four_wheel_pickup: '४-पहिया पिकअप (बोलेरो/हिलक्स)',
    cat_cargo_van: 'कार्गो वैन (ईको/डिलीवरी वैन)',
    cat_mini_truck: 'मिनी ट्रक (टाटा ऐस/दोस्त)',
    cat_six_wheel_truck: '६-पहिया ट्रक (टाटा ४०७/११०९)',
    cat_eight_wheel_truck: '८-पहिया भारी ट्रक',
    cat_ten_wheel_truck: '१०-पहिया भारी मालवाहक',
    cat_twelve_wheel_truck: '१२-पहिया मल्टी-एक्सल ट्रक',
    cat_fourteen_wheel_truck: '१४-पहिया विशाल मालवाहक',
    cat_heavy_freight_trailer: 'फ्लैटबेड / कंटेनर ट्रेलर',

    cargo_fmcg: 'खाद्य एवं उपभोक्ता सामग्री (FMCG)',
    cargo_construction: 'निर्माण सामग्री (सीमेंट, सरिया, गिट्टी)',
    cargo_agricultural: 'कृषि उपज, अनाज एवं फल',
    cargo_perishable: 'शीघ्र नष्ट होने वाला एवं कोल्ड चेन सामान',
    cargo_furniture: 'फर्नीचर एवं घरेलू/कार्यालय सामान',
    cargo_machinery: 'औद्योगिक मशीनरी एवं उपकरण',
    cargo_electronics: 'इलेक्ट्रॉनिक्स एवं घरेलू उपकरण',
    cargo_courier_parcels: 'कूरियर पार्सल एवं एक्सप्रेस पैकेट',
    cargo_timber_minerals: 'लकड़ी, रेत एवं खनिज पदार्थ',
    cargo_other: 'सामान्य वाणिज्यिक माल',

    body_open_body: 'खुला डाला (Open Body)',
    body_covered_container: 'बंद कंटेनर (Covered Container)',
    body_tarpaulin_high_side: 'तिरपाल हाई-साइड (Tarpaulin)',
    body_refrigerated_reefer: 'रेफ्रिजरेटेड कोल्ड वैन (Reefer)',
    body_flatbed_trailer: 'फ्लैटबेड ट्रेलर (Flatbed)',
    body_liquid_tanker: 'लिक्विड टैंकर (Tanker)',

    status_open: 'बोली के लिए खुला',
    status_bidding: 'मोलभाव जारी',
    status_assigned: 'गाड़ी तय हुई',
    status_at_pickup: 'लोडिंग स्थल पर पहुंचा',
    status_loaded: 'सामान लोड हुआ',
    status_in_transit: 'राजमार्ग पर ढुलाई जारी',
    status_at_destination: 'गंतव्य पर पहुंचा',
    status_delivered: 'सामान सुपुर्द (POD प्रमाणित)',
    status_cancelled: 'रद्द किया गया',

    postCargoBtn: 'नया माल पोस्ट करें',
    registerVehicleBtn: 'वाहन पंजीकृत करें',
    makeOfferBtn: 'भाड़ा पेश करें',
    counterOfferBtn: 'काउंटर ऑफर भेजें',
    acceptOfferBtn: 'स्वीकार करें और बुक करें',
    declineOfferBtn: 'अस्वीकार करें',
    viewChallanBtn: 'परिवहन चालान देखें',
    downloadBiltyBtn: 'चालान / बिल्टी प्रिंट करें',
    submitPodBtn: 'डिलीवरी प्रमाण (POD) जमा करें',
    verifyDeliveryOtpBtn: 'प्राप्तकर्ता का OTP सत्यापित करें',
    triggerSosBtn: 'आपातकालीन SOS सक्रिय करें',
    fileDisputeBtn: 'सामान क्षति / विवाद दर्ज करें',
    searchBtn: 'खोजें',
    filterBtn: 'फ़िल्टर',
    saveBtn: 'सुरक्षित करें',
    cancelBtn: 'रद्द करें',
    confirmBtn: 'पुष्टि करें',
    callDriverBtn: 'चालक को कॉल करें',
    trackLiveBtn: 'लाइव ट्रैकिंग',

    pickupPoint: 'उठाने का स्थान (लोडिंग पता)',
    destinationPoint: 'पहुंचाने का स्थान (अनलोडिंग पता)',
    cargoWeight: 'माल का वजन (कि.ग्रा.)',
    declaredValue: 'घोषित मूल्य (रू.)',
    targetBudget: 'अनुमानित बजट (रू.)',
    offeredFare: 'प्रस्तावित भाड़ा (रू.)',
    distanceKm: 'दूरी (कि.मी.)',
    estimatedTransitTime: 'अनुमानित समय',
    laborCount: 'लोडिंग/अनलोडिंग सहायक संख्या',
    specialInstructions: 'विशेष निर्देश एवं सावधानी',
    vehiclePlate: 'वाहन नंबर',
    bluebookNumber: 'वाहन रजिस्ट्रेशन (बिलबुक नंबर)',
    routePermit: 'रूट परमिट नंबर',
    insurancePolicy: 'बीमा पॉलिसी नंबर',
    driverName: 'चालक का नाम',
    consigneeName: 'सामान पाने वाले का नाम',
    consigneePhone: 'सामान पाने वाले का फोन',
    deliveryOtp: '४-अंकों का डिलीवरी OTP',
    digitalSignature: 'डिजिटल हस्ताक्षर',
    clearSignature: 'हस्ताक्षर मिटाएं',
    paymentMethod: 'भुगतान विधि',
    paymentStatus: 'भुगतान स्थिति',
    advanceAmount: 'अग्रिम भुगतान (रू.)',
    balancePayable: 'अनलोडिंग पर शेष राशि (रू.)',

    negotiationTitle: 'inDrive शैली में पारदर्शी भाड़ा मोलभाव',
    negotiationSubtitle: 'बिना बिचौलियों के व्यापारी और ट्रक चालक के बीच सीधा एवं निष्पक्ष भाड़ा निर्धारण',
    yourCounterOffer: 'आपका काउंटर ऑफर (रू.)',
    originalOffer: 'प्रारंभिक प्रस्ताव',
    enterFareAmount: 'प्रस्तावित भाड़ा राशि दर्ज करें',

    returnSaverTitle: 'वापसी भाड़ा बचत (खाली ट्रक से बचत)',
    returnSaverSubtitle: 'राजमार्ग पर खाली लौटने वाले ट्रकों के साथ माल जोड़ें और ३०-३५% तक भाड़ा बचाएं',
    returnDiscountBadge: '३०-३५% तक भारी छूट',
    postReturnRouteBtn: 'वापसी रूट पोस्ट करें',
    emptyTruckAlert: 'खाली ट्रक लौट रहा है',

    challanTitle: 'नेपाल सरकारी परिवहन चालान फॉर्म (चलानी फारम)',
    biltyTitle: 'कंसाइनमेंट नोट एवं बिल्टी (Bill of Lading / Bilty)',
    consignorDetails: 'प्रेषक विवरण (Consignor)',
    consigneeDetails: 'प्राप्तकर्ता विवरण (Consignee)',
    carrierDetails: 'ढुलाईकर्ता एवं वाहन विवरण (Carrier)',
    goodsSummary: 'माल विवरण एवं कुल वजन',
    freightBreakdown: 'भाड़ा वित्तीय विवरण',
    officialQrValidation: 'डिजिटल प्रमाणीकरण QR कोड',
    printDocument: 'दस्तावेज प्रिंट करें',

    insuranceTitle: 'वाहन एवं माल ढुलाई बीमा (GIT)',
    insuranceSubtitle: 'राजमार्ग पर सुरक्षित ढुलाई हेतु सत्यापित बीमा रिकॉर्ड',
    vehicleComprehensive: 'व्यापक वाहन बीमा (Comprehensive)',
    vehicleThirdParty: 'तृतीय पक्ष देयता बीमा (Third Party)',
    goodsInTransitGIT: 'माल ढुलाई बीमा (GIT Insurance)',
    expiryDateLabel: 'पॉलिसी समाप्ति तिथि',
    statusValid: 'सत्यापित एवं सक्रिय',
    statusExpiringSoon: 'शीघ्र समाप्त होने वाला',
    statusExpired: 'पॉलिसी समाप्त',
    addInsurancePolicy: 'नई बीमा पॉलिसी जोड़ें',

    disputeTitle: 'सामान क्षति, लापता माल एवं विवाद निवारण',
    disputeSubtitle: 'माल ढुलाई में निष्पक्ष जांच एवं दावा समाधान',
    damageCargo: 'सामान की टूट-फूट या क्षति',
    missingItems: 'माल की कमी या लापता होना',
    transitDelay: 'अत्यधिक विलंब',
    fareDispute: 'भाड़े में विसंगति',
    fraudReport: 'धोखाधड़ी का संदेह',
    disputeDescription: 'घटना का विस्तृत विवरण',
    claimedAmount: 'दावा की गई राशि (रू.)',
    submitDispute: 'विवाद दर्ज करें',

    emergencyTitle: 'नेपाल राजमार्ग आपातकालीन सहायता एवं SOS',
    emergencySubtitle: 'नेपाल पुलिस, ट्रैफिक हेल्पलाइन, हेभी क्रेन एवं सुरक्षित पड़ाव',
    sosBannerWarning: 'आपात स्थिति में १-टैप में पुलिस और बचाव दल को वास्तविक लोकेशन भेजी जाती है।',
    nepalPolice100: 'नेपाल पुलिस कंट्रोल (१००)',
    trafficPolice103: 'ट्रैफिक पुलिस राजमार्ग डेस्क (१०३)',
    ambulance102: 'आपातकालीन एम्बुलेंस (१०२)',
    heavyCraneTowing: 'हेभी क्रेन एवं टोइंग सेवा',
    highwayCheckpoints: 'राजमार्ग सुरक्षा चेकपोस्ट',
    fuelStops247: '२४/७ डीजल स्टेशन',
    safeTruckRest: 'सुरक्षित ट्रक पार्किंग एवं विश्राम स्थल',

    adminOverviewTitle: 'प्लेटफॉर्म मास्टर प्रशासन कंसोल',
    adminOverviewSubtitle: 'उपयोगकर्ता, फ्लीट दस्तावेज, सक्रिय ढुलाई, विवाद एवं अनुपालन प्रबंधन',
    totalFreightHandled: 'कुल ढोया गया माल (टन)',
    registeredTrucksCount: 'पंजीकृत वाणिज्यिक ट्रक',
    activeShipmentsCount: 'मार्ग में सक्रिय ढुलाई',
    pendingVerifications: 'प्रमाणीकरण हेतु लंबित दस्तावेज',
    disputeArbitration: 'विवाद मध्यस्थता डेस्क',
    approveVehicle: 'दस्तावेज स्वीकृत करें',
    rejectVehicle: 'अस्वीकृत करें',
    resetDemoDatabase: 'डेमो डेटा रीसेट करें',

    // Comprehensive Verification
    verificationNav: 'सत्यापन एवं केवाईसी (KYC)',
    verificationStatusUnverified: 'असत्यापित',
    verificationStatusPending: 'समीक्षाधीन',
    verificationStatusVerified: 'सत्यापित (Verified)',
    verificationStatusRejected: 'अस्वीकृत (Rejected)',
    phoneVerificationTitle: 'मोबाइल नंबर एवं SMS OTP सत्यापन',
    phoneVerificationSubtitle: 'वास्तविक ६-अंकीय SMS OTP कोड द्वारा फोन सत्यापित करें',
    sendOtpBtn: 'SMS OTP भेजें',
    verifyOtpBtn: 'OTP सत्यापित करें',
    otpSentNotice: 'आपके मोबाइल पर ६-अंकीय सत्यापन कोड भेजा गया है।',
    enter6DigitOtp: '६-अंकीय OTP कोड दर्ज करें',
    driverVerificationTitle: 'ड्राइविंग लाइसेंस सत्यापन',
    driverVerificationSubtitle: 'यातायात व्यवस्था विभाग (DoTM) अनुसार वैध लाइसेंस',
    licenseNumber: 'ड्राइविंग लाइसेंस संख्या',
    licenseCategory: 'लाइसेंस श्रेणी',
    licenseExpiry: 'लाइसेंस समाप्ति तिथि',
    uploadLicenseFront: 'लाइसेंस का अगला भाग अपलोड करें',
    uploadLicenseBack: 'लाइसेंस का पिछला भाग अपलोड करें',
    nationalIdTitle: 'राष्ट्रीय पहचान पत्र / नागरिकता सत्यापन',
    nationalIdSubtitle: 'नेपाल सरकार द्वारा जारी नागरिकता प्रमाण-पत्र या राष्ट्रीय पहचान पत्र',
    idType: 'पहचान पत्र प्रकार',
    idNumber: 'पहचान पत्र संख्या',
    issuedDistrict: 'जारी जिला',
    issuedDate: 'जारी तिथि',
    uploadIdFront: 'पहचान पत्र का अगला फोटो',
    uploadIdBack: 'पहचान पत्र का पिछला फोटो',
    companyVerificationTitle: 'परिवहन एवं कार्गो कंपनी सत्यापन',
    companyVerificationSubtitle: 'कंपनी रजिस्ट्रार कार्यालय (OCR) एवं स्थायी लेखा संख्या (PAN/VAT)',
    registeredCompanyName: 'पंजीकृत कंपनी का नाम',
    panNumber: 'स्थायी खाता संख्या (PAN)',
    vatNumber: 'मूल्य वर्धित कर संख्या (VAT)',
    registrationNumber: 'कंपनी पंजीकरण संख्या',
    uploadRegistrationCert: 'कंपनी पंजीकरण प्रमाण पत्र अपलोड करें',
    uploadPanVatCert: 'PAN/VAT प्रमाण पत्र अपलोड करें',
    authorizedRepDetails: 'अधिकृत प्रतिनिधि विवरण',
    vehicleOwnerVerificationTitle: 'वाहन स्वामित्व एवं बिलबुक सत्यापन',
    vehicleOwnerVerificationSubtitle: 'ब्लूबुक (बिलबुक), वार्षिक कर चुकता एवं रूट परमिट',
    taxTokenNumber: 'वाहन कर रसीद संख्या',
    taxTokenExpiry: 'वाहन कर समाप्ति तिथि',
    uploadBluebookDoc: 'ब्लूबुक (Bilbook) फोटो अपलोड करें',
    uploadTaxTokenDoc: 'कर चुकता रसीद अपलोड करें',
    uploadRoutePermitDoc: 'रूट परमिट दस्तावेज अपलोड करें',
    uploadOwnershipDeed: 'स्वामित्व हस्तांतरण दस्तावेज',
    googleSignIn: 'Google से साइन इन करें',
    facebookLogin: 'Facebook से लॉगिन करें',
    oauthConfigNotice: 'Google एवं Meta OAuth 2.0 प्रमाणीकरण। अनुपलब्ध होने पर सिम्युलेशन मोड में चलेगा।',
    adminVerificationQueue: 'केंद्रीय सत्यापन एवं ऑडिट कंसोल',
    adminApproveAction: 'स्वीकृत करें (Approve)',
    adminRejectAction: 'अस्वीकृत करें (Reject)',
    rejectionReasonPrompt: 'अस्वीकृति का कारण अनिवार्य लिखें',
    rejectionReasonLabel: 'अस्वीकृति का कारण',
    reasonBlurry: 'फोटो स्पष्ट नहीं है या पढ़ने योग्य नहीं है',
    reasonExpired: 'प्रस्तुत दस्तावेज की वैधता समाप्त हो चुकी है',
    reasonMismatch: 'विवरण सरकारी रिकॉर्ड से मेल नहीं खाते',
    reasonTaxUnpaid: 'वार्षिक वाहन कर बकाया या भुगतान नहीं हुआ है',
    reasonIncomplete: 'अधूरे दस्तावेज प्रस्तुत किए गए हैं',
    auditLogTitle: 'सत्यापन ऑडिट लॉग एवं इतिहास',
    expiryReminders: 'दस्तावेज समाप्ति सूचनाएं',
    secureStorageNotice: 'सभी पहचान पत्र और ब्लूबुक सुरक्षित निजी वॉल्ट में रखे जाते हैं।',

    // Feature 1: Trip History, Earnings, Fuel & Expenses
    tripsHistoryNav: 'यात्रा इतिहास (Trip History)',
    liveTrackingNav: 'लाइव जीपीएस एवं मार्ग ट्रैकिंग',
    driverEarningsNav: 'चालक की कमाई एवं लेजर',
    vehicleOwnerReportsNav: 'फ्लीट मालिक एवं परिवहन रिपोर्ट',
    fuelExpensesNav: 'डीजल एवं संचालन व्यय',
    customerTrackingPortalNav: 'ग्राहक शिपमेंट ट्रैकिंग पोर्टल',

    filterDaily: 'दैनिक (आज)',
    filterWeekly: 'साप्ताहिक',
    filterMonthly: 'मासिक',
    filterYearly: 'वार्षिक',
    filterCustomDate: 'कस्टम तिथि चुनें',
    startDateLabel: 'प्रारंभ तिथि',
    endDateLabel: 'अंतिम तिथि',
    filterAllStatus: 'सभी स्थितियां',

    plannedDistance: 'नियोजित राजमार्ग दूरी (किमी)',
    actualDistanceKm: 'वास्तविक तय की गई दूरी (किमी)',
    startOdometerLabel: 'प्रारंभिक ओडोमीटर रीडिंग (किमी)',
    endOdometerLabel: 'अंतिम ओडोमीटर रीडिंग (किमी)',
    actualOdometerDiff: 'ओडोमीटर अनुसार कुल दूरी',
    odometerReadingMissing: 'ओडोमीटर रीडिंग उपलब्ध नहीं',

    agreedFreight: 'सहमति भाड़ा राशि',
    additionalCharges: 'अतिरिक्त शुल्क',
    tollAndParking: 'टोल एवं पार्किंग व्यय',
    loadingUnloadingFee: 'लोडिंग / अनलोडिंग मजदूरी',
    platformCommission: 'लोडमित्र सेवा कमीशन',
    grossRevenue: 'सकल माल भाड़ा राजस्व (Gross)',
    netEarnings: 'शुद्ध चालक कमाई (Net)',
    pendingPayments: 'लंबित भुगतान',
    receivedPayments: 'प्राप्त भुगतान',
    unpaidCustomerBalances: 'ग्राहकों से बकाया राशि',
    pendingDriverPayments: 'चालकों को देय बकाया राशि',

    tripStatusAssigned: 'आवंटित (Assigned)',
    tripStatusAccepted: 'स्वीकृत',
    tripStatusInTransit: 'मार्ग में (In Transit)',
    tripStatusDelayed: 'विलंबित (Delayed)',
    tripStatusDelivered: 'वितरित (Delivered)',
    tripStatusCancelled: 'रद्द',

    fuelLogTitle: 'डीजल / ईंधन भरने का रिकॉर्ड',
    logFuelBtn: 'ईंधन प्रविष्टि दर्ज करें',
    fuelTypeDiesel: 'डीजल (Diesel)',
    fuelTypePetrol: 'पेट्रोल (Petrol)',
    fuelTypeCng: 'सीएनजी (CNG)',
    fuelLitres: 'मात्रा (लीटर)',
    fuelCostPerLitre: 'प्रति लीटर दर (रू.)',
    fuelTotalCost: 'कुल ईंधन खर्च (रू.)',
    fuelStationName: 'पेट्रोल पंप का नाम',
    fuelStationLocation: 'पंप का स्थान / राजमार्ग',
    fuelOdometerAtRefuel: 'ईंधन भराते समय ओडोमीटर (किमी)',
    fuelReceiptPhoto: 'ईंधन रसीद / बिल फोटो',
    fuelEconomyKmpl: 'ईंधन माइलेज (किमी / लीटर)',
    fuelCostPerKm: 'प्रति किमी ईंधन लागत (रू.)',
    fuelPolicyTitle: 'वाहन अनुसार ईंधन प्रविष्टि नीति',
    fuelPolicyOptional: 'वैकल्पिक',
    fuelPolicyRequiredAll: 'प्रत्येक यात्रा पर अनिवार्य',
    fuelPolicyRequiredSelected: 'केवल चयनित चालकों के लिए अनिवार्य',
    fuelReviewApprove: 'ईंधन रिकॉर्ड स्वीकृत करें',
    fuelReviewReject: 'अस्वीकृत करें',
    fuelReviewRevision: 'संशोधन का अनुरोध करें',
    fuelApprovalPending: 'समीक्षाधीन',
    fuelApprovalApproved: 'स्वीकृत',
    fuelApprovalRejected: 'अस्वीकृत',

    maintenanceTitle: 'वाहन रखरखाव एवं परिचालन व्यय',
    logExpenseBtn: 'नया व्यय दर्ज करें',
    expenseRepairs: 'वाहन मरम्मत एवं सर्विसिंग',
    expenseTyresParts: 'टायर एवं स्पेयर पार्ट्स',
    expenseTollsParking: 'टोल टैक्स एवं पार्किंग शुल्क',
    expenseLoadingUnloading: 'लोडिंग एवं अनलोडिंग मजदूरी',
    expenseRoadPermitsTaxes: 'रोड टैक्स एवं परमिट शुल्क',
    expenseDriverAllowance: 'चालक / सहायक दैनिक भत्ता',
    expenseOther: 'अन्य फुटकर खर्च',
    expenseAmount: 'खर्च राशि (रू.)',
    expenseDescription: 'खर्च का विवरण',
    incompleteExpenseWarning: 'अपूर्ण व्यय रिकॉर्ड: कुछ यात्राओं में ईंधन या रखरखाव दर्ज नहीं है, इसलिए शुद्ध लाभ अनुमानित है।',

    // Feature 2: Live Location, Delays, Breakdowns & Customer Tracking
    gpsStatusLive: 'लाइव जीपीएस कनेक्टेड (Live GPS)',
    gpsStatusReported: 'चालक द्वारा दर्ज चेकपॉइंट',
    gpsStatusUnavailable: 'स्थान डेटा अनुपलब्ध',
    permissionRequestGps: 'वास्तविक लोकेशन ट्रैकिंग के लिए चालक के डिवाइस पर जीपीएस अनुमति आवश्यक है',
    updateCheckpointManually: 'मैन्युअल चेकपॉइंट अपडेट',
    lastUpdated: 'अंतिम अपडेट',
    currentCheckpointLabel: 'वर्तमान चेकपॉइंट / स्थल',
    estimatedArrivalLabel: 'अनुमानित आगमन समय (ETA)',
    revisedEtaLabel: 'संशोधित ETA',

    driverControlTripStarted: 'यात्रा प्रारंभ (Trip Started)',
    driverControlOnTheWay: 'मार्ग में (On The Way)',
    driverControlStopped: 'वाहन रुका हुआ है (Stopped)',
    driverControlDelayed: 'विलंबित है (Delayed)',
    driverControlBreakdown: 'वाहन खराब / आपातकालीन',
    driverControlResumed: 'यात्रा पुनः प्रारंभ',
    driverControlArrived: 'गंतव्य पर पहुंचा',
    driverControlDelivered: 'माल सुपुर्द किया (POD)',

    reportDelayBreakdownTitle: 'राजमार्ग विलंब अथवा वाहन खराबी रिपोर्ट',
    delayReasonBreakdown: 'इंजन / यांत्रिक खराबी',
    delayReasonTyre: 'टायर पंचर / ब्लास्ट',
    delayReasonTraffic: 'भारी ट्रैफिक जाम',
    delayReasonClosure: 'सड़क बंद अथवा मरम्मत कार्य',
    delayReasonLandslide: 'भूस्खलन (Landslide)',
    delayReasonWeather: 'प्रतिकूल मौसम / कोहरा / भारी वर्षा',
    delayReasonCheckpoint: 'पुलिस / ट्रैफिक / चेकपोस्ट जांच',
    delayReasonFuel: 'ईंधन स्टेशन कतार / कमी',
    delayReasonLoading: 'लोडिंग / अनलोडिंग में देरी',
    delayReasonRest: 'चालक विश्राम / भोजन',
    delayReasonAccident: 'सड़क दुर्घटना / अवरोध',
    delayReasonOther: 'अन्य कारण',
    expectedDelayDuration: 'अनुमानित विलंब अवधि (मिनट)',
    requestRoadsideAssistance: 'राजमार्ग क्रेन अथवा आपातकालीन सहायता आवश्यक है',
    resumeJourneyBtn: 'यात्रा पुनः शुरू करें',
    delayReportedAlert: 'चालक ने राजमार्ग पर विलंब की सूचना दर्ज की है।',

    trackShipmentTitle: 'ग्राहक शिपमेंट लाइव ट्रैकिंग पोर्टल',
    enterTrackingCode: '१०-अंकीय ट्रैकिंग कोड या ट्रिप आईडी दर्ज करें',
    searchTrackingBtn: 'शिपमेंट ट्रैक करें',
    trackingCodePlaceholder: 'उदा: TRK-LM-2026-8819 अथवा TRIP-2026-101',
    permittedDriverDetails: 'अधिकृत चालक एवं वाहन विवरण',
    secureTrackingNotice: 'यह ट्रैकिंग पृष्ठ केवल अधिकृत ग्राहक एवं वाहक के लिए सुरक्षित है। व्यक्तिगत पहचान गोपनीय रखी जाती है।',
    deliveryOtpPrompt: 'सामान सुरक्षित प्राप्त करने पर चालक को ४-अंकीय डिलीवरी OTP दिखाएं।',

    exportCsvBtn: 'CSV डाउनलोड करें',
    printReportBtn: 'रिपोर्ट प्रिंट / PDF',
    vehicleSummaryTitle: 'वाहन वार ढुलाई एवं व्यय सारांश',
    driverSummaryTitle: 'चालक वार कमाई एवं भुगतान सारांश',
    estimatedProfit: 'अनुमानित शुद्ध परिचालन लाभ',
    notificationsTitle: 'सूचनाएं एवं अलर्ट',
    markAllReadBtn: 'सभी पढ़े गए चिन्हित करें',
    noNotifications: 'इस समय कोई नई सूचना नहीं है।'
  },

  zh: {
    brandTitle: 'LoadMitra',
    brandCompany: 'LM Logistics & Cargo',
    tagline: '尼泊尔领先的货运与数字物流交易平台',
    subtitle: '直连货主、微卡、皮卡及重型干线物流车队',
    demoBadge: '演示物流数据与环境',
    demoBannerDesc: '基于尼泊尔主要干线走廊与真实货车车型模拟。实时GPS轨迹、在线运费竞价及凭证全功能可用。',
    legalDisclaimer: '车辆牌号、官方运输许可证、提货OTP密码及税务识别号均保持标准格式不变。多语言翻译仅为方便国际物流操作。',

    langNepali: 'नेपाली',
    langEnglish: 'English',
    langHindi: 'हिन्दी',
    langChinese: '中文',
    selectLanguage: '选择语言',

    navMarketplace: '货源大厅',
    navVehicles: '车队运力',
    navPostCargo: '发布货源',
    navReturnTrips: '返程特惠车',
    navActiveShipments: '我的运单',
    navInsurance: '保险与证照',
    navEmergency: '公路应急救援',
    navAdmin: '管理中台',
    switchRole: '切换角色',
    loginText: '登录',
    logoutText: '退出登录',
    registerText: '新用户注册',
    profileText: '企业资料',

    role_customer: '货主 / 发货企业',
    role_driver: '司机 / 货车车主',
    role_courier: '快递与小包承运商',
    role_fleet_company: '物流与大型车队企业',
    role_admin: '平台超级管理员',

    cat_three_wheel: '3轮货运三轮车 (Auto/Tempo)',
    cat_four_wheel_pickup: '4轮货运皮卡 (Bolero/Hilux)',
    cat_cargo_van: '封闭厢式面包车 (Eeco/Delivery Van)',
    cat_mini_truck: '轻型微卡 (Tata Ace/Dost)',
    cat_six_wheel_truck: '6轮中型单桥货车 (407/1109)',
    cat_eight_wheel_truck: '8轮重型干线货车',
    cat_ten_wheel_truck: '10轮重型多轴载重车',
    cat_twelve_wheel_truck: '12轮重型前四后八',
    cat_fourteen_wheel_truck: '14轮大型高栏半挂牵引车',
    cat_heavy_freight_trailer: '平板车 / 集装箱拖车',

    cargo_fmcg: '快消品及包装食品 (FMCG)',
    cargo_construction: '建材五金 (水泥、螺纹钢、石料)',
    cargo_agricultural: '农产品及粮食大宗',
    cargo_perishable: '果蔬生鲜与冷链货物',
    cargo_furniture: '家具建材及企业搬迁',
    cargo_machinery: '工业机械与工程设备',
    cargo_electronics: '家用电器及电子设备',
    cargo_courier_parcels: '电商包裹与快递小包',
    cargo_timber_minerals: '木材及工业原材料',
    cargo_other: '综合大宗商业货物',

    body_open_body: '开放式栏板车 (Open Body)',
    body_covered_container: '全封闭式集装箱 (Covered Container)',
    body_tarpaulin_high_side: '高栏雨布防雨车 (High-Side Tarpaulin)',
    body_refrigerated_reefer: '冷藏冷冻温控车 (Reefer)',
    body_flatbed_trailer: '重型平板挂车 (Flatbed)',
    body_liquid_tanker: '液体罐车 (Tanker)',

    status_open: '开放报价中',
    status_bidding: '运费议价中',
    status_assigned: '车辆已锁定',
    status_at_pickup: '已抵达装货点',
    status_loaded: '货物装载完毕并铅封',
    status_in_transit: '干线公路运输中',
    status_at_destination: '已抵达目的地',
    status_delivered: '已签收 (POD电子回单已核验)',
    status_cancelled: '已取消',

    postCargoBtn: '发布新货源',
    registerVehicleBtn: '登记承运车辆',
    makeOfferBtn: '提交运费报价',
    counterOfferBtn: '提交还价报价',
    acceptOfferBtn: '接受报价并确认订车',
    declineOfferBtn: '拒绝报价',
    viewChallanBtn: '查看运输行车单 (Challan)',
    downloadBiltyBtn: '打印提单/行车单 (Bilty)',
    submitPodBtn: '提交电子签收证明 (POD)',
    verifyDeliveryOtpBtn: '核验收货人4位OTP验证码',
    triggerSosBtn: '触发一键公路紧急求助 (SOS)',
    fileDisputeBtn: '货损申报与纠纷调解',
    searchBtn: '搜索货源/车辆',
    filterBtn: '筛选条件',
    saveBtn: '保存修改',
    cancelBtn: '取消',
    confirmBtn: '确认并提交',
    callDriverBtn: '直呼司机',
    trackLiveBtn: '实时GPS在途轨迹',

    pickupPoint: '提货地址 (装货点)',
    destinationPoint: '送达地址 (卸货点)',
    cargoWeight: '货物重量 (公斤)',
    declaredValue: '货物申报价值 (卢比)',
    targetBudget: '预期运费预算 (卢比)',
    offeredFare: '司机报价 (卢比)',
    distanceKm: '运距 (公里)',
    estimatedTransitTime: '预估在途时效',
    laborCount: '装卸搬运辅助工人数量',
    specialInstructions: '特殊装载与防潮安全说明',
    vehiclePlate: '车牌号码',
    bluebookNumber: '机动车行驶证号 (Bluebook)',
    routePermit: '道路运输营运证号',
    insurancePolicy: '货物运输保险单号',
    driverName: '承运司机姓名',
    consigneeName: '收货人姓名',
    consigneePhone: '收货人联系电话',
    deliveryOtp: '4位提货签收验证码 (OTP)',
    digitalSignature: '收货人电子签名',
    clearSignature: '重签',
    paymentMethod: '运费支付方式',
    paymentStatus: '结算状态',
    advanceAmount: '装车预付款 (卢比)',
    balancePayable: '卸车尾款结算 (卢比)',

    negotiationTitle: 'inDrive式双向透明运费博弈',
    negotiationSubtitle: '无中介抽成，货主与卡车司机直接点对点协商真实合理运价',
    yourCounterOffer: '您的还价金额 (卢比)',
    originalOffer: '初始报价',
    enterFareAmount: '请输入拟议运费金额',

    returnSaverTitle: '返程空驶回程车匹配',
    returnSaverSubtitle: '撮合卸货后空车返程运力，节省高达30-35%的干线物流成本',
    returnDiscountBadge: '返程特惠立省30-35%',
    postReturnRouteBtn: '发布空车返程路线',
    emptyTruckAlert: '空车返程特惠预警',

    challanTitle: '尼泊尔交通部合规货物运输行车单 (Challan)',
    biltyTitle: '多式联运大宗货物提单 (Bill of Lading / Bilty)',
    consignorDetails: '发货人信息 (Consignor)',
    consigneeDetails: '收货人信息 (Consignee)',
    carrierDetails: '承运车队与驾驶员资质 (Carrier)',
    goodsSummary: '货物品名包装与总重',
    freightBreakdown: '运杂费与结算明细',
    officialQrValidation: '数字防伪核验二维码',
    printDocument: '打印单据',

    insuranceTitle: '车辆综合险与货物在途运输险 (GIT)',
    insuranceSubtitle: '尼泊尔境内干线公路承运人与货物全方位风险保障体系',
    vehicleComprehensive: '机动车全面商业险',
    vehicleThirdParty: '机动车第三者责任险',
    goodsInTransitGIT: '在途货物运输险 (GIT Insurance)',
    expiryDateLabel: '保单到期日',
    statusValid: '保单核验有效',
    statusExpiringSoon: '保单即将到期',
    statusExpired: '保单已失效',
    addInsurancePolicy: '录入新保单记录',

    disputeTitle: '货损货差理赔与履约争议申诉',
    disputeSubtitle: '平台官方物流纠纷快速响应与仲裁调解',
    damageCargo: '货物破损残损',
    missingItems: '货物少件缺失',
    transitDelay: '干线严重超时延误',
    fareDispute: '运费费用争议',
    fraudReport: '欺诈与严重违规举报',
    disputeDescription: '争议详细说明',
    claimedAmount: '主张索赔金额 (卢比)',
    submitDispute: '提交纠纷仲裁申请',

    emergencyTitle: '尼泊尔主要干线公路应急救援与SOS',
    emergencySubtitle: '一键直连尼泊尔国家警察、交警总队、重型拖车与安全服务区',
    sosBannerWarning: '在公路遭遇滑坡、抢险或机械故障时，点击SOS可立即向交警指挥中心广播坐标。',
    nepalPolice100: '尼泊尔国家警察报警 (100)',
    trafficPolice103: '尼泊尔交警公路指挥中心 (103)',
    ambulance102: '医疗急救救护车 (102)',
    heavyCraneTowing: '重型货车救援吊车与清障拖车',
    highwayCheckpoints: '干线安全检查站',
    fuelStops247: '24小时柴油供应站',
    safeTruckRest: '大型货车定点安全停车服务区',

    adminOverviewTitle: 'LoadMitra 平台主控管理后台',
    adminOverviewSubtitle: '全网货源、承运车队资质核验、在途运单、纠纷仲裁与财务审计',
    totalFreightHandled: '累计承运货物总量 (吨)',
    registeredTrucksCount: '平台在册商业货车',
    activeShipmentsCount: '干线在途运输单量',
    pendingVerifications: '待核验车证与保单',
    disputeArbitration: '货损仲裁专席',
    approveVehicle: '核验通过',
    rejectVehicle: '驳回重审',
    resetDemoDatabase: '重置演示数据库',

    // Comprehensive Verification
    verificationNav: '资质认证与KYC',
    verificationStatusUnverified: '未认证',
    verificationStatusPending: '审核中',
    verificationStatusVerified: '已认证 (Verified)',
    verificationStatusRejected: '已驳回 (Rejected)',
    phoneVerificationTitle: '手机号码与短信OTP验证',
    phoneVerificationSubtitle: '通过真实6位密码学短信OTP验证手机身份',
    sendOtpBtn: '发送短信OTP验证码',
    verifyOtpBtn: '验证OTP验证码',
    otpSentNotice: '已向您的手机号码发送6位验证码。',
    enter6DigitOtp: '请输入6位OTP验证码',
    driverVerificationTitle: '驾驶证资质认证',
    driverVerificationSubtitle: '尼泊尔交通管理局 (DoTM) 官方驾驶证准驾车型与有效期核验',
    licenseNumber: '驾驶证号码',
    licenseCategory: '准驾车型类别',
    licenseExpiry: '驾驶证到期日期',
    uploadLicenseFront: '上传驾驶证正面照片',
    uploadLicenseBack: '上传驾驶证副页照片',
    nationalIdTitle: '国民身份证 / 公民证认证',
    nationalIdSubtitle: '尼泊尔政府颁发的公民证、国民身份证或护照信息',
    idType: '证件类型',
    idNumber: '证件号码',
    issuedDistrict: '签发行政区 (District)',
    issuedDate: '签发日期',
    uploadIdFront: '上传身份证正面',
    uploadIdBack: '上传身份证背面',
    companyVerificationTitle: '运输与物流企业认证',
    companyVerificationSubtitle: '企业登记处 (OCR) 营业执照与税务局 (PAN/VAT) 登记',
    registeredCompanyName: '企业工商法定注册名称',
    panNumber: '纳税人永久识别号 (PAN)',
    vatNumber: '增值税登记号 (VAT)',
    registrationNumber: '企业营业执照注册号',
    uploadRegistrationCert: '上传企业注册营业执照扫描件',
    uploadPanVatCert: '上传PAN/VAT税务登记证明',
    authorizedRepDetails: '法定授权代表信息',
    vehicleOwnerVerificationTitle: '车主及蓝本 (Bilbook) 资质认证',
    vehicleOwnerVerificationSubtitle: '车辆登记蓝本 (Bluebook)、年度路税完税证明与线路营运证',
    taxTokenNumber: '车船路税收据凭证号',
    taxTokenExpiry: '年度路税有效截止日期',
    uploadBluebookDoc: '上传车辆蓝本 (Bluebook) 内页扫描件',
    uploadTaxTokenDoc: '上传年度路税完税收据',
    uploadRoutePermitDoc: '上传线路营运许可证明 (Route Permit)',
    uploadOwnershipDeed: '上传车辆所有权与过户证明',
    googleSignIn: '使用 Google 账号登录',
    facebookLogin: '使用 Facebook 账号登录',
    oauthConfigNotice: '已适配 Google 与 Meta OAuth 2.0。未配置密钥时以模拟模式安全运行。',
    adminVerificationQueue: '资质审核中台与合规日志',
    adminApproveAction: '审核通过 (Approve)',
    adminRejectAction: '驳回申请 (Reject)',
    rejectionReasonPrompt: '请输入驳回理由（必填）',
    rejectionReasonLabel: '驳回原因',
    reasonBlurry: '证件照片模糊不清或难以辨识',
    reasonExpired: '提交的证件或执照已超出有效期',
    reasonMismatch: '证件信息与法定数据库记录不一致',
    reasonTaxUnpaid: '年度车船路税逾期未缴',
    reasonIncomplete: '证件缺页或缺少背面扫描件',
    auditLogTitle: '资质认证审计日志与追溯链',
    expiryReminders: '证照临期预警与续期提醒',
    secureStorageNotice: '所有公民证、驾照和蓝本均保存在私有访问控制安全库中。',

    // Feature 1: Trip History, Earnings, Fuel & Expenses
    tripsHistoryNav: '行程历史 (Trip History)',
    liveTrackingNav: '实时轨迹与预计到达 (ETA)',
    driverEarningsNav: '司机收益与账目明细',
    vehicleOwnerReportsNav: '车队老板与运输经营报表',
    fuelExpensesNav: '燃油与车辆运营成本',
    customerTrackingPortalNav: '货主运单公开查询中心',

    filterDaily: '今日 (Daily)',
    filterWeekly: '本周 (Weekly)',
    filterMonthly: '本月 (Monthly)',
    filterYearly: '年度 (Yearly)',
    filterCustomDate: '自定义日期区间',
    startDateLabel: '起始日期',
    endDateLabel: '结束日期',
    filterAllStatus: '全部状态',

    plannedDistance: '规划干线公路里程 (公里)',
    actualDistanceKm: '实际行驶里程 (公里)',
    startOdometerLabel: '发车里程表读数 (公里)',
    endOdometerLabel: '到达里程表读数 (公里)',
    actualOdometerDiff: '里程表计算实跑距离',
    odometerReadingMissing: '里程表读数待司机录入',

    agreedFreight: '协议商定总运费',
    additionalCharges: '装卸附加费及杂项',
    tollAndParking: '干线过桥过路及停车费',
    loadingUnloadingFee: '人工搬运与装卸力资',
    platformCommission: 'LoadMitra 平台居间技术服务费',
    grossRevenue: '运费毛收入 (Gross Revenue)',
    netEarnings: '实际到手净收益 (Net Earnings)',
    pendingPayments: '待结算在途款项',
    receivedPayments: '已到账已付清运费',
    unpaidCustomerBalances: '货主未付账期应收款',
    pendingDriverPayments: '应付司机待发薪资与运费',

    tripStatusAssigned: '已派车 (Assigned)',
    tripStatusAccepted: '司机已接单',
    tripStatusInTransit: '干线在途中 (In Transit)',
    tripStatusDelayed: '途中遭遇延误 (Delayed)',
    tripStatusDelivered: '到达签收交付 (Delivered)',
    tripStatusCancelled: '已取消',

    fuelLogTitle: '柴油与燃料加注记录',
    logFuelBtn: '录入加油记录',
    fuelTypeDiesel: '柴油 (Diesel)',
    fuelTypePetrol: '汽油 (Petrol)',
    fuelTypeCng: '压缩天然气 (CNG)',
    fuelLitres: '加油升数 (Litres)',
    fuelCostPerLitre: '单价 (卢比/升)',
    fuelTotalCost: '加油总金额 (卢比)',
    fuelStationName: '加油站名称',
    fuelStationLocation: '加油站位置 / 公路段',
    fuelOdometerAtRefuel: '加油时车辆里程表 (公里)',
    fuelReceiptPhoto: '加油机凭条 / 发票照片',
    fuelEconomyKmpl: '百公里油耗 / 百升里程 (km/L)',
    fuelCostPerKm: '每公里燃油成本 (卢比/km)',
    fuelPolicyTitle: '车辆加油登记录入策略',
    fuelPolicyOptional: '车主自选（选填）',
    fuelPolicyRequiredAll: '每趟行程强制录入',
    fuelPolicyRequiredSelected: '仅对指定司机强制',
    fuelReviewApprove: '核准燃油报销凭证',
    fuelReviewReject: '驳回加油报销',
    fuelReviewRevision: '要求司机补充重新提交',
    fuelApprovalPending: '待审核',
    fuelApprovalApproved: '已核准',
    fuelApprovalRejected: '已驳回',

    maintenanceTitle: '车辆维保与日常运营开支',
    logExpenseBtn: '录入车辆费用',
    expenseRepairs: '机械大修与常规保养',
    expenseTyresParts: '轮胎磨损更换与零部件',
    expenseTollsParking: '干线公路过桥路费与停车费',
    expenseLoadingUnloading: '人工装卸货搬运杂费',
    expenseRoadPermitsTaxes: '车船税及跨省过境特许通行费',
    expenseDriverAllowance: '司机与跟车押运员伙食津贴',
    expenseOther: '其他偶发运营支出',
    expenseAmount: '费用金额 (卢比)',
    expenseDescription: '费用详细说明',
    incompleteExpenseWarning: '提示：由于部分运单尚未录入加油票据或维保凭据，当前测算利润为根据已有账目估算之参考值。',

    // Feature 2: Live Location, Delays, Breakdowns & Customer Tracking
    gpsStatusLive: '高精度实时GPS在线 (Live GPS)',
    gpsStatusReported: '司机上报公路检查站坐标',
    gpsStatusUnavailable: '位置信号暂时离线',
    permissionRequestGps: '获取高精度真实坐标需要在司机移动设备浏览器上授予定位权限',
    updateCheckpointManually: '手动更新所处公路检查点',
    lastUpdated: '最后同步时间',
    currentCheckpointLabel: '当前所处干线位置 / 地标',
    estimatedArrivalLabel: '预计到达时间 (ETA)',
    revisedEtaLabel: '更新后 ETA',

    driverControlTripStarted: '发车启程 (Trip Started)',
    driverControlOnTheWay: '正常在途中 (On The Way)',
    driverControlStopped: '中途停靠中 (Stopped)',
    driverControlDelayed: '发生延误 (Delayed)',
    driverControlBreakdown: '机械故障 / 应急故障',
    driverControlResumed: '解除警报，恢复行驶',
    driverControlArrived: '已抵达收货目的地',
    driverControlDelivered: '完成卸货交付 (签署POD)',

    reportDelayBreakdownTitle: '上报干线路况延误或货车机械故障',
    delayReasonBreakdown: '发动机 / 刹车底盘机械故障',
    delayReasonTyre: '爆胎 / 补胎充气维修',
    delayReasonTraffic: '公路交通严重大拥堵',
    delayReasonClosure: '干线道路施工封闭管制',
    delayReasonLandslide: '山体滑坡 / 泥石流塌方 (Mugling/Highway)',
    delayReasonWeather: '恶劣暴雨 / 浓雾低温通行受阻',
    delayReasonCheckpoint: '交警 / 交通海关地磅抽检',
    delayReasonFuel: '排队加油 / 柴油供应短缺',
    delayReasonLoading: '发货企业延误装车 / 卸货排队',
    delayReasonRest: '疲劳驾驶法定安全停车休整',
    delayReasonAccident: '交通事故阻滞路段',
    delayReasonOther: '其他特殊突发事件',
    expectedDelayDuration: '预计滞留延误时长 (分钟)',
    requestRoadsideAssistance: '需要调派重型吊车或公路救援协助',
    resumeJourneyBtn: '确认已恢复通行',
    delayReportedAlert: '承运司机已向平台及货主同步公路延误报告。',

    trackShipmentTitle: '货主公开货物运单轨迹查询',
    enterTrackingCode: '输入10位运单查询码 (Tracking Code) 或行程编号',
    searchTrackingBtn: '立即查询运单',
    trackingCodePlaceholder: '例: TRK-LM-2026-8819 或 TRIP-2026-101',
    permittedDriverDetails: '本次承运司机及车辆资质概要',
    secureTrackingNotice: '本查询通道受严格访问权限控制，仅展示货主授权信息，司机敏感身份证件与他人隐私受到严格保护。',
    deliveryOtpPrompt: '货物到达现场查验合格后，请向司机出示4位交付OTP密码以完成签收。',

    exportCsvBtn: '导出 CSV 数据表',
    printReportBtn: '打印报表 / 存为 PDF',
    vehicleSummaryTitle: '车队各车辆运输里程与成本汇总',
    driverSummaryTitle: '司机收益结算明细报表',
    estimatedProfit: '预计经营净利润',
    notificationsTitle: '消息与运单动态提醒',
    markAllReadBtn: '全部标为已读',
    noNotifications: '暂无未读消息。'
  }
};
