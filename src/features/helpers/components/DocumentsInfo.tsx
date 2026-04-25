'use client';

import { useRef, useState } from 'react';
import { Upload, X, ShieldCheck, Zap, User } from 'lucide-react';
import Image from 'next/image';

interface DocumentsInfoProps {
  onNext: (data: { profilePicture?: File; cnicFront?: File; cnicBack?: File }) => void;
  onBack: () => void;
}

interface FilePreview {
  file: File;
  preview: string;
}

function UploadBox({
  label, hint, required, value, onChange, onRemove,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  value: FilePreview | null;
  onChange: (f: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file);
    e.target.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required ? <span className="text-red-500">*</span> : <span className="text-gray-400 font-normal">(Optional)</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}

      {value ? (
        <div className="relative w-full h-36 rounded-2xl overflow-hidden border-2 border-blue-200 group">
          <Image src={value.preview} alt={label} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={onRemove}
              className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[80%]">
            {value.file.name}
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-36 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500 group"
        >
          <Upload size={24} className="group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold">Click to upload</span>
          <span className="text-[10px]">JPG, PNG — max 5MB</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

export default function DocumentsInfo({ onNext, onBack }: DocumentsInfoProps) {
  const [profilePicture, setProfilePicture] = useState<FilePreview | null>(null);
  const [cnicFront, setCnicFront]           = useState<FilePreview | null>(null);
  const [cnicBack, setCnicBack]             = useState<FilePreview | null>(null);

  const makePreview = (file: File): FilePreview => ({
    file,
    preview: URL.createObjectURL(file),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      profilePicture: profilePicture?.file,
      cnicFront:      cnicFront?.file,
      cnicBack:       cnicBack?.file,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Documents & Photo</h2>
        <p className="text-gray-500 text-sm">Upload your profile photo and verification documents.</p>
      </div>

      {/* CNIC tip banner */}
      <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
        <Zap size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-700">Speed up your approval!</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Providing your CNIC front &amp; back is optional but helps our team verify your identity faster — so you start getting bookings sooner.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Profile picture */}
        <div className="flex items-center gap-2 mb-1">
          <User size={16} className="text-blue-500" />
          <span className="text-sm font-bold text-gray-700">Profile Photo</span>
        </div>
        <UploadBox
          label="Profile Picture"
          hint="A clear photo of your face helps clients trust you."
          value={profilePicture}
          onChange={(f) => setProfilePicture(makePreview(f))}
          onRemove={() => setProfilePicture(null)}
        />

        {/* CNIC */}
        <div className="flex items-center gap-2 mt-2 mb-1">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span className="text-sm font-bold text-gray-700">CNIC Verification</span>
          <span className="text-[10px] bg-amber-100 text-amber-600 font-bold px-2 py-0.5 rounded-full">Faster approval</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <UploadBox
            label="CNIC Front"
            hint="Front side of your national ID."
            value={cnicFront}
            onChange={(f) => setCnicFront(makePreview(f))}
            onRemove={() => setCnicFront(null)}
          />
          <UploadBox
            label="CNIC Back"
            hint="Back side of your national ID."
            value={cnicBack}
            onChange={(f) => setCnicBack(makePreview(f))}
            onRemove={() => setCnicBack(null)}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-[2] py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/30 active:scale-[0.98]"
        >
          Complete Registration
        </button>
      </div>
    </form>
  );
}
