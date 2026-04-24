"use client";

import React, { useEffect, useRef } from "react";

export default function KundliAnimation() {
  const starfieldRef = useRef<SVGGElement>(null);
  const outerRingRef = useRef<SVGGElement>(null);
  const middleRingRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (
      !starfieldRef.current ||
      !outerRingRef.current ||
      !middleRingRef.current
    )
      return;

    // --- Generate Starfield ---
    const starfield = starfieldRef.current;
    starfield.innerHTML = "";
    const stars: { x: number; y: number }[] = [];
    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * 1000;
      const y = (Math.random() - 0.5) * 1000;
      const r = Math.random() * 1.5;
      stars.push({ x, y });
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("r", r.toString());
      circle.setAttribute("fill", i % 4 === 0 ? "#00E5FF" : "#FFF");
      circle.style.opacity = "0";
      circle.style.animation = `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 5}s alternate forwards`;
      starfield.appendChild(circle);
    }

    // --- Generate Zodiac Symbols ---
    const zodiacs = [
      "♈",
      "♉",
      "♊",
      "♋",
      "♌",
      "♍",
      "♎",
      "♏",
      "♐",
      "♑",
      "♒",
      "♓",
    ];
    const outerRing = outerRingRef.current;
    outerRing.innerHTML = "";

    // Background circles for outer ring
    const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c1.setAttribute("r", "420");
    c1.setAttribute("stroke", "rgba(0, 229, 255, 0.15)");
    c1.setAttribute("stroke-width", "1");
    c1.setAttribute("fill", "none");
    outerRing.appendChild(c1);

    const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c2.setAttribute("r", "380");
    c2.setAttribute("stroke", "rgba(0, 229, 255, 0.3)");
    c2.setAttribute("stroke-width", "1.5");
    c2.setAttribute("stroke-dasharray", "4 12");
    c2.setAttribute("fill", "none");
    outerRing.appendChild(c2);

    zodiacs.forEach((symbol, i) => {
      const angle = i * 30 * (Math.PI / 180);
      const x = 400 * Math.cos(angle);
      const y = 400 * Math.sin(angle);
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("x", x.toString());
      text.setAttribute("y", y.toString());
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("fill", "#00E5FF");
      text.setAttribute("font-size", "22");
      text.setAttribute("transform", `rotate(${i * 30 + 90}, ${x}, ${y})`);
      text.textContent = symbol;
      outerRing.appendChild(text);
    });

    // --- Generate Middle Ring (Planetary Nodes) ---
    const middleRing = middleRingRef.current;
    middleRing.innerHTML = "";

    const c3 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c3.setAttribute("r", "320");
    c3.setAttribute("stroke", "rgba(255, 215, 0, 0.2)");
    c3.setAttribute("stroke-width", "1.5");
    c3.setAttribute("fill", "none");
    middleRing.appendChild(c3);

    const c4 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c4.setAttribute("r", "290");
    c4.setAttribute("stroke", "rgba(255, 215, 0, 0.05)");
    c4.setAttribute("stroke-width", "15");
    c4.setAttribute("fill", "none");
    middleRing.appendChild(c4);

    const planets = ["☉", "☽", "♂", "☿", "♃", "♀", "♄", "☊", "☋"];
    planets.forEach((symbol, i) => {
      const angle = i * 40 * (Math.PI / 180);
      const x = 320 * Math.cos(angle);
      const y = 320 * Math.sin(angle);

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("r", "14");
      circle.setAttribute("fill", "#0B0914");
      circle.setAttribute("stroke", "#FFD700");
      circle.setAttribute("stroke-width", "1.5");
      middleRing.appendChild(circle);

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.setAttribute("x", x.toString());
      text.setAttribute("y", y.toString());
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("fill", "#FFD700");
      text.setAttribute("font-size", "14");
      text.setAttribute("transform", `rotate(${i * 40 + 90}, ${x}, ${y})`);
      text.textContent = symbol;
      middleRing.appendChild(text);
    });
  }, []);

  return (
    <div className="relative w-full max-w-2xl aspect-square p-4 mb-2 md:mb-8 pointer-events-none select-none">
      <svg viewBox="0 0 1000 1000" className="w-full h-full drop-shadow-2xl">
        <defs>
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g transform="translate(500, 500)">
          <g ref={starfieldRef} id="starfield"></g>

          <g ref={outerRingRef} className="spin-slow" id="outer-ring"></g>
          <g
            ref={middleRingRef}
            className="spin-medium-rev"
            id="middle-ring"
          ></g>

          <g className="spin-fast" id="inner-ring">
            <circle
              r="240"
              stroke="rgba(0, 229, 255, 0.2)"
              strokeWidth="1"
              strokeDasharray="2 8"
              fill="none"
            />
            <circle
              r="215"
              stroke="rgba(255, 215, 0, 0.4)"
              strokeWidth="1"
              fill="none"
            />
          </g>

          {/* North Indian Kundli Chart */}
          <g
            className="kundli-glow"
            stroke="#FFD700"
            strokeWidth="2.5"
            fill="none"
            filter="url(#gold-glow)"
          >
            <rect
              x="-150"
              y="-150"
              width="300"
              height="300"
              pathLength="100"
              className="draw-line"
            />
            <line
              x1="-150"
              y1="-150"
              x2="150"
              y2="150"
              pathLength="100"
              className="draw-line"
              style={{ animationDelay: "0.5s" }}
            />
            <line
              x1="150"
              y1="-150"
              x2="-150"
              y2="150"
              pathLength="100"
              className="draw-line"
              style={{ animationDelay: "0.5s" }}
            />
            <polygon
              points="0,-150 150,0 0,150 -150,0"
              pathLength="100"
              className="draw-line"
              style={{ animationDelay: "1.2s" }}
            />
          </g>

          {/* Pulsing Central Bindu */}
          <circle cx="0" cy="0" r="3" fill="#FFF" filter="url(#cyan-glow)">
            <animate
              attributeName="r"
              values="3; 8; 3"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8; 1; 0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  );
}
