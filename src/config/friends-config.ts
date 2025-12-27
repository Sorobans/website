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
    site: "hsn的博客",
    url: 'https://blog.huangsn.dev/',
    owner: 'hsn',
    desc: '是想长头发但是还在敲代码的hsn!',
    image: 'https://avatars.githubusercontent.com/u/51445446?v=4',
    color: '#a172ff',
  },
  {
    site: "凌菀喵",
    url: 'https://nyac.at/',
    owner: 'clansty',
    desc: '你好，这里是凌菀',
    image: 'https://avatars.githubusercontent.com/u/18461360?v=4',
    color: '#93b7f6',
  },
  {
    site: "HSn's Blog",
    url: 'https://blog.huangsn.dev',
    owner: 'HSn',
    desc: '人在北极，彻底失败',
    image: 'https://avatars.githubusercontent.com/u/91785709?v=4',
    color: '#f8ffc2',
  },
  {
    site: '李嘉图的博客',
    url: 'https://gogec.cn/',
    owner: '李嘉图',
    desc: '努力想得到什么东西，其实只要沉着冷静坚持不懈，就可以轻易神不知鬼不觉的得到。',
    image: 'https://gogec.cn/assets/ckg-Dsi84xWE.jpg',
    color: '#393535',
  },
  {
    site: '余弦の博客',
    url: 'https://blog.cosine.ren/',
    owner: 'cosine',
    desc: '=WA的一声就哭了',
    image: 'https://blog.cosine.ren/img/avatar.webp',
  },
  {
    site: '阿凯的博客',
    url: 'https://salephine.asia/',
    owner: '阿凯',
    desc: '生如逆旅单行道，哪有岁月可回头。',
    image: 'https://avatars.githubusercontent.com/u/84063341?v=4',
    color: '#1c8adb',
  },
];

export const friendsIntro = {
  title: '小伙伴们',
  subtitle: '改了一下,有时间顺序从新到旧排列～',
  applyTitle: '欢迎加友链',
  applyDesc: '在本页留言,格式如下',
  exampleYaml: `- site: snowの博客 # 站点名称
  url: https://xhblog.top/ # 站点网址
  owner: snow # 昵称
  desc: 爬起仅仅是因为不想输 # 站点简介
  image: https://xhblog.top/img/avatar.jpg
  color: "#ffc0cb" # 图标色`,
};
