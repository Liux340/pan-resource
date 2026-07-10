export interface ResourceFrontmatter {
  title: string;
  slug: string;
  description: string;
  cover: string;
  category: string;
  tags: string[];
  publishDate: string;
  updateDate: string;
 夸克链接?: string;
  百度链接?: string;
  迅雷链接?: string;
  recommended?: boolean;
  popular?: boolean;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  icon: string;
}

export interface ResourceItem {
  frontmatter: ResourceFrontmatter;
  url: string;
}