import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { render, screen } from '@testing-library/react';
import { isDefined } from 'twenty-shared/utils';

import { EventFieldDiff } from '@/activities/timeline-activities/rows/main-object/components/EventFieldDiff';
import { getJestMetadataAndApolloMocksWrapper } from '~/testing/jest/getJestMetadataAndApolloMocksWrapper';
import { getTestEnrichedObjectMetadataItemsMock } from '~/testing/utils/getTestEnrichedObjectMetadataItemsMock';

const objectMetadataItems = getTestEnrichedObjectMetadataItemsMock();

const companyObjectMetadataItem = objectMetadataItems.find(
  (objectMetadataItem) => objectMetadataItem.nameSingular === 'company',
);

const companyNameFieldMetadataItem = companyObjectMetadataItem?.fields.find(
  (fieldMetadataItem) => fieldMetadataItem.name === 'name',
);

const renderEventFieldDiff = (fieldDiff: {
  before: unknown;
  after: unknown;
}) => {
  if (
    !isDefined(companyObjectMetadataItem) ||
    !isDefined(companyNameFieldMetadataItem)
  ) {
    throw new Error('Company name field metadata is missing from the mocks');
  }

  const MetadataAndApolloWrapper = getJestMetadataAndApolloMocksWrapper({
    objectMetadataItems,
  });

  return render(
    <MetadataAndApolloWrapper>
      <I18nProvider i18n={i18n}>
        <EventFieldDiff
          fieldDiff={fieldDiff}
          mainObjectMetadataItem={companyObjectMetadataItem}
          fieldMetadataItem={companyNameFieldMetadataItem}
          diffArtificialRecordStoreId="event-id--company-name"
        />
      </I18nProvider>
    </MetadataAndApolloWrapper>,
  );
};

describe('EventFieldDiff', () => {
  it('shows the previous and the new value of an updated field', async () => {
    renderEventFieldDiff({ before: 'Acme', after: 'Globex' });

    expect(await screen.findByText('Acme')).toBeVisible();
    expect(await screen.findByText('Globex')).toBeVisible();
    expect(screen.queryByText('Empty')).not.toBeInTheDocument();
  });

  it('shows "Empty" for the previous value when the field was empty', async () => {
    renderEventFieldDiff({ before: '', after: 'Globex' });

    expect(screen.getByText('Empty')).toBeVisible();
    expect(await screen.findByText('Globex')).toBeVisible();
  });

  it('shows "Empty" for the new value when the field was cleared', async () => {
    renderEventFieldDiff({ before: 'Acme', after: null });

    expect(await screen.findByText('Acme')).toBeVisible();
    expect(screen.getByText('Empty')).toBeVisible();
  });
});
