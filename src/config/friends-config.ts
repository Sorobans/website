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
    site: "Soroban's Blog",
    url: 'https://www.soroban.lol',
    owner: 'Soroban',
    desc: '#NotBald',
    image: 'https://website-zeta-nine-74.vercel.app/img/724d7fb480c8ac0db472ca5c7e36d239.jpg',
    color: '#12e2e8',
  },
];

export const friendsIntro = {
  title: 'Friends',
  subtitle: 'Updated: Sorted from newest to oldest by date～',
  applyTitle: 'Welcome to link exchange!',
  applyDesc: 'Leave a comment on this page using the following format:',
  exampleYaml: `- site: Soroban's Blog # Site Name
  url: https://sorobans.github.io
  owner: Soroban
  desc: Coding until I'm bald
  image: https://soroban.lol/img/avatar.jpg
  color: "#ffc0cb" # Theme color`,
};