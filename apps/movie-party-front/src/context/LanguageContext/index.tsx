import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { hgts } from "@salvatore.hakase/hgts";

export interface LanguageContextType {
    language: string;
    changeLanguage: (locale: string) => void;
    availableLanguages: string[];
    t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState(hgts.getLanguage());

    const changeLanguage = useCallback((locale: string) => {
        try {
            hgts.changeLanguage(locale);
            setLanguage(locale);
        } catch (error) {
            console.error("Failed to change language:", error);
        }
    }, []);

    const t = useCallback(
        (key: string, params?: Record<string, string | number>) => {
            return hgts.t(key, params);
        },
        [language]
    );

    const availableLanguages = hgts.getAvailableLanguages();

    return (
        <LanguageContext.Provider
            value={{
                language,
                changeLanguage,
                availableLanguages,
                t,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};

export const useAppLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error(
            "useAppLanguage must be used within a LanguageProvider"
        );
    }
    return context;
};
