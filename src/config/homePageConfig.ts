// Home / BlogIndex Config
export const homePageProfile = {
  name: 'Soroban',
  tagline: '“ I prefer the depth of the ocean to the noise of the waves. ”',
  avatarUrl: '/img/724d7fb480c8ac0db472ca5c7e36d239.jpg',
  avatarAlt: 'SnowAvatar',
  backgroundUrl: '/img/site_header_1920.webp',
  footerText: '© Soroban 2026',
};

export const homePageLinks = {
  xUrl: 'https://x.com/ImSoroban',
  githubUrl: 'https://github.com/Sorobans',
  telegramUrl: 'https://youtube.com/@Sorobans',
};

export async function getHomePageProfile() {
  const { getBackgroundImages } = await import('@lib/backgrounds');
  const backgroundImages = await getBackgroundImages();
  const backgroundUrl = backgroundImages.length
    ? backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
    : homePageProfile.backgroundUrl;

  return { ...homePageProfile, backgroundUrl };
}
