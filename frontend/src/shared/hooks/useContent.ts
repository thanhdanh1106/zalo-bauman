import { JSONContent } from '@tiptap/core';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function extractTOC(json: JSONContent): TOCItem[] {
  const toc: TOCItem[] = [];

  const walk = (nodes?: JSONContent[]) => {
    if (!nodes) return;
    for (const node of nodes) {
      if (node.type === 'heading') {
        const text = node.content?.map((n) => n.text || '').join('') || '';
        const slug = text.toLowerCase().replace(/\s+/g, '-');
        toc.push({
          id: slug,
          text,
          level: node.attrs?.level || 1,
        });
      }
      if (node.content) walk(node.content);
    }
  };

  walk(json.content);
  return toc;
}