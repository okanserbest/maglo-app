type PdfIconProps = {
  name: string; // base name without extension, e.g., 'Dashboard'
  png: string;  // fallback PNG import path
  size?: number; // pixel size
  className?: string;
};

// Tries to render /figma/icons/<name>.pdf from public, falls back to provided PNG
export default function PdfIcon({ name, png, size = 20, className }: PdfIconProps) {
  const pdfPath = `/figma/icons/${name}.pdf`;
  // object tag will show fallback content if PDF fails to load
  return (
    <object
      data={pdfPath}
      type="application/pdf"
      width={size}
      height={size}
      aria-label={`${name} icon`}
      className={className}
    >
      <img src={png} width={size} height={size} alt="" className={className} />
    </object>
  );
}
