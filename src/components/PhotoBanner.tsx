type PhotoBannerProps = {
  title: string;
  text: string;
  image: string;
  alt: string;
  position?: string;
  height?: number;
};

// Cada página recebe uma foto própria (sem repetição); o véu neon mantém o texto legível.
function PhotoBanner({ title, text, image, alt, position = "center 50%", height = 200 }: PhotoBannerProps) {
  return (
    <div className="photo-banner" style={{ height }} data-animate>
      <img src={image} alt={alt} style={{ objectPosition: position }} loading="lazy" decoding="async" />
      <div className="photo-banner__text">
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default PhotoBanner;
