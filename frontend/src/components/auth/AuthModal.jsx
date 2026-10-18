import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthCard } from './AuthCard';

export const AuthModal = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Dark Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Card with Spring Pop Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative z-10 w-full max-w-md my-auto"
          >
            <AuthCard
              initialMode={initialMode}
              isModal={true}
              onClose={onClose}
              onSuccess={(data) => {
                if (onSuccess) onSuccess(data);
                setTimeout(() => {
                  if (onClose) onClose();
                }, 1200);
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
