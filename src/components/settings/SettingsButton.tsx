
import React from 'react';
import { SettingsDialog } from './SettingsDialog';

export const SettingsButton: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <SettingsDialog />
    </div>
  );
};
