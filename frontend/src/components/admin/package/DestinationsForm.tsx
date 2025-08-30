import React from 'react';
import { DestinationPicker } from './DestinationPicker';

interface DestinationsFormProps {
  form: any;
  updateForm: (updates: any) => void;
}

export function DestinationsForm({ form, updateForm }: DestinationsFormProps) {
  const handleDestinationsChange = (destinations: any[]) => {
    updateForm({ destinations });
  };

  return (
    <DestinationPicker
      selectedDestinations={form.destinations || []}
      onDestinationsChange={handleDestinationsChange}
    />
  );
}
