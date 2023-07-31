export interface MindGalleryProps {
  feed: Array<MindGalleryImage>
  settings: MindGallerySettings
}

export interface MindGalleryImage {
  node: {
    sourceUrl: string,
    srcSet: string,
    sizes: string,
    width: string,
    height: string,
    altText: string,
    caption?: string,
    type: string,
    mediaDetails: { width: number, height: number }
  }
}
export interface MindGallerySettings {
  ratio: string
  throttle: string
  easingduration?: string
  easingtype?: string
  type?: string
  autoplay?: string
  scale?: string
}
