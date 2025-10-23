import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import confetti from "canvas-confetti";
import { RotateCcw } from "lucide-react";

const PRIZES = [
  "Un mes adicional en tu membresía",
  "Diagnostico y limpieza + Escaneo Digital (Dental Center)",
  "Day Pass para 2 invitados en Phisique",
  "Three Day Pass para una persona de tu elección",
  "Un mes adicional a tu membresía",
  "Evaluación Checkup para tu persona favorita",
  "Diagnostico y limpieza + Escaneo Digital (Dental Center)",
  "Three Day Pass para una persona de tu elección",
];

const COLORS = [
  "#909599",
  "#2D3748",
  "#909599",
  "#1a1a2e",
  "#909599",
  "#2D3748",
  "#909599",
  "#1a1a2e",
];

function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);
  const [wheelSize, setWheelSize] = useState(600);
  const wheelRef = useRef<SVGSVGElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(
    typeof Audio !== "undefined" ? new Audio("/win.mp3") : null
  );

  // 🔹 Ajustar tamaño dinámicamente según el ancho de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 400) setWheelSize(250);
      else if (window.innerWidth < 640) setWheelSize(320);
      else if (window.innerWidth < 1024) setWheelSize(450);
      else setWheelSize(600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const center = wheelSize / 2;
  const radius = wheelSize / 2 - 40;

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedPrize(null);

    const randomIndex = 0;
    const sectionAngle = 360 / PRIZES.length;
    const prizeCenterAngle = randomIndex * sectionAngle + sectionAngle / 2;
    const pointerAngle = 270;
    const desiredLandingAngle = pointerAngle - prizeCenterAngle;
    const spins = 15;
    const finalAngle =
      spins * 360 + ((desiredLandingAngle % 360) + 360) % 360;

    gsap.to(wheelRef.current, {
      rotation: finalAngle,
      transformOrigin: `${center}px ${center}px`,
      duration: 10,
      ease: "power4.inOut",
      onComplete: () => {
        setIsSpinning(false);
        setSelectedPrize(PRIZES[0]);
        winSound.current?.play();
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
      },
    });
  };

  const resetWheel = () => {
    if (isSpinning) return;
    gsap.to(wheelRef.current, { rotation: 0, duration: 1, ease: "power2.inOut" });
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
      const textRadius = radius * 0.7;
      const textX = center + textRadius * Math.cos(textAngleRad);
      const textY = center + textRadius * Math.sin(textAngleRad);

      return (
        <g key={index}>
          <path d={pathData} fill={COLORS[index]} stroke="#fff" strokeWidth="3" />
          <text
            x={textX}
            y={textY}
            fill="white"
            fontSize={wheelSize < 400 ? "8" : "12"}
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${textAngle}, ${textX}, ${textY})`}
          >
            <tspan x={textX} dy="-0.5em">
              {prize.split(" ").slice(0, 4).join(" ")}
            </tspan>
            <tspan x={textX} dy="1.2em">
              {prize.split(" ").slice(4).join(" ")}
            </tspan>
          </text>
        </g>
      );
    });
  };

  return (
    <div
      className="min-h-screen bg-[#909599] flex items-center justify-center p-4"
      style={{
        backgroundImage:
          "url(https://www.phisiqueclub.com/wp-content/uploads/2023/11/LAMINA-3-scaled.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="backdrop-blur-xs rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-7xl border border-white/40 shadow-lg drop-shadow-2xl">
        <div className="text-center mb-8 flex flex-col items-center justify-center">
          <img src="/title.png" className="w-40 sm:w-48 md:w-56 h-auto" alt="title" />
          <p className="text-white text-base sm:text-lg font-bold mt-2">
            ¡Gira la ruleta y gana increíbles premios!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* 🎯 Ruleta */}
          <div className="relative flex-shrink-0 scale-130 sm:scale-100">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-5 z-20">
              <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-[#AA182C]"></div>
              <div className="w-7 h-7 bg-[#AA182C] rounded-full absolute -top-3 left-1/2 transform -translate-x-1/2 border-4 border-white"></div>
            </div>

            <svg
              ref={wheelRef}
              width={wheelSize}
              height={wheelSize}
              className="drop-shadow-2xl"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#AA182C" />
                  <stop offset="100%" stopColor="#AA182C" />
                </linearGradient>
              </defs>

              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="20"
              />

              {createWheelSections()}

              <circle
                cx={center}
                cy={center}
                r={wheelSize * 0.06}
                fill="url(#gradient)"
                stroke="#fff"
                strokeWidth="4"
              />
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white">
              <img
                src="/logo.jpg"
                className="w-12 sm:w-20 md:w-24 h-auto rounded-full"
                alt="logo"
              />
            </div>
          </div>

          {/* 📋 Panel derecho */}
          <div className="flex flex-col items-center lg:items-start space-y-4 w-full lg:w-[450px]">
            <div className="flex flex-col sm:flex-row w-full gap-3">
              <button
                onClick={spinWheel}
                disabled={isSpinning}
                className="bg-[#1a1a2e] text-white px-6 py-3 rounded-2xl font-bold text-base sm:text-lg hover:scale-105 transform transition-all duration-200 w-full disabled:opacity-50"
              >
                {isSpinning ? "Girando..." : "¡GIRAR LA RULETA!"}
              </button>

              <button
                onClick={resetWheel}
                disabled={isSpinning}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-5 py-3 rounded-2xl font-semibold w-full flex items-center justify-center gap-2 hover:scale-105 transform transition-all duration-200 disabled:opacity-50"
              >
                <RotateCcw size={20} /> Reiniciar
              </button>
            </div>

            {selectedPrize && !isSpinning && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 sm:p-6 rounded-3xl shadow-2xl border-2 border-yellow-300 w-full text-center animate-pulse">
                <div className="text-3xl sm:text-4xl mb-2">🎉</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  ¡FELICITACIONES!
                </h3>
                <p className="text-base sm:text-xl font-black">{selectedPrize}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
