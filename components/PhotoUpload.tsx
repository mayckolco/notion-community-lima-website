"use client";

import { useCallback, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

const MAX_SIZE_MB = 5;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function PhotoUpload({ value, onChange, error }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setSizeError(null);

      if (!ACCEPTED.includes(file.type)) {
        setSizeError("Solo se aceptan JPG, PNG y WEBP");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setSizeError(`El archivo debe pesar menos de ${MAX_SIZE_MB}MB`);
        return;
      }

      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(file);
    },
    [onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange(null);
    setSizeError(null);
  };

  const displayError = sizeError ?? error;

  return (
    <div className="space-y-2">
      {preview && value ? (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border group">
          <Image
            src={preview}
            alt="Foto de perfil"
            fill
            className="object-cover"
            unoptimized
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            aria-label="Eliminar foto"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
      ) : (
        <label
          className={cn(
            "flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-primary/5",
            displayError && "border-destructive"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {dragOver ? (
              <ImageIcon className="h-8 w-8 text-primary" />
            ) : (
              <Upload className="h-8 w-8" />
            )}
            <span className="text-sm font-medium">
              {dragOver ? "Suelta la imagen" : "Sube tu foto"}
            </span>
            <span className="text-xs">JPG, PNG, WEBP · Máx. 5MB</span>
          </div>
          <input
            type="file"
            accept={ACCEPTED.join(",")}
            onChange={handleChange}
            className="sr-only"
          />
        </label>
      )}
      {displayError && (
        <p className="text-xs text-destructive">{displayError}</p>
      )}
    </div>
  );
}
