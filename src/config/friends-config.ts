export interface FriendLink {
  site: string;
  url: string;
  owner: string;
  desc: string;
  image: string;
  color?: string;
}

export const friendsData: FriendLink[] = [
  {
    site: "matto's blog",
    url: 'https://www.matto.top/',
    owner: 'matto',
    desc: 'Lazing around every day keeps the body healthy.',
    image: 'https://s3.bmp.ovh/imgs/2022/05/04/dcbc99998523dd33.png',
    color: '#12e2e8',
  },
  {
    site: "Youzi's Site",
    url: 'https://www.hxyouzi.com/blog/',
    owner: 'Youzi',
    desc: 'Strong winds will break the waves; someday I will hoist my sail to cross the sea.',
    image: 'https://www.hxyouzi.com/fs/avater/1766993232_打伞少女.jpg',
    color: '#ec66ab',
  },
  {
    site: 'Lemon Tea House',
    url: 'https://blog.lemonice.top',
    owner: 'Cold Lemon',
    desc: 'Early rain in Lin\'an, fallen petals through the night.',
    image: 'https://blog.lemonice.top/img/avatar.webp',
    color: '#e0edff',
  },
  {
    site: 'SheepChef Blog',
    url: 'https://shef.cc/',
    owner: 'SheepChef',
    desc: 'Someone once called me a "sky-seeker." I love the sky simply because it is blue. From blue to azure to cyanotype—it’s a portrait of the blue.',
    image: 'https://shef.cc/wp-content/uploads/cropped-cropped-QQ-Logo-512x512.jpg',
    color: '#5c67e6',
  },
  {
    site: 'Hakadao',
    url: 'https://hakadao.cc',
    owner: 'Hakadao',
    desc: 'Now I am become a loser, the destroyer of myself.',
    image: 'https://avatars.githubusercontent.com/u/33394391?v=4&s=100',
    color: '#0e0f1a',
  },
  {
    site: "Elykia's Blog",
    url: 'https://blog.elykia.cn/',
    owner: 'Elykia',
    desc: 'To the flawless one.',
    image: 'https://bu.dusays.com/2024/10/25/671b2438203a6.gif',
    color: '#ebb4ff',
  },
  {
    site: "HalfSweet's Blog",
    url: 'https://blog.halfsweet.cn/',
    owner: 'HalfSweet',
    desc: 'Try to create some value.',
    image: 'https://blog.halfsweet.cn/img/Headshot.jpg',
    color: '#ebb4ff',
  },
  {
    site: 'Guoweiyi',
    url: 'https://gwy.fun/',
    owner: 'Guoweiyi',
    desc: 'Unaware when spring arrived, unaware when the blossoms fell.',
    image: 'https://gwy.fun/_next/image?url=https%3A%2F%2Fwww.gwy.fun%2Fzhan%2Flogo.jpg&w=640&q=75',
    color: '#98abff',
  },
  {
    site: "RainbowBird'S Blog",
    url: 'https://blog.luoling.moe/',
    owner: 'RainbowBird',
    desc: 'Chase your dreams and live life to the fullest.',
    image: 'https://blog.luoling.moe/images/avatar.jpg',
    color: '#063',
  },
  {
    site: "hsn's Blog",
    url: 'https://www.zh314.xyz/',
    owner: 'hsn',
    desc: 'I want long hair but I\'m still stuck here coding!',
    image: 'https://avatars.githubusercontent.com/u/51445446?v=4',
    color: '#a172ff',
  },
  {
    site: 'NyaCat',
    url: 'https://nyac.at/',
    owner: 'clansty',
    desc: 'Hello, this is Lingwan.',
    image: 'https://avatars.githubusercontent.com/u/18461360?v=4',
    color: '#93b7f6',
  },
  {
    site: "HSn's Blog",
    url: 'https://blog.huangsn.dev',
    owner: 'HSn',
    desc: 'Currently at the North Pole, total failure.',
    image: 'https://avatars.githubusercontent.com/u/91785709?v=4',
    color: '#f8ffc2',
  },
  {
    site: "Ricardo's Blog",
    url: 'https://gogec.cn/',
    owner: 'Ricardo',
    desc: 'If you want something, stay calm and persistent; you can achieve it quietly and effortlessly.',
    image: 'https://gogec.cn/assets/ckg-Dsi84xWE.jpg',
    color: '#393535',
  },
  {
    site: "Cosine's Blog",
    url: 'https://blog.cosine.ren/',
    owner: 'cosine',
    desc: '*Cries in Wrong Answer*',
    image: 'https://blog.cosine.ren/img/avatar.webp',
  },
  {
    site: "Akai's Blog",
    url: 'https://salephine.asia/',
    owner: 'Akai',
    desc: 'Life is a one-way journey; there is no turning back the clock.',
    image: 'https://avatars.githubusercontent.com/u/84063341?v=4',
    color: '#1c8adb',
  },
  {
    site: 'MicroWorld',
    url: 'https://www.hayrsiane.com/',
    owner: 'Hayrsiane',
    desc: 'Sharing tech, life, thoughts, and occasional madness from a corner of the internet.',
    image: 'https://cdn.picui.cn/vip/2026/01/04/695a1e9196d1a.png',
  },
];

export const friendsIntro = {
  title: 'Friends',
  subtitle: 'Updated: Sorted from newest to oldest by date～',
  applyTitle: 'Welcome to link exchange!',
  applyDesc: 'Leave a comment on this page using the following format:',
  exampleYaml: `- site: Snowflake's Blog # Site Name
  url: https://sorobans.github.io
  owner: Snowflake
  desc: Coding until I'm bald
  image: https://xhblog.top/img/avatar.jpg
  color: "#ffc0cb" # Theme color`,
};