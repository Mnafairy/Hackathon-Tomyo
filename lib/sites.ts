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
  lang?: string;
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
  {
    name: 'Scholarship Positions',
    url: 'https://scholarship-positions.com/category/mongolia/',
    lang: 'en',
    selectors: {
      articleList: 'article.post',
      title: 'h1.entry-title a',
      link: 'h1.entry-title a',
      date: '',
      excerpt: '.entry-content p',
      image: 'img.wp-post-image',
    },
  },
  {
    name: 'Scholars4Dev',
    url: 'https://www.scholars4dev.com/',
    lang: 'en',
    selectors: {
      articleList: '.post.clearfix',
      title: 'h2 a',
      link: 'h2 a',
      date: '',
      excerpt: 'p',
      image: 'img',
    },
  },
];
