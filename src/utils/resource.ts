import type { ResourceFrontmatter, Category } from '../types/resource';

export function getAllResources(): { frontmatter: ResourceFrontmatter; url: string }[] {
  const resources = Object.values(import.meta.glob('../content/resources/*.{md,mdx}', { eager: true }));
  return resources
    .map((mod: any) => ({
      frontmatter: mod.frontmatter as ResourceFrontmatter,
      url: `/resource/${mod.frontmatter.slug}`,
    }))
    .sort((a, b) => new Date(b.frontmatter.publishDate).getTime() - new Date(a.frontmatter.publishDate).getTime());
}

export function getCategories(): Category[] {
  const resources = getAllResources();
  const catMap = new Map<string, number>();

  const iconMap: Record<string, string> = {
    software: '💻',
    video: '🎬',
    music: '🎵',
    book: '📚',
    image: '🖼️',
    game: '🎮',
    course: '📖',
    tool: '🔧',
    design: '🎨',
    other: '📦',
  };

  for (const r of resources) {
    const cat = r.frontmatter.category;
    catMap.set(cat, (catMap.get(cat) || 0) + 1);
  }

  return Array.from(catMap.entries()).map(([name, count]) => ({
    name,
    slug: name,
    count,
    icon: iconMap[name] || '📦',
  }));
}

export function getHotResources(): { frontmatter: ResourceFrontmatter; url: string }[] {
  return getAllResources().filter((r) => r.frontmatter.popular).slice(0, 8);
}

export function getRecommendedResources(): { frontmatter: ResourceFrontmatter; url: string }[] {
  return getAllResources().filter((r) => r.frontmatter.recommended).slice(0, 8);
}

export function getLatestResources(limit = 12): { frontmatter: ResourceFrontmatter; url: string }[] {
  return getAllResources().slice(0, limit);
}

export function getResourcesByCategory(slug: string): { frontmatter: ResourceFrontmatter; url: string }[] {
  return getAllResources().filter((r) => r.frontmatter.category === slug);
}