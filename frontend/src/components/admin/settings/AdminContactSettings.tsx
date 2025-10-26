import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  useToast,
  Card,
  CardBody,
  Heading,
  Text,
  Divider,
} from '@chakra-ui/react';

interface HomepageSettings {
  contact_email?: string;
  contact_phone?: string;
  whatsapp_number?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_twitter?: string;
  social_linkedin?: string;
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('access');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const AdminContactSettings: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<HomepageSettings>({});

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/homepage/settings/');
      if (!res.ok) throw new Error('Failed to load settings');
      const data = await res.json();
      setSettings(data || {});
    } catch (err: any) {
      toast({ status: 'error', title: 'Failed to load contact settings' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/homepage/settings/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      const data = await res.json();
      setSettings(data || {});
      toast({ status: 'success', title: 'Contact settings updated' });
    } catch (err: any) {
      toast({ status: 'error', title: 'Failed to save contact settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="md">Contact Details</Heading>
            <Text color="gray.500">These are shown on booking and contact sections.</Text>
          </Box>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input name="contact_email" value={settings.contact_email || ''} onChange={handleChange} placeholder="info@yourcompany.com" />
              </FormControl>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input name="contact_phone" value={settings.contact_phone || ''} onChange={handleChange} placeholder="+960 7xx xxxx" />
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>WhatsApp Number</FormLabel>
              <Input name="whatsapp_number" value={settings.whatsapp_number || ''} onChange={handleChange} placeholder="9607441097" />
            </FormControl>
          </VStack>

          <Divider />

          <Box>
            <Heading size="sm">Social Links</Heading>
          </Box>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Facebook</FormLabel>
              <Input name="social_facebook" value={settings.social_facebook || ''} onChange={handleChange} placeholder="https://facebook.com/yourpage" />
            </FormControl>
            <FormControl>
              <FormLabel>Instagram</FormLabel>
              <Input name="social_instagram" value={settings.social_instagram || ''} onChange={handleChange} placeholder="https://instagram.com/yourpage" />
            </FormControl>
            <HStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Twitter</FormLabel>
                <Input name="social_twitter" value={settings.social_twitter || ''} onChange={handleChange} placeholder="https://x.com/yourpage" />
              </FormControl>
              <FormControl>
                <FormLabel>LinkedIn</FormLabel>
                <Input name="social_linkedin" value={settings.social_linkedin || ''} onChange={handleChange} placeholder="https://linkedin.com/company/yourpage" />
              </FormControl>
            </HStack>
          </VStack>

          <HStack justify="flex-end" pt={4}>
            <Button onClick={fetchSettings} isLoading={loading} variant="outline">Reset</Button>
            <Button colorScheme="purple" onClick={handleSave} isLoading={saving}>Save Changes</Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default AdminContactSettings;


