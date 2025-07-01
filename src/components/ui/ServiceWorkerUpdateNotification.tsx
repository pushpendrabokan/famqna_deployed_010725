import React from 'react';
import { useServiceWorker } from '../../hooks/useServiceWorker';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import Button from './Button';

const ServiceWorkerUpdateNotification: React.FC = () => {
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();

  return (
    <AnimatePresence>
      {isUpdateAvailable && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-primary/90 text-white py-3 px-4 rounded-lg shadow-lg z-50 flex items-center gap-3"
        >
          <RefreshCw className="w-5 h-5 animate-spin" />
          <div>
            <p className="font-medium">New version available!</p>
            <p className="text-xs opacity-90">Refresh to update and get the latest features</p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={updateServiceWorker}
          >
            Update
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceWorkerUpdateNotification;