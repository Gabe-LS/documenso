import { Img, Section } from '../components';
import { cn } from './email-primitives';

export interface TemplateImageProps {
  assetBaseUrl: string;
  className?: string;
  staticAsset: string;
  width?: number;
  height?: number;
}

export const TemplateImage = ({ assetBaseUrl, className, staticAsset, width, height }: TemplateImageProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Section className={cn('mt-6', className)}>
      <Img className="mx-auto mb-4" src={getAssetUrl(`/static/${staticAsset}`)} alt="" width={width} height={height} />
    </Section>
  );
};

export default TemplateImage;
