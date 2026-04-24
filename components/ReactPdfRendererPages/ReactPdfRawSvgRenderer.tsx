import React from 'react';
import { Svg, Rect, Line, Text, Tspan, G } from '@react-pdf/renderer';

interface ReactPdfRawSvgRendererProps {
  svgString: string;
}

export const ReactPdfRawSvgRenderer: React.FC<ReactPdfRawSvgRendererProps> = ({ svgString }) => {
  if (!svgString) return null;

  // Pre-process raw svg (cleaning up)
  let cleanedSvg = svgString.trim();
  if (cleanedSvg.startsWith('"') && cleanedSvg.endsWith('"')) {
    try {
      cleanedSvg = JSON.parse(cleanedSvg);
    } catch {
      /* ignore */
    }
  }
  
  // Extract viewBox or default to 300 300
  const viewBoxMatch = cleanedSvg.match(/viewBox="([^"]+)"/) || cleanedSvg.match(/width="(\d+)"\s*height="(\d+)"/);
  const viewBox = viewBoxMatch && viewBoxMatch[1] && viewBoxMatch[1].includes(' ') 
    ? viewBoxMatch[1] 
    : `0 0 ${viewBoxMatch ? viewBoxMatch[1] : 300} ${viewBoxMatch ? viewBoxMatch[2] : 300}`;

  // Parse CSS string to object map
  const parseStyle = (styleStr: string | undefined) => {
    if (!styleStr) return {};
    return styleStr.split(';').reduce((acc, rule) => {
      const [key, value] = rule.split(':').map(str => str.trim());
      if (key && value) {
        const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        acc[camelKey] = value;
      }
      return acc;
    }, {} as Record<string, string>);
  };

  // 1. Map <rect>
  const rects = [...cleanedSvg.matchAll(/<rect([^>]+)\/?>/g)].map((m, i) => {
    const attrs = m[1];
    const x = attrs.match(/x="([^"]+)"/)?.[1];
    const y = attrs.match(/y="([^"]+)"/)?.[1];
    const width = attrs.match(/width="([^"]+)"/)?.[1];
    const height = attrs.match(/height="([^"]+)"/)?.[1];
    const fill = attrs.match(/fill="([^"]+)"/)?.[1];
    const stroke = attrs.match(/stroke="([^"]+)"/)?.[1];
    const strokeWidth = attrs.match(/stroke-width="([^"]+)"/)?.[1];
    const transform = attrs.match(/transform="([^"]+)"/)?.[1];
    
    return (
      <Rect 
        key={`rect-${i}`}
        x={x || "0"} y={y || "0"} 
        width={width || "0"} height={height || "0"} 
        fill={fill || "none"} 
        stroke={stroke} 
        strokeWidth={strokeWidth} 
        transform={transform} 
      />
    );
  });

  // 2. Map <line>
  const lines = [...cleanedSvg.matchAll(/<line([^>]+)\/?>/g)].map((m, i) => {
    const attrs = m[1];
    const x1 = attrs.match(/x1="([^"]+)"/)?.[1];
    const y1 = attrs.match(/y1="([^"]+)"/)?.[1];
    const x2 = attrs.match(/x2="([^"]+)"/)?.[1];
    const y2 = attrs.match(/y2="([^"]+)"/)?.[1];
    
    const styleStr = attrs.match(/style="([^"]+)"/)?.[1];
    const style = parseStyle(styleStr);
    
    const stroke = attrs.match(/stroke="([^"]+)"/)?.[1] || style.stroke || "black";
    const strokeWidth = attrs.match(/stroke-width="([^"]+)"/)?.[1] || style.strokeWidth || 1;
    
    return (
      <Line 
        key={`line-${i}`}
        x1={x1 || "0"} y1={y1 || "0"} x2={x2 || "0"} y2={y2 || "0"} 
        stroke={stroke} 
        strokeWidth={strokeWidth} 
      />
    );
  });

  // 3. Map <text> to a single <Text> node, stripping all <tspan> to prevent xAdvance crash
  const texts = [...cleanedSvg.matchAll(/<text([^>]*)>([\s\S]*?)<\/text>/g)].map((m, i) => {
    const attrs = m[1];
    const innerHtml = m[2];
    
    // Strip all internal XML/HTML tags (like <tspan>) to get pure text content
    const pureText = innerHtml.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!pureText) return null;
    
    const x = attrs.match(/x="([^"]+)"/)?.[1];
    const y = attrs.match(/y="([^"]+)"/)?.[1];
    
    const styleStr = attrs.match(/style="([^"]+)"/)?.[1];
    const styleObj = parseStyle(styleStr);
    const fill = attrs.match(/fill="([^"]+)"/)?.[1] || styleObj.fill || "black";
    const fontSize = styleObj.fontSize ? parseInt(styleObj.fontSize) : 11;
    
    return (
      <Text 
        key={`text-${i}`} 
        x={x || "0"} y={y || "0"} 
        fill={fill}
        style={{ fontSize, fontWeight: styleObj.fontWeight || "normal" } as any}
      >
        {pureText}
      </Text>
    );
  }).filter(Boolean);

  return (
    <Svg viewBox={viewBox} width="100%" height="100%">
      {rects}
      {lines}
      {texts}
    </Svg>
  );
};

export default ReactPdfRawSvgRenderer;
