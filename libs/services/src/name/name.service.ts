export class NameService {
  getCronName(cronId: string): string {
    return `${cronId}_rss_import`;
  }
}
