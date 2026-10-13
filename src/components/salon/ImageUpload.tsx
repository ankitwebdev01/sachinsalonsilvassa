import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function ImageUpload({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ url: string; value: string }>();
  async function upload(file?: File) {
    if (!file) return;
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Choose a JPG, PNG or WebP photo."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Choose a photo smaller than 10 MB."); return; }
    setBusy(true);
    try {
      const extension = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
      const path = `${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("salon-media").upload(path, file, { contentType: file.type });
      if (uploadError) throw uploadError;
      const next = `/api/public/media?path=${path}`;
      const { data } = await supabase.storage.from("salon-media").createSignedUrl(path, 3600);
      setPreview({ url: data?.signedUrl ?? next, value: next });
      onChange(next);
    } catch (e) { setError(e instanceof Error ? e.message : "Photo upload failed. Please try again."); }
    finally { setBusy(false); if (input.current) input.current.value = ""; }
  }
  return <div className="min-w-0 space-y-2"><input ref={input} aria-label={`Upload ${label}`} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => void upload(e.target.files?.[0])} />{value && <img src={preview?.value === value ? preview.url : value} alt={label} className="h-32 w-full rounded-md bg-secondary object-contain" />}<div className="flex flex-wrap gap-2"><Button type="button" variant="outline" disabled={busy} onClick={() => input.current?.click()}>{busy ? <LoaderCircle className="animate-spin" /> : <ImagePlus />}{busy ? "Uploading…" : value ? "Change photo" : "Choose photo"}</Button>{value && <Button type="button" variant="ghost" size="icon" title="Remove photo" aria-label={`Remove ${label}`} onClick={() => onChange("")}><Trash2 /></Button>}</div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div>;
}