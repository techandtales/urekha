"use client";

import { useState } from "react";
import {
  User,
  MapPin,
  Clock,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Orbit,
  PenLine,
  Check,
  X,
  Loader2,
  Navigation,
} from "lucide-react";
import LocationUpdateModal from "@/components/profile/LocationUpdateModal";
import { ModernAuthInput } from "@/components/auth/ModernAuthInput";
import { completeUserProfile } from "@/app/auth/actions";
import { useRouter } from "next/navigation";

interface ProfileDataEditorProps {
  userData: any;
  userEmail: string;
}

export default function ProfileDataEditor({
  userData,
  userEmail,
}: ProfileDataEditorProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState(userData?.name || "");
  const [dob, setDob] = useState(userData?.date_of_birth || "");
  const [tob, setTob] = useState(userData?.time_of_birth || "");
  const [gender, setGender] = useState(userData?.gender || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [country, setCountry] = useState(userData?.country || "");
  const [state, setState] = useState(userData?.state || "");
  const [city, setCity] = useState(userData?.city || "");
  const [latitude, setLatitude] = useState<number | string>(
    userData?.latitude || "",
  );
  const [longitude, setLongitude] = useState<number | string>(
    userData?.longitude || "",
  );
  const [timezone, setTimezone] = useState<string>(userData?.timezone || "");

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(Number(position.coords.latitude.toFixed(6)));
          setLongitude(Number(position.coords.longitude.toFixed(6)));
        },
        (error) => {
          console.error("Error obtaining location", error);
          alert(
            "Could not automatically determine location. Please allow location permissions or enter manually.",
          );
        },
      );
    } else {
      alert("Geolocation is not available in your browser.");
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const result = await completeUserProfile({
      name,
      date_of_birth: dob,
      time_of_birth: tob,
      gender,
      phone,
      country,
      state,
      city,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      timezone,
    });

    setIsLoading(false);
    if (!result?.error) {
      setIsEditing(false);
      // Force Next.js to re-fetch the server component
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleCancel = () => {
    // Revert state
    setName(userData?.name || "");
    setDob(userData?.date_of_birth || "");
    setTob(userData?.time_of_birth || "");
    setGender(userData?.gender || "");
    setPhone(userData?.phone || "");
    setCountry(userData?.country || "");
    setState(userData?.state || "");
    setCity(userData?.city || "");
    setLatitude(userData?.latitude || "");
    setLongitude(userData?.longitude || "");
    setTimezone(userData?.timezone || "");
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 relative transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-slate-100 dark:border-zinc-800 gap-4">
        <h2 className="text-xl font-medium text-slate-900 dark:text-white flex items-center gap-2 transition-colors duration-300">
          Profile details
        </h2>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <LocationUpdateModal />
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                <PenLine size={16} />
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-1.5 bg-[#7e56da] hover:bg-[#6543b5] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-[#7e56da]/20"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8">
        {/* Full Name */}
        <div className="flex items-start gap-4">
          <div className="mt-0.5 p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 shrink-0 transition-colors duration-300">
            <User size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium transition-colors duration-300">
              Full Name
            </p>
            {isEditing ? (
              <ModernAuthInput
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
            ) : (
              <p className="text-sm text-slate-900 dark:text-white font-medium transition-colors duration-300">
                {userData?.name || "Not provided"}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="mt-0.5 p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 shrink-0 transition-colors duration-300">
            <Mail size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium transition-colors duration-300">
              Email Address
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-900 dark:text-white font-medium transition-colors duration-300">
                {userData?.email || userEmail}
              </p>
              {userData?.email && !isEditing && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono border border-emerald-200 dark:border-emerald-500/20 shrink-0">
                  <ShieldCheck size={10} /> Verified
                </span>
              )}
            </div>
            {isEditing && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Email cannot be changed directly.
              </p>
            )}
          </div>
        </div>

        {/* DOB */}
        <div className="flex items-start gap-4">
          <div className="mt-0.5 p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 shrink-0 transition-colors duration-300">
            <Calendar size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium transition-colors duration-300">
              Date of Birth
            </p>
            {isEditing ? (
              <ModernAuthInput
                name="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            ) : (
              <p className="text-sm text-slate-900 dark:text-white font-medium transition-colors duration-300">
                {userData?.date_of_birth || "Not provided"}
              </p>
            )}
          </div>
        </div>

        {/* TOB */}
        <div className="flex items-start gap-4">
          <div className="mt-0.5 p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 shrink-0 transition-colors duration-300">
            <Clock size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium transition-colors duration-300">
              Time of Birth
            </p>
            {isEditing ? (
              <ModernAuthInput
                name="tob"
                type="time"
                value={tob}
                onChange={(e) => setTob(e.target.value)}
              />
            ) : (
              <p className="text-sm text-slate-900 dark:text-white font-medium transition-colors duration-300">
                {userData?.time_of_birth || "Not provided"}
              </p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4">
          <div className="mt-0.5 p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 shrink-0 transition-colors duration-300">
            <Phone size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium transition-colors duration-300">
              Phone Number
            </p>
            {isEditing ? (
              <ModernAuthInput
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
              />
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-900 dark:text-white font-medium transition-colors duration-300">
                  {userData?.phone || "Not provided"}
                </p>
                {userData?.phone && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono border border-emerald-200 dark:border-emerald-500/20 shrink-0">
                    <ShieldCheck size={10} /> Verified
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Gender */}
        <div className="flex items-start gap-4">
          <div className="mt-0.5 p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 shrink-0 transition-colors duration-300">
            <Orbit size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium transition-colors duration-300">
              Gender
            </p>
            {isEditing ? (
              <div className="flex gap-2">
                {["male", "female"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`flex-1 h-12 flex items-center justify-center capitalize rounded-xl border px-3 py-1 text-sm transition-all duration-300 ${
                      gender === g
                        ? "border-[#7e56da] dark:border-[#7e56da]/50 bg-[#7e56da]/10 text-[#7e56da] font-semibold"
                        : "border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-900 dark:text-white font-medium capitalize transition-colors duration-300">
                {userData?.gender || "Not provided"}
              </p>
            )}
          </div>
        </div>

        {/* Location Combined */}
        <div className="flex items-start gap-4 md:col-span-2 lg:col-span-1">
          <div className="mt-0.5 p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 shrink-0 transition-colors duration-300">
            <MapPin size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium transition-colors duration-300">
              Location
            </p>
            {isEditing ? (
              <div className="space-y-2">
                <ModernAuthInput
                  name="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                />
                <div className="flex gap-2">
                  <ModernAuthInput
                    name="state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                  />
                  <ModernAuthInput
                    name="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-900 dark:text-white font-medium transition-colors duration-300">
                {[userData?.city, userData?.state, userData?.country]
                  .filter(Boolean)
                  .join(", ") || "Not provided"}
              </p>
            )}
          </div>
        </div>

        {/* Coordinates */}
        <div className="flex items-start gap-4">
          <div className="mt-0.5 p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 shrink-0 transition-colors duration-300">
            <Orbit size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium transition-colors duration-300">
              Coordinates
            </p>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <ModernAuthInput
                    name="latitude"
                    type="number"
                    step="any"
                    value={latitude as string}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="Latitude"
                  />
                  <ModernAuthInput
                    name="longitude"
                    type="number"
                    step="any"
                    value={longitude as string}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="Longitude"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Navigation size={14} className="text-[#7e56da]" />{" "}
                  Auto-detect Coordinates
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-900 dark:text-white font-mono transition-colors duration-300">
                  {userData?.latitude && userData?.longitude
                    ? `${Number(userData.latitude).toFixed(4)}°, ${Number(userData.longitude).toFixed(4)}°`
                    : "Unknown"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Timezone */}
        <div className="flex items-start gap-4">
          <div className="mt-0.5 p-2 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 shrink-0 transition-colors duration-300">
            <Clock size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium transition-colors duration-300">
              Timezone
            </p>
            {isEditing ? (
              <ModernAuthInput
                name="timezone"
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="e.g. 5.5 or Asia/Kolkata"
              />
            ) : (
              <p className="text-sm text-slate-900 dark:text-white font-mono transition-colors duration-300">
                {userData?.timezone || "Unknown"}
              </p>
            )}
          </div>
        </div>

        {/* Subscription */}
        <div className="flex items-start gap-4">
          <div className="mt-0.5 p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0 transition-colors duration-300">
            <Sparkles size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium transition-colors duration-300">
              Subscription
            </p>
            <p className="text-sm text-slate-900 dark:text-white font-medium transition-colors duration-300">
              Urekha Free Tier
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
