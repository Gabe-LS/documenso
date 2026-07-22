import { Column, Img, Row, Section } from '../components';
import { cn } from './email-primitives';

export interface TemplateDocumentImageProps {
  assetBaseUrl: string;
  /** For genuinely exceptional cases only — spacing is baked in by default. */
  className?: string;
}

/**
 * The canonical "document" illustration used across most templates.
 * `mt-6` is baked in here so no call site needs to pass spacing.
 */
export const TemplateDocumentImage = ({ assetBaseUrl, className }: TemplateDocumentImageProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Section className={cn('mt-6', className)}>
      <Row className="table-fixed">
        <Column />

        <Column>
          <Img
            className="mx-auto mb-4 h-[138px] w-[110px]"
            src={getAssetUrl('/static/document.png')}
            alt=""
            width={110}
            height={138}
          />
        </Column>

        <Column />
      </Row>
    </Section>
  );
};

export default TemplateDocumentImage;
