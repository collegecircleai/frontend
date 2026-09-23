"use client";

import { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";

type ThemedImageProps = Omit<ImageProps, "src"> & {
  lightSrc: string;
  darkSrc?: string;
};

export default function ThemedImage({
  lightSrc,
  darkSrc,
  alt,
  ...rest
}: ThemedImageProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      const dataTheme = root.getAttribute("data-theme");
      const hasDarkClass = root.classList.contains("dark");

      setIsDark(dataTheme === "dark" || hasDarkClass);
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    return () => observer.disconnect();
  }, []);

  const src = isDark && darkSrc ? darkSrc : lightSrc;

  return <Image src={src} alt={alt} {...rest} />;
}
