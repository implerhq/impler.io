export function getErrorObject(error: string): Record<string, string> {
  if (!error) return {};
  const errorStrs = error.split(`, `);
  let fieldName: string;

  return errorStrs.reduce((acc: Record<string, string>, val: string) => {
    [, fieldName] = val.split(/`/);
    acc[fieldName] = val;

    return acc;
  }, {});
}
