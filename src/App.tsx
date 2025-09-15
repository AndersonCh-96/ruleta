import { useState, useRef } from "react";
import gsap from "gsap";
import { RotateCcw } from "lucide-react";

const PRIZES = [
  "Un mes adicional en tu membresía",
  "Sigue participando",
  "Day Pass para 2 invitados en Phisique",
  "Premio especial de una marca aliada",
  "Three Day Pass para una persona de tu elección",
  "Evaluación Checkup para tu persona favorita",
  "Sigue participando",
  "Premio especial de una marca aliada",
];

const COLORS = [
  "#FF6B6B", // Coral
  "#4ECDC4", // Turquoise
  "#45B7D1", // Blue
  "#96CEB4", // Mint
  "#FECA57", // Yellow
  "#FF9FF3", // Pink
  "#54A0FF", // Light Blue
  "#5F27CD", // Purple
];

function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);
  const wheelRef = useRef<SVGSVGElement | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedPrize(null);

    const randomIndex = Math.floor(Math.random() * PRIZES.length);
    const sectionAngle = 360 / PRIZES.length;
    const prizeStartAngle = randomIndex * sectionAngle;
    const prizeCenterAngle = prizeStartAngle + sectionAngle / 2;

    // Ajuste: el puntero está arriba => 270° en el sistema de rotación
    const pointerAngle = 270;
    const desiredLandingAngle = pointerAngle - prizeCenterAngle;

    const spins = 6; // número de vueltas completas
    const finalAngle =
      spins * 360 + ((desiredLandingAngle % 360) + 360) % 360;

    gsap.to(wheelRef.current, {
      rotation: finalAngle,
      transformOrigin: "250px 250px", // centro del SVG
      duration: 4,
      ease: "power4.inOut",
      onComplete: () => {
        setIsSpinning(false);
        setSelectedPrize(PRIZES[randomIndex]);
      },
    });
  };

  const resetWheel = () => {
    if (isSpinning) return;
    gsap.to(wheelRef.current, {
      rotation: 0,
      duration: 1,
      ease: "power2.inOut",
    });
    setSelectedPrize(null);
  };

  const createWheelSections = () => {
    const sectionAngle = 360 / PRIZES.length;

    return PRIZES.map((prize, index) => {
      const startAngle = index * sectionAngle;
      const endAngle = (index + 1) * sectionAngle;

      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;

      const largeArcFlag = sectionAngle > 180 ? 1 : 0;

      const x1 = 250 + 230 * Math.cos(startAngleRad);
      const y1 = 250 + 230 * Math.sin(startAngleRad);
      const x2 = 250 + 230 * Math.cos(endAngleRad);
      const y2 = 250 + 230 * Math.sin(endAngleRad);

      const pathData = [
        `M 250 250`,
        `L ${x1} ${y1}`,
        `A 230 230 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `Z`,
      ].join(" ");

      const textAngle = startAngle + sectionAngle / 2;
      const textAngleRad = (textAngle * Math.PI) / 180;
      const textRadius = 150;
      const textX = 250 + textRadius * Math.cos(textAngleRad);
      const textY = 250 + textRadius * Math.sin(textAngleRad);

      return (
        <g key={index}>
          <path
            d={pathData}
            fill={COLORS[index]}
            stroke="#ffffff"
            strokeWidth="3"
          />
          <text
            x={textX}
            y={textY}
            fill="white"
            fontSize="13"
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${textAngle}, ${textX}, ${textY})`}
          >
            <tspan x={textX} dy="-0.5em">
              {prize.split(" ").slice(0, 3).join(" ")}
            </tspan>
            <tspan x={textX} dy="1em">
              {prize.split(" ").slice(3).join(" ")}
            </tspan>
          </text>
        </g>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-7xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">PHISIQUE</h1>
          <h1 className="text-4xl font-bold text-white mb-2">
            🎯 Ruleta de Premios
          </h1>
          <p className="text-white/80 text-lg">
            ¡Gira la ruleta y gana increíbles premios!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Ruleta */}
          <div className="relative flex-shrink-0">
            {/* Puntero */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-20">
              <div className="w-0 h-0 border-l-[25px] border-r-[25px] border-b-[50px] border-l-transparent border-r-transparent border-b-yellow-400"></div>
              <div className="w-8 h-8 bg-yellow-400 rounded-full absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-white shadow-lg"></div>
            </div>

            {/* SVG de la ruleta */}
            <svg
              ref={wheelRef}
              width="500"
              height="500"
              className="drop-shadow-2xl"
            >
              <circle
                cx="250"
                cy="250"
                r="240"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="10"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
              </defs>
              {createWheelSections()}
              <circle
                cx="250"
                cy="250"
                r="30"
                fill="url(#gradient)"
                stroke="#ffffff"
                strokeWidth="5"
              />
              <text
                x="250"
                y="260"
                fill="white"
                fontSize="24"
                textAnchor="middle"
                className="font-bold"
              >
                🎊
              </text>
            </svg>
          </div>

          {/* Panel derecho */}
          <div className="flex flex-col items-center lg:items-start space-y-6 min-w-[350px]">
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg transition-all duration-200 w-full disabled:opacity-50"
            >
              {isSpinning ? "Girando..." : "¡GIRAR LA RULETA!"}
            </button>

            <button
              onClick={resetWheel}
              disabled={isSpinning}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-200 w-full disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RotateCcw size={24} /> Reiniciar Ruleta
            </button>

            {selectedPrize && !isSpinning && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-3xl shadow-2xl border-2 border-yellow-300 w-full text-center animate-pulse">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-4">¡FELICITACIONES!</h3>
                <p className="text-xl font-black">{selectedPrize}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
