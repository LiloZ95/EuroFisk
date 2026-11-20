import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  // A CMS replacement must retry the new image, even after a previous request failed.
  return <ResolvedImage key={`${props.src ?? ""}\n${props.fallbackSrc ?? ""}`} {...props} />;
}

function ResolvedImage({ src, fallbackSrc, onError, ...props }: ImageWithFallbackProps) {
  const [attempt, setAttempt] = useState(0);
  const sources = [...new Set([src, fallbackSrc, ERROR_IMG_SRC].filter((value): value is string => Boolean(value)))];
  const currentSrc = sources[Math.min(attempt, sources.length - 1)];

  return (
    <img
      {...props}
      src={currentSrc}
      onError={(event) => {
        onError?.(event);
        // Stop at the placeholder if both the CMS photo and its backup fail.
        setAttempt((current) => Math.min(current + 1, sources.length - 1));
      }}
    />
  );
}
