interface Item {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, strng>;
  category: string;
  kind: string;
}

interface Response {
  kind: string;
  items: Item[];
}

const googleFonts: Response;
export default googleFonts;
