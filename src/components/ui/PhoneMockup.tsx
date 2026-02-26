'use client';

interface PhoneMockupProps {
  src: string;
  title?: string;
}

export function PhoneMockup({ src, title = 'App preview' }: PhoneMockupProps) {
  // Append embed=true to hide site chrome (header/footer) inside the iframe
  const embedSrc = src.includes('?') ? `${src}&embed=true` : `${src}?embed=true`;

  return (
    <div className="phone-frame">
      {/* Notch */}
      <div className="phone-notch" />

      {/* Status bar area */}
      <div className="phone-status-bar" />

      {/* Content */}
      <div className="phone-content">
        <iframe
          src={embedSrc}
          title={title}
          className="h-full w-full border-0"
          loading="lazy"
        />
      </div>

      {/* Home indicator */}
      <div className="phone-home-indicator" />
    </div>
  );
}
