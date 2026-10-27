import { useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';

const DEFAULT_DRIVER_SETTINGS = {
  dailyRate: 799,
  hourlyRate: 120,
  registrationFee: 799,
  isRegistrationActive: true,
  badgeText: '₹799/Day',
  planName: 'Verified Driver Daily Hire & Registration',
  noticeText: 'Verified Commercial Driver • Available across Bhubaneswar, Cuttack & Puri',
};

const STORAGE_KEY = 'carzodrive_driver_settings';

export function useDriverSettings() {
  const [driverSettings, setDriverSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed.dailyRate === 'number') {
            return parsed;
          }
        }
      } catch (_) {}
    }
    return DEFAULT_DRIVER_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchDriverSettings = async () => {
    setIsLoading(true);
    try {
      const res = await settingsAPI.getDriverSettings();
      if (res?.data) {
        const data = {
          dailyRate: Number(res.data.dailyRate ?? 799),
          hourlyRate: Number(res.data.hourlyRate ?? 120),
          registrationFee: Number(res.data.registrationFee ?? 799),
          isRegistrationActive: res.data.isRegistrationActive ?? true,
          badgeText: res.data.badgeText || `₹${res.data.dailyRate ?? 799}/Day`,
          planName: res.data.planName || 'Verified Driver Daily Hire & Registration',
          noticeText: res.data.noticeText || 'Verified Commercial Driver • Available across Bhubaneswar, Cuttack & Puri',
        };
        setDriverSettings(data);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (_) {}
      }
    } catch (err) {
      console.warn('Driver settings load notice, using standard ₹799 defaults:', err?.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverSettings();

    const handleCustomChange = (e) => {
      if (e.detail) {
        const incoming = e.detail;
        setDriverSettings((prev) => ({
          ...prev,
          dailyRate: Number(incoming.dailyRate ?? prev.dailyRate),
          hourlyRate: Number(incoming.hourlyRate ?? prev.hourlyRate),
          registrationFee: Number(incoming.registrationFee ?? prev.registrationFee),
          isRegistrationActive: incoming.isRegistrationActive ?? prev.isRegistrationActive,
          badgeText: incoming.badgeText || `₹${incoming.dailyRate ?? prev.dailyRate}/Day`,
          noticeText: incoming.noticeText || prev.noticeText,
        }));
      } else {
        fetchDriverSettings();
      }
    };

    window.addEventListener('carzodrive-driver-settings-change', handleCustomChange);
    window.addEventListener('storage', (ev) => {
      if (ev.key === STORAGE_KEY && ev.newValue) {
        try {
          setDriverSettings(JSON.parse(ev.newValue));
        } catch (_) {}
      }
    });

    return () => {
      window.removeEventListener('carzodrive-driver-settings-change', handleCustomChange);
    };
  }, []);

  return {
    driverSettings,
    dailyRate: driverSettings.dailyRate || 799,
    registrationFee: driverSettings.registrationFee || 799,
    badgeText: driverSettings.badgeText || '₹799/Day',
    isLoading,
    refetch: fetchDriverSettings,
  };
}
