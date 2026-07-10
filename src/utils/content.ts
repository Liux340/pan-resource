import { getCollection } from 'astro:content';
import type { ResourceFrontmatter, Category } from '../types/resource';

export async function getAllResources() {
  const entries = await getCollection('resources');
  return entries
    .map((entry) => ({
      frontmatter: entry.data as unknown as ResourceFrontmatter,
      url: `/resource/${entry.data.slug}`,
    }))
    .sort((a, b) => new Date(b.frontmatter.publishDate).getTime() - new Date(a.frontmatter.publishDate).getTime());
}

export async function getCategories(): Promise<Category[]> {
  const resources = await getAllResources();
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

export async function getHotResources() {
  const all = await getAllResources();
  return all.filter((r) => r.frontmatter.popular).slice(0, 8);
}

export async function getRecommendedResources() {
  const all = await getAllResources();
  return all.filter((r) => r.frontmatter.recommended).slice(0, 8);
}

export async function getLatestResources(limit = 12) {
  const all = await getAllResources();
  return all.slice(0, limit);
}

export async function getResourcesByCategory(slug: string) {
  const all = await getAllResources();
  return all.filter((r) => r.frontmatter.category === slug);
}