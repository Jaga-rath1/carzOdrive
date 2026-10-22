import React, { useState } from 'react';
import {
  MessageCircle,
  Coins,
  CheckCircle2,
  Printer,
  CalendarCheck,
  FileText,
} from 'lucide-react';
import { Button } from '../common/Button';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { InvoiceModal } from '../common/InvoiceModal';
import { formatCurrency } from '../../utils/formatters';
import { getQuickBookingWhatsAppMessage } from '../../utils/whatsapp';

export const BookingStepConfirmation = ({
  paymentMode,
  bookingCode,
  paymentNumber,
  invoiceNumber,
  confirmedBooking,
  transactionId,
  guestName,
  guestPhone,
  guestEmail,
  guestNotes,
  currentService,
  currentItemName,
  userCarModel,
  pickupDate,
  returnDate,
  selectedService,
  days,
  effectivePickupLocation,
  effectiveDropoffLocation,
  includeProtection,
  amountDueNow,
  amountDueAtPickup,
  remainingAmount,
  total,
  deposit,
  onResetAndClose,
  onViewBooking,
}) => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const invoiceBookingData = confirmedBooking || {
    bookingNumber: bookingCode,
    invoiceNumber: invoiceNumber || (paymentNumber ? `INV-${paymentNumber.replace(/^PAY-/, '')}` : undefined),
    guestName,
    guestPhone,
    guestEmail,
    guestNotes,
    serviceType: selectedService,
    vehicleName: userCarModel ? `${currentItemName} (Client Car: ${userCarModel})` : currentItemName,
    pickupLocation: effectivePickupLocation,
    dropoffLocation: effectiveDropoffLocation,
    pickupDate,
    returnDate,
    days: selectedService === 'tour-packages' ? 1 : days,
    includeProtection,
    totalAmount: total,
    paidAmount: amountDueNow,
    balanceAmount: amountDueAtPickup,
    securityDeposit: deposit,
    paymentMode,
    paymentStatus: paymentMode === 'full' ? 'PAID' : paymentMode === 'partial' ? 'PARTIALLY_PAID' : 'OFFLINE_PENDING',
    transactionId,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-5 text-center sm:text-left">
      {/* Dynamic Success Banner based on paymentMode */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4 ${
          paymentMode === 'full'
            ? 'bg-blue-50 border-blue-300'
            : paymentMode === 'partial'
            ? 'bg-indigo-50 border-indigo-300'
            : 'bg-emerald-50 border-emerald-300'
        }`}
      >
        <div
          className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
            paymentMode === 'full'
              ? 'bg-blue-100 border-blue-300 text-blue-600'
              : paymentMode === 'partial'
              ? 'bg-indigo-100 border-indigo-300 text-indigo-600'
              : 'bg-emerald-100 border-emerald-300 text-emerald-600'
          }`}
        >
          {paymentMode === 'offline' ? (
            <MessageCircle className="w-6 h-6" />
          ) : paymentMode === 'partial' ? (
            <Coins className="w-6 h-6" />
          ) : (
            <CheckCircle2 className="w-6 h-6" />
          )}
        </div>
        <div>
          <div
            className={`text-xs uppercase tracking-wider font-bold ${
              paymentMode === 'full'
                ? 'text-blue-700'
                : paymentMode === 'partial'
                ? 'text-indigo-700'
                : 'text-emerald-700'
            }`}
          >
            Booking Reference: <span className="font-mono text-slate-950 font-bold">{bookingCode}</span> •{' '}
            Payment Receipt: <span className="font-mono text-slate-950 font-bold">{paymentNumber || transactionId}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-950 mt-0.5">
            {paymentMode === 'offline'
              ? `WhatsApp Concierge Dispatched for ${guestName || 'Distinguished Guest'}`
              : `Priority Allocation Secured for ${guestName || 'Distinguished Guest'}`}
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            {paymentMode === 'full'
              ? `100% Payment authorized (${transactionId || 'Verified Gateway'}). Zero balance due on vehicle handover.`
              : paymentMode === 'partial'
              ? `25% Advance token authorized (${transactionId || 'Verified Gateway'}). Balance ${formatCurrency(
                  remainingAmount
                )} payable at vehicle handover.`
              : `Booking itinerary dispatched to our WhatsApp concierge. Full fare ${formatCurrency(
                  total
                )} payable on vehicle delivery.`}
          </p>
        </div>
      </div>

      {/* Booking Summary Card */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-medium">Service Category:</span>
          <span className="font-bold text-slate-950">{currentService?.label}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-medium">Selected Item:</span>
          <span className="font-bold text-blue-600">
            {userCarModel ? `${currentItemName} (Own Car: ${userCarModel})` : currentItemName}
          </span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-medium">Schedule:</span>
          <span className="font-semibold text-slate-900">
            {pickupDate} to {returnDate} (
            {selectedService === 'tour-packages' ? 'Package' : `${days} ${days === 1 ? 'Day' : 'Days'}`}
            )
          </span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-medium">Pick-up Location:</span>
          <span className="font-bold text-slate-900">{effectivePickupLocation}</span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-medium">Drop-off Location:</span>
          <span className="font-bold text-slate-900">{effectiveDropoffLocation}</span>
        </div>
        {includeProtection && (
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-medium">Protection:</span>
            <span className="font-bold text-blue-600">Zero-Excess Damage Waiver</span>
          </div>
        )}

        {/* Payment Breakdown details */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-medium">Payment Mode & Status:</span>
          <span className="font-bold text-slate-900">
            {paymentMode === 'full'
              ? 'Full Payment (100% Online • PAID)'
              : paymentMode === 'partial'
              ? 'Partial Payment (25% Token Online • PARTIALLY_PAID)'
              : 'Offline Payment (Pay at Pickup • OFFLINE_PENDING)'}
          </span>
        </div>

        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-medium">Paid Online Today:</span>
          <span className="font-bold text-emerald-600">
            {formatCurrency(amountDueNow)} {transactionId ? `(Txn: ${transactionId})` : ''}
          </span>
        </div>

        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-500 font-medium">Balance on Handover:</span>
          <span className="font-bold text-slate-900">
            {amountDueAtPickup > 0 ? `${formatCurrency(amountDueAtPickup)} (Cash / UPI)` : '₹0 (Paid in Full)'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-bold text-slate-900">Total Booking Value:</span>
          <span className="text-base font-black text-blue-600">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full sm:w-1/3"
            icon={FileText}
            iconPosition="left"
            onClick={() => setShowInvoiceModal(true)}
          >
            Invoice / Voucher
          </Button>

          <button
            type="button"
            onClick={onViewBooking}
            className="w-full sm:w-1/3 py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>View Booking</span>
          </button>

          <Button
            type="button"
            variant="primary"
            size="md"
            className="w-full sm:w-1/3"
            onClick={onResetAndClose}
          >
            Done
          </Button>
        </div>

        <WhatsAppButton
          message={getQuickBookingWhatsAppMessage({
            serviceName: currentService?.label,
            vehicleName: userCarModel
              ? `${currentItemName} (Client Car: ${userCarModel})`
              : currentItemName,
            userCarModel,
            pickupDate,
            returnDate,
            days: selectedService === 'tour-packages' ? 1 : days,
            location: effectivePickupLocation,
            dropLocation: effectiveDropoffLocation,
            protection: includeProtection ? 'Zero-Excess Damage Waiver' : 'Standard / None',
            deposit,
            total: formatCurrency(total),
            paymentMode:
              paymentMode === 'full'
                ? 'Full Payment (100% Online)'
                : paymentMode === 'partial'
                ? 'Partial Payment (25% Token Online)'
                : 'Offline Payment (Pay at Pickup)',
            paidNow: formatCurrency(amountDueNow),
            balanceOnPickup: formatCurrency(amountDueAtPickup),
            bookingCode,
            guestName,
            guestPhone,
            guestEmail,
            notes: guestNotes,
          })}
          label={`Chat with Concierge on WhatsApp (Ref: ${bookingCode})`}
          size="md"
          variant="solid"
          className="w-full py-3 text-xs"
        />
      </div>

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        booking={invoiceBookingData}
        bookingIdOrCode={bookingCode}
      />
    </div>
  );
};
