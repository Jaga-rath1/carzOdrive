import { useState, useEffect, useCallback } from 'react';
import { settingsAPI } from '../services/api';

const DEFAULT_DISCOUNT = {
  isActive: true,
  percentage: 5,
  name: 'Special Promotional Discount',
  badgeText: '5% OFF',
  bannerText: 'Limited Offer: Enjoy 5% OFF on all Self-Drive & Car with Driver Rides across Odisha!',
  minBookingAmount: 0,
  maxDiscountCap: 5000,
  applicableServices: [
    'self-drive-car',
    'self-drive-bike',
    'car-with-driver',
    'driver-only',
    'tour-packages',
  ],
};

let globalDiscountState = { ...DEFAULT_DISCOUNT };
let hasFetchedDiscount = false;
const listeners = new Set();

function updateGlobalDiscount(newDiscount) {
  if (!newDiscount) return;
  globalDiscountState = {
    ...globalDiscountState,
    ...newDiscount,
    percentage: Number(newDiscount.percentage ?? globalDiscountState.percentage ?? 5),
    isActive: newDiscount.isActive !== undefined ? Boolean(newDiscount.isActive) : globalDiscountState.isActive,
  };
  listeners.forEach((listener) => listener(globalDiscountState));
}

export function useDiscount() {
  const [discount, setDiscount] = useState(globalDiscountState);
  const [isLoading, setIsLoading] = useState(!hasFetchedDiscount);

  useEffect(() => {
    listeners.add(setDiscount);

    if (!hasFetchedDiscount) {
      hasFetchedDiscount = true;
      settingsAPI
        .getDiscount()
        .then((res) => {
          const data = res?.data || res;
          if (data && typeof data === 'object') {
            updateGlobalDiscount(data);
          }
        })
        .catch((err) => {
          console.warn('Discount fetch fallback to default 5%:', err?.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    const handleCustomChange = (e) => {
      const data = e?.detail;
      if (data) {
        updateGlobalDiscount(data);
      }
    };

    window.addEventListener('carzodrive-discount-change', handleCustomChange);
    return () => {
      listeners.delete(setDiscount);
      window.removeEventListener('carzodrive-discount-change', handleCustomChange);
    };
  }, []);

  const calculateDiscount = useCallback(
    (baseAmount = 0, serviceType = 'self-drive-car') => {
      const numBase = Math.max(0, Number(baseAmount) || 0);
      const isEligibleService =
        !discount.applicableServices ||
        discount.applicableServices.length === 0 ||
        discount.applicableServices.includes(serviceType);

      const isMinAmountSatisfied = numBase >= (discount.minBookingAmount || 0);

      const isEligible = Boolean(
        discount.isActive &&
        discount.percentage > 0 &&
        isEligibleService &&
        isMinAmountSatisfied
      );

      if (!isEligible) {
        return {
          originalAmount: numBase,
          discountAmount: 0,
          finalAmount: numBase,
          discountPercent: 0,
          isDiscountActive: false,
          badgeText: '',
        };
      }

      let discountAmount = Math.round((numBase * discount.percentage) / 100);
      if (discount.maxDiscountCap && discount.maxDiscountCap > 0) {
        discountAmount = Math.min(discountAmount, discount.maxDiscountCap);
      }

      const finalAmount = Math.max(0, numBase - discountAmount);

      return {
        originalAmount: numBase,
        discountAmount,
        finalAmount,
        discountPercent: discount.percentage,
        isDiscountActive: true,
        badgeText: discount.badgeText || `${discount.percentage}% OFF`,
      };
    },
    [discount]
  );

  return {
    discount,
    isLoading,
    calculateDiscount,
    isDiscountActive: discount.isActive && discount.percentage > 0,
    discountPercentage: discount.percentage,
    badgeText: discount.badgeText || `${discount.percentage}% OFF`,
    bannerText: discount.bannerText || `Exclusive ${discount.percentage}% OFF on all bookings!`,
  };
}
