import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Center,
  Button,
  useToast,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { AdvancedSEO } from './AdvancedSEO';
import { useBreadcrumbs } from './Breadcrumbs';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';
import { generatePackageStructuredData } from '../utils/seoOptimizations';
import { PackageDetailLayout } from './package/PackageDetailLayout';
import { StickyBookingBar } from './package/StickyBookingBar';
import { PackageBookingForm } from './PackageBookingForm';
import { getStoredLayoutVariant } from './package/packageLayoutVariantStorage';
import { getActivePackageDetailVariant } from '../theme/packageDetailVariants';
import type { Package, PackageVariant } from '../types';
import type { BookingInitialValues } from './package/packageDetailLayoutTypes';

export function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState<BookingInitialValues | null>(null);
  const layoutVariant = useMemo(
    () => getStoredLayoutVariant() ?? getActivePackageDetailVariant(),
    []
  );

  const { data: packages, isLoading, error } = useFetch<Package>('/packages/');
  const packageData = packages?.find((pkg) => pkg.id === parseInt(id || '0', 10));
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  const breadcrumbs = useBreadcrumbs([
    { name: 'Home', href: '/' },
    { name: 'Travel Packages', href: '/packages' },
    { name: packageData?.name || 'Package', href: `/packages/${id}`, isCurrentPage: true },
  ]);

  useEffect(() => {
    if (!packageData) return;
    document.title = `${packageData.name} - Travel Agency`;
    const variants = packageData.variants ?? [];
    const defaultVariant = variants.find((v) => v.is_default) ?? variants[0];
    setSelectedVariantId(defaultVariant?.id ?? null);

    try {
      const recentlyViewed = JSON.parse(
        localStorage.getItem('recently_viewed_packages') || '[]'
      ) as Array<{
        id: number;
        name: string;
        image: string;
        price: string;
        duration: number;
        viewedAt: number;
      }>;
      const packageInfo = {
        id: packageData.id,
        name: packageData.name,
        image:
          packageData.images && packageData.images.length > 0
            ? packageData.images[0].image
            : '',
        price: String(packageData.price),
        duration: packageData.duration,
        viewedAt: Date.now(),
      };
      const filtered = recentlyViewed.filter((p) => p.id !== packageInfo.id);
      const updated = [packageInfo, ...filtered].slice(0, 8);
      localStorage.setItem('recently_viewed_packages', JSON.stringify(updated));
    } catch (e) {
      console.error('PackageDetailPage: failed to update recently viewed', e);
    }
  }, [packageData]);

  const variantsList: PackageVariant[] = packageData?.variants ?? [];
  const selectedVariant: PackageVariant | undefined =
    selectedVariantId != null && variantsList.length > 0
      ? variantsList.find((v) => v.id === selectedVariantId)
      : undefined;

  const viewPackage = useMemo((): Package | null => {
    if (!packageData) return null;
    if (selectedVariant) {
      return {
        ...packageData,
        price: String(selectedVariant.price),
        original_price: selectedVariant.original_price
          ? String(selectedVariant.original_price)
          : undefined,
        duration: Number(selectedVariant.duration_days),
      };
    }
    return packageData;
  }, [packageData, selectedVariant]);

  const handleBookNow = (init?: BookingInitialValues) => {
    setBookingPrefill(init ?? null);
    setShowBookingForm(true);
  };

  const closeBookingForm = () => {
    setShowBookingForm(false);
    setBookingPrefill(null);
  };

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      description: isWishlisted
        ? 'Package removed from your wishlist'
        : 'Package added to your wishlist',
      status: 'success',
      duration: 2000,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: packageData?.name || 'Travel Package',
          text: packageData?.description || 'Check out this amazing travel package!',
          url: window.location.href,
        })
        .catch((err) => {
          console.error('PackageDetailPage: Web Share failed', err);
        });
    } else {
      navigator.clipboard.writeText(window.location.href).then(
        () => {
          toast({
            title: 'Link copied',
            description: 'Package link copied to clipboard',
            status: 'success',
            duration: 2000,
          });
        },
        (err) => {
          console.error('PackageDetailPage: clipboard write failed', err);
          toast({
            title: 'Could not copy link',
            description: 'Copy the address from your browser bar instead.',
            status: 'error',
            duration: 3000,
          });
        }
      );
    }
  };

  if (isLoading) {
    return (
      <Container maxW="7xl" py={8}>
        <Center minH="60vh">
          <LoadingSpinner />
        </Center>
      </Container>
    );
  }

  if (error || !packageData || !viewPackage) {
    return (
      <Container maxW="7xl" py={8}>
        <Center minH="60vh">
          <Alert status="error" borderRadius="lg" maxW="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Package not found</AlertTitle>
              <AlertDescription>
                The package you&apos;re looking for doesn&apos;t exist or has been removed.
              </AlertDescription>
            </Box>
          </Alert>
        </Center>
        <Center mt={6}>
          <Button onClick={() => navigate('/packages')} colorScheme="purple">
            Back to Packages
          </Button>
        </Center>
      </Container>
    );
  }

  const structuredData = generatePackageStructuredData(packageData);
  const pkgWithOptionalPrice = packageData as Package & { price_from?: string };

  return (
    <>
      <AdvancedSEO
        title={`${packageData.name} - Maldives Travel Package`}
        description={
          packageData.description ||
          `Discover ${packageData.name} with Thread Travels & Tours. Budget-friendly Maldives travel experience with island packages and multi-island adventures.`
        }
        image={packageData.images?.[0]?.image}
        type="product"
        keywords={`${packageData.name}, Maldives package, Thread Travels, budget Maldives, island adventure, affordable paradise`}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        price={
          pkgWithOptionalPrice.price_from != null &&
          pkgWithOptionalPrice.price_from !== ''
            ? {
                amount: parseFloat(String(pkgWithOptionalPrice.price_from).replace(/[^0-9.]/g, '')) || 0,
                currency: 'USD',
                availability: 'InStock' as const,
              }
            : undefined
        }
      />

      <ErrorBoundary level="page">
        <PackageDetailLayout
          packageData={packageData}
          viewPackage={viewPackage}
          selectedVariantId={selectedVariantId}
          onVariantChange={setSelectedVariantId}
          onBookNow={handleBookNow}
          onAddToWishlist={handleAddToWishlist}
          onShare={handleShare}
          isWishlisted={isWishlisted}
          variant={layoutVariant}
        />

        <StickyBookingBar
          packageData={viewPackage}
          selectedVariant={selectedVariant}
          onBookNow={() => handleBookNow()}
          onAddToWishlist={handleAddToWishlist}
          onShare={handleShare}
          isWishlisted={isWishlisted}
        />

        <PackageBookingForm
          isOpen={showBookingForm}
          packageId={packageData.id}
          packageName={packageData.name}
          packagePrice={
            selectedVariantId && variantsList.length > 0
              ? (() => {
                  const v = variantsList.find((vv) => vv.id === selectedVariantId);
                  return v ? parseFloat(String(v.price)) : parseFloat(String(packageData.price));
                })()
              : parseFloat(String(packageData.price))
          }
          packageDurationDays={
            selectedVariantId && variantsList.length > 0
              ? (() => {
                  const v = variantsList.find((vv) => vv.id === selectedVariantId);
                  return v ? Number(v.duration_days) : packageData.duration;
                })()
              : packageData.duration
          }
          initialPrefill={bookingPrefill}
          onClose={closeBookingForm}
        />
      </ErrorBoundary>
    </>
  );
}
