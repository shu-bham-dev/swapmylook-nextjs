"use client";

import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS, Node } from '@contentful/rich-text-types';
import Link from 'next/link';

interface RichTextRendererProps {
  content: any;
}

// Custom render options for Contentful RichText
const renderOptions: Options = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-bold">{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em className="italic">{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u className="underline">{text}</u>,
    [MARKS.CODE]: (text: React.ReactNode) => (
      <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-sm">{text}</code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: Node, children: React.ReactNode) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: Node, children: React.ReactNode) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: Node, children: React.ReactNode) => (
      <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: Node, children: React.ReactNode) => (
      <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: Node, children: React.ReactNode) => (
      <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (node: Node, children: React.ReactNode) => (
      <h5 className="text-base font-bold mt-3 mb-2">{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (node: Node, children: React.ReactNode) => (
      <h6 className="text-sm font-bold mt-2 mb-1">{children}</h6>
    ),
    [BLOCKS.UL_LIST]: (node: Node, children: React.ReactNode) => (
      <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: Node, children: React.ReactNode) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: Node, children: React.ReactNode) => (
      <li className="mb-1">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: Node, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-pink-500 pl-4 py-2 my-4 italic text-gray-600">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-gray-200" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: Node) => {
      const data = node.data as any;
      const { title, description, file } = data.target?.fields || {};
      const imageUrl = file?.url;
      
      if (!imageUrl) return null;
      
      return (
        <div className="my-6">
          <img
            src={`https:${imageUrl}`}
            alt={title || description || 'Blog image'}
            className="rounded-lg max-w-full h-auto mx-auto"
          />
          {description && (
            <p className="text-sm text-gray-500 text-center mt-2">{description}</p>
          )}
        </div>
      );
    },
    [INLINES.HYPERLINK]: (node: Node, children: React.ReactNode) => {
      const data = node.data as any;
      const uri = data.uri;
      const isExternal = uri?.startsWith('http');
      
      if (!uri) return <>{children}</>;
      
      if (isExternal) {
        return (
          <a
            href={uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700 underline"
          >
            {children}
          </a>
        );
      }
      
      // Handle internal links
      return (
        <Link href={uri} className="text-pink-600 hover:text-pink-700 underline">
          {children}
        </Link>
      );
    },
    [INLINES.ENTRY_HYPERLINK]: (node: Node, children: React.ReactNode) => {
      // Handle entry hyperlinks (links to other Contentful entries)
      return (
        <span className="text-pink-600 hover:text-pink-700 cursor-pointer">
          {children}
        </span>
      );
    },
  },
};

export function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content) {
    return (
      <div className="text-gray-500 italic">
        No content available for this blog post.
      </div>
    );
  }

  try {
    return (
      <div className="rich-text-content">
        {documentToReactComponents(content, renderOptions)}
      </div>
    );
  } catch (error) {
    console.error('Error rendering rich text:', error);
    return (
      <div className="text-gray-500">
        Unable to display content. Please try again later.
      </div>
    );
  }
}

// Fallback renderer for simple text extraction
export function SimpleTextRenderer({ content }: RichTextRendererProps) {
  if (!content || !content.content) return null;
  
  const extractText = (node: any): string => {
    if (node.nodeType === 'text') {
      return node.value || '';
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join('');
    }
    
    return '';
  };
  
  const text = content.content.map(extractText).join(' ');
  
  return (
    <div className="space-y-4">
      {text.split('\n\n').map((paragraph: string, index: number) => (
        <p key={index} className="mb-4 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
}