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

const getColorForName = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
};

const getInitials = (name: string): string => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

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

    const encoded = encodeURIComponent(svg.trim());
    return `data:image/svg+xml,${encoded}`;
};

export interface AvatarOptions {
    name: string;
    size?: number;
}

export const generateAvatar = (options: AvatarOptions): string => {
    const { name, size = 40 } = options;

    return generateSVGAvatar(name, size);
};

export const generateMUIAvatarProps = (name: string) => {
    return {
        children: getInitials(name),
        sx: {
            bgcolor: getColorForName(name),
            color: "white",
            fontWeight: 600,
            fontSize: "1rem",
            minWidth: "auto",
            mr: 1.5,
        },
    };
};
