// Registry for Figma exports dropped into /public/figma
// Use getFigmaUrl('dashboard-reference') to retrieve the URL

const map: Record<string, string> = {
  // Add entries like: 'dashboard-reference': '/figma/dashboard-reference.pdf'
};

export function getFigmaUrl(key: string): string | undefined {
  return map[key];
}

export function registerFigmaAsset(key: string, filename: string) {
  map[key] = `/figma/${filename}`;
}
