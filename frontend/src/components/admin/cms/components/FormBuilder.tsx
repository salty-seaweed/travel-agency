import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  Select,
  Switch,
  FormControl,
  FormLabel,
  IconButton,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Divider,
  Textarea,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import {
  DocumentTextIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  GlobeAltIcon,
  ChatBubbleLeftIcon,
  ListBulletIcon,
  CheckIcon,
  TrashIcon,
  PlusIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'url' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: string[]; // For select, radio, checkbox
  defaultValue?: string;
  helpText?: string;
}

interface FormConfig {
  title: string;
  description?: string;
  fields: FormField[];
  submitText: string;
  successMessage: string;
  emailNotifications: boolean;
  notificationEmail?: string;
  styling: {
    theme: 'default' | 'modern' | 'minimal' | 'elegant';
    primaryColor: string;
    borderRadius: string;
    spacing: string;
  };
}

interface FormBuilderProps {
  formConfig: FormConfig;
  onChange: (config: FormConfig) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ formConfig, onChange }) => {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: DocumentTextIcon },
    { value: 'email', label: 'Email', icon: EnvelopeIcon },
    { value: 'phone', label: 'Phone', icon: PhoneIcon },
    { value: 'textarea', label: 'Text Area', icon: ChatBubbleLeftIcon },
    { value: 'select', label: 'Dropdown', icon: ListBulletIcon },
    { value: 'checkbox', label: 'Checkbox', icon: CheckIcon },
    { value: 'radio', label: 'Radio Buttons', icon: CheckIcon },
    { value: 'date', label: 'Date Picker', icon: CalendarIcon },
    { value: 'url', label: 'URL', icon: GlobeAltIcon },
    { value: 'number', label: 'Number', icon: DocumentTextIcon },
  ];

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}...`,
      required: false,
    };
    
    onChange({
      ...formConfig,
      fields: [...formConfig.fields, newField],
    });
    setSelectedField(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    onChange({
      ...formConfig,
      fields: formConfig.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    });
  };

  const deleteField = (fieldId: string) => {
    onChange({
      ...formConfig,
      fields: formConfig.fields.filter(field => field.id !== fieldId),
    });
    setSelectedField(null);
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const currentIndex = formConfig.fields.findIndex(field => field.id === fieldId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= formConfig.fields.length) return;

    const newFields = [...formConfig.fields];
    [newFields[currentIndex], newFields[newIndex]] = [newFields[newIndex], newFields[currentIndex]];

    onChange({
      ...formConfig,
      fields: newFields,
    });
  };

  const generateFormHTML = () => {
    const { fields, submitText, styling } = formConfig;
    
    const formStyle = `
      .custom-form {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background: white;
        border-radius: ${styling.borderRadius};
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .form-field {
        margin-bottom: ${styling.spacing};
      }
      .form-label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
        color: #374151;
      }
      .form-input {
        width: 100%;
        padding: 10px;
        border: 1px solid #d1d5db;
        border-radius: ${styling.borderRadius};
        font-size: 14px;
      }
      .form-input:focus {
        outline: none;
        border-color: ${styling.primaryColor};
        box-shadow: 0 0 0 3px ${styling.primaryColor}20;
      }
      .form-button {
        background: ${styling.primaryColor};
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: ${styling.borderRadius};
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .form-button:hover {
        opacity: 0.9;
      }
      .required {
        color: #ef4444;
      }
    `;

    const formHTML = `
      <form class="custom-form">
        ${fields.map(field => {
          const required = field.required ? 'required' : '';
          const requiredMark = field.required ? '<span class="required">*</span>' : '';
          
          switch (field.type) {
            case 'textarea':
              return `
                <div class="form-field">
                  <label class="form-label">${field.label} ${requiredMark}</label>
                  <textarea class="form-input" placeholder="${field.placeholder || ''}" ${required}></textarea>
                  ${field.helpText ? `<small style="color: #6b7280; font-size: 12px;">${field.helpText}</small>` : ''}
                </div>
              `;
            case 'select':
              return `
                <div class="form-field">
                  <label class="form-label">${field.label} ${requiredMark}</label>
                  <select class="form-input" ${required}>
                    <option value="">${field.placeholder || 'Select an option'}</option>
                    ${field.options?.map(option => `<option value="${option}">${option}</option>`).join('') || ''}
                  </select>
                  ${field.helpText ? `<small style="color: #6b7280; font-size: 12px;">${field.helpText}</small>` : ''}
                </div>
              `;
            case 'checkbox':
              return `
                <div class="form-field">
                  <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" ${required}>
                    ${field.label} ${requiredMark}
                  </label>
                  ${field.helpText ? `<small style="color: #6b7280; font-size: 12px;">${field.helpText}</small>` : ''}
                </div>
              `;
            case 'radio':
              return `
                <div class="form-field">
                  <label class="form-label">${field.label} ${requiredMark}</label>
                  ${field.options?.map(option => `
                    <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                      <input type="radio" name="${field.id}" value="${option}" ${required}>
                      ${option}
                    </label>
                  `).join('') || ''}
                  ${field.helpText ? `<small style="color: #6b7280; font-size: 12px;">${field.helpText}</small>` : ''}
                </div>
              `;
            default:
              return `
                <div class="form-field">
                  <label class="form-label">${field.label} ${requiredMark}</label>
                  <input type="${field.type}" class="form-input" placeholder="${field.placeholder || ''}" ${required}>
                  ${field.helpText ? `<small style="color: #6b7280; font-size: 12px;">${field.helpText}</small>` : ''}
                </div>
              `;
          }
        }).join('')}
        <button type="submit" class="form-button">${submitText}</button>
      </form>
    `;

    return { formHTML, formStyle };
  };

  const { formHTML, formStyle } = generateFormHTML();

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" color={textColor} mb={2}>
            Form Builder
          </Heading>
          <Text color="gray.600">
            Create custom forms with various field types and validation
          </Text>
        </Box>

        <Box display="flex" gap={6} h="700px">
          {/* Form Builder Panel */}
          <Box w="400px" bg={bgColor} border="1px solid" borderColor={borderColor} borderRadius="md" p={4} overflowY="auto">
            <VStack spacing={6} align="stretch">
              {/* Form Settings */}
              <Box>
                <Heading size="md" mb={3} color={textColor}>
                  Form Settings
                </Heading>
                <VStack spacing={3} align="stretch">
                  <FormControl>
                    <FormLabel fontSize="sm">Form Title</FormLabel>
                    <Input
                      value={formConfig.title}
                      onChange={(e) => onChange({ ...formConfig, title: e.target.value })}
                      placeholder="Contact Form"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontSize="sm">Description</FormLabel>
                    <Textarea
                      value={formConfig.description || ''}
                      onChange={(e) => onChange({ ...formConfig, description: e.target.value })}
                      placeholder="Optional form description..."
                      rows={2}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Submit Button Text</FormLabel>
                    <Input
                      value={formConfig.submitText}
                      onChange={(e) => onChange({ ...formConfig, submitText: e.target.value })}
                      placeholder="Submit"
                    />
                  </FormControl>
                </VStack>
              </Box>

              <Divider />

              {/* Add Fields */}
              <Box>
                <Heading size="md" mb={3} color={textColor}>
                  Add Fields
                </Heading>
                <SimpleGrid columns={2} spacing={2}>
                  {fieldTypes.map((fieldType) => (
                    <Button
                      key={fieldType.value}
                      size="sm"
                      variant="outline"
                      leftIcon={<fieldType.icon className="w-4 h-4" />}
                      onClick={() => addField(fieldType.value as FormField['type'])}
                    >
                      {fieldType.label}
                    </Button>
                  ))}
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Field List */}
              <Box>
                <Heading size="md" mb={3} color={textColor}>
                  Form Fields ({formConfig.fields.length})
                </Heading>
                <VStack spacing={2} align="stretch">
                  {formConfig.fields.map((field, index) => (
                    <Card
                      key={field.id}
                      bg={selectedField === field.id ? 'blue.50' : bgColor}
                      border="1px solid"
                      borderColor={selectedField === field.id ? 'blue.200' : borderColor}
                      cursor="pointer"
                      onClick={() => setSelectedField(field.id)}
                    >
                      <CardBody p={3}>
                        <HStack justify="space-between">
                          <Box flex={1}>
                            <Text fontWeight="semibold" fontSize="sm" color={textColor}>
                              {field.label}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {field.type} {field.required && '(Required)'}
                            </Text>
                          </Box>
                          <HStack spacing={1}>
                            <Tooltip label="Move Up">
                              <IconButton
                                size="xs"
                                variant="ghost"
                                icon={<ArrowsUpDownIcon className="w-3 h-3" />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveField(field.id, 'up');
                                }}
                                isDisabled={index === 0}
                                aria-label="Move Up"
                              />
                            </Tooltip>
                            <Tooltip label="Delete">
                              <IconButton
                                size="xs"
                                variant="ghost"
                                icon={<TrashIcon className="w-3 h-3" />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteField(field.id);
                                }}
                                aria-label="Delete"
                              />
                            </Tooltip>
                          </HStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Field Editor / Preview */}
          <Box flex={1} bg={bgColor} border="1px solid" borderColor={borderColor} borderRadius="md" p={4}>
            {previewMode ? (
              // Preview Mode
              <Box>
                <HStack justify="space-between" mb={4}>
                  <Heading size="md" color={textColor}>
                    Form Preview
                  </Heading>
                  <Button size="sm" onClick={() => setPreviewMode(false)}>
                    Edit Mode
                  </Button>
                </HStack>
                <Box>
                  <style>{formStyle}</style>
                  <div dangerouslySetInnerHTML={{ __html: formHTML }} />
                </Box>
              </Box>
            ) : selectedField ? (
              // Field Editor
              <FieldEditor
                field={formConfig.fields.find(f => f.id === selectedField)!}
                onUpdate={(updates) => updateField(selectedField, updates)}
                onClose={() => setSelectedField(null)}
              />
            ) : (
              // No Field Selected
              <Box textAlign="center" py={20}>
                <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <Text color="gray.500">
                  Select a field from the left panel to edit its properties
                </Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* Actions */}
        <HStack justify="space-between">
          <Button
            leftIcon={<EyeIcon className="w-4 h-4" />}
            onClick={() => setPreviewMode(!previewMode)}
            variant="outline"
          >
            {previewMode ? 'Edit Mode' : 'Preview Form'}
          </Button>
          
          <HStack spacing={3}>
            <Button variant="outline" onClick={() => onChange({ ...formConfig, fields: [] })}>
              Clear All Fields
            </Button>
            <Button colorScheme="blue">
              Save Form
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

// Field Editor Component
interface FieldEditorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onClose: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onUpdate, onClose }) => {
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="md" color={textColor}>
            Edit Field: {field.label}
          </Heading>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </HStack>

        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel fontSize="sm">Field Label</FormLabel>
            <Input
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="Field label"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Placeholder Text</FormLabel>
            <Input
              value={field.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="Enter placeholder text..."
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Help Text</FormLabel>
            <Textarea
              value={field.helpText || ''}
              onChange={(e) => onUpdate({ helpText: e.target.value })}
              placeholder="Optional help text..."
              rows={2}
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel fontSize="sm" mb={0}>
              Required Field
            </FormLabel>
            <Switch
              isChecked={field.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
            />
          </FormControl>

          {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
            <FormControl>
              <FormLabel fontSize="sm">Options (one per line)</FormLabel>
              <Textarea
                value={field.options?.join('\n') || ''}
                onChange={(e) => onUpdate({ options: e.target.value.split('\n').filter(Boolean) })}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                rows={4}
              />
            </FormControl>
          )}

          <FormControl>
            <FormLabel fontSize="sm">Default Value</FormLabel>
            <Input
              value={field.defaultValue || ''}
              onChange={(e) => onUpdate({ defaultValue: e.target.value })}
              placeholder="Default value"
            />
          </FormControl>
        </VStack>
      </VStack>
    </Box>
  );
};
