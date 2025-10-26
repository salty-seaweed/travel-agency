import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  Text,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  name: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  showHome = true,
  separator = <ChevronRightIcon className="h-4 w-4" />
}) => {
  const location = useLocation();
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const linkColor = useColorModeValue('blue.600', 'blue.300');
  const currentPageColor = useColorModeValue('gray.800', 'white');

  // Auto-generate breadcrumbs from URL if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home if showHome is true
    if (showHome) {
      breadcrumbs.push({
        name: 'Home',
        href: '/'
      });
    }

    // Generate breadcrumbs from path
    pathnames.forEach((pathname, index) => {
      const href = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      
      // Convert pathname to readable name
      let name = pathname
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Handle special cases
      switch (pathname) {
        case 'packages':
          name = 'Travel Packages';
          break;
        case 'transportation':
          name = 'Transportation';
          break;
        case 'about':
          name = 'About Us';
          break;
        case 'contact':
          name = 'Contact Us';
          break;
        case 'faq':
          name = 'FAQ';
          break;
        case 'blog':
          name = 'Blog';
          break;
        case 'customer':
          name = 'Customer Portal';
          break;
        case 'dashboard':
          name = 'Dashboard';
          break;
      }

      breadcrumbs.push({
        name,
        href: isLast ? undefined : href,
        isCurrentPage: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  // Don't render if only home item and we're on home page
  if (breadcrumbItems.length <= 1 && location.pathname === '/') {
    return null;
  }

  return (
    <Box className={className} py={2}>
      <Breadcrumb
        spacing={2}
        separator={
          <Box color={textColor} display="flex" alignItems="center">
            {separator}
          </Box>
        }
      >
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem
            key={index}
            isCurrentPage={item.isCurrentPage}
            isLastChild={index === breadcrumbItems.length - 1}
          >
            {item.href && !item.isCurrentPage ? (
              <BreadcrumbLink
                as={RouterLink}
                to={item.href}
                color={linkColor}
                _hover={{
                  textDecoration: 'underline',
                  color: linkColor
                }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                {index === 0 && showHome && (
                  <Icon as={HomeIcon} h={4} w={4} />
                )}
                {item.name}
              </BreadcrumbLink>
            ) : (
              <Text
                color={item.isCurrentPage ? currentPageColor : textColor}
                fontWeight={item.isCurrentPage ? 'semibold' : 'normal'}
                display="flex"
                alignItems="center"
                gap={1}
              >
                {index === 0 && showHome && (
                  <Icon as={HomeIcon} h={4} w={4} />
                )}
                {item.name}
              </Text>
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </Box>
  );
};

// Hook to get current breadcrumbs for SEO structured data
export const useBreadcrumbs = (customItems?: BreadcrumbItem[]) => {
  const location = useLocation();

  const getBreadcrumbs = (): Array<{ name: string; url: string }> => {
    if (customItems) {
      return customItems
        .filter(item => item.href)
        .map(item => ({
          name: item.name,
          url: `https://threadtravels.com${item.href}`
        }));
    }

    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs: Array<{ name: string; url: string }> = [];

    // Add home
    breadcrumbs.push({
      name: 'Home',
      url: 'https://threadtravels.com/'
    });

    // Add path segments
    pathnames.forEach((pathname, index) => {
      const href = `/${pathnames.slice(0, index + 1).join('/')}`;
      
      let name = pathname
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Handle special cases
      switch (pathname) {
        case 'packages':
          name = 'Travel Packages';
          break;
        case 'transportation':
          name = 'Transportation';
          break;
        case 'about':
          name = 'About Us';
          break;
        case 'contact':
          name = 'Contact Us';
          break;
        case 'faq':
          name = 'FAQ';
          break;
        case 'blog':
          name = 'Blog';
          break;
      }

      breadcrumbs.push({
        name,
        url: `https://threadtravels.com${href}`
      });
    });

    return breadcrumbs;
  };

  return getBreadcrumbs();
};

export default Breadcrumbs;
