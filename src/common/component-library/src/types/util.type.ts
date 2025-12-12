export type TranslationFunction = (translationLabel: string, defaultValue?: string) => string;

type AnyTFunction = (key: string, options?: Record<string, unknown>) => string;

/**
 * Adapter that turns any compatible translation function into a `TranslationFunction`.
 *
 * `t` can be any function that:
 *  \- takes at least a `key` string
 *  \- optionally takes a second `options` argument which may contain `defaultValue`
 *  \- returns a string
 */
export const toUiKitTranslation =
  <T extends AnyTFunction>(t: T): TranslationFunction =>
  (translationLabel: string, defaultValue?: string) => {
    // Pass defaultValue via options, compatible with react-i18next TFunction
    return t(translationLabel, defaultValue !== undefined ? { defaultValue } : undefined);
  };
