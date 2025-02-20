export interface Category {
  id: number;
  name: string;
  slug: string;
  backgroundImage: string;
}

export const categories: Category[] = [
  {
    id: 1,
    name: 'Talk',
    slug: 'talk',
    backgroundImage: '/categoryPage/talk.webp',
  },
  {
    id: 2,
    name: '마인크래프트',
    slug: 'minecraft',
    backgroundImage: '/categoryPage/minecraft.webp',
  },
  {
    id: 3,
    name: '음악/노래',
    slug: 'music',
    backgroundImage: '/categoryPage/music.webp',
  },
  {
    id: 4,
    name: '그림/아트',
    slug: 'art',
    backgroundImage: '/categoryPage/art.webp',
  },
  {
    id: 5,
    name: '오버워치2',
    slug: 'overwatch2',
    backgroundImage: '/categoryPage/overwatch2.webp',
  },
  {
    id: 6,
    name: '리그 오브 레전드',
    slug: 'league-of-legends',
    backgroundImage: '/categoryPage/league-of-legends.webp',
  },
];
