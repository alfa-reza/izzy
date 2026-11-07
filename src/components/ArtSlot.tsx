import { useEffect, useState } from 'react';
import { artwork, mediaUrl } from '../content/media';

type Props = {
  id: string;
  className?: string;
  compact?: boolean;
  priority?: boolean;
  onAvailabilityChange?: (available: boolean) => void;
};

export function ArtSlot({ id, className = '', compact = false, priority = false, onAvailabilityChange }: Props) {
  const art = artwork[id];
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    onAvailabilityChange?.(false);
  }, [id, onAvailabilityChange]);

  if (!art) return null;
  const hasImage = Boolean(art.src && !failed);

  return (
    <div className={`art-slot art-${art.aspectRatio} ${hasImage ? 'has-image' : 'is-empty'} ${className}`}>
      {hasImage && art.src ? (
        <img
          src={mediaUrl(art.src)}
          alt={art.alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => onAvailabilityChange?.(true)}
          onError={() => { setFailed(true); onAvailabilityChange?.(false); }}
        />
      ) : (
        <div className="art-empty" role="img" aria-label={`A picture belongs here: ${art.label}`}>
          <span className="art-corner top-left" aria-hidden="true" />
          <span className="art-corner top-right" aria-hidden="true" />
          <span className="art-corner bottom-left" aria-hidden="true" />
          <span className="art-corner bottom-right" aria-hidden="true" />
          <span className="art-empty-center">
            <span className="art-placeholder-mark" aria-hidden="true"><i /><i /><i /><i /></span>
            <span className="art-label">{art.label}</span>
            {!compact && <span className="art-hint">A picture belongs here.<br />I saved a spot for it!</span>}
          </span>
        </div>
      )}
    </div>
  );
}