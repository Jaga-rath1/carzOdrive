import React from 'react';
import { DocumentViewerModal } from '../../common/DocumentViewerModal';

export const VendorDocPreviewModal = ({ activePreviewDoc, onClose }) => {
  if (!activePreviewDoc) return null;

  return (
    <DocumentViewerModal
      isOpen={!!activePreviewDoc}
      onClose={onClose}
      documentUrl={activePreviewDoc.url}
      title={activePreviewDoc.type || 'Vehicle Verification Document'}
      documentType={activePreviewDoc.name || 'Owner & Registration Credential'}
      verified={true}
    />
  );
};
