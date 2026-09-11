import { useEffect, useState } from "react";
import { defaults, loadContent, type ContentMap } from "@/lib/salon";
export function useSalonContent() {
  const [content, setContent] = useState<ContentMap>(defaults);
  useEffect(() => { loadContent().then(setContent).catch(() => undefined); }, []);
  return content;
}
