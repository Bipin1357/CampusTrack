import React from 'react';
import logoImg from '../../assets/logo/campustrack-logo.png';

export default function Logo({
  className = '',
  height,
  width,
  alt = 'CampusTrack Logo',
  style = {},
  ...props
}) {
  const customStyle = { ...style };

  if (height !== undefined) {
    customStyle.height = typeof height === 'number' ? `${height}px` : height;
  }
  if (width !== undefined) {
    customStyle.width = typeof width === 'number' ? `${width}px` : width;
  }

  return (
    <img
      src={logoImg}
      alt={alt}
      className={`object-contain transition-transform select-none shrink-0 ${className}`}
      style={customStyle}
      loading="eager"
      decoding="async"
      {...props}
    />
  );
}
