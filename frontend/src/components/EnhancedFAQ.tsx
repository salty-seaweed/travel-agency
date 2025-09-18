import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Heading,
  Text,
  VStack,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import { AdvancedSEO } from './AdvancedSEO';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface EnhancedFAQProps {
  faqs: FAQItem[];
  title?: string;
  description?: string;
  showSEO?: boolean;
  categories?: string[];
}

export const EnhancedFAQ: React.FC<EnhancedFAQProps> = ({
  faqs,
  title = 'Frequently Asked Questions',
  description = 'Find answers to common questions about our services.',
  showSEO = true,
  categories
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  // Generate FAQ structured data for SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": title,
    "description": description,
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Filter FAQs by category if categories are provided
  const filteredFAQs = categories && categories.length > 0 
    ? faqs.filter(faq => !faq.category || categories.includes(faq.category))
    : faqs;

  // Group FAQs by category
  const groupedFAQs = categories 
    ? categories.reduce((acc, category) => {
        acc[category] = faqs.filter(faq => faq.category === category);
        return acc;
      }, {} as Record<string, FAQItem[]>)
    : { 'General': filteredFAQs };

  return (
    <>
      {showSEO && (
        <AdvancedSEO
          title={title}
          description={description}
          type="website"
          structuredData={faqStructuredData}
          keywords="FAQ, frequently asked questions, Maldives travel, Thread Travels, support"
        />
      )}
      
      <Container maxW="4xl" py={12}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color={textColor}>
              {title}
            </Heading>
            <Text fontSize="lg" color={mutedTextColor} maxW="2xl">
              {description}
            </Text>
          </VStack>

          {categories ? (
            // Render categorized FAQs
            <VStack spacing={8} align="stretch">
              {Object.entries(groupedFAQs).map(([category, categoryFaqs]) => (
                categoryFaqs.length > 0 && (
                  <Box key={category}>
                    <Heading size="md" color={textColor} mb={4}>
                      {category}
                    </Heading>
                    <Accordion allowMultiple>
                      {categoryFaqs.map((faq, index) => (
                        <AccordionItem 
                          key={index} 
                          border="1px solid" 
                          borderColor={borderColor}
                          borderRadius="lg"
                          mb={2}
                          bg={bgColor}
                        >
                          <AccordionButton 
                            py={4} 
                            px={6}
                            _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                          >
                            <Box flex="1" textAlign="left">
                              <Text fontWeight="semibold" color={textColor}>
                                {faq.question}
                              </Text>
                            </Box>
                            <AccordionIcon color={textColor} />
                          </AccordionButton>
                          <AccordionPanel pb={4} px={6}>
                            <Text color={mutedTextColor} lineHeight="1.6">
                              {faq.answer}
                            </Text>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Box>
                )
              ))}
            </VStack>
          ) : (
            // Render all FAQs without categories
            <Accordion allowMultiple>
              {filteredFAQs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  border="1px solid" 
                  borderColor={borderColor}
                  borderRadius="lg"
                  mb={2}
                  bg={bgColor}
                >
                  <AccordionButton 
                    py={4} 
                    px={6}
                    _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                  >
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="semibold" color={textColor}>
                        {faq.question}
                      </Text>
                    </Box>
                    <AccordionIcon color={textColor} />
                  </AccordionButton>
                  <AccordionPanel pb={4} px={6}>
                    <Text color={mutedTextColor} lineHeight="1.6">
                      {faq.answer}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </VStack>
      </Container>
    </>
  );
};

// Default FAQ data for Thread Travels
export const threadTravelsFAQs: FAQItem[] = [
  {
    question: "What destinations do you offer in the Maldives?",
    answer: "We offer packages to various atolls and islands across the Maldives, including popular destinations like Male, Hulhule, and many resort islands. Our curated selection includes luxury resorts, local island experiences, and adventure packages.",
    category: "Destinations"
  },
  {
    question: "How do I book a package with Thread Travels?",
    answer: "You can book through our website, WhatsApp, or by contacting us directly. Simply browse our packages, select your preferred option, and follow the booking process. Our team will assist you throughout the entire process.",
    category: "Booking"
  },
  {
    question: "What is included in your travel packages?",
    answer: "Our packages typically include accommodation, meals (as specified), airport transfers, and various activities. Each package clearly lists what's included and excluded. We also offer customizable packages to meet your specific needs.",
    category: "Packages"
  },
  {
    question: "Do you provide airport transfers?",
    answer: "Yes, we provide comprehensive transportation services including airport transfers, seaplane transfers, and speedboat transfers depending on your destination and package selection.",
    category: "Transportation"
  },
  {
    question: "What is your cancellation policy?",
    answer: "Our cancellation policy varies depending on the package and timing of cancellation. Generally, cancellations made 30+ days in advance receive full refunds, while later cancellations may incur fees. Please check specific package terms.",
    category: "Policies"
  },
  {
    question: "Do you offer custom itineraries?",
    answer: "Absolutely! We specialize in creating personalized travel experiences. Contact us with your preferences, budget, and travel dates, and we'll craft a custom itinerary just for you.",
    category: "Services"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept various payment methods including bank transfers, credit cards, and mobile payments. Payment terms and options will be provided during the booking process.",
    category: "Payment"
  },
  {
    question: "Is travel insurance recommended?",
    answer: "Yes, we highly recommend travel insurance to protect your investment and provide peace of mind. We can help you understand your options and connect you with insurance providers.",
    category: "Insurance"
  }
];

export default EnhancedFAQ;
