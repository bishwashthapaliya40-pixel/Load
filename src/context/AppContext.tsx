import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Language, Booking, CargoPost, BidOffer } from '../types';
import { translations, TranslationDictionary } from '../data/translations';
import { INITIAL_USERS } from '../data/mockData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCargoForBidding: CargoPost | null;
  setSelectedCargoForBidding: (cargo: CargoPost | null) => void;
  selectedBookingForChallan: Booking | null;
  setSelectedBookingForChallan: (booking: Booking | null) => void;
  selectedBookingForPod: Booking | null;
  setSelectedBookingForPod: (booking: Booking | null) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isPostCargoModalOpen: boolean;
  setIsPostCargoModalOpen: (open: boolean) => void;
  isRegisterVehicleModalOpen: boolean;
  setIsRegisterVehicleModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: (open: boolean) => void;
  isCustomerTrackingModalOpen: boolean;
  setIsCustomerTrackingModalOpen: (open: boolean) => void;
  selectedTripForDetail: any | null;
  setSelectedTripForDetail: (trip: any | null) => void;
  unreadNotificationsCount: number;
  setUnreadNotificationsCount: (count: number) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Nepali ('ne') for Nepal, or restore from localStorage
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('loadmitra_language') as Language;
    if (saved && (saved === 'ne' || saved === 'en' || saved === 'hi' || saved === 'zh')) {
      return saved;
    }
    return 'ne'; // Nepali as official default
  });

  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const savedUser = localStorage.getItem('loadmitra_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USERS[0]; // Ramesh Adhikari (Customer / Shipper)
  });

  const [activeTab, setActiveTab] = useState<string>('marketplace');
  const [selectedCargoForBidding, setSelectedCargoForBidding] = useState<CargoPost | null>(null);
  const [selectedBookingForChallan, setSelectedBookingForChallan] = useState<Booking | null>(null);
  const [selectedBookingForPod, setSelectedBookingForPod] = useState<Booking | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isPostCargoModalOpen, setIsPostCargoModalOpen] = useState<boolean>(false);
  const [isRegisterVehicleModalOpen, setIsRegisterVehicleModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState<boolean>(false);
  const [isCustomerTrackingModalOpen, setIsCustomerTrackingModalOpen] = useState<boolean>(false);
  const [selectedTripForDetail, setSelectedTripForDetail] = useState<any | null>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Set language with persistence
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('loadmitra_language', lang);
    if (currentUser) {
      const updatedUser = { ...currentUser, preferredLanguage: lang };
      setCurrentUserState(updatedUser);
      localStorage.setItem('loadmitra_user', JSON.stringify(updatedUser));
    }
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    localStorage.setItem('loadmitra_user', JSON.stringify(user));
    if (user.preferredLanguage) {
      setLanguageState(user.preferredLanguage);
      localStorage.setItem('loadmitra_language', user.preferredLanguage);
    }
  };

  const switchUserRole = (role: UserRole) => {
    const matching = INITIAL_USERS.find((u) => u.role === role) || {
      ...currentUser,
      role
    };
    setCurrentUser(matching);
    showToast(`Switched view to ${translations[language][`role_${role}` as keyof TranslationDictionary]}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const t = translations[language] || translations.ne;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentUser,
        setCurrentUser,
        switchUserRole,
        activeTab,
        setActiveTab,
        selectedCargoForBidding,
        setSelectedCargoForBidding,
        selectedBookingForChallan,
        setSelectedBookingForChallan,
        selectedBookingForPod,
        setSelectedBookingForPod,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isPostCargoModalOpen,
        setIsPostCargoModalOpen,
        isRegisterVehicleModalOpen,
        setIsRegisterVehicleModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isNotificationsDrawerOpen,
        setIsNotificationsDrawerOpen,
        isCustomerTrackingModalOpen,
        setIsCustomerTrackingModalOpen,
        selectedTripForDetail,
        setSelectedTripForDetail,
        unreadNotificationsCount,
        setUnreadNotificationsCount,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
