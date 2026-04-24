"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  MapPin,
  X,
  CheckCircle2,
  Loader2,
  PenLine,
} from "lucide-react";
import { updateUserLocation } from "@/app/auth/actions";
import { useRouter } from "next/navigation";

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    country?: string;
    state?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
  };
}

export default function LocationUpdateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);

  // Selected data State
  const [selectedData, setSelectedData] = useState<{
    country: string;
    state: string;
    city: string;
    latitude: number | null;
    longitude: number | null;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state when opening/closing
  useEffect(() => {
    if (!isOpen) {
      setSuggestions([] as LocationSuggestion[]);
    }
  }, [isOpen]);

  // Nominatim Geocoding Search
  const searchLocation = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([] as LocationSuggestion[]);
      setIsSearching(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
        {
          headers: {
            "Accept-Language": "en", // Force english responses ideally
          },
        },
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      // Don't show confusing errors for generic network drops during typing
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce the input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearching(true);
    setSelectedData(null); // Clear previous selection if they start typing again

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      searchLocation(value);
    }, 800);
  };

  const handleSelect = (s: LocationSuggestion) => {
    // Extract best city representation
    const city =
      s.address.city ||
      s.address.town ||
      s.address.village ||
      s.address.county ||
      "";
    const state = s.address.state || "";
    const country = s.address.country || "";

    setSelectedData({
      country,
      state,
      city,
      latitude: parseFloat(s.lat),
      longitude: parseFloat(s.lon),
    });

    setSearchQuery(s.display_name.split(",")[0]); // Put short name in input
    setSuggestions([] as LocationSuggestion[]); // hide dropdown
  };

  const handleSubmit = async () => {
    if (!selectedData) return;
    setIsSubmitting(true);
    setError("");

    try {
      const result = await updateUserLocation(selectedData);
      if (result.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        title="Update Location"
        className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium transition-all"
      >
        <MapPin size={16} />
        Update Location
      </button>

      {/* Modal - Rendered via Portal to break out of all overflow-hidden containers */}
      {mounted &&
        isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
              onClick={() => !isSubmitting && setIsOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-[#050A0A] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF8C00]/0 via-[#FF8C00]/50 to-[#FF8C00]/0" />
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#FF8C00]/10 border border-[#FF8C00]/20">
                    <MapPin className="text-[#FF8C00] w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Update Coordinates
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="text-white/40 hover:text-white transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="space-y-6">
                  {/* Search Input */}
                  <div className="space-y-2 relative">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-white/50">
                      Search Place or City
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="e.g. Kyoto, Japan"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF8C00]/50 focus:bg-white/10 transition-all font-serif"
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                      {isSearching && (
                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FF8C00] w-4 h-4 animate-spin" />
                      )}
                    </div>

                    {/* Dropdown Suggestions */}
                    {suggestions.length > 0 && !selectedData && (
                      <div className="mt-2 bg-[#0A0F0F] border border-white/10 rounded-xl shadow-inner flex flex-col max-h-[220px] overflow-y-auto custom-scrollbar">
                        {suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelect(s)}
                            className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-[#FF8C00]/10 hover:text-[#FF8C00] transition-colors border-b border-white/5 last:border-0"
                          >
                            {s.display_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Extracted Data Confirmation */}
                  {selectedData && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                      <div className="p-4 rounded-xl bg-[#FF8C00]/5 border border-[#FF8C00]/20">
                        <h4 className="text-sm font-medium text-[#FF8C00] mb-4 flex items-center gap-2">
                          <CheckCircle2 size={16} /> Location Extracted
                        </h4>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-[10px] uppercase text-white/40 mb-1">
                              City/Town
                            </p>
                            <p className="text-white text-sm font-serif">
                              {selectedData.city || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-white/40 mb-1">
                              State
                            </p>
                            <p className="text-white text-sm font-serif">
                              {selectedData.state || "N/A"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[10px] uppercase text-white/40 mb-1">
                              Country
                            </p>
                            <p className="text-white text-sm font-serif">
                              {selectedData.country || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="bg-black/50 rounded-lg p-3 flex justify-between">
                          <div>
                            <p className="text-[10px] uppercase text-[#FF8C00]/50 mb-0.5">
                              Latitude
                            </p>
                            <p className="text-white/80 font-mono text-xs">
                              {selectedData.latitude?.toFixed(6)}°
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase text-[#FF8C00]/50 mb-0.5">
                              Longitude
                            </p>
                            <p className="text-white/80 font-mono text-xs">
                              {selectedData.longitude?.toFixed(6)}°
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                      {error}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20 rounded-b-2xl">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-all font-medium text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedData || isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#FF8C00]/20 border border-[#FF8C00]/30 text-[#FF8C00] hover:bg-[#FF8C00]/30 hover:text-[#FF8C00] transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Securing...
                    </>
                  ) : (
                    "Secure Coordinates"
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
