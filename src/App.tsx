import { useState, useRef } from "react";
import gsap from "gsap";
import { RotateCcw } from "lucide-react";

const PRIZES = [
  "Un mes adicional en tu membresía",
  "Diagnostico y limpieza + Escaneo Digital (Dental Center)",
  "Day Pass para 2 invitados en Phisique",
  "Three Day Pass para una persona de tu elección.",
  "Un mes adicional a tu membresía.",
  "Evaluación Checkup para tu persona favorita.",
  "Diagnostico y limpieza + Escaneo Digital (Dental Center)",
  "Three Day Pass para una persona de tu elección.",
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

  // Configuración de tamaño escalable
  const wheelSize = 600; // tamaño del SVG
  const center = wheelSize / 2;
  const radius = 280;

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

    const spins = 7; // número de vueltas completas
    const finalAngle =
      spins * 360 + ((desiredLandingAngle % 360) + 360) % 360;

    gsap.to(wheelRef.current, {
      rotation: finalAngle,
      transformOrigin: `${center}px ${center}px`,
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

      const x1 = center + radius * Math.cos(startAngleRad);
      const y1 = center + radius * Math.sin(startAngleRad);
      const x2 = center + radius * Math.cos(endAngleRad);
      const y2 = center + radius * Math.sin(endAngleRad);

      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `Z`,
      ].join(" ");

      const textAngle = startAngle + sectionAngle / 2;
      const textAngleRad = (textAngle * Math.PI) / 180;
      const textRadius = 190; // distancia del texto al centro
      const textX = center + textRadius * Math.cos(textAngleRad);
      const textY = center + textRadius * Math.sin(textAngleRad);

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
    <div className="min-h-screen bg-[#909599] flex items-center justify-center p-4">
      <div className="backdrop-blur-lg rounded-3xl p-8 max-w-8xl w-full">
        <div className="text-center mb-8 flex flex-col items-center justify-center">
          <div>
            <img src="/title.png" className="w-50 h-20" alt="" />
          </div>
          {/* <h1 className="text-4xl font-bold text-white mb-2">
            Ruleta de Premios
          </h1> */}
          <p className="text-white/80 text-lg">
            ¡Gira la ruleta y gana increíbles premios!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Ruleta */}
          <div className="relative flex-shrink-0">
            {/* Puntero */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-5 z-20">
              <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-t-[60px] border-l-transparent border-r-transparent border-t-[#AA182C]"></div>
              <div className="w-9 h-9 bg-yellow-400 rounded-full absolute -top-4 left-1/2 transform -translate-x-1/2 border-4 border-white shadow-lg"></div>
            </div>

            {/* SVG de la ruleta */}
            <svg
              ref={wheelRef}
              width={wheelSize}
              height={wheelSize}
              className="drop-shadow-2xl"
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="24"
              />

              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#AA182C" />
                  <stop offset="100%" stopColor="#AA182C" />
                </linearGradient>
              </defs>

              {createWheelSections()}

              <circle
                cx={center}
                cy={center}
                r="35"
                fill="url(#gradient)"
                stroke="#ffffff"
                strokeWidth="6"
              />
            </svg>

            {/* Logo central */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white">
              <img
                src="/logo.jpg"
                className="w-24 h-24 rounded-full"
                alt=""
              />
            </div>
          </div>

          {/* Panel derecho */}
          <div className="flex flex-col items-center lg:items-start space-y-2 min-w-[350px]">
            <div className="flex flex-row w-full gap-2">
              <button
                onClick={spinWheel}
                disabled={isSpinning}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg transition-all duration-200 w-full disabled:opacity-50 cursor-pointer"
              >
                {isSpinning ? "Girando..." : "¡GIRAR LA RULETA!"}
              </button>

              <button
                onClick={resetWheel}
                disabled={isSpinning}
                className="bg-gradient-to-r cursor-pointer from-gray-600 to-gray-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-200 w-full disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RotateCcw size={24} /> Reiniciar Ruleta
              </button>
            </div>

            {selectedPrize && !isSpinning && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-3xl shadow-2xl border-2 border-yellow-300 w-full text-center animate-pulse ">
                <div className="text-4xl mb-2">🎉</div>
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
