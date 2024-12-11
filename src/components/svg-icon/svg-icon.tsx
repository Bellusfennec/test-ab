import { useState, useEffect } from "react";

interface SvgIconProps {
  name: string;
  width?: number;
  height?: number;
}

export const SvgIcon = ({ name, width = 24, height = 24 }: SvgIconProps) => {
  const [SvgComponent, setSvgComponent] = useState<React.ComponentType<React.SVGProps<SVGSVGElement>> | null>(null);

  const loadSvg = async () => {
    try {
      // Важно добавить ?react к пути импорта
      const svgModule = await import(`../../assets/icons/${name}.svg?react`);
      setSvgComponent(() => svgModule.default);
    } catch (error) {
      console.error(`Error load SVG: ${name}`, error);
    }
  };

  useEffect(() => {
    loadSvg();
  }, [name]);

  if (!SvgComponent) return null;

  return <SvgComponent width={width} height={height} />;
};
