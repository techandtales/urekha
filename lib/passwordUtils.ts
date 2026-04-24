export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export const calculateStrength = (password: string): PasswordStrength => {
    let score = 0;
    if (!password) return 0;

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return score as PasswordStrength;
}

export const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
export const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

export interface PasswordRequirement {
    label: string;
    test: (password: string) => boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "Contains a number", test: (p) => /[0-9]/.test(p) },
    { label: "Contains an uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "Contains a special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];
