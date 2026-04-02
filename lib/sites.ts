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
    name: "NUM News",
    url: "https://news.num.edu.mn/",
    selectors: {
      articleList: ".single_post_block, .small_post_block_copy, .gum_post_data",
      title: "a.p_title, a.post_title",
      link: "a.p_title, a.post_title",
      date: "li.date",
      excerpt: "",
      image: "img",
    },
  },
  {
    name: "MSUE News",
    url: "https://msue.edu.mn/",
    selectors: {
      articleList: ".blog-post.blog-post-style2",
      title: '.post-details a[href*="/n/r/"]',
      link: '.post-details a[href*="/n/r/"]',
      date: ".text-extra-small.text-medium-gray",
      excerpt: "",
      image: "img",
    },
  },
  {
    name: "Scholarship Positions",
    url: "https://scholarship-positions.com/category/mongolia/",
    lang: "en",
    selectors: {
      articleList: "article.post",
      title: "h1.entry-title a",
      link: "h1.entry-title a",
      date: "",
      excerpt: ".entry-content p",
      image: "img.wp-post-image",
    },
  },
  {
    name: "Scholars4Dev",
    url: "https://www.scholars4dev.com/",
    lang: "en",
    selectors: {
      articleList: ".post.clearfix",
      title: "h2 a",
      link: "h2 a",
      date: "",
      excerpt: "p",
      image: "img",
    },
  },
  {
    name: "Scholars4Dev (Page 2)",
    url: "https://www.scholars4dev.com/page/2/",
    lang: "en",
    selectors: {
      articleList: ".post.clearfix",
      title: "h2 a",
      link: "h2 a",
      date: "",
      excerpt: "p",
      image: "img",
    },
  },
  {
    name: "Scholars4Dev (Page 3)",
    url: "https://www.scholars4dev.com/page/3/",
    lang: "en",
    selectors: {
      articleList: ".post.clearfix",
      title: "h2 a",
      link: "h2 a",
      date: "",
      excerpt: "p",
      image: "img",
    },
  },
  {
    name: "Монголын Математикийн Олимпиад",
    url: "https://www.mmo.mn",
    selectors: {
      articleList: "div.article.card",
      title: "h4 a",
      link: "h4 a",
      date: "",
      excerpt: "p",
      image: "",
    },
  },
  {
    name: "Мэдээлэл Зүйн Олимпиад",
    url: "https://informatics.edu.mn",
    selectors: {
      articleList: "article.bloghash-article",
      title: "h4.entry-title a",
      link: "h4.entry-title a",
      date: ".posted-on",
      excerpt: ".post-excerpt",
      image: "img",
    },
  },
  {
    name: "Мэдээлэл Зүйн Олимпиад (Page 2)",
    url: "https://informatics.edu.mn/?paged=2",
    selectors: {
      articleList: "article.bloghash-article",
      title: "h4.entry-title a",
      link: "h4.entry-title a",
      date: ".posted-on",
      excerpt: ".post-excerpt",
      image: "img",
    },
  },
  {
    name: "Ministry of Education (EN)",
    url: "https://en.moe.gov.mn",
    lang: "en",
    selectors: {
      articleList: ".spost.post-list-item",
      title: ".entry-title a",
      link: ".entry-title a",
      date: ".entry-meta li",
      excerpt: ".entry-content p",
      image: ".entry-image img",
    },
  },
  {
    name: "NUM Химийн тэнхим",
    url: "https://dep.num.edu.mn/chemistry/",
    selectors: {
      articleList: "li.post",
      title: "h5 a",
      link: "h5 a",
      date: "span.date",
      excerpt: ".post-excerpt",
      image: ".photo img",
    },
  },
  {
    name: "Ikon.mn Боловсрол",
    url: "https://ikon.mn/l/11",
    selectors: {
      articleList: 'a[href^="/n/"]',
      title: "",
      link: "",
      date: "",
      excerpt: "",
      image: "img",
    },
  },
];
