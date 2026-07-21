import { Img } from '../components';

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
    <Img
      className={className}
      src={getAssetUrl(`/static/${staticAsset}`)}
      alt=""
      width={width}
      height={height}
    />
  );
};

export default TemplateImage;
