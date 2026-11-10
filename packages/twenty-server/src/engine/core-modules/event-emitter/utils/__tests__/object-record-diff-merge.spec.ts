import { objectRecordDiffMerge } from 'src/engine/core-modules/event-emitter/utils/object-record-diff-merge';

describe('objectRecordDiffMerge', () => {
  it('keeps the first before and the latest after of a field changed twice', () => {
    expect(
      objectRecordDiffMerge(
        { diff: { name: { before: 'Acme', after: 'Acme Inc' } } },
        { diff: { name: { before: 'Acme Inc', after: 'Acme Corp' } } },
      ),
    ).toEqual({ diff: { name: { before: 'Acme', after: 'Acme Corp' } } });
  });

  it('keeps fields changed only once on either side', () => {
    expect(
      objectRecordDiffMerge(
        { diff: { name: { before: 'Acme', after: 'Acme Inc' } } },
        { diff: { employees: { before: 50, after: 60 } } },
      ),
    ).toEqual({
      diff: {
        name: { before: 'Acme', after: 'Acme Inc' },
        employees: { before: 50, after: 60 },
      },
    });
  });

  it('drops a field edited back to its original value', () => {
    expect(
      objectRecordDiffMerge(
        {
          diff: {
            name: { before: 'Acme', after: 'Acme Inc' },
            employees: { before: 50, after: 60 },
          },
        },
        { diff: { name: { before: 'Acme Inc', after: 'Acme' } } },
      ),
    ).toEqual({ diff: { employees: { before: 50, after: 60 } } });
  });

  it('compares composite values deeply', () => {
    expect(
      objectRecordDiffMerge(
        {
          diff: {
            domainName: {
              before: { primaryLinkUrl: 'acme.com' },
              after: { primaryLinkUrl: 'acme.io' },
            },
          },
        },
        {
          diff: {
            domainName: {
              before: { primaryLinkUrl: 'acme.io' },
              after: { primaryLinkUrl: 'acme.com' },
            },
          },
        },
      ),
    ).toEqual({ diff: {} });
  });

  it('returns an empty diff when neither side has one', () => {
    expect(objectRecordDiffMerge({}, null)).toEqual({ diff: {} });
  });
});
