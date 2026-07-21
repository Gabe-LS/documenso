import { Column, Img, Row, Section } from '../components';

export interface TemplateDocumentImageProps {
  assetBaseUrl: string;
  className?: string;
}

export const TemplateDocumentImage = ({ assetBaseUrl, className }: TemplateDocumentImageProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Section className={className}>
      <Row className="table-fixed">
        <Column />

        <Column>
          <Img
            className="mx-auto h-[172px] w-[159px]"
            src={getAssetUrl('/static/document.png')}
            alt=""
            width={159}
            height={172}
          />
        </Column>

        <Column />
      </Row>
    </Section>
  );
};

export default TemplateDocumentImage;
