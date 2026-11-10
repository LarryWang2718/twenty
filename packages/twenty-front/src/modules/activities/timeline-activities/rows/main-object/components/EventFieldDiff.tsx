import { styled } from '@linaria/react';

import { EventFieldDiffLabel } from '@/activities/timeline-activities/rows/main-object/components/EventFieldDiffLabel';
import { EventFieldDiffValue } from '@/activities/timeline-activities/rows/main-object/components/EventFieldDiffValue';
import { EventFieldDiffValueEffect } from '@/activities/timeline-activities/rows/main-object/components/EventFieldDiffValueEffect';
import { EventRelationFieldDiffValues } from '@/activities/timeline-activities/rows/main-object/components/EventRelationFieldDiffValues';
import { isRelationFieldChangeValue } from '@/activities/timeline-activities/utils/relationFieldChangeValue';
import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { Trans } from '@lingui/react/macro';
import { isObject } from '@sniptt/guards';
import { FieldMetadataType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme';
import { doNotTranslate } from 'twenty-shared/i18n';

type EventFieldDiffProps = {
  fieldDiff: { before: unknown; after: unknown };
  mainObjectMetadataItem: EnrichedObjectMetadataItem;
  fieldMetadataItem: FieldMetadataItem | undefined;
  diffArtificialRecordStoreId: string;
};

const StyledEventFieldDiffContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${themeCssVariables.spacing[1]};
  height: 24px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledEmptyValue = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledArrowContainer = styled.span`
  color: ${themeCssVariables.font.color.secondary};
`;

const isFieldDiffScalarValueEmpty = (value: unknown): boolean =>
  !isDefined(value) || value === '';

const isFieldDiffValueEmpty = (value: unknown): boolean =>
  isFieldDiffScalarValueEmpty(value) ||
  (isObject(value) && Object.values(value).every(isFieldDiffScalarValueEmpty));

export const EventFieldDiff = ({
  fieldDiff,
  mainObjectMetadataItem,
  fieldMetadataItem,
  diffArtificialRecordStoreId,
}: EventFieldDiffProps) => {
  if (!fieldMetadataItem) {
    throw new Error(doNotTranslate('fieldMetadataItem is required'));
  }

  const isRelationFieldDiff =
    fieldMetadataItem.type === FieldMetadataType.RELATION &&
    (isRelationFieldChangeValue(fieldDiff.before) ||
      isRelationFieldChangeValue(fieldDiff.after));

  if (isRelationFieldDiff) {
    return (
      <StyledEventFieldDiffContainer>
        <EventFieldDiffLabel fieldMetadataItem={fieldMetadataItem} />
        <StyledArrowContainer>→</StyledArrowContainer>
        <EventRelationFieldDiffValues
          fieldDiff={fieldDiff}
          fieldMetadataItem={fieldMetadataItem}
        />
      </StyledEventFieldDiffContainer>
    );
  }

  const renderFieldDiffValue = ({
    value,
    recordStoreId,
  }: {
    value: unknown;
    recordStoreId: string;
  }) => {
    if (isFieldDiffValueEmpty(value)) {
      return (
        <StyledEmptyValue>
          <Trans>Empty</Trans>
        </StyledEmptyValue>
      );
    }

    return (
      <>
        <EventFieldDiffValueEffect
          diffArtificialRecordStoreId={recordStoreId}
          mainObjectMetadataItem={mainObjectMetadataItem}
          fieldMetadataItem={fieldMetadataItem}
          diffRecord={value as Record<string, unknown>}
        />
        <EventFieldDiffValue
          diffArtificialRecordStoreId={recordStoreId}
          mainObjectMetadataItem={mainObjectMetadataItem}
          fieldMetadataItem={fieldMetadataItem}
        />
      </>
    );
  };

  return (
    <StyledEventFieldDiffContainer>
      <EventFieldDiffLabel fieldMetadataItem={fieldMetadataItem} />
      {renderFieldDiffValue({
        value: fieldDiff.before,
        recordStoreId: `${diffArtificialRecordStoreId}--before`,
      })}
      <StyledArrowContainer>→</StyledArrowContainer>
      {renderFieldDiffValue({
        value: fieldDiff.after,
        recordStoreId: `${diffArtificialRecordStoreId}--after`,
      })}
    </StyledEventFieldDiffContainer>
  );
};
