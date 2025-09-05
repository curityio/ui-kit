/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { CredentialRuleDescriptor } from '../../../shared/data-access/API/user-management/typing-overwrites';

export const passwordValidator = (
  passwordRules: CredentialRuleDescriptor[] = [],
  passwordValue: string
): { [errorRuleType: string]: boolean } => {
  const passwordValidationResult = passwordRules.reduce(
    (validationErrors: { [errorRuleType: string]: boolean }, rule) => {
      if (!passwordSatifiesValidatorRule(rule, passwordValue)) {
        const errorRuleType = rule.__typename;

        return {
          ...validationErrors,
          [errorRuleType]: true,
        };
      }

      return validationErrors;
    },
    {}
  );

  return passwordValidationResult;
};

const passwordSatifiesValidatorRule = (rule: CredentialRuleDescriptor, value: string) => {
  if (!value || !rule) {
    return false;
  }

  const valueToMatch = [...value];
  const ruleType = rule.__typename;

  switch (ruleType) {
    case 'MinimumDigitsPasswordRule':
      return valueToMatch.filter(character => /^\p{Nd}$/u.test(character)).length >= rule.minimum!;
    case 'MinimumUniquePasswordRule':
      return new Set(valueToMatch).size >= rule.minimum!;
    case 'MinimumLengthPasswordRule':
      return valueToMatch.length >= rule.minimum!;
    case 'MinimumLowerCasePasswordRule':
      return valueToMatch.filter(character => /^\p{Ll}$/u.test(character)).length >= rule.minimum!;
    case 'MinimumUpperCasePasswordRule':
      return valueToMatch.filter(character => /^\p{Lu}$/u.test(character)).length >= rule.minimum!;
    case 'MinimumSpecialPasswordRule':
      return minSpecialCharactersValidator(rule, valueToMatch);
    case 'MaximumSequencePasswordRule':
      return maximumSequenceValidator(rule, value);
    default:
      return true;
  }
};

function minSpecialCharactersValidator(rule: CredentialRuleDescriptor, valueToMatch: string[]) {
  const baseSymbols = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
  const latin1Symbols =
    '\u00a1\u00a2\u00a3\u00a4\u00a5\u00a6\u00a7\u00a8\u00a9\u00aa\u00ab\u00ac\u00ad\u00ae\u00af\u00b0\u00b1\u00b2\u00b3\u00b4\u00b5\u00b6\u00b7\u00b8\u00b9\u00ba\u00bb\u00bc\u00bd\u00be\u00bf';
  const symbolsSet = new Set([...baseSymbols, ...latin1Symbols]);

  return (
    valueToMatch.filter(character => symbolsSet.has(character) || /^\p{Sc}$/u.test(character)).length >= rule.minimum!
  );
}

function maximumSequenceValidator(rule: CredentialRuleDescriptor, value: string) {
  const englishAlphabetical = [...'abcdefghijklmnopqrstuvwxyz'];
  const digits = [...'01234567890'];
  const quertyLine1 = [...'qwertyuiop'];
  const quertyLine2 = [...'asdfghjkl'];
  const quertyLine3 = [...'zxcvbnm'];
  const sequences = [
    englishAlphabetical,
    [...englishAlphabetical].reverse(),
    digits,
    [...digits].reverse(),
    quertyLine1,
    [...quertyLine1].reverse(),
    quertyLine2,
    [...quertyLine2].reverse(),
    quertyLine3,
    [...quertyLine3].reverse(),
  ];
  const valueToMatch = [...value.toLowerCase()];
  const stopIndex = valueToMatch.length - rule.maximum!;

  const isDisallowedSubsequence = (valueToMatch: string[], startIndex: number, sequence: string[]) => {
    let sequenceIndex = sequence.indexOf(valueToMatch[startIndex]);
    if (sequenceIndex < 0 || sequenceIndex + rule.maximum! > sequence.length) {
      return false;
    }

    const endIndex = startIndex + rule.maximum!;
    for (let i = startIndex; i <= endIndex; i++) {
      const strChar = valueToMatch[i];
      const sequenceChar = sequence[sequenceIndex++];
      if (strChar !== sequenceChar) {
        return false;
      }
    }

    return true;
  };

  for (let startIndex = 0; startIndex < stopIndex; startIndex++) {
    const foundInSequence = sequences.find(s => isDisallowedSubsequence(valueToMatch, startIndex, s));

    if (foundInSequence) {
      return false;
    }
  }
  return true;
}
