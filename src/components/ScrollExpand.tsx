'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollExpandProps {
  src?: string;
  mediaZoom?: number;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function ScrollExpand({
  src,
  style,
  children
}: ScrollExpandProps) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={style}>
      {src && (
        <img
          src={src}
          alt="Expand media"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
        {children}
      </div>
    </div>
  );
}
