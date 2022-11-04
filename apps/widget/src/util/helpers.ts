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

export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const KBSize = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(KBSize));

  return `${parseFloat((bytes / Math.pow(KBSize, i)).toFixed(dm))} ${sizes[i]}`;
}
