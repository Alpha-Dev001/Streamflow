import React from 'react';

const LoadingSkeleton = ({
  variant = 'default',
  className = '',
  lines = 3,
  showAvatar = false,
  showThumbnail = false
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-900/40 via-gray-800/30 to-gray-900/40 bg-[length:200%_100%]';
  const animationStyle = {
    animation: 'shimmer 2s ease-in-out infinite',
    backgroundSize: '200% 100%',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.03)'
  };

  const renderDefaultSkeleton = () => (
    <div className={`space-y-3 ${className}`}>
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <div
            className="rounded-full w-10 h-10 border border-white/5"
            style={{
              ...animationStyle,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)'
            }}
          />
          <div className="flex-1 space-y-2">
            <div
              className="h-4 rounded w-3/4 border border-white/5"
              style={{
                ...animationStyle,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 100%)'
              }}
            />
            <div
              className="h-3 rounded w-1/2 border border-white/5"
              style={{
                ...animationStyle,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)'
              }}
            />
          </div>
        </div>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded border border-white/5"
          style={{
            ...animationStyle,
            width: i === lines - 1 ? '75%' : '100%',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.05) 100%)'
          }}
        />
      ))}
    </div>
  );

  const renderCardSkeleton = () => (
    <div className={`glass-card overflow-hidden ${className}`}>
      {showThumbnail && (
        <div
          className={`${baseClasses} aspect-video`}
          style={animationStyle}
        />
      )}
      <div className="p-4">
        {showAvatar && (
          <div className="flex items-start gap-3 mb-3">
            <div
              className={`${baseClasses} rounded-full w-8 h-8 flex-shrink-0`}
              style={animationStyle}
            />
            <div className="flex-1">
              <div
                className={`${baseClasses} h-4 rounded mb-2`}
                style={animationStyle}
              />
              <div
                className={`${baseClasses} h-3 rounded w-2/3`}
                style={animationStyle}
              />
            </div>
          </div>
        )}
        <div className="space-y-2">
          <div
            className={`${baseClasses} h-4 rounded`}
            style={animationStyle}
          />
          <div
            className={`${baseClasses} h-3 rounded w-3/4`}
            style={animationStyle}
          />
        </div>
      </div>
    </div>
  );

  const renderStreamCardSkeleton = () => (
    <div className={`glass-card cursor-pointer overflow-hidden ${className}`}>
      {/* Thumbnail skeleton */}
      <div className="relative aspect-video bg-black/20">
        <div
          className={`${baseClasses} w-full h-full`}
          style={{
            ...animationStyle,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)'
          }}
        />
        {/* Live badge skeleton */}
        <div className="absolute top-3 left-3">
          <div
            className="bg-black/40 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-full"
            style={{
              animation: 'shimmer 2s ease-in-out infinite',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
          />
        </div>
        {/* Viewer count skeleton */}
        <div className="absolute top-3 right-3">
          <div
            className="bg-black/40 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-md"
            style={{
              animation: 'shimmer 2s ease-in-out infinite',
              background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
          />
        </div>
      </div>

      {/* Info section skeleton */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar skeleton */}
          <div
            className="rounded-full w-8 h-8 flex-shrink-0 border border-white/5"
            style={{
              ...animationStyle,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)'
            }}
          />
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title skeleton */}
            <div
              className="h-4 rounded"
              style={{
                ...animationStyle,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)'
              }}
            />
            {/* Username skeleton */}
            <div
              className="h-3 rounded w-2/3"
              style={{
                ...animationStyle,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)'
              }}
            />
            {/* Category tag skeleton */}
            <div
              className="h-3 w-16 rounded"
              style={{
                ...animationStyle,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 100%)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboardSkeleton = () => (
    <div className={`space-y-6 ${className}`}>
      {/* Video preview skeleton */}
      <div className="glass-card overflow-hidden rounded-lg bg-black/30">
        <div
          className="w-full h-full"
          style={{
            ...animationStyle,
            height: '450px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.01) 100%)'
          }}
        />
      </div>

      {/* Controls skeleton */}
      <div className="glass-card p-4 bg-black/20">
        <div className="flex flex-wrap gap-3">
          <div
            className="h-10 w-24 rounded-lg border border-white/5"
            style={{
              ...animationStyle,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)'
            }}
          />
          <div
            className="h-10 w-32 rounded-lg border border-white/5"
            style={{
              ...animationStyle,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)'
            }}
          />
          <div
            className="h-10 w-28 rounded-lg ml-auto border border-white/5"
            style={{
              ...animationStyle,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)'
            }}
          />
        </div>
      </div>

      {/* Stream settings skeleton */}
      <div className="glass-card p-6 bg-black/20">
        <div
          className="h-6 w-32 rounded mb-4"
          style={{
            ...animationStyle,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 100%)'
          }}
        />
        <div className="space-y-4">
          <div>
            <div
              className="h-3 w-24 rounded mb-2"
              style={{
                ...animationStyle,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)'
              }}
            />
            <div
              className="h-10 w-full rounded border border-white/5"
              style={{
                ...animationStyle,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 100%)'
              }}
            />
          </div>
          <div>
            <div
              className="h-3 w-20 rounded mb-2"
              style={{
                ...animationStyle,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)'
              }}
            />
            <div
              className="h-10 w-full rounded border border-white/5"
              style={{
                ...animationStyle,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 100%)'
              }}
            />
          </div>
          <div>
            <div
              className="h-3 w-28 rounded mb-2"
              style={{
                ...animationStyle,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)'
              }}
            />
            <div className="flex gap-2">
              <div
                className="h-10 flex-1 rounded border border-white/5"
                style={{
                  ...animationStyle,
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 100%)'
                }}
              />
              <div
                className="h-10 w-12 rounded border border-white/5"
                style={{
                  ...animationStyle,
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)'
                }}
              />
              <div
                className="h-10 w-12 rounded border border-white/5"
                style={{
                  ...animationStyle,
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)'
                }}
              />
            </div>
          </div>
          <div
            className="h-10 w-full rounded border border-white/5"
            style={{
              ...animationStyle,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 100%)'
            }}
          />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="glass-card p-4 bg-black/20">
            <div
              className="w-10 h-10 rounded-lg mx-auto mb-2 border border-white/5"
              style={{
                ...animationStyle,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)'
              }}
            />
            <div
              className="h-8 w-16 mx-auto mb-1 rounded"
              style={{
                ...animationStyle,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 100%)'
              }}
            />
            <div
              className="h-3 w-20 mx-auto rounded"
              style={{
                ...animationStyle,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderTextSkeleton = () => (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded border border-white/5"
          style={{
            ...animationStyle,
            width: i === lines - 1 ? '75%' : '100%',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.05) 100%)'
          }}
        />
      ))}
    </div>
  );

  const renderCircleSkeleton = () => (
    <div
      className={`rounded-full border border-white/5 ${className}`}
      style={{
        ...animationStyle,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)'
      }}
    />
  );

  switch (variant) {
    case 'card':
      return renderCardSkeleton();
    case 'stream':
      return renderStreamCardSkeleton();
    case 'dashboard':
      return renderDashboardSkeleton();
    case 'text':
      return renderTextSkeleton();
    case 'circle':
      return renderCircleSkeleton();
    default:
      return renderDefaultSkeleton();
  }
};

export default LoadingSkeleton;
