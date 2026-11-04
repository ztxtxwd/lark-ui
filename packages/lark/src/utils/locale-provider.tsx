import { createContext, useContext, useMemo, type ReactNode } from "react";

export interface LarkTranslations {
  label?: {
    optional: string;
    tooltip: string;
  };
  layerDialog: {
    close: string;
    cancel: string;
  };
}

export type LarkTranslationsPartial = {
  [Key in keyof LarkTranslations]?: Partial<NonNullable<LarkTranslations[Key]>>;
};

type ResolvedLarkTranslations = {
  [Key in keyof LarkTranslations]-?: NonNullable<LarkTranslations[Key]>;
};

const defaultTranslations: ResolvedLarkTranslations = {
  label: {
    optional: "(optional)",
    tooltip: "More information",
  },
  layerDialog: {
    close: "Close",
    cancel: "Cancel",
  },
};

const LarkLocaleContext =
  createContext<ResolvedLarkTranslations>(defaultTranslations);

export interface LarkLocaleProviderProps {
  children: ReactNode;
  /**
   * Partial overrides for Lark's built-in English copy. Components without an
   * override continue to use their English defaults.
   */
  translations?: LarkTranslationsPartial;
}

/**
 * Supplies translations for Lark-owned UI copy. Explicit component props take
 * precedence over these defaults.
 */
export function LarkLocaleProvider({
  children,
  translations,
}: LarkLocaleProviderProps) {
  const value = useMemo<ResolvedLarkTranslations>(
    () => ({
      label: {
        ...defaultTranslations.label,
        ...translations?.label,
      },
      layerDialog: {
        ...defaultTranslations.layerDialog,
        ...translations?.layerDialog,
      },
    }),
    [translations],
  );

  return (
    <LarkLocaleContext.Provider value={value}>
      {children}
    </LarkLocaleContext.Provider>
  );
}

/** @internal Used by Lark components to resolve translated built-in copy. */
export function useLarkLocale(): ResolvedLarkTranslations {
  return useContext(LarkLocaleContext);
}
