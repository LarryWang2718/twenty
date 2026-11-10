import { fastDeepEqual, isDefined, isPlainObject } from 'twenty-shared/utils';

type FieldDiff = { before: unknown; after: unknown };

const getFieldDiffs = (properties: unknown): Record<string, FieldDiff> =>
  isPlainObject(properties) && isPlainObject(properties.diff)
    ? (properties.diff as Record<string, FieldDiff>)
    : {};

export const objectRecordDiffMerge = (
  oldProperties: unknown,
  newProperties: unknown,
): { diff: Record<string, FieldDiff> } => {
  const oldDiff = getFieldDiffs(oldProperties);
  const newDiff = getFieldDiffs(newProperties);

  const mergedDiff: Record<string, FieldDiff> = {};

  for (const fieldName of new Set([
    ...Object.keys(oldDiff),
    ...Object.keys(newDiff),
  ])) {
    const oldFieldDiff = oldDiff[fieldName];
    const newFieldDiff = newDiff[fieldName];

    const fieldDiff =
      isDefined(oldFieldDiff) && isDefined(newFieldDiff)
        ? { before: oldFieldDiff.before, after: newFieldDiff.after }
        : (oldFieldDiff ?? newFieldDiff);

    // A value edited back to where it started within the merge window is not a change
    if (fastDeepEqual(fieldDiff.before, fieldDiff.after)) {
      continue;
    }

    mergedDiff[fieldName] = fieldDiff;
  }

  return { diff: mergedDiff };
};
