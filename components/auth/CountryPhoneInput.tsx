"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { countries, Country } from "@/lib/countries";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CountryPhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function CountryPhoneInput({ className, label, error, ...props }: CountryPhoneInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries.find(c => c.code === "IN") || countries[0]);
    const [isFocused, setIsFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filter countries based on search
    const filteredCountries = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return countries.filter(country =>
            country.name.toLowerCase().includes(query) ||
            country.code.toLowerCase().includes(query) ||
            country.dial_code.includes(query)
        );
    }, [searchQuery]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            // Small delay to allow animation to start
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        } else {
            setSearchQuery(""); // Reset search when closed
        }
    }, [isOpen]);

    return (
        <div className="space-y-1.5 w-full group relative z-20">
            <div className={cn(
                "relative flex h-12 w-full rounded-xl border bg-slate-100 dark:bg-zinc-800 text-sm text-slate-900 dark:text-white transition-all duration-300",
                error ? "border-red-500" : "border-transparent dark:border-zinc-700 focus-within:border-[#7e56da] focus-within:ring-1 focus-within:ring-[#7e56da]"
            )}>

                {/* Hidden Input for Country Code Form Submission */}
                <input type="hidden" name="countryCode" value={selectedCountry.dial_code} />

                {/* Country Selector Trigger */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 pl-3 pr-2 border-r border-slate-200 dark:border-zinc-700 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors rounded-l-xl shrink-0 outline-none"
                >
                    <span className="text-2xl leading-none select-none">{selectedCountry.flag}</span>
                    <span className="text-slate-700 dark:text-white/80 font-medium select-none">{selectedCountry.dial_code}</span>
                    <ChevronDown size={14} className={cn("text-slate-400 dark:text-white/50 transition-transform", isOpen && "rotate-180")} />
                </button>

                {/* Phone Input */}
                <input
                    className={cn(
                        "flex-1 h-full bg-transparent px-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    placeholder={label || "Phone Number"}
                    {...props}
                />
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full xs:w-[300px] mt-2 bg-white dark:bg-zinc-950/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 flex flex-col max-h-[300px]"
                        ref={dropdownRef}
                        onWheel={(e) => e.stopPropagation()}
                    >
                        {/* Search Bar */}
                        <div className="p-2 border-b border-slate-100 dark:border-white/10 sticky top-0 bg-white/80 dark:bg-zinc-950/95 z-10 backdrop-blur-md">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search country..."
                                    className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-[#7e56da]/50 dark:focus:border-brand-gold/30 focus:bg-slate-100 dark:focus:bg-white/10 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Country List */}
                        <div className="overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex-1">
                            {filteredCountries.length > 0 ? (
                                filteredCountries.map((country) => (
                                    <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCountry(country);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 w-full px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors text-left",
                                            selectedCountry.code === country.code && "bg-slate-100 dark:bg-white/5 text-[#7e56da] dark:text-brand-gold"
                                        )}
                                    >
                                        <span className="text-2xl leading-none">{country.flag}</span>
                                        <span className="text-slate-700 dark:text-white/90 font-medium w-12">{country.dial_code}</span>
                                        <span className="text-sm text-slate-500 dark:text-white/60 truncate flex-1">{country.name}</span>
                                        {selectedCountry.code === country.code && (
                                            <motion.div layoutId="activeCountry" className="w-1.5 h-1.5 rounded-full bg-[#7e56da] dark:bg-brand-gold" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-sm text-slate-400 dark:text-white/40">
                                    No countries found.
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
        </div>
    );
}
