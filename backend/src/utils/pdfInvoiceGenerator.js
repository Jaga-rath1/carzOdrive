const PDFDocument = require('pdfkit');

const COMPANY_META = {
  legalName: 'CARZODRIVE LUXURY MOBILITY & TOURS PRIVATE LIMITED',
  tradeName: 'CARZODRIVE',
  tagline: 'Odisha Premium Mobility & Guided Tours Platform',
  address: 'Plot No. 42, Airport Square, Master Canteen, Bhubaneswar, Odisha - 751001, India',
  gstin: '21AAACC1234D1Z5',
  cin: 'U50100OR2026PTC045812',
  pan: 'AAACC1234D',
  state: 'Odisha',
  stateCode: '21',
  supportPhone: '+91 79780 00000',
  supportEmail: 'concierge@carzodrive.com',
  website: 'https://carzodrive.com',
  sacCarRental: '996411',
  sacTourOperator: '998553',
};

/**
 * Generate official PDF Buffer for Tax Invoice & Travel Voucher
 * @param {Object} booking 
 * @returns {Promise<Buffer>}
 */
function generateInvoicePdfBuffer(booking) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 36,
        info: {
          Title: `Tax Invoice - ${booking.invoiceNumber || booking.bookingNumber || 'CARZODRIVE'}`,
          Author: 'CARZODRIVE LUXURY MOBILITY',
          Subject: 'Official Tax Invoice & Travel Voucher',
          Keywords: 'carzodrive, invoice, gst, voucher, travel',
        },
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const bookingNumber = booking.bookingNumber || booking._id;
      const invoiceNumber = booking.invoiceNumber || `INV-${String(bookingNumber).replace(/^CZ-/, '')}`;
      const isTour =
        booking.serviceType?.toLowerCase().includes('tour') ||
        booking.serviceType?.toLowerCase().includes('package') ||
        Boolean(booking.packageId);

      const sacCode = isTour ? COMPANY_META.sacTourOperator : COMPANY_META.sacCarRental;
      const gstRate = isTour ? 5 : 18;

      const total = Number(booking.totalAmount || booking.priceBreakdown?.totalAmount || 0);
      const paid = Number(booking.paidAmount || (booking.paymentStatus === 'PAID' ? total : 0));
      const balance = booking.balanceAmount !== undefined ? Number(booking.balanceAmount) : Math.max(0, total - paid);
      const deposit = Number(booking.securityDeposit || booking.priceBreakdown?.securityDeposit || 0);

      const baseRate = Math.round(total / (1 + gstRate / 100));
      const gstAmount = Math.max(0, total - baseRate);
      const cgst = Math.round(gstAmount / 2);
      const sgst = gstAmount - cgst;

      const customerName = booking.guestName || booking.customerId?.name || 'Valued Guest';
      const customerPhone = booking.guestPhone || booking.customerId?.phone || 'Not provided';
      const customerEmail = booking.guestEmail || booking.customerId?.email || 'Not provided';
      const vehicleName =
        booking.vehicleName ||
        booking.vehicleId?.name ||
        booking.bikeId?.name ||
        booking.packageId?.name ||
        booking.packageId?.title ||
        (isTour ? 'Odisha Tour Package' : 'Fleet Rental');

      const formatLoc = (loc, fallback) => {
        if (!loc) return fallback;
        if (typeof loc === 'string') return loc;
        if (typeof loc === 'object') return loc.address || loc.name || loc.city || fallback;
        return String(loc);
      };

      const pickup = formatLoc(booking.pickupLocation, 'Bhubaneswar Hub');
      const dropoff = formatLoc(booking.dropoffLocation, 'Same as Pickup');
      const pickupDate = booking.pickupDate || (booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : 'Scheduled');
      const returnDate = booking.returnDate || (booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-IN') : 'Scheduled');
      const days = Number(booking.days || 1);
      const invoiceDate = booking.invoiceDate ? new Date(booking.invoiceDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');

      const pageWidth = doc.page.width;
      const margin = 36;
      const contentWidth = pageWidth - margin * 2;

      // ─────────────────────────────────────────────────────────────────────────────
      // 1. BRAND HEADER & TAX INVOICE BANNER
      // ─────────────────────────────────────────────────────────────────────────────
      doc.rect(margin, margin, contentWidth, 75).fill('#0f172a');

      // Left Brand
      doc.fillColor('#38bdf8').font('Helvetica-Bold').fontSize(22).text('CARZODRIVE', margin + 14, margin + 12);
      doc.fillColor('#94a3b8').font('Helvetica').fontSize(8).text(COMPANY_META.legalName, margin + 14, margin + 38);
      doc.fillColor('#cbd5e1').font('Helvetica').fontSize(7.5).text(
        `${COMPANY_META.address} | GSTIN: ${COMPANY_META.gstin} | PAN: ${COMPANY_META.pan} | State: 21 (Odisha)`,
        margin + 14,
        margin + 50
      );

      // Right Tax Invoice Badge
      doc.rect(pageWidth - margin - 150, margin + 14, 136, 46).fill('#1e293b');
      doc.fillColor('#38bdf8').font('Helvetica-Bold').fontSize(11).text('TAX INVOICE', pageWidth - margin - 146, margin + 20, { width: 128, align: 'center' });
      doc.fillColor('#94a3b8').font('Helvetica').fontSize(7.5).text('ORIGINAL FOR RECIPIENT', pageWidth - margin - 146, margin + 34, { width: 128, align: 'center' });
      doc.fillColor('#34d399').font('Helvetica-Bold').fontSize(8).text(`Status: ${booking.paymentStatus || 'CONFIRMED'}`, pageWidth - margin - 146, margin + 46, { width: 128, align: 'center' });

      let cursorY = margin + 85;

      // ─────────────────────────────────────────────────────────────────────────────
      // 2. INVOICE META BAR
      // ─────────────────────────────────────────────────────────────────────────────
      doc.rect(margin, cursorY, contentWidth, 32).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#475569').font('Helvetica-Bold').fontSize(8);
      
      const colW = contentWidth / 4;
      doc.text('INVOICE NUMBER:', margin + 10, cursorY + 6);
      doc.fillColor('#0f172a').font('Helvetica').text(invoiceNumber, margin + 10, cursorY + 17);

      doc.fillColor('#475569').font('Helvetica-Bold').text('INVOICE DATE:', margin + colW + 10, cursorY + 6);
      doc.fillColor('#0f172a').font('Helvetica').text(invoiceDate, margin + colW + 10, cursorY + 17);

      doc.fillColor('#475569').font('Helvetica-Bold').text('BOOKING REFERENCE:', margin + colW * 2 + 10, cursorY + 6);
      doc.fillColor('#0284c7').font('Helvetica-Bold').text(`#${bookingNumber}`, margin + colW * 2 + 10, cursorY + 17);

      doc.fillColor('#475569').font('Helvetica-Bold').text('PLACE OF SUPPLY:', margin + colW * 3 + 10, cursorY + 6);
      doc.fillColor('#0f172a').font('Helvetica').text('Odisha (State Code 21)', margin + colW * 3 + 10, cursorY + 17);

      cursorY += 40;

      // ─────────────────────────────────────────────────────────────────────────────
      // 3. BILLED TO & ITINERARY BOXES (2-Columns)
      // ─────────────────────────────────────────────────────────────────────────────
      const boxWidth = (contentWidth - 12) / 2;
      const boxHeight = 90;

      // Box 1: Billed To
      doc.rect(margin, cursorY, boxWidth, boxHeight).fillAndStroke('#ffffff', '#e2e8f0');
      doc.rect(margin, cursorY, boxWidth, 18).fill('#f1f5f9');
      doc.fillColor('#334155').font('Helvetica-Bold').fontSize(8).text('BILLED TO (PASSENGER / GUEST)', margin + 10, cursorY + 5);

      doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(10).text(customerName, margin + 10, cursorY + 25);
      doc.fillColor('#64748b').font('Helvetica').fontSize(8.5);
      doc.text(`Phone: ${customerPhone}`, margin + 10, cursorY + 41);
      doc.text(`Email: ${customerEmail}`, margin + 10, cursorY + 54);
      doc.text(`Customer ID / Type: ${booking.customerId ? 'Registered Client' : 'Direct Booking'}`, margin + 10, cursorY + 67);

      // Box 2: Service & Schedule Details
      const col2X = margin + boxWidth + 12;
      doc.rect(col2X, cursorY, boxWidth, boxHeight).fillAndStroke('#ffffff', '#e2e8f0');
      doc.rect(col2X, cursorY, boxWidth, 18).fill('#f1f5f9');
      doc.fillColor('#334155').font('Helvetica-Bold').fontSize(8).text('SERVICE & ITINERARY ALLOCATION', col2X + 10, cursorY + 5);

      doc.fillColor('#0284c7').font('Helvetica-Bold').fontSize(10).text(vehicleName, col2X + 10, cursorY + 25, { width: boxWidth - 20, ellipsis: true });
      doc.fillColor('#64748b').font('Helvetica').fontSize(8.5);
      doc.text(`Schedule: ${pickupDate} to ${returnDate} (${days} ${days === 1 ? 'Day' : 'Days'})`, col2X + 10, cursorY + 41);
      doc.text(`Pick-up Hub: ${pickup}`, col2X + 10, cursorY + 54, { width: boxWidth - 20, ellipsis: true });
      doc.text(`Drop-off Hub: ${dropoff}`, col2X + 10, cursorY + 67, { width: boxWidth - 20, ellipsis: true });

      cursorY += boxHeight + 14;

      // ─────────────────────────────────────────────────────────────────────────────
      // 4. ITEMIZED CHARGES TABLE
      // ─────────────────────────────────────────────────────────────────────────────
      doc.rect(margin, cursorY, contentWidth, 20).fill('#1e293b');
      doc.fillColor('#f8fafc').font('Helvetica-Bold').fontSize(8);
      doc.text('DESCRIPTION OF SERVICE', margin + 10, cursorY + 6);
      doc.text('SAC', margin + 280, cursorY + 6, { width: 50, align: 'center' });
      doc.text('QTY / DAYS', margin + 340, cursorY + 6, { width: 60, align: 'center' });
      doc.text('TAXABLE VALUE', margin + 410, cursorY + 6, { width: contentWidth - 410 - 10, align: 'right' });

      cursorY += 20;

      // Line 1: Primary Service
      doc.rect(margin, cursorY, contentWidth, 32).fillAndStroke('#ffffff', '#e2e8f0');
      doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9).text(vehicleName, margin + 10, cursorY + 6, { width: 260 });
      doc.fillColor('#64748b').font('Helvetica').fontSize(7.5).text(
        isTour ? 'Tour Package Sightseeing, Guide & Transport' : `Vehicle Rental Fare (${days} Day(s))`,
        margin + 10,
        cursorY + 18
      );
      doc.fillColor('#334155').font('Helvetica').fontSize(8.5).text(sacCode, margin + 280, cursorY + 11, { width: 50, align: 'center' });
      doc.text(String(days), margin + 340, cursorY + 11, { width: 60, align: 'center' });
      doc.fillColor('#0f172a').font('Helvetica-Bold').text(`Rs. ${baseRate.toLocaleString('en-IN')}`, margin + 410, cursorY + 11, { width: contentWidth - 410 - 10, align: 'right' });

      cursorY += 32;

      // Line 2: Security Deposit (if present)
      if (deposit > 0) {
        doc.rect(margin, cursorY, contentWidth, 24).fillAndStroke('#f8fafc', '#e2e8f0');
        doc.fillColor('#0f172a').font('Helvetica').fontSize(8.5).text('Refundable Security Deposit (Non-Taxable)', margin + 10, cursorY + 7);
        doc.fillColor('#64748b').text('—', margin + 280, cursorY + 7, { width: 50, align: 'center' });
        doc.text('1', margin + 340, cursorY + 7, { width: 60, align: 'center' });
        doc.fillColor('#0f172a').text(`Rs. ${deposit.toLocaleString('en-IN')}`, margin + 410, cursorY + 7, { width: contentWidth - 410 - 10, align: 'right' });
        cursorY += 24;
      }

      cursorY += 10;

      // ─────────────────────────────────────────────────────────────────────────────
      // 5. FINANCIAL LEDGER & PAYMENT DETAILS (2-Columns)
      // ─────────────────────────────────────────────────────────────────────────────
      const leftW = contentWidth * 0.54;
      const rightW = contentWidth - leftW - 12;
      const rightX = margin + leftW + 12;

      // Left Box: Payment Details & Bank/GST Declarations
      doc.rect(margin, cursorY, leftW, 115).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(8.5).text('PAYMENT DETAILS & VERIFICATION', margin + 10, cursorY + 10);
      doc.fillColor('#475569').font('Helvetica').fontSize(8);
      doc.text(`Payment Mode: ${booking.paymentMode?.toUpperCase() || 'ONLINE 100%'}`, margin + 10, cursorY + 25);
      doc.text(`Payment Status: ${booking.paymentStatus || 'CONFIRMED'}`, margin + 10, cursorY + 38);
      doc.text(`Transaction Reference: ${booking.transactionId || 'OFFLINE'}`, margin + 10, cursorY + 51);
      doc.text(`GST Reverse Charge Applicable: NO`, margin + 10, cursorY + 64);

      doc.fillColor('#64748b').font('Helvetica').fontSize(7.5).text(
        'This is a computer-generated Tax Invoice issued under Section 31 of CGST Act, 2017. ' +
        'No physical signature required.',
        margin + 10,
        cursorY + 84,
        { width: leftW - 20 }
      );

      // Right Box: Financial Breakdown Summary
      doc.rect(rightX, cursorY, rightW, 115).fillAndStroke('#ffffff', '#e2e8f0');
      const rowH = 15;
      let rY = cursorY + 8;

      const drawLedgerRow = (label, value, isBold = false, color = '#334155') => {
        doc.fillColor(color).font(isBold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8);
        doc.text(label, rightX + 10, rY);
        doc.text(value, rightX + 10, rY, { width: rightW - 20, align: 'right' });
        rY += rowH;
      };

      drawLedgerRow('Taxable Subtotal:', `Rs. ${baseRate.toLocaleString('en-IN')}`);
      drawLedgerRow(`CGST @ ${(gstRate / 2).toFixed(1)}%:`, `Rs. ${cgst.toLocaleString('en-IN')}`);
      drawLedgerRow(`SGST @ ${(gstRate / 2).toFixed(1)}%:`, `Rs. ${sgst.toLocaleString('en-IN')}`);
      if (deposit > 0) {
        drawLedgerRow('Security Deposit:', `Rs. ${deposit.toLocaleString('en-IN')}`);
      }

      // Divider
      doc.moveTo(rightX + 10, rY).lineTo(rightX + rightW - 10, rY).strokeColor('#cbd5e1').stroke();
      rY += 4;

      drawLedgerRow('Total Invoice Value:', `Rs. ${total.toLocaleString('en-IN')}`, true, '#0284c7');
      drawLedgerRow('Advance Amount Paid:', `Rs. ${paid.toLocaleString('en-IN')}`, true, '#059669');
      drawLedgerRow('Balance at Handover:', `Rs. ${balance.toLocaleString('en-IN')}`, true, balance > 0 ? '#d97706' : '#64748b');

      cursorY += 128;

      // ─────────────────────────────────────────────────────────────────────────────
      // 6. CUSTOMER INSTRUCTIONS & HANDOVER VERIFICATION
      // ─────────────────────────────────────────────────────────────────────────────
      doc.rect(margin, cursorY, contentWidth, 36).fillAndStroke('#eff6ff', '#bfdbfe');
      doc.fillColor('#1e40af').font('Helvetica-Bold').fontSize(8).text('IMPORTANT TRAVEL & HANDOVER INSTRUCTIONS:', margin + 10, cursorY + 8);
      doc.fillColor('#1e3a8a').font('Helvetica').fontSize(7.5).text(
        '1. Please carry a valid Government Photo ID (Aadhaar / Driving License / Passport) for verification at vehicle handover.\n' +
        '2. For self-drive reservations, original Driving License matching the booking profile must be presented before keys are issued.',
        margin + 10,
        cursorY + 18,
        { width: contentWidth - 20 }
      );

      // ─────────────────────────────────────────────────────────────────────────────
      // 7. FOOTER
      // ─────────────────────────────────────────────────────────────────────────────
      const footerY = doc.page.height - margin - 24;
      doc.moveTo(margin, footerY).lineTo(pageWidth - margin, footerY).strokeColor('#e2e8f0').stroke();
      doc.fillColor('#64748b').font('Helvetica').fontSize(7.5).text(
        `CARZODRIVE LUXURY MOBILITY & TOURS PVT LTD • 24x7 Helpline: ${COMPANY_META.supportPhone} • ${COMPANY_META.supportEmail} • ${COMPANY_META.website}`,
        margin,
        footerY + 8,
        { width: contentWidth, align: 'center' }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  generateInvoicePdfBuffer,
  COMPANY_META,
};
