import React from 'react';

const GoldenWheelSVG: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
      <defs>
        {/* Reusable Hexagon with Inner Lines */}
        <g id="hex">
          <polygon points="0,-35 30.31,-17.5 30.31,17.5 0,35 -30.31,17.5 -30.31,-17.5" stroke="#FDBA6B" fill="none" strokeWidth={2.5} />
          <line x1="0" y1="-35" x2="0" y2="35" stroke="#FDBA6B" strokeWidth={1} />
          <line x1="-30.31" y1="-17.5" x2="30.31" y2="17.5" stroke="#FDBA6B" strokeWidth={1} />
          <line x1="-30.31" y1="17.5" x2="30.31" y2="-17.5" stroke="#FDBA6B" strokeWidth={1} />
        </g>

        {/* Reusable Small Star */}
        <g id="star">
          <polygon points="0,-6 2,-2 6,0 2,2 0,6 -2,2 -6,0 -2,-2" fill="#FDE6C5" />
        </g>

        {/* Moon Phases */}
        <g id="moon-top">
          <circle cx="0" cy="0" r="12" fill="#FFF9E6" stroke="#FDBA6B" strokeWidth={2.5} />
          <path d="M 0,-12 A 12,12 0 0,1 0,12 Z" fill="#11151A" />
        </g>
        <g id="moon-right">
          <circle cx="0" cy="0" r="12" fill="#FFF9E6" stroke="#FDBA6B" strokeWidth={2.5} />
          <path d="M -12,0 A 12,12 0 0,0 12,0 Z" fill="#11151A" />
        </g>
        <g id="moon-bottom">
          <circle cx="0" cy="0" r="12" fill="#FFF9E6" stroke="#FDBA6B" strokeWidth={2.5} />
          <path d="M 0,-12 A 12,12 0 0,0 0,12 Z" fill="#11151A" />
        </g>
        <g id="moon-left">
          <circle cx="0" cy="0" r="12" fill="#FFF9E6" stroke="#FDBA6B" strokeWidth={2.5} />
          <path d="M -12,0 A 12,12 0 0,0 12,0 Z" fill="#11151A" />
        </g>
      </defs>

      {/* Background (Transparent) */}
      <rect width="100%" height="100%" fill="none" />

      {/* Main Container Centered */}
      <g transform="translate(400, 500)">
        
        {/* Faint Background Grids & Dots */}
        <g stroke="#FDE6C5" fill="none" strokeWidth={1} strokeDasharray="4 12">
          <line x1="0" y1="-450" x2="0" y2="450" />
          <line x1="-350" y1="0" x2="350" y2="0" />
          <line x1="-300" y1="-300" x2="300" y2="300" />
          <line x1="-300" y1="300" x2="300" y2="-300" />
        </g>
        
        {/* Faint Background Circles */}
        <circle cx="0" cy="0" r="390" stroke="#FDE6C5" fill="none" strokeWidth={1} strokeDasharray="2 4" />
        <circle cx="0" cy="0" r="410" stroke="#FDE6C5" fill="none" strokeWidth={1} strokeDasharray="2 4" />

        {/* Outer Decorative Dots */}
        <circle cx="0" cy="-450" r="4" fill="#FDE6C5" />
        <circle cx="0" cy="450" r="4" fill="#FDE6C5" />
        <circle cx="-350" cy="0" r="4" fill="#FDE6C5" />
        <circle cx="350" cy="0" r="4" fill="#FDE6C5" />
        
        {/* Inner Decorative Dots & Stars */}
        <use href="#star" x="-200" y="-300" />
        <use href="#star" x="200" y="-300" />
        <use href="#star" x="-200" y="300" />
        <use href="#star" x="200" y="300" />
        <circle cx="-250" cy="-150" r="2" fill="#FDE6C5" />
        <circle cx="250" cy="-150" r="2" fill="#FDE6C5" />
        <circle cx="-250" cy="150" r="2" fill="#FDE6C5" />
        <circle cx="250" cy="150" r="2" fill="#FDE6C5" />
        
        {/* Hexagons */}
        <use href="#hex" x="0" y="-385" />
        <use href="#hex" x="0" y="385" />

        {/* Large Outer Triangle */}
        <g>
          <polygon points="0,-310 330,225 -330,225" stroke="#FDBA6B" fill="none" strokeWidth={4} />
          <polygon points="0,-285 295,205 -295,205" stroke="#FDBA6B" fill="none" strokeWidth={1} />
          
          <line x1="0" y1="-320" x2="0" y2="-345" stroke="#FDBA6B" strokeWidth={2.5} />
          <line x1="0" y1="-335" x2="-10" y2="-335" stroke="#FDBA6B" strokeWidth={1} />
          <line x1="0" y1="-335" x2="10" y2="-335" stroke="#FDBA6B" strokeWidth={1} />
          
          <line x1="345" y1="235" x2="365" y2="245" stroke="#FDBA6B" strokeWidth={2.5} />
          <line x1="350" y1="230" x2="355" y2="245" stroke="#FDBA6B" strokeWidth={1} />
          
          <line x1="-345" y1="235" x2="-365" y2="245" stroke="#FDBA6B" strokeWidth={2.5} />
          <line x1="-350" y1="230" x2="-355" y2="245" stroke="#FDBA6B" strokeWidth={1} />
        </g>

        {/* Side Outer Arcs */}
        <path d="M -260,-130 A 300 300 0 0 0 -260,130" stroke="#FDBA6B" fill="none" strokeWidth={4} />
        <path d="M 260,-130 A 300 300 0 0 1 260,130" stroke="#FDBA6B" fill="none" strokeWidth={4} />

        {/* Concentric Circles Outer to Inner */}
        <circle cx="0" cy="0" r="270" stroke="#FDBA6B" fill="none" strokeWidth={1} />
        <circle cx="0" cy="0" r="260" stroke="#FDBA6B" fill="none" strokeWidth={1} strokeDasharray="6 6" />
        <circle cx="0" cy="0" r="245" stroke="#FDBA6B" fill="none" strokeWidth={4} />
        
        <circle cx="0" cy="0" r="220" stroke="#FDBA6B" fill="none" strokeWidth={1} strokeDasharray="2 4" />
        
        {/* Moon Placements */}
        <use href="#moon-top" x="0" y="-220" />
        <use href="#moon-bottom" x="0" y="220" />
        <use href="#moon-left" x="-220" y="0" />
        <use href="#moon-right" x="220" y="0" />

        <circle cx="0" cy="0" r="195" stroke="#FDBA6B" fill="none" strokeWidth={1} />
        
        {/* The 8-Pointed Star (Overlapping Squares) */}
        <g stroke="#FDBA6B" fill="none" strokeWidth={2.5}>
          <rect x="-127.28" y="-127.28" width="254.56" height="254.56" />
          <rect x="-127.28" y="-127.28" width="254.56" height="254.56" transform="rotate(45)" />
        </g>

        {/* Star Connector Lines & Center Focus */}
        <circle cx="0" cy="0" r="127.28" stroke="#FDBA6B" fill="none" strokeWidth={1} />
        <circle cx="0" cy="0" r="105" stroke="#FDBA6B" fill="none" strokeWidth={1} />
        <circle cx="0" cy="0" r="85" stroke="#FDBA6B" fill="none" strokeWidth={2.5} />
        <circle cx="0" cy="0" r="75" stroke="#FDBA6B" fill="none" strokeWidth={1} strokeDasharray="2 4" />

        {/* Central Eye Motif */}
        <path d="M -55,0 A 65 65 0 0 1 55,0 A 65 65 0 0 1 -55,0 Z" stroke="#FDBA6B" fill="none" strokeWidth={2.5} />
        <path d="M -45,0 A 55 55 0 0 1 45,0 A 55 55 0 0 1 -45,0 Z" stroke="#FDBA6B" fill="none" strokeWidth={1} />

        {/* Thick Black Crescents */}
        <path d="M -15,-38 A 45,45 0 0,0 -15,38 A 25,25 0 0,1 -15,-38 Z" fill="#11151A" />
        <path d="M 15,-38 A 45,45 0 0,1 15,38 A 25,25 0 0,0 15,-38 Z" fill="#11151A" />

        {/* Center Pupil */}
        <circle cx="0" cy="0" r="14" fill="#11151A" />
        <circle cx="4" cy="-4" r="3.5" fill="#FFF9E6" />

        {/* Final Small Internal Details */}
        <polygon points="0,-180 -15,-155 15,-155" stroke="#FDBA6B" fill="none" strokeWidth={1} />
        <polygon points="0,180 -15,155 15,155" stroke="#FDBA6B" fill="none" strokeWidth={1} />
        <polygon points="-180,0 -155,-15 -155,15" stroke="#FDBA6B" fill="none" strokeWidth={1} />
        <polygon points="180,0 155,-15 155,15" stroke="#FDBA6B" fill="none" strokeWidth={1} />
        
        <polygon points="-127.28,-127.28 -100,-135 -135,-100" stroke="#FDBA6B" fill="none" strokeWidth={1} />
        <polygon points="127.28,-127.28 100,-135 135,-100" stroke="#FDBA6B" fill="none" strokeWidth={1} />
        <polygon points="-127.28,127.28 -100,135 -135,100" stroke="#FDBA6B" fill="none" strokeWidth={1} />
        <polygon points="127.28,127.28 100,135 135,100" stroke="#FDBA6B" fill="none" strokeWidth={1} />

      </g>
    </svg>
  );
};

export default GoldenWheelSVG;