import React, { useEffect, useRef } from 'react';

const Globe3D = () => {
  const globeRef = useRef(null);
  
  const characters = [
    "A", "Ж", "م", "你", "日", "한", "क", "த", "ע", "Γ", "ค", "Б", "文", "ا", "ヲ", "ㄱ", "د",
    "α", "ב", "ñ", "ü", "ø", "ß", "ç", "é", "ö", "ä", "ã", "õ", "ı", "ğ", "ş",
    "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я", "ё", "ђ", "ј", "љ", "њ", "ћ", "џ", "အ",
    "ဗ", "စ", "ဒ", "ဖ", "ဂ", "ဟ", "ဇ", "က", "လ", "မ", "န", "ပ", "ြ"
  ];

  useEffect(() => {
    let animationId;
    let rotation = 0;

    const animate = () => {
      rotation += 0.5;
      if (globeRef.current) {
        globeRef.current.style.transform = `rotateX(15deg) rotateY(${rotation}deg)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Generate sphere coordinates for characters
  const generateSpherePositions = () => {
    const positions = [];
    const radius = 100;
    
    for (let i = 0; i < characters.length; i++) {
      // Use golden ratio for even distribution
      const phi = Math.acos(1 - 2 * (i + 0.5) / characters.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions.push({ x, y, z, phi, theta });
    }
    
    return positions;
  };

  const positions = generateSpherePositions();

  return (
    <div className="w-full h-96 flex justify-center items-center">
      <div
        ref={globeRef}
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          width: '300px',
          height: '300px',
          perspective: '1000px'
        }}
      >
        {characters.map((char, index) => {
          const pos = positions[index];
          const scale = (pos.z + 150) / 300; // Scale based on z-position for depth
          
          return (
            <div
              key={index}
              className="absolute text-primary-content font-bold select-none"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px) translate(-50%, -50%)`,
                fontSize: `${16 + scale * 8}px`,
                opacity: 0.6 + scale * 0.4,
                zIndex: Math.floor(pos.z + 150)
              }}
            >
              {char}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Globe3D;