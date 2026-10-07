export class MailHelper {
  static firstLink(text: string, urlPart: string): string {
    const links = text.match(/https?:\/\/[^\s<>"')]+/g) ?? [];
    return links.find((link) => link.includes(urlPart)) ?? '';
  }

  static resetTokenFrom(link: string): string {
    return new URL(link).pathname.split('/').pop() ?? '';
  }
}
