import { format } from 'date-fns';
import { marked } from 'marked';

// Format date for display
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Unknown date';
  }
}

// Convert markdown to HTML
export function markdownToHtml(markdown: string): string {
  try {
    return marked(markdown);
  } catch (error) {
    return markdown;
  }
}

// Truncate text to specified length
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

// Generate excerpt from content
export function generateExcerpt(content: string, length: number = 150): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1') // Remove bold/italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
    .replace(/