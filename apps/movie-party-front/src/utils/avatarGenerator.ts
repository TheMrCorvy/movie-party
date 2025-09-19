/**
 * Utility functions for generating random avatars
 */

// Predefined color palette - 15 pleasant colors for avatars
const AVATAR_COLORS = [
    "#FF6B6B", // Coral Red
    "#4ECDC4", // Turquoise
    "#45B7D1", // Sky Blue
    "#96CEB4", // Sage Green
    "#FFEAA7", // Light Yellow
    "#DDA0DD", // Plum
    "#98D8C8", // Mint
    "#F7DC6F", // Soft Yellow
    "#BB8FCE", // Light Purple
    "#85C1E2", // Light Blue
    "#F8B739", // Golden Orange
    "#52C7B8", // Teal
    "#FFB6C1", // Light Pink
    "#87CEEB", // Sky Blue
    "#98FB98", // Pale Green
];

/**
 * Get a consistent color for a given name
 */
const getColorForName = (name: string): string => {
    // Simple hash to get consistent color for the same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
};

/**
 * Get initials from a name
 */
const getInitials = (name: string): string => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

/**
 * Generate a simple SVG avatar with initials
 */
export const generateSVGAvatar = (name: string, size: number = 40): string => {
    const initials = getInitials(name);
    const backgroundColor = getColorForName(name);

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <rect width="${size}" height="${size}" fill="${backgroundColor}" rx="${size * 0.1}" />
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                  font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
                  font-size="${size * 0.4}" font-weight="600" fill="white">
                ${initials}
            </text>
        </svg>
    `;

    // Convert SVG to data URI
    const encoded = encodeURIComponent(svg.trim());
    return `data:image/svg+xml,${encoded}`;
};

/**
 * Generate avatar using external service (DiceBear Avatars)
 * Optional: Use this for more variety
 */
export const generateExternalAvatar = (
    name: string,
    size: number = 40
): string => {
    const seed = encodeURIComponent(name);
    return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&size=${size}&backgroundColor=${encodeURIComponent(getColorForName(name))}`;
};

/**
 * Avatar generation options
 */
export interface AvatarOptions {
    name: string;
    size?: number;
    useExternalService?: boolean;
}

/**
 * Main function to generate avatar
 */
export const generateAvatar = (options: AvatarOptions): string => {
    const { name, size = 40, useExternalService = false } = options;

    if (useExternalService) {
        return generateExternalAvatar(name, size);
    }

    return generateSVGAvatar(name, size);
};

/**
 * Generate Material-UI Avatar props with color and initials
 */
export const generateMUIAvatarProps = (name: string) => {
    return {
        children: getInitials(name),
        sx: {
            bgcolor: getColorForName(name),
            color: "white", // Explicitly set text color to white
            fontWeight: 600,
            fontSize: "1rem",
        },
    };
};
