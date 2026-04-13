import { useState } from "react";

type Props = {
  src: string;
  alt: string;
};

export const ImageZoom = ({ src, alt }: Props) => {
  const [pos, setPos] = useState({ x: 50, y: 50, show: false });

  return (
    <div
      className="relative w-full overflow-hidden rounded-md bg-white"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPos({ x, y, show: true });
      }}
      onMouseLeave={() => setPos((p) => ({ ...p, show: false }))}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full block"
      />

      {pos.show && (
        <div
          className="absolute pointer-events-none border border-white rounded-full w-40 h-40 shadow-lg"
          style={{
            top: `calc(${pos.y}% - 80px)`,
            left: `calc(${pos.x}% - 80px)`,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "220%",
            backgroundPosition: `${pos.x}% ${pos.y}%`,
          }}
        />
      )}
    </div>
  );
};