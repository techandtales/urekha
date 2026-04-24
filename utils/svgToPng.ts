import { useState, useEffect } from "react";

export const DUMMY_SVG = `<svg height="300" width="300" xmlns="http://www.w3.org/2000/svg" style="background-color: white">
          <rect x="0" y="0" width="300" height="300" fill="none" stroke="black" stroke-width="2"/>
          <line x1="0" y1="0" x2="300" y2="300" style="stroke:black;stroke-width:1"/>
          <line x1="300" y1="0" x2="0" y2="300" style="stroke:black;stroke-width:1"/>
          <rect x="45" y="45" width="210" height="210" fill="none" stroke="black" stroke-width="1" transform="rotate(45, 150, 150)"/>
          
          <text x="120" y="78" style="font-family:Arial;font-size:11px;fill:#d22b2b;font-weight:bold">As<tspan baseline-shift="super" style="font-family:'Lucida Sans', sans-serif;fill:#1F222E;font-size:7px\">(29.1)</tspan> Ke<tspan baseline-shift="super" style="font-family:'Lucida Sans', sans-serif;fill:#1F222E;font-size:7px\">(16.1)</tspan></text>
          <text x="42" y="30" style="font-family:Arial;font-size:11px;fill:#d22b2b;font-weight:bold"></text>
          <text x="6" y="78" style="font-family:Arial;font-size:11px;fill:#d22b2b;font-weight:bold">Mo<tspan baseline-shift="super" style="font-family:'Lucida Sans', sans-serif;fill:#1F222E;font-size:7px\">(21.7)</tspan></text>
          <text x="30" y="153" style="font-family:Arial;font-size:11px;fill:#d22b2b;font-weight:bold"></text>
          <text x="6" y="228" style="font-family:Arial;font-size:11px;fill:#d22b2b;font-weight:bold"></text>
          <text x="36" y="270" style="font-family:Arial;font-size:11px;fill:#d22b2b;font-weight:bold">Sa<tspan baseline-shift="super" style="font-family:'Lucida Sans', sans-serif;fill:#1F222E;font-size:7px\">(24.9)</tspan></text>
          <text x="102" y="216" style="font-family:Arial;font-size:11px;fill:#d22b2b;font-weight:bold">Ra<tspan baseline-shift="super" style="font-family:'Lucida Sans', sans-serif;fill:#1F222E;font-size:7px\">(16.1)</tspan></text>
          <text x="186" y="270" style="font-family:Arial;font-size:11px;fill:#d22b2b;font-weight:bold"></text>
          <text x="240" y="234" style="font-family:Arial;font-size:11px;fill:#d22b2b;font-weight:bold">Ma<tspan baseline-shift="super" style="font-family:'Lucida Sans', sans-serif;fill:#1F222E;font-size:7px\">(4.0)</tspan> Ju<tspan baseline-shift="super" style="font-family:'Lucida Sans', sans-serif;fill:#1F222E;font-size:7px\">(17.6)</tspan></text>
          <text x="171" y="153" style="font-family:Arial;font-size:11px;fill:#d22b2b;font-weight:bold"></text>
          <text x="240" y="78" style="font-family:Arial;font-size:11px;fill:#d22b2b;font-weight:bold">Su<tspan baseline-shift="super" style="font-family:'Lucida Sans', sans-serif;fill:#1F222E;font-size:7px\">(2.0)</tspan> Me<tspan baseline-shift="super" style="font-family:'Lucida Sans', sans-serif;fill:#1F222E;font-size:7px\">(28.5)</tspan> Ve<tspan baseline-shift="super" style="font-family:'Lucida Sans', sans-serif;fill:#1F222E;font-size:7px\">(13.9)</tspan></text>
          <text x="186" y="30" style="font-family:Arial;font-size:11px;fill:#d22b2b;font-weight:bold"></text>
          <text x="148" y="140" style="font-family:Arial;font-size:10px;fill:#919191\">6</text>
          <text x="74" y="67" style="font-family:Arial;font-size:10px;fill:#919191\">7</text>
          <text x="63" y="79" style="font-family:Arial;font-size:10px;fill:#919191\">8</text>
          <text x="137" y="153.5" style="font-family:Arial;font-size:10px;fill:#919191\">9</text>
          <text x="63" y="227" style="font-family:Arial;font-size:10px;fill:#919191\">10</text>
          <text x="74" y="237" style="font-family:Arial;font-size:10px;fill:#919191\">11</text>
          <text x="145" y="166" style="font-family:Arial;font-size:10px;fill:#919191\">12</text>
          <text x="220.5" y="238" style="font-family:Arial;font-size:10px;fill:#919191\">1</text>
          <text x="232" y="227" style="font-family:Arial;font-size:10px;fill:#919191\">2</text>
          <text x="158" y="153" style="font-family:Arial;font-size:10px;fill:#919191\">3</text>
          <text x="233" y="79" style="font-family:Arial;font-size:10px;fill:#919191\">4</text>
          <text x="222" y="67" style="font-family:Arial;font-size:10px;fill:#919191\">5</text>
      </svg>`;

export function useSvgToPng(svgString: string | null): string | null {
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!svgString) {
      setPngDataUrl(null);
      return;
    }

    const img = new window.Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const w = img.width || 800;
      const h = img.height || 800;
      canvas.width = w * 2;
      canvas.height = h * 2;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFDF5"; // matching the PDF bg color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPngDataUrl(canvas.toDataURL("image/png", 1.0));
      }
    };

    let finalSvg = svgString;
    if (!finalSvg.includes("width=")) {
      finalSvg = finalSvg.replace("<svg ", '<svg width="600" height="600" ');
    }

    try {
      const svg64 = btoa(unescape(encodeURIComponent(finalSvg)));
      img.src = "data:image/svg+xml;base64," + svg64;
    } catch (e) {
      // fail silently
    }
  }, [svgString]);

  return pngDataUrl;
}

export function useMultipleSvgToPng(
  svgDict: Record<string, any> | null | undefined,
): Record<string, string> {
  const [pngDict, setPngDict] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!svgDict || Object.keys(svgDict).length === 0) {
      setPngDict({});
      return;
    }

    let isMounted = true;
    const newDict: Record<string, string> = {};
    const keys = Object.keys(svgDict);
    let loadedCount = 0;

    keys.forEach((key) => {
      const chartObj = svgDict[key];
      const svgString = typeof chartObj === "object" ? chartObj.svg : chartObj;

      if (!svgString) {
        loadedCount++;
        if (loadedCount === keys.length && isMounted) setPngDict(newDict);
        return;
      }

      const img = new window.Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const w = img.width || 800;
        const h = img.height || 800;
        canvas.width = w * 2;
        canvas.height = h * 2;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.fillStyle = "#FFFDF5"; // matching the PDF bg color
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          newDict[key] = canvas.toDataURL("image/png", 1.0);
        }
        loadedCount++;
        if (loadedCount === keys.length && isMounted) {
          setPngDict({ ...newDict });
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === keys.length && isMounted) {
          setPngDict({ ...newDict });
        }
      };

      let finalSvg = svgString;
      if (typeof finalSvg === "string" && !finalSvg.includes("width=")) {
        finalSvg = finalSvg.replace("<svg ", '<svg width="600" height="600" ');
      }

      try {
        const svg64 = btoa(unescape(encodeURIComponent(finalSvg)));
        img.src = "data:image/svg+xml;base64," + svg64;
      } catch (e) {
        loadedCount++;
        if (loadedCount === keys.length && isMounted) setPngDict(newDict);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [svgDict]);

  return pngDict;
}
