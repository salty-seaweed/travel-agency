import React from 'react';
import { PackageImageGallery } from '../../PackageImageGallery';
import type { PackageImage } from '../../../../types';

interface ImageGalleryProps {
  images: PackageImage[];
  packageName: string;
}

export function ImageGallery({ images, packageName }: ImageGalleryProps) {
  return <PackageImageGallery images={images} packageName={packageName} />;
}
