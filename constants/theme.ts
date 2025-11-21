export const Colors = {
    primary: '#6366f1', // Indigo 500 - Modern, premium primary
    primaryDark: '#4f46e5',
    secondary: '#10b981', // Emerald 500 - Success/Go
    danger: '#ef4444', // Red 500

    background: '#f8fafc', // Slate 50
    surface: '#ffffff',
    surfaceHighlight: '#f1f5f9', // Slate 100

    text: '#0f172a', // Slate 900
    textSecondary: '#64748b', // Slate 500
    textLight: '#ffffff',

    border: '#e2e8f0', // Slate 200

    // Dark mode specific (can be expanded later)
    dark: {
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f8fafc',
    }
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    round: 9999,
};

export const Shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
};
