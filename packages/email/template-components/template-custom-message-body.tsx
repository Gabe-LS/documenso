import React from 'react';

import { Text } from '../components';
import { EMAIL_BODY_TEXT_CLASSES } from './email-primitives';

export type TemplateCustomMessageBodyProps = {
  text?: string;
};

export const TemplateCustomMessageBody = ({ text }: TemplateCustomMessageBodyProps) => {
  if (!text) {
    return null;
  }

  const normalized = text
    .trim()
    .replace(/\r\n?/g, '\n')
    .replace(/\n\s*\n+/g, '\n\n')
    .replace(/\n{2,}/g, '\n\n');

  const paragraphs = normalized.split('\n\n');

  return paragraphs.map((paragraph, i) => (
    <Text key={`p-${i}`} className={`mt-4 mb-1 whitespace-pre-line break-words ${EMAIL_BODY_TEXT_CLASSES}`}>
      {paragraph.split('\n').map((line, j) => (
        <React.Fragment key={`line-${i}-${j}`}>
          {j > 0 && <br />}
          {line}
        </React.Fragment>
      ))}
    </Text>
  ));
};

export default TemplateCustomMessageBody;
