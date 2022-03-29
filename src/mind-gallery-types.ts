export interface MindGalleryProps {
  feed: Array<MindGalleryImage>
  settings: MindGallerySettings
}

export interface MindGalleryImage {
  node: {
    sourceUrl: string,
    srcSet: string,
    altText: string,
    caption?: string,
    mediaDetails: { width: number, height: number }
  }
}
export interface MindGallerySettings {
  imageRatio: number
  throttleDelay: number
  galleryEasing: { duration: number, ease: string }
}