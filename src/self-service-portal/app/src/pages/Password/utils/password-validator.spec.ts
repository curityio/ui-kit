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

import { passwordValidator } from './password-validator.ts';
import { describe, expect, it } from 'vitest';
import { CredentialRuleDescriptor } from '../../../shared/data-access/API/user-management/typing-overwrites';

describe('passwordValidator', () => {
  describe('Multiple Rule Validation', () => {
    it('passwordValidator should succeed with multiple rules', () => {
      const validationErrors = passwordValidator(
        [
          { __typename: 'MinimumDigitsPasswordRule', minimum: 2 },
          { __typename: 'MinimumLowerCasePasswordRule', minimum: 3 },
          { __typename: 'MinimumUpperCasePasswordRule', minimum: 2 },
          { __typename: 'MinimumSpecialPasswordRule', minimum: 1 },
          { __typename: 'MinimumLengthPasswordRule', minimum: 6 },
          { __typename: 'MinimumUniquePasswordRule', minimum: 5 },
          { __typename: 'MaximumSequencePasswordRule', maximum: 3 },
        ],
        'Ab1!cdE2'
      );

      expect(validationErrors).toEqual({});
    });

    it('passwordValidator should fail with multiple rules', () => {
      const validationErrors = passwordValidator(
        [
          { __typename: 'MinimumDigitsPasswordRule', minimum: 2 },
          { __typename: 'MinimumLowerCasePasswordRule', minimum: 3 },
          { __typename: 'MinimumUpperCasePasswordRule', minimum: 2 },
          { __typename: 'MinimumSpecialPasswordRule', minimum: 1 },
          { __typename: 'MinimumLengthPasswordRule', minimum: 6 },
          { __typename: 'MinimumUniquePasswordRule', minimum: 5 },
          { __typename: 'MaximumSequencePasswordRule', maximum: 2 },
        ],
        'aBc'
      );

      expect(validationErrors).toEqual({
        MinimumDigitsPasswordRule: true,
        MinimumLowerCasePasswordRule: true,
        MinimumUpperCasePasswordRule: true,
        MinimumSpecialPasswordRule: true,
        MinimumLengthPasswordRule: true,
        MinimumUniquePasswordRule: true,
        MaximumSequencePasswordRule: true,
      });
    });
  });

  describe('Single Rule Validation', () => {
    it('validates MinimumDigitsPasswordRule', () => {
      const rule: CredentialRuleDescriptor = {
        __typename: 'MinimumDigitsPasswordRule',
        minimum: 2,
        message: '',
        detailedMessage: '',
      };

      let validationErrors = passwordValidator([rule], 'abc123');
      expect(validationErrors).toEqual({});

      validationErrors = passwordValidator([rule], 'abc1');
      expect(validationErrors).toEqual({
        MinimumDigitsPasswordRule: true,
      });

      validationErrors = passwordValidator([rule], 'a1b2c');
      expect(validationErrors).toEqual({});
    });

    it('validates MinimumUniquePasswordRule', () => {
      const rule: CredentialRuleDescriptor = {
        __typename: 'MinimumUniquePasswordRule',
        minimum: 5,
        message: '',
        detailedMessage: '',
      };

      let validationErrors = passwordValidator([rule], 'abcde');
      expect(validationErrors).toEqual({});

      validationErrors = passwordValidator([rule], 'aaaab');
      expect(validationErrors).toEqual({
        MinimumUniquePasswordRule: true,
      });

      validationErrors = passwordValidator([rule], 'abcdA');
      expect(validationErrors).toEqual({});
    });

    it('validates MinimumLengthPasswordRule', () => {
      const rule: CredentialRuleDescriptor = {
        __typename: 'MinimumLengthPasswordRule',
        minimum: 6,
        message: '',
        detailedMessage: '',
      };

      let validationErrors = passwordValidator([rule], 'abcdef');
      expect(validationErrors).toEqual({});

      validationErrors = passwordValidator([rule], 'abc');
      expect(validationErrors).toEqual({
        MinimumLengthPasswordRule: true,
      });
    });

    it('validates MinimumLowerCasePasswordRule', () => {
      const rule: CredentialRuleDescriptor = {
        __typename: 'MinimumLowerCasePasswordRule',
        minimum: 2,
        message: '',
        detailedMessage: '',
      };

      let validationErrors = passwordValidator([rule], 'abCD');
      expect(validationErrors).toEqual({});

      validationErrors = passwordValidator([rule], 'A1C!');
      expect(validationErrors).toEqual({
        MinimumLowerCasePasswordRule: true,
      });

      validationErrors = passwordValidator([rule], 'xYzA');
      expect(validationErrors).toEqual({});
    });

    it('validates MinimumUpperCasePasswordRule', () => {
      const rule: CredentialRuleDescriptor = {
        __typename: 'MinimumUpperCasePasswordRule',
        minimum: 2,
        message: '',
        detailedMessage: '',
      };

      let validationErrors = passwordValidator([rule], 'ABcd');
      expect(validationErrors).toEqual({});

      validationErrors = passwordValidator([rule], 'abcD');
      expect(validationErrors).toEqual({
        MinimumUpperCasePasswordRule: true,
      });

      validationErrors = passwordValidator([rule], 'aB1C2');
      expect(validationErrors).toEqual({});
    });

    it('validates MinimumSpecialPasswordRule', () => {
      const rule: CredentialRuleDescriptor = {
        __typename: 'MinimumSpecialPasswordRule',
        minimum: 2,
        message: '',
        detailedMessage: '',
      };

      let validationErrors = passwordValidator([rule], 'abc#@');
      expect(validationErrors).toEqual({});

      validationErrors = passwordValidator([rule], 'abc#');
      expect(validationErrors).toEqual({
        MinimumSpecialPasswordRule: true,
      });

      validationErrors = passwordValidator([rule], '!a@bc');
      expect(validationErrors).toEqual({});
    });

    it('validates MaximumSequencePasswordRule', () => {
      const rule: CredentialRuleDescriptor = {
        __typename: 'MaximumSequencePasswordRule',
        maximum: 3,
        message: '',
        detailedMessage: '',
      };
      const forbiddenSequences = [
        { name: 'English alphabetical sequence', password: 'abcd' },
        { name: 'Reverse English alphabetical sequence', password: 'zyxw' },
        { name: 'Numeric sequence', password: '1234' },
        { name: 'Reverse numeric sequence', password: '4321' },
        { name: 'QWERTY row sequence', password: 'qwerty' },
        { name: 'Reverse QWERTY row sequence', password: 'ytrewq' },
        { name: 'QWERTY2 row sequence', password: 'asdfgh' },
        { name: 'Reverse QWERTY2 row sequence', password: 'hgfdsa' },
        { name: 'QWERTY3 row sequence', password: 'zxcvbnm' },
        { name: 'Reverse QWERTY3 row sequence', password: 'mnbvcxz' },
      ];

      forbiddenSequences.forEach(({ password }) => {
        const validationErrors = passwordValidator([rule], password);

        expect(validationErrors).toEqual({ MaximumSequencePasswordRule: true });
      });
    });
  });
});
