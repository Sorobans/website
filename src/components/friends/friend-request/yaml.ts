export interface FormData {
  site: string;
  owner: string;
  url: string;
  desc: string;
  image: string;
  color: string;
}

export function generateFriendYaml(formData: FormData): string {
  return `site: ${formData.site || 'Site Name'}
url: ${formData.url || 'https://example.com'}
owner: ${formData.owner || 'Your Nickname'}
desc: ${formData.desc || 'Site Description'}
image: ${formData.image || 'https://example.com/avatar.jpg'}
color: "${formData.color || '#ffc0cb'}"`;
}