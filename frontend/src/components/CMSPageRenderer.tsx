import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Divider,
  Grid,
  GridItem,
  Flex,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet } from '../api';
import Layout from './Layout';
import type { Page } from '../types';

interface CMSPageRendererProps {
  slug?: string;
  pageId?: string;
}

export const CMSPageRenderer: React.FC<CMSPageRendererProps> = ({ slug, pageId }) => {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const navigate = useNavigate();

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Get the actual slug from params or props
  const actualSlug = slug || params.slug || pageId;

  useEffect(() => {
    if (actualSlug) {
      loadPage();
    }
  }, [actualSlug]);

  const loadPage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load by slug first, then by ID
      let response;
      if (pageId) {
        response = await apiGet(`pages/${pageId}/`);
      } else {
        response = await apiGet(`pages/by-slug/${actualSlug}/`);
      }
      
      if (response && response.status === 'published') {
        setPage(response);
      } else {
        setError('Page not found or not published');
      }
    } catch (err) {
      setError('Failed to load page');
      console.error('Error loading page:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content: string) => {
    // Basic HTML content rendering with styling
    return (
      <Box
        className="cms-content"
        dangerouslySetInnerHTML={{ __html: content }}
        sx={{
          '& h1': {
            fontSize: '2xl',
            fontWeight: 'bold',
            mb: 4,
            color: textColor,
          },
          '& h2': {
            fontSize: 'xl',
            fontWeight: 'semibold',
            mb: 3,
            color: textColor,
          },
          '& h3': {
            fontSize: 'lg',
            fontWeight: 'semibold',
            mb: 2,
            color: textColor,
          },
          '& p': {
            mb: 4,
            lineHeight: 'tall',
            color: textColor,
          },
          '& ul, & ol': {
            mb: 4,
            pl: 6,
          },
          '& li': {
            mb: 1,
            color: textColor,
          },
          '& a': {
            color: 'blue.500',
            textDecoration: 'underline',
            _hover: {
              color: 'blue.600',
            },
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'blue.500',
            pl: 4,
            py: 2,
            bg: 'blue.50',
            borderRadius: 'md',
            mb: 4,
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 'md',
            mb: 4,
          },
        }}
      />
    );
  };

  const renderTemplate = (page: Page) => {
    const { template, title, content, meta_description } = page;

    switch (template) {
      case 'full-width':
        return (
          <Box bg={bgColor} minH="100vh">
            <Container maxW="full" px={0}>
              {/* Hero Section */}
              <Box
                bgGradient="linear(to-r, blue.600, purple.600)"
                color="white"
                py={20}
                textAlign="center"
              >
                <Container maxW="4xl">
                  <Heading size="2xl" mb={4}>
                    {title}
                  </Heading>
                  {meta_description && (
                    <Text fontSize="lg" opacity={0.9}>
                      {meta_description}
                    </Text>
                  )}
                </Container>
              </Box>

              {/* Content Section */}
              <Container maxW="4xl" py={12}>
                {renderContent(content)}
              </Container>
            </Container>
          </Box>
        );

      case 'sidebar':
        return (
          <Box bg={bgColor} minH="100vh">
            <Container maxW="7xl" py={8}>
              <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
                {/* Main Content */}
                <GridItem>
                  <Card bg={cardBg} shadow="md">
                    <CardHeader>
                      <Heading size="lg" color={textColor}>
                        {title}
                      </Heading>
                    </CardHeader>
                    <CardBody>
                      {renderContent(content)}
                    </CardBody>
                  </Card>
                </GridItem>

                {/* Sidebar */}
                <GridItem>
                  <VStack spacing={6} align="stretch">
                    <Card bg={cardBg} shadow="md">
                      <CardHeader>
                        <Heading size="md" color={textColor}>
                          Quick Links
                        </Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          <Button variant="ghost" justifyContent="flex-start">
                            About Us
                          </Button>
                          <Button variant="ghost" justifyContent="flex-start">
                            Contact
                          </Button>
                          <Button variant="ghost" justifyContent="flex-start">
                            Services
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>

                    <Card bg={cardBg} shadow="md">
                      <CardHeader>
                        <Heading size="md" color={textColor}>
                          Contact Info
                        </Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          <Text fontSize="sm" color="gray.600">
                            📧 info@threadtravels.mv
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            📞 +960 123 4567
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            📍 Male, Maldives
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </VStack>
                </GridItem>
              </Grid>
            </Container>
          </Box>
        );

      case 'landing':
        return (
          <Box bg={bgColor} minH="100vh">
            {/* Hero Section */}
            <Box
              bgGradient="linear(135deg, blue.600 0%, purple.600 100%)"
              color="white"
              py={24}
              textAlign="center"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
                opacity={0.3}
              />
              <Container maxW="4xl" position="relative" zIndex={1}>
                <Heading size="3xl" mb={6}>
                  {title}
                </Heading>
                {meta_description && (
                  <Text fontSize="xl" opacity={0.9} mb={8}>
                    {meta_description}
                  </Text>
                )}
                <HStack spacing={4} justify="center">
                  <Button size="lg" colorScheme="white" variant="outline">
                    Get Started
                  </Button>
                  <Button size="lg" bg="white" color="blue.600" _hover={{ bg: 'gray.100' }}>
                    Learn More
                  </Button>
                </HStack>
              </Container>
            </Box>

            {/* Content Section */}
            <Container maxW="4xl" py={16}>
              <Card bg={cardBg} shadow="xl" borderRadius="xl">
                <CardBody p={12}>
                  {renderContent(content)}
                </CardBody>
              </Card>
            </Container>
          </Box>
        );

      case 'blog':
        return (
          <Box bg={bgColor} minH="100vh">
            <Container maxW="4xl" py={8}>
              <VStack spacing={8} align="stretch">
                {/* Header */}
                <Box textAlign="center" py={8}>
                  <Badge colorScheme="blue" mb={4}>
                    Blog Post
                  </Badge>
                  <Heading size="2xl" mb={4} color={textColor}>
                    {title}
                  </Heading>
                  {meta_description && (
                    <Text fontSize="lg" color="gray.600" mb={6}>
                      {meta_description}
                    </Text>
                  )}
                  <Divider />
                </Box>

                {/* Content */}
                <Card bg={cardBg} shadow="md">
                  <CardBody p={8}>
                    {renderContent(content)}
                  </CardBody>
                </Card>

                {/* Footer */}
                <Box textAlign="center" py={8}>
                  <Divider mb={6} />
                  <HStack spacing={6} justify="center">
                    <Button variant="ghost" size="sm">
                      Share
                    </Button>
                    <Button variant="ghost" size="sm">
                      Comment
                    </Button>
                    <Button variant="ghost" size="sm">
                      Bookmark
                    </Button>
                  </HStack>
                </Box>
              </VStack>
            </Container>
          </Box>
        );

      case 'contact':
        return (
          <Box bg={bgColor} minH="100vh">
            <Container maxW="6xl" py={8}>
              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12}>
                {/* Contact Form Side */}
                <GridItem>
                  <Card bg={cardBg} shadow="lg">
                    <CardHeader>
                      <Heading size="lg" color={textColor}>
                        Get in Touch
                      </Heading>
                    </CardHeader>
                    <CardBody>
                      {renderContent(content)}
                    </CardBody>
                  </Card>
                </GridItem>

                {/* Contact Info Side */}
                <GridItem>
                  <VStack spacing={8} align="stretch">
                    <Card bg={cardBg} shadow="md">
                      <CardHeader>
                        <Heading size="md" color={textColor}>
                          Contact Information
                        </Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={6} align="stretch">
                          <HStack>
                            <Box
                              w={12}
                              h={12}
                              bg="blue.100"
                              borderRadius="full"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              📧
                            </Box>
                            <Box>
                              <Text fontWeight="semibold" color={textColor}>
                                Email
                              </Text>
                              <Text color="gray.600">info@threadtravels.mv</Text>
                            </Box>
                          </HStack>
                          <HStack>
                            <Box
                              w={12}
                              h={12}
                              bg="green.100"
                              borderRadius="full"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              📞
                            </Box>
                            <Box>
                              <Text fontWeight="semibold" color={textColor}>
                                Phone
                              </Text>
                              <Text color="gray.600">+960 123 4567</Text>
                            </Box>
                          </HStack>
                          <HStack>
                            <Box
                              w={12}
                              h={12}
                              bg="purple.100"
                              borderRadius="full"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              📍
                            </Box>
                            <Box>
                              <Text fontWeight="semibold" color={textColor}>
                                Address
                              </Text>
                              <Text color="gray.600">Male, Maldives</Text>
                            </Box>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </VStack>
                </GridItem>
              </Grid>
            </Container>
          </Box>
        );

      default: // 'default' template
        return (
          <Box bg={bgColor} minH="100vh">
            <Container maxW="4xl" py={8}>
              <Card bg={cardBg} shadow="lg">
                <CardHeader>
                  <Heading size="xl" color={textColor}>
                    {title}
                  </Heading>
                  {meta_description && (
                    <Text color="gray.600" mt={2}>
                      {meta_description}
                    </Text>
                  )}
                </CardHeader>
                <CardBody>
                  {renderContent(content)}
                </CardBody>
              </Card>
            </Container>
          </Box>
        );
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container maxW="4xl" py={8}>
          <VStack spacing={6}>
            <Skeleton height="40px" width="300px" />
            <Skeleton height="20px" width="200px" />
            <Skeleton height="400px" width="100%" />
          </VStack>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxW="4xl" py={8}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </Container>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout>
        <Container maxW="4xl" py={8}>
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>Page Not Found!</AlertTitle>
            <AlertDescription>The page you're looking for doesn't exist.</AlertDescription>
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{page.seo_title || page.title} - Thread Travels & Tours</title>
        <meta name="description" content={page.seo_description || page.meta_description} />
        <meta name="keywords" content={page.meta_keywords} />
        {page.canonical_url && <link rel="canonical" href={page.canonical_url} />}
        <meta name="robots" content={page.robots} />
        
        {/* Open Graph */}
        <meta property="og:title" content={page.og_title || page.title} />
        <meta property="og:description" content={page.og_description || page.meta_description} />
        {page.og_image && <meta property="og:image" content={page.og_image.file_url} />}
        
        {/* JSON-LD Structured Data */}
        {page.json_ld && (
          <script type="application/ld+json">
            {JSON.stringify(page.json_ld)}
          </script>
        )}
      </Helmet>
      
      {renderTemplate(page)}
    </>
  );
};
