export interface SiteSelectors {
  articleList: string;
  title: string;
  link: string;
  date: string;
  excerpt: string;
  image: string;
}

export interface SiteConfig {
  name: string;
  url: string;
  selectors: SiteSelectors;
}

export const sites: SiteConfig[] = [
  {
    name: 'NUM News',
    url: 'https://news.num.edu.mn/',
    selectors: {
      articleList: '.single_post_block, .small_post_block_copy, .gum_post_data',
      title: 'a.p_title, a.post_title',
      link: 'a.p_title, a.post_title',
      date: 'li.date',
      excerpt: '',
      image: 'img',
    },
  },
  {
    name: 'MSUE News',
    url: 'https://msue.edu.mn/',
    selectors: {
      articleList: '.blog-post.blog-post-style2',
      title: '.post-details a[href*="/n/r/"]',
      link: '.post-details a[href*="/n/r/"]',
      date: '.text-extra-small.text-medium-gray',
      excerpt: '',
      image: 'img',
    },
  },
];
