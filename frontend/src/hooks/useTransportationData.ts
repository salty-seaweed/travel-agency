import { useState, useEffect } from 'react';
import { config } from '../config';

interface TransferType {
  id: number;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  features: string[];
  pricing_range: string;
  best_for: string;
  pros: string[];
  cons: string[];
  is_active: boolean;
  order: number;
}

interface ResortTransfer {
  id: number;
  resort_name: string;
  price: number;
  duration: string;
  transfer_type: string;
  is_active: boolean;
  order: number;
  atoll: string;
}

interface AtollTransfer {
  id: number;
  atoll_name: string;
  description: string;
  icon: string;
  gradient: string;
  is_active: boolean;
  order: number;
  resorts: ResortTransfer[];
}

interface TransferFAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  icon: string;
  is_active: boolean;
  order: number;
}

interface TransferContactMethod {
  id: number;
  method: string;
  icon: string;
  color: string;
  contact: string;
  description: string;
  response_time: string;
  is_active: boolean;
  order: number;
}

interface TransferBookingStep {
  id: number;
  step_number: number;
  title: string;
  description: string;
  icon: string;
  details: string[];
  tips: string;
  is_active: boolean;
}

interface TransferBenefit {
  id: number;
  benefit: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  order: number;
}

interface TransferPricingFactor {
  id: number;
  factor: string;
  description: string;
  icon: string;
  impact: string;
  examples: string[];
  is_active: boolean;
  order: number;
}

interface TransferContent {
  id: number;
  section: string;
  title: string;
  subtitle: string;
  description: string;
  badge_text: string;
  badge_icon: string;
  is_active: boolean;
  order: number;
}

interface TransportationData {
  transfer_types: TransferType[];
  atoll_transfers: AtollTransfer[];
  faqs: TransferFAQ[];
  contact_methods: TransferContactMethod[];
  booking_steps: TransferBookingStep[];
  benefits: TransferBenefit[];
  pricing_factors: TransferPricingFactor[];
  content: TransferContent[];
}

export const useTransportationData = () => {
  const [data, setData] = useState<TransportationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransportationData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${config.apiBaseUrl}/transportation/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const transportationData = await response.json();
        setData(transportationData);
      } catch (err) {
        console.error('Error fetching transportation data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch transportation data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransportationData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      // Trigger refetch by updating the state
      setData(null);
    }
  };
}; 