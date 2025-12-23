export const homePageProfile = {
  name: 'Snow',
  tagline: '“爬起仅仅只是因为不想输。”',
  avatarUrl: '/img/724d7fb480c8ac0db472ca5c7e36d239.jpg',
  avatarAlt: 'SnowAvatar',
  backgroundUrl: '/img/site_header_1920.webp',
  footerText: '© Snowの小窝 - 2022-2025',
};

export const homePageLinks = {
  githubUrl: 'https://github.com/XueHua-s',
};

export async function getHomePageProfile() {
  const { getBackgroundImages } = await import('@lib/backgrounds');
  const backgroundImages = await getBackgroundImages();
  const backgroundUrl = backgroundImages.length
    ? backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
    : homePageProfile.backgroundUrl;

  return { ...homePageProfile, backgroundUrl };
}
