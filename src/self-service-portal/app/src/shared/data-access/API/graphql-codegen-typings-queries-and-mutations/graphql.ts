/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * The fields used for filtering.
   *
   * Depending on server configuration, this may be an enum with the following variants:
   * * STARTS_WITH - always present
   * * ENDS_WITH   - only for Data Sources that support it
   */
  FilterType: { input: any; output: any; }
  /** Long is a 64-bit integer number. */
  Long: { input: any; output: any; }
  /** An Object can contain any valid JSON object. */
  Object: { input: any; output: any; }
  /**
   * Sorting fields are not available in all Data Sources.
   * When available, Sorting is an input Object with the following fields:
   * * sortBy: SortAttribute
   * * sortOrder: SortOrder!
   */
  Sorting: { input: any; output: any; }
};

/** The representation of an user account. */
export type Account = Resource & {
  __typename?: 'Account';
  /** Active account indicator. */
  active: Scalars['Boolean']['output'];
  /** Addresses. */
  addresses?: Maybe<Array<Maybe<Address>>>;
  /** User's devices. */
  devices?: Maybe<Array<Maybe<Device>>>;
  /** Display name. */
  displayName?: Maybe<Scalars['String']['output']>;
  /** Dynamically registered clients. */
  dynamicClients?: Maybe<Array<Maybe<DynamicallyRegisteredClient>>>;
  /** Email addresses. */
  emails?: Maybe<Array<Maybe<StringMultiValuedValue>>>;
  /** Entitlements. */
  entitlements?: Maybe<Array<Maybe<StringMultiValuedValue>>>;
  /** External ID. */
  externalId?: Maybe<Scalars['String']['output']>;
  /** Groups. */
  groups?: Maybe<Array<Maybe<StringMultiValuedValue>>>;
  /** The account's ID. */
  id: Scalars['ID']['output'];
  /** Instant messaging services. */
  ims?: Maybe<Array<Maybe<StringMultiValuedValue>>>;
  /** Linked accounts. */
  linkedAccounts?: Maybe<Array<Maybe<LinkedAccount>>>;
  /** Locale. */
  locale?: Maybe<Scalars['String']['output']>;
  /** Account's metadata. */
  meta?: Maybe<Meta>;
  /** Opt-in MFA configuration. */
  mfaOptIn?: Maybe<OptinMfa>;
  /** Name. */
  name?: Maybe<Name>;
  /** Nickname. */
  nickName?: Maybe<Scalars['String']['output']>;
  /** Phone numbers. */
  phoneNumbers?: Maybe<Array<Maybe<StringMultiValuedValue>>>;
  /** Photos. */
  photos?: Maybe<Array<Maybe<StringMultiValuedValue>>>;
  /** Preferred language. */
  preferredLanguage?: Maybe<Scalars['String']['output']>;
  /** Profile's URL. */
  profileUrl?: Maybe<Scalars['String']['output']>;
  /** Roles. */
  roles?: Maybe<Array<Maybe<StringMultiValuedValue>>>;
  /** Time zone. */
  timeZone?: Maybe<Scalars['String']['output']>;
  /** Title. */
  title?: Maybe<Scalars['String']['output']>;
  /** Username. */
  userName: Scalars['String']['output'];
  /** User type. */
  userType?: Maybe<Scalars['String']['output']>;
  /** Website. */
  website?: Maybe<Scalars['String']['output']>;
  /** X. 509 certificates. */
  x509Certificates?: Maybe<Array<Maybe<StringMultiValuedValue>>>;
};

/** A connection to a list of items in pagination. */
export type AccountConnection = {
  __typename?: 'AccountConnection';
  /** The list of edges containing accounts */
  edges?: Maybe<Array<Maybe<AccountEdge>>>;
  /** Pagination information for this connection */
  pageInfo: PageInfo;
  /** Total count of items in the connection */
  totalCount: Scalars['Long']['output'];
};

/** The fields defining the created account attributes. */
export type AccountCreateFields = {
  /** Active account indicator. */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Addresses. */
  addresses?: InputMaybe<Array<InputMaybe<AddressInput>>>;
  /** Display name. */
  displayName?: InputMaybe<Scalars['String']['input']>;
  /** Email addresses. */
  emails?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** Entitlements. */
  entitlements?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** External ID. */
  externalId?: InputMaybe<Scalars['String']['input']>;
  /** Groups. */
  groups?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** Instant messaging services. */
  ims?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** Locale. */
  locale?: InputMaybe<Scalars['String']['input']>;
  /** Name. */
  name?: InputMaybe<NameCreateFields>;
  /** Nickname. */
  nickName?: InputMaybe<Scalars['String']['input']>;
  /** Password. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** Phone numbers. */
  phoneNumbers?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** Photos. */
  photos?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** Preferred language. */
  preferredLanguage?: InputMaybe<Scalars['String']['input']>;
  /** Profile's URL. */
  profileUrl?: InputMaybe<Scalars['String']['input']>;
  /** Roles. */
  roles?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** Time zone. */
  timeZone?: InputMaybe<Scalars['String']['input']>;
  /** Title. */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Username. */
  userName: Scalars['String']['input'];
  /** User type. */
  userType?: InputMaybe<Scalars['String']['input']>;
  /** Website. */
  website?: InputMaybe<Scalars['String']['input']>;
  /** X. 509 certificates. */
  x509Certificates?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
};

/** Representation of `AccountEdge` used by the pagination mechanism. */
export type AccountEdge = {
  __typename?: 'AccountEdge';
  /** The item at the end of the edge */
  node?: Maybe<Account>;
};

/**
 * Definition of the fields to update:
 * - A field with a `non-null` value means that the corresponding account attribute will be updated with that value.
 * - A field with the `null` value means that the corresponding account attribute will be removed.
 * - An absent field means that the corresponding account attribute will remain the same.
 */
export type AccountUpdateFields = {
  /** Active account indicator. */
  active?: InputMaybe<Scalars['Boolean']['input']>;
  /** Addresses. */
  addresses?: InputMaybe<Array<InputMaybe<AddressInput>>>;
  /** Display name. */
  displayName?: InputMaybe<Scalars['String']['input']>;
  /** Email addresses. */
  emails?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** Entitlements. */
  entitlements?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** External ID. */
  externalId?: InputMaybe<Scalars['String']['input']>;
  /** Groups. */
  groups?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** Instant messaging services. */
  ims?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** Locale. */
  locale?: InputMaybe<Scalars['String']['input']>;
  /** Name. */
  name?: InputMaybe<NameUpdateFields>;
  /** Nickname. */
  nickName?: InputMaybe<Scalars['String']['input']>;
  /** Password. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** Phone numbers. */
  phoneNumbers?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** Photos. */
  photos?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** Preferred language. */
  preferredLanguage?: InputMaybe<Scalars['String']['input']>;
  /** Profile's URL. */
  profileUrl?: InputMaybe<Scalars['String']['input']>;
  /** Roles. */
  roles?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
  /** Time zone. */
  timeZone?: InputMaybe<Scalars['String']['input']>;
  /** Title. */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Username. */
  userName?: InputMaybe<Scalars['String']['input']>;
  /** User type. */
  userType?: InputMaybe<Scalars['String']['input']>;
  /** Website. */
  website?: InputMaybe<Scalars['String']['input']>;
  /** X. 509 certificates. */
  x509Certificates?: InputMaybe<Array<InputMaybe<StringMultiValuedValueInput>>>;
};

/** The added device fields */
export type AddDeviceFields = {
  /** Alias. */
  alias?: InputMaybe<Scalars['String']['input']>;
  /** Device ID. */
  deviceId: Scalars['String']['input'];
  /** Device type. */
  deviceType?: InputMaybe<Scalars['String']['input']>;
  /** Expires at. */
  expiresAt?: InputMaybe<Scalars['Long']['input']>;
  /** External ID. */
  externalId?: InputMaybe<Scalars['String']['input']>;
  /** Form factor. */
  formFactor?: InputMaybe<Scalars['String']['input']>;
  /** Owner. */
  owner?: InputMaybe<Scalars['String']['input']>;
};

/** Input to the `AddDeviceToAccountByAccountId` mutation. */
export type AddDeviceToAccountByAccountIdInput = {
  /** Account ID. */
  accountId: Scalars['String']['input'];
  /** Device fields to add device to an account. */
  deviceFields: AddDeviceFields;
};

/** Result of the `AddDeviceToAccountByAccountId` mutation. */
export type AddDeviceToAccountByAccountIdPayload = {
  __typename?: 'AddDeviceToAccountByAccountIdPayload';
  /** The added device. */
  device?: Maybe<Device>;
};

/** Input to the `addOptInMfaFactorToAccountByAccountId` mutation. */
export type AddOptInMfaFactorToAccountByAccountIdInput = {
  /** The ID of the account to where the factor should be added. */
  accountId: Scalars['String']['input'];
  /** The ACR of the factor to add. */
  acr: Scalars['String']['input'];
};

/** Result of the `addOptInMfaFactorToAccountByAccountId ` mutation. */
export type AddOptInMfaFactorToAccountByAccountIdPayload = {
  __typename?: 'AddOptInMfaFactorToAccountByAccountIdPayload';
  /** `true` if the factor was successfully added. */
  added: Scalars['Boolean']['output'];
};

/** The representation of an user account address. */
export type Address = {
  __typename?: 'Address';
  /** Country. */
  country?: Maybe<Scalars['String']['output']>;
  /** Address representation for display purposes.#Address representation for display purposes. */
  display?: Maybe<Scalars['String']['output']>;
  /** Formatted version of the address. */
  formatted?: Maybe<Scalars['String']['output']>;
  /** Locality. */
  locality?: Maybe<Scalars['String']['output']>;
  /** Postal code. */
  postalCode?: Maybe<Scalars['String']['output']>;
  /** Primary address indicator. */
  primary?: Maybe<Scalars['Boolean']['output']>;
  /** Region */
  region?: Maybe<Scalars['String']['output']>;
  /** Street address. */
  streetAddress?: Maybe<Scalars['String']['output']>;
  /** Address type. */
  type?: Maybe<Scalars['String']['output']>;
};

/** Input required to define an address. */
export type AddressInput = {
  /** Country. */
  country?: InputMaybe<Scalars['String']['input']>;
  /** Address representation for display purposes. */
  display?: InputMaybe<Scalars['String']['input']>;
  /** Formatted version of the address. */
  formatted?: InputMaybe<Scalars['String']['input']>;
  /** Locality. */
  locality?: InputMaybe<Scalars['String']['input']>;
  /** Postal code. */
  postalCode?: InputMaybe<Scalars['String']['input']>;
  /** Primary address indicator. */
  primary?: InputMaybe<Scalars['Boolean']['input']>;
  /** Region. */
  region?: InputMaybe<Scalars['String']['input']>;
  /** Street address. */
  streetAddress?: InputMaybe<Scalars['String']['input']>;
  /** Address type. */
  type?: InputMaybe<Scalars['String']['input']>;
};

/** Algorithms supported to encrypt the content encryption key, present as 'alg' in JWE header. */
export enum AsymmetricKeyManagementAlgorithm {
  /** ECDH ES algorithm */
  EcdhEs = 'ECDH_ES',
  /** ECDH ES A128KW algorithm */
  EcdhEsA128Kw = 'ECDH_ES_A128KW',
  /** ECDH ES A192KW algorithm */
  EcdhEsA192Kw = 'ECDH_ES_A192KW',
  /** ECDH ES A256KW algorithm */
  EcdhEsA256Kw = 'ECDH_ES_A256KW',
  /** RSA 1.5 algorithm */
  Rsa1_5 = 'RSA1_5',
  /** RSA OAEP algorithm */
  RsaOaep = 'RSA_OAEP',
  /** RSA OAEP 256 algorithm */
  RsaOaep_256 = 'RSA_OAEP_256'
}

export type AuthorizedClaim = {
  __typename?: 'AuthorizedClaim';
  /** An optional human readable description of the claim. */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * The localized claim name.
   * Defaults to the claim name if no localization information is available.
   */
  localizedName: Scalars['String']['output'];
  /** The unique and stable claim name. */
  name: Scalars['String']['output'];
};

export type AuthorizedOAuthClient = {
  __typename?: 'AuthorizedOAuthClient';
  /** An optional description of the client. */
  description?: Maybe<Scalars['String']['output']>;
  /** The unique and stable identifier for the client. */
  id: Scalars['ID']['output'];
  /** The optional client's Logo URL. */
  logoUri?: Maybe<Scalars['String']['output']>;
  /** An optional human readable name of the client. */
  name?: Maybe<Scalars['String']['output']>;
};

export type AuthorizedScope = {
  __typename?: 'AuthorizedScope';
  /** An optional human readable description of the scope. */
  description?: Maybe<Scalars['String']['output']>;
  /**
   * The localized scope name.
   * Defaults to the scope name if no localization information is available.
   */
  localizedName: Scalars['String']['output'];
  /** The unique and stable scope name. */
  name: Scalars['String']['output'];
};

/** A bucket identified by its subject and purpose storing attributes. */
export type Bucket = {
  __typename?: 'Bucket';
  /** Attributes stored in the bucket. */
  attributes: Scalars['Object']['output'];
  /** The purpose of the bucket. */
  purpose: Scalars['String']['output'];
  /** The subject owning the bucket, typically, the user name of the account owning the bucket. */
  subject: Scalars['String']['output'];
};

/** Input to the `completeOptInMfaResetRecoveryCodesByAccountId` mutation. */
export type CompleteOptInMfaResetRecoveryCodesByAccountIdInput = {
  /** The ID of the account where to reset the recovery codes */
  accountId: Scalars['String']['input'];
  /** The state returned by the `startOptInMfaResetRecoveryCodesByAccountId` mutation. */
  state: Scalars['String']['input'];
};

/** Response of the `completeOptInMfaResetRecoveryCodesByAccountId` mutation. */
export type CompleteOptInMfaResetRecoveryCodesByAccountIdPayload = {
  __typename?: 'CompleteOptInMfaResetRecoveryCodesByAccountIdPayload';
  /** The account state after opt-in MFA reset recovery codes */
  account?: Maybe<Account>;
};

/** Input to the `completeOptInMfaSetupByAccountId` mutation. */
export type CompleteOptInMfaSetupByAccountIdInput = {
  /** The ID of the account where to setup opt-in MFA */
  accountId: Scalars['String']['input'];
  /** The state returned by the `startOptInMfaSetupByAccountId` mutation. */
  state: Scalars['String']['input'];
};

/** Response of the `completeOptInMfaSetupByAccountId` mutation. */
export type CompleteOptInMfaSetupByAccountIdPayload = {
  __typename?: 'CompleteOptInMfaSetupByAccountIdPayload';
  /** The account state after opt-in MFA setup */
  account?: Maybe<Account>;
};

/** Input to the `completeVerifyEmailAddressByAccountId` mutation. */
export type CompleteVerifyEmailAddressByAccountIdInput = {
  /** The accountId for which to check the One Time Password. */
  accountId: Scalars['String']['input'];
  /** The One Time Password that was sent to the email address as requested in the `startVerifyEmailAddressByAccountId` mutation. */
  otp: Scalars['String']['input'];
  /** The `state` as provided in the response of the `startVerifyEmailAddressByAccountId` mutation. */
  state: Scalars['String']['input'];
};

/** Result of the `completeVerifyEmailAddressByAccountId` mutation. */
export type CompleteVerifyEmailAddressByAccountIdPayload = {
  __typename?: 'CompleteVerifyEmailAddressByAccountIdPayload';
  /**
   * The result of the `CompleteVerifyEmailAddress` mutation. If the returned result is true, the email address
   * was accepted and registered with the account.
   */
  result: Scalars['Boolean']['output'];
};

/** Used when invoking the mutation to complete the verification of a new Passkey. */
export type CompleteVerifyPasskeyByAccountIdInput = {
  /** The accountId for which to register the Passkey. */
  accountId: Scalars['String']['input'];
  /** The Base64 URL encoded credential response JSON as returned from the WebAuthn API. */
  credentialResponseJson: Scalars['String']['input'];
  /** The `state` as provided in the result of the `startVerifyPasskeyByAccountId` mutation. */
  state: Scalars['String']['input'];
};

/** Result of the `completeVerifyPasskeyByAccountId` mutation. */
export type CompleteVerifyPasskeyByAccountIdPayload = {
  __typename?: 'CompleteVerifyPasskeyByAccountIdPayload';
  /** If the returned result is true, the Passkey was accepted and registered with the account. */
  result: Scalars['Boolean']['output'];
};

/** Used when invoking the mutation to complete the verification of a new phone number. */
export type CompleteVerifyPhoneNumberByAccountIdInput = {
  /** The accountId for which to check the One Time Password. */
  accountId: Scalars['String']['input'];
  /** The One Time Password that was sent to the phone number as requested in the `startVerifyPhoneNumberByAccountId` mutation. */
  otp: Scalars['String']['input'];
  /** The `state` as provided in the response of the `startVerifyPhoneNumberByAccountId` mutation. */
  state: Scalars['String']['input'];
};

/** Result of the `completeVerifyPhoneNumberByAccountId` mutation. */
export type CompleteVerifyPhoneNumberByAccountIdPayload = {
  __typename?: 'CompleteVerifyPhoneNumberByAccountIdPayload';
  /** If the returned result is true, the phone number was accepted and registered with the account. */
  result: Scalars['Boolean']['output'];
};

/** Input to the `completeVerifyTotpDeviceByAccountId` mutation. */
export type CompleteVerifyTotpDeviceByAccountIdInput = {
  /** The accountId for which to register a new TOTP device */
  accountId: Scalars['String']['input'];
  /** The `state` as provided in the result of the `startVerifyTotpDeviceByAccountId` mutation. */
  state: Scalars['String']['input'];
  /**
   * The TOTP code that the user's device has calculated with the settings that were provided in the result
   * of the `StartVerifyTotpDevice` mutation.
   */
  totp: Scalars['String']['input'];
};

/** Result of the `completeVerifyTotpDeviceByAccountId` mutation. */
export type CompleteVerifyTotpDeviceByAccountIdPayload = {
  __typename?: 'CompleteVerifyTotpDeviceByAccountIdPayload';
  /** The result of the adding the new TOTP device to the account. */
  result: Scalars['Boolean']['output'];
};

/** Supported content encryption algorithms, present as 'enc' in JWE header. */
export enum ContentEncryptionAlgorithm {
  /** A128CBC HS256 algorithm */
  A128CbcHs256 = 'A128CBC_HS256',
  /** A128CBC GCM algorithm */
  A128Gcm = 'A128GCM',
  /** A192CBC HS384 algorithm */
  A192CbcHs384 = 'A192CBC_HS384',
  /** A192CBC GCM algorithm */
  A192Gcm = 'A192GCM',
  /** A256CBC HS512 algorithm */
  A256CbcHs512 = 'A256CBC_HS512',
  /** A256CBC GCM algorithm */
  A256Gcm = 'A256GCM'
}

/** Input to the `CreateAccount` mutation. */
export type CreateAccountInput = {
  /** The fields defining the created account attributes. */
  fields: AccountCreateFields;
};

/** Result of the `CreateAccount` mutation. */
export type CreateAccountPayload = {
  __typename?: 'CreateAccountPayload';
  /** Account. */
  account?: Maybe<Account>;
};

/** EXPERIMENTAL: the schema for this type may change in non backwards-compatible ways. */
export type CredentialPolicyDescriptor = {
  __typename?: 'CredentialPolicyDescriptor';
  /** List with the description of the rules that control credential update */
  credentialUpdateRules?: Maybe<Array<CredentialRuleDescriptor>>;
};

/** State of credential policies' rules for a particular user. */
export type CredentialPolicyRulesState = {
  __typename?: 'CredentialPolicyRulesState';
  /** Password age rule */
  age?: Maybe<PasswordAge>;
  /** Force password reset rule */
  forceReset?: Maybe<ForcePasswordReset>;
  /** Password history rule. */
  history?: Maybe<PasswordHistory>;
  /** Temporary lockout rule */
  temporaryLockout?: Maybe<TemporaryLockout>;
  /** Username. */
  userName?: Maybe<Scalars['String']['output']>;
};

/** State of credential policies' rules for a particular user. */
export type CredentialPolicyRulesStateInput = {
  /** Password age rule */
  age?: InputMaybe<PasswordAgeInput>;
  /** Force password reset rule */
  forceReset?: InputMaybe<ForcePasswordResetInput>;
  /** Password history rule. */
  history?: InputMaybe<PasswordHistoryInput>;
  /** Temporary lockout rule */
  temporaryLockout?: InputMaybe<TemporaryLockoutInput>;
  /** Username. */
  userName?: InputMaybe<Scalars['String']['input']>;
};

/** EXPERIMENTAL: the schema for this interface may change in non backwards-compatible ways. */
export type CredentialRuleDescriptor = {
  /** Longer localized message describing the rule. */
  detailedMessage?: Maybe<Scalars['String']['output']>;
  /** Short localized message describing the rule. */
  message?: Maybe<Scalars['String']['output']>;
};

/** Input to the `DeleteAccountById` mutation. */
export type DeleteAccountByIdInput = {
  /** The ID of the account to delete. */
  accountId: Scalars['String']['input'];
  /** Delete account links */
  deleteAccountLinks?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Result of the `DeleteAccountById` mutation. */
export type DeleteAccountByIdPayload = {
  __typename?: 'DeleteAccountByIdPayload';
  /** Account. */
  account?: Maybe<Account>;
  /** `true` if the account was successfully deleted. */
  deleted: Scalars['Boolean']['output'];
  /** `true` if the account links were successfully deleted. */
  deletedAccountLinks?: Maybe<Scalars['Boolean']['output']>;
};

/** Input to the `deleteBucketByUserName` mutation. */
export type DeleteBucketByUserNameInput = {
  /** The purpose of the bucket. */
  purpose: Scalars['String']['input'];
  /** The user name owning the bucket. */
  userName: Scalars['String']['input'];
};

/** Result of the `deleteBucketByUserName` mutation. */
export type DeleteBucketByUserNamePayload = {
  __typename?: 'DeleteBucketByUserNamePayload';
  /** `true` if the bucket was successfully deleted, `false` otherwise. */
  deleted: Scalars['Boolean']['output'];
};

/** Input to the `DeleteDeviceFromAccountByAccountId` mutation. */
export type DeleteDeviceFromAccountByAccountIdInput = {
  /** The ID of the account from where the device should be removed. */
  accountId: Scalars['String']['input'];
  /** The ID of the device to remove. */
  deviceId: Scalars['String']['input'];
};

/** Result of the `DeleteDeviceFromAccountByAccountId` mutation. */
export type DeleteDeviceFromAccountByAccountIdPayload = {
  __typename?: 'DeleteDeviceFromAccountByAccountIdPayload';
  /** `true` if the device was successfully deleted. */
  deleted: Scalars['Boolean']['output'];
};

/** Input to the `deleteEmailAddressByAccountId` mutation. */
export type DeleteEmailAddressByAccountIdInput = {
  /** The accountId for which to delete the email address. */
  accountId: Scalars['String']['input'];
  /** The already existing email address to delete. */
  emailAddressToDelete: Scalars['String']['input'];
};

/** Result of the `deleteEmailAddressByAccountId` mutation. */
export type DeleteEmailAddressByAccountIdPayload = {
  __typename?: 'DeleteEmailAddressByAccountIdPayload';
  /**
   * Returns true when the email address was deleted.
   * When the email address did not exist or could not be deleted, false is returned.
   */
  result: Scalars['Boolean']['output'];
};

/** Input to the `DeleteLinkFromAccountByAccountId` mutation. */
export type DeleteLinkFromAccountByAccountIdInput = {
  /** The ID of the account from where to remove the linked account. */
  accountId: Scalars['String']['input'];
  /** The specification of the linked account to remove. */
  linkedAccount: LinkedAccountInput;
};

/** Result of the `DeleteLinkFromAccountByAccountId` mutation. */
export type DeleteLinkFromAccountByAccountIdPayload = {
  __typename?: 'DeleteLinkFromAccountByAccountIdPayload';
  /** `true` if the linked account was successfully deleted. */
  deleted: Scalars['Boolean']['output'];
};

/** Input to the `DeleteOptInMfaFactorFromAccountByAccountId` mutation. */
export type DeleteOptInMfaFactorFromAccountByAccountIdInput = {
  /** The ID of the account from where the factor should be removed. */
  accountId: Scalars['String']['input'];
  /** The ACR of the factor to remove. */
  acr: Scalars['String']['input'];
};

/** Result of the `DeleteOptInMfaFactorFromAccountByAccountId` mutation. */
export type DeleteOptInMfaFactorFromAccountByAccountIdPayload = {
  __typename?: 'DeleteOptInMfaFactorFromAccountByAccountIdPayload';
  /** `true` if the factor was successfully deleted. */
  deleted: Scalars['Boolean']['output'];
};

/** Used when invoking the mutation to delete a phone number. */
export type DeletePhoneNumberByAccountIdInput = {
  /** The accountId for which to delete the phone number. */
  accountId: Scalars['String']['input'];
  /** The already existing phone number to delete. */
  phoneNumberToDelete: Scalars['String']['input'];
};

/** Result of the `deletePhoneNumberByAccountId` mutation. */
export type DeletePhoneNumberByAccountIdPayload = {
  __typename?: 'DeletePhoneNumberByAccountIdPayload';
  /**
   * Returns true when the phone number was deleted.
   * When the phone number did not exist or could not be deleted, false is returned.
   */
  result: Scalars['Boolean']['output'];
};

/** The representation of a device. */
export type Device = {
  __typename?: 'Device';
  /** Alias. */
  alias?: Maybe<Scalars['String']['output']>;
  /** Device category. */
  category?: Maybe<DeviceCategory>;
  /** Details about the device. */
  details?: Maybe<DeviceDetails>;
  /** Device identifier. */
  deviceId: Scalars['String']['output'];
  /** Device type. */
  deviceType?: Maybe<Scalars['String']['output']>;
  /** Expires at. */
  expiresAt?: Maybe<Scalars['Long']['output']>;
  /** External identifier. */
  externalId?: Maybe<Scalars['String']['output']>;
  /** Device's form factor. */
  formFactor?: Maybe<Scalars['String']['output']>;
  /** Metadata. */
  meta?: Maybe<Meta>;
  /** Owner. */
  owner?: Maybe<Scalars['String']['output']>;
};

/** The device category. */
export type DeviceCategory = {
  __typename?: 'DeviceCategory';
  /** Device category name (e.g. "webauthn/passkeys", "totp"...). */
  name: Scalars['String']['output'];
};

/** Category-specific details about a device. */
export type DeviceDetails = TotpDeviceDetails | WebAuthnDeviceDetails;

/** Fields based on the DCR/DCRM responses, using the exact same names and types */
export type DynamicallyRegisteredClient = {
  __typename?: 'DynamicallyRegisteredClient';
  /** Access token TTL. */
  access_token_ttl?: Maybe<Scalars['Long']['output']>;
  /** Allow per request redirect URIs indicator. */
  allow_per_request_redirect_uris?: Maybe<Scalars['Boolean']['output']>;
  /** Allowed origins. */
  allowed_origins?: Maybe<Array<Scalars['String']['output']>>;
  /** Application URL. */
  application_url?: Maybe<Scalars['String']['output']>;
  /** Authenticated user. */
  authenticated_user?: Maybe<Scalars['String']['output']>;
  /** Authenticator filters. */
  authenticator_filters?: Maybe<Array<Scalars['String']['output']>>;
  /** The signing algorithm used for authorization responses. */
  authorization_signed_response_alg?: Maybe<Scalars['String']['output']>;
  /** The signing algorithm used for backchannel authentication request. */
  backchannel_authentication_request_signing_alg?: Maybe<Scalars['String']['output']>;
  /** Backchannel client notification endpoint. */
  backchannel_client_notification_endpoint?: Maybe<Scalars['String']['output']>;
  /** Backchannel logout session required indicator. */
  backchannel_logout_session_required?: Maybe<Scalars['Boolean']['output']>;
  /** Backchannel logout URI. */
  backchannel_logout_uri?: Maybe<Scalars['String']['output']>;
  /** Backchannel token delivery mode. */
  backchannel_token_delivery_mode?: Maybe<TokenDeliveryMode>;
  /** Backchannel user code parameter indicator. */
  backchannel_user_code_parameter?: Maybe<Scalars['Boolean']['output']>;
  /** Client ID. */
  client_id: Scalars['ID']['output'];
  /** Client's id issued at. */
  client_id_issued_at?: Maybe<Scalars['Long']['output']>;
  /** Client's name. */
  client_name?: Maybe<Scalars['String']['output']>;
  /** Client's URI. */
  client_uri?: Maybe<Scalars['String']['output']>;
  /** Default ACR values. */
  default_acr_values?: Maybe<Array<Scalars['String']['output']>>;
  /** Default maximum age. */
  default_max_age?: Maybe<Scalars['Long']['output']>;
  /** Disallowed proof key challenge methods. */
  disallowed_proof_key_challenge_methods?: Maybe<Array<Scalars['String']['output']>>;
  /** Frontchannel logout session required indicator. */
  frontchannel_logout_session_required?: Maybe<Scalars['Boolean']['output']>;
  /** Frontchannel logout URI. */
  frontchannel_logout_uri?: Maybe<Scalars['String']['output']>;
  /** Grant types. */
  grant_types: Array<Scalars['String']['output']>;
  /** The encryption algorithm used for id token encrypted responses. */
  id_token_encrypted_response_alg?: Maybe<Scalars['String']['output']>;
  /** The content encryption algorithm to use for encrypted ID token responses. */
  id_token_encrypted_response_enc?: Maybe<Scalars['String']['output']>;
  /** The signing algorithm used for id token signed responses. */
  id_token_signed_response_alg?: Maybe<Scalars['String']['output']>;
  /** The number of seconds the ID token should be valid for. */
  id_token_ttl?: Maybe<Scalars['Long']['output']>;
  /** Initiate login URI. */
  initiate_login_uri?: Maybe<Scalars['String']['output']>;
  /** JSON Web Key Set */
  jwks?: Maybe<Scalars['Object']['output']>;
  /** JWKS URI */
  jwks_uri?: Maybe<Scalars['String']['output']>;
  /** Logo URI. */
  logo_uri?: Maybe<Scalars['String']['output']>;
  /** Policy URI. */
  policy_uri?: Maybe<Scalars['String']['output']>;
  /** Post logout redirect URIs. */
  post_logout_redirect_uris?: Maybe<Array<Scalars['String']['output']>>;
  /** field with the extra properties that on a DCR/DCRM response are added to the top level */
  properties?: Maybe<Scalars['Object']['output']>;
  /** Redirect URIs. */
  redirect_uris: Array<Scalars['String']['output']>;
  /** Refresh token maximum rolling lifetime */
  refresh_token_max_rolling_lifetime?: Maybe<Scalars['Long']['output']>;
  /** Refresh token TTL. */
  refresh_token_ttl?: Maybe<Scalars['Long']['output']>;
  /** Registration client URI. */
  registration_client_uri?: Maybe<Scalars['String']['output']>;
  /** The signing algorithm used for request object. */
  request_object_signing_alg?: Maybe<Scalars['String']['output']>;
  /** Request URIs. */
  request_uris?: Maybe<Array<Scalars['String']['output']>>;
  /** Require proof key indicator. */
  require_proof_key?: Maybe<Scalars['Boolean']['output']>;
  /** Require pushed authorization requests indicator. */
  require_pushed_authorization_requests?: Maybe<Scalars['Boolean']['output']>;
  /** Requires consent indicator. */
  requires_consent?: Maybe<Scalars['Boolean']['output']>;
  /** Response types. */
  response_types: Array<Scalars['String']['output']>;
  /** Reuse refresh token indicator. */
  reuse_refresh_tokens?: Maybe<Scalars['Boolean']['output']>;
  /** Scope. */
  scope: Scalars['String']['output'];
  /** Sector identifier URI for when using PPID. */
  sector_identifier_uri?: Maybe<Scalars['String']['output']>;
  /** Software ID. */
  software_id?: Maybe<Scalars['String']['output']>;
  /** Status of Dynamically Registered Client. */
  status: DynamicallyRegisteredClientStatus;
  /** Subject type. */
  subject_type: SubjectType;
  /** TLS client authentication subject DN */
  tls_client_auth_subject_dn?: Maybe<Scalars['String']['output']>;
  /** The authentication methods used by token endpoint */
  token_endpoint_auth_methods: Array<Scalars['String']['output']>;
  /** The signing algorithm used by token endpoint */
  token_endpoint_auth_signing_alg?: Maybe<Scalars['String']['output']>;
  /** Terms of Service URI. */
  tos_uri?: Maybe<Scalars['String']['output']>;
  /** The signing algorithm used for userinfo responses. */
  userinfo_signed_response_alg?: Maybe<Scalars['String']['output']>;
};

/** Dynamically Registered Client status. */
export enum DynamicallyRegisteredClientStatus {
  /** Active. */
  Active = 'active',
  /** Inactive. */
  Inactive = 'inactive',
  /** Revoked. */
  Revoked = 'revoked'
}

/** Information about the factor to register */
export type FactorRegisterInput = {
  /** The ACR of the factor to register */
  acr: Scalars['String']['input'];
};

/** Filter attribute. */
export enum FilterAttribute {
  /** Email. */
  Email = 'email',
  /** Username. */
  UserName = 'userName'
}

/** The fields used for filtering. */
export type Filtering = {
  /** Expected value for the FilterAttribute. The filter value should be at least 3 characters long. */
  filter: Scalars['String']['input'];
  /** Name of the attribute used for filtering. */
  filterBy: FilterAttribute;
  /** Filtering type */
  filterType: Scalars['FilterType']['input'];
};

/** Force password reset rule */
export type ForcePasswordReset = {
  __typename?: 'ForcePasswordReset';
  /**
   * Whether a password reset is currently required.
   * If that's the case, the user will be required to change their password on the next login.
   */
  resetRequired?: Maybe<Scalars['Boolean']['output']>;
};

/** Force password reset rule */
export type ForcePasswordResetInput = {
  /**
   * Whether a password reset is currently required.
   * If that's the case, the user will be required to change their password on the next login.
   */
  resetRequired?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Represents an authorization granted by a resource owner (user) to a client. */
export type GrantedAuthorization = {
  __typename?: 'GrantedAuthorization';
  /** Authorized claims names */
  authorizedClaims: Array<AuthorizedClaim>;
  /** Information about the authorized client. */
  authorizedClient: AuthorizedOAuthClient;
  /** Authorized scopes. */
  authorizedScopes: Array<AuthorizedScope>;
  /** Metadata about this authorization, namely creation and modification timestamps */
  meta: Meta;
  /** The username that granted the authorization */
  owner: Scalars['String']['output'];
};

export type GrantedAuthorizationConnection = {
  __typename?: 'GrantedAuthorizationConnection';
  /** The list of edges containing the authorization nodes. */
  edges: Array<GrantedAuthorizationEdge>;
  /** Pagination information for this connection. */
  pageInfo: PageInfo;
  /** Total number of authorizations based on input parameters. */
  totalCount: Scalars['Long']['output'];
  /** Warning related to this query result */
  warnings?: Maybe<Array<GrantedAuthorizationQueryResultWarning>>;
};

export type GrantedAuthorizationEdge = {
  __typename?: 'GrantedAuthorizationEdge';
  node: GrantedAuthorization;
};

export type GrantedAuthorizationQueryResultWarning = {
  __typename?: 'GrantedAuthorizationQueryResultWarning';
  type: GrantedAuthorizationQueryResultWarningType;
};

/** Contains the currently existing types of warning that can be returned */
export enum GrantedAuthorizationQueryResultWarningType {
  /**
   * The query result is incomplete: there may be missing granted authorizations and the granted authorizations
   * may not include the complete information, namely for scopes and claims.
   */
  IncompleteResult = 'INCOMPLETE_RESULT'
}

/**
 * Input to the 'initializeAccountActivation' mutation.
 * One of the accountId, username or email fields must be provided.
 */
export type InitializeAccountActivationInput = {
  /** The accountId of the user whom account should be activated. */
  accountId?: InputMaybe<Scalars['String']['input']>;
  /** The email of the user whom account should be activated. */
  email?: InputMaybe<Scalars['String']['input']>;
  /**
   * The locale to use for the activation email (e.g. en, sv...).
   * If not provided, the configured default-locale will be used.
   */
  locale?: InputMaybe<Scalars['String']['input']>;
  /** The username of the user whom account should be activated. */
  userName?: InputMaybe<Scalars['String']['input']>;
};

/** Result of the 'initializeAccountActivation' mutation. */
export type InitializeAccountActivationPayload = {
  __typename?: 'InitializeAccountActivationPayload';
  /** True if the account activation email was sent. */
  result: Scalars['Boolean']['output'];
};

/** The representation of a linked account. */
export type LinkedAccount = {
  __typename?: 'LinkedAccount';
  /** Creation time. */
  created: Scalars['Long']['output'];
  /** Domain. */
  domain: Scalars['String']['output'];
  /** Value. */
  value: Scalars['String']['output'];
};

/** The specification of a linked account. */
export type LinkedAccountInput = {
  /** The linked account domain. */
  domain: Scalars['String']['input'];
  /** The linked account value. */
  value: Scalars['String']['input'];
};

/** EXPERIMENTAL: the schema for this type may change in non backwards-compatible ways. */
export type MaximumSequencePasswordRule = CredentialRuleDescriptor & {
  __typename?: 'MaximumSequencePasswordRule';
  detailedMessage?: Maybe<Scalars['String']['output']>;
  /** The maximum allow length for any sequence. */
  maximum?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

/** Metadata. */
export type Meta = {
  __typename?: 'Meta';
  /** Instant the resource was created (in epoch-seconds). */
  created: Scalars['Long']['output'];
  /** Instant the resource was last modified (in epoch-seconds). */
  lastModified: Scalars['Long']['output'];
  /** Resource type. */
  resourceType: Scalars['String']['output'];
  /** Time zone ID. */
  timeZoneId?: Maybe<Scalars['String']['output']>;
};

/** EXPERIMENTAL: the schema for this type may change in non backwards-compatible ways. */
export type MinimumDigitsPasswordRule = CredentialRuleDescriptor & {
  __typename?: 'MinimumDigitsPasswordRule';
  detailedMessage?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  /** The minimum amount of digit characters. */
  minimum?: Maybe<Scalars['Int']['output']>;
};

/** EXPERIMENTAL: the schema for this type may change in non backwards-compatible ways. */
export type MinimumLengthPasswordRule = CredentialRuleDescriptor & {
  __typename?: 'MinimumLengthPasswordRule';
  detailedMessage?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  /** The minimum password length. */
  minimum?: Maybe<Scalars['Int']['output']>;
};

/** EXPERIMENTAL: the schema for this type may change in non backwards-compatible ways. */
export type MinimumLowerCasePasswordRule = CredentialRuleDescriptor & {
  __typename?: 'MinimumLowerCasePasswordRule';
  detailedMessage?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  /** The minimum amount of lower case characters. */
  minimum?: Maybe<Scalars['Int']['output']>;
};

/** EXPERIMENTAL: the schema for this type may change in non backwards-compatible ways. */
export type MinimumSpecialPasswordRule = CredentialRuleDescriptor & {
  __typename?: 'MinimumSpecialPasswordRule';
  detailedMessage?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  /** The minimum amount of special characters. */
  minimum?: Maybe<Scalars['Int']['output']>;
};

/** EXPERIMENTAL: the schema for this type may change in non backwards-compatible ways. */
export type MinimumUniquePasswordRule = CredentialRuleDescriptor & {
  __typename?: 'MinimumUniquePasswordRule';
  detailedMessage?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  /** The minimum amount of unique characters. */
  minimum?: Maybe<Scalars['Int']['output']>;
};

/** EXPERIMENTAL: the schema for this type may change in non backwards-compatible ways. */
export type MinimumUpperCasePasswordRule = CredentialRuleDescriptor & {
  __typename?: 'MinimumUpperCasePasswordRule';
  detailedMessage?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  /** The minimum amount of upper case characters. */
  minimum?: Maybe<Scalars['Int']['output']>;
};

/** List of available Mutations. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Adds a device to an account, by account ID. */
  addDeviceToAccountByAccountId?: Maybe<AddDeviceToAccountByAccountIdPayload>;
  /**
   * Adds one factor to opt-in MFA, by account ID.
   *
   * This mutation requires an opt-in MFA action to be configured in the User Management profile.
   */
  addOptInMfaFactorToAccountByAccountId?: Maybe<AddOptInMfaFactorToAccountByAccountIdPayload>;
  /**
   * Completes the reset of the opt-in MFA recovery codes.
   *
   * This mutation requires an opt-in MFA action to be configured in the User Management profile.
   */
  completeOptInMfaResetRecoveryCodesByAccountId?: Maybe<CompleteOptInMfaResetRecoveryCodesByAccountIdPayload>;
  /**
   * Completes the setup of opt-in MFA on an account.
   *
   * This mutation requires an opt-in MFA action to be configured in the User Management profile.
   */
  completeOptInMfaSetupByAccountId?: Maybe<CompleteOptInMfaSetupByAccountIdPayload>;
  /**
   * Completes the flow to register a new email address, by providing the One Time Password that was sent as part of the
   * startVerifyEmailAddressByAccountId mutation
   */
  completeVerifyEmailAddressByAccountId?: Maybe<CompleteVerifyEmailAddressByAccountIdPayload>;
  /**
   * Completes the flow to register a new Passkey.
   * This operation requires a Passkeys authenticator configured in the associated user management
   * profile, otherwise it will fail.
   */
  completeVerifyPasskeyByAccountId?: Maybe<CompleteVerifyPasskeyByAccountIdPayload>;
  /**
   * Completes the flow to register a new phone number, by providing the One Time Password that was sent as part of the
   * startVerifyPhoneNumberByAccountId mutation
   */
  completeVerifyPhoneNumberByAccountId?: Maybe<CompleteVerifyPhoneNumberByAccountIdPayload>;
  /**
   * Completes the flow to register a new TOTP device, by providing the response to the challenge (secret)
   * that was sent in the `startVerifyTotpDeviceByAccountId operation.
   * This operation requires a TOTP authenticator configured in the associated user management
   * profile, otherwise it will fail.
   */
  completeVerifyTotpDeviceByAccountId?: Maybe<CompleteVerifyTotpDeviceByAccountIdPayload>;
  /** Creates an account. */
  createAccount?: Maybe<CreateAccountPayload>;
  /** Deletes an account by ID. */
  deleteAccountById?: Maybe<DeleteAccountByIdPayload>;
  /** Deletes a bucket by user name and purpose. */
  deleteBucketByUserName?: Maybe<DeleteBucketByUserNamePayload>;
  /** Deletes a device from an account, by account ID. */
  deleteDeviceFromAccountByAccountId?: Maybe<DeleteDeviceFromAccountByAccountIdPayload>;
  /** Update an account by deleting an email address. The primary email address can not be deleted. */
  deleteEmailAddressByAccountId?: Maybe<DeleteEmailAddressByAccountIdPayload>;
  /** Deletes a linked account from an account, by account ID. */
  deleteLinkFromAccountByAccountId?: Maybe<DeleteLinkFromAccountByAccountIdPayload>;
  /**
   * Deletes one factor from MFA, by account ID. When trying to delete the last factor, then an error is returned.
   * Use resetOptInMfaStateByAccountId operation to reset the MFA state for an account ID.
   */
  deleteOptInMfaFactorFromAccountByAccountId?: Maybe<DeleteOptInMfaFactorFromAccountByAccountIdPayload>;
  /** Update an account by deleting a phone number. The primary phone number can not be deleted. */
  deletePhoneNumberByAccountId?: Maybe<DeletePhoneNumberByAccountIdPayload>;
  /**
   * Initializes an account activation for the provided user. This operation requires an HTML
   * Form authenticator configured in the associated user management profile, otherwise it will fail.
   */
  initializeAccountActivation?: Maybe<InitializeAccountActivationPayload>;
  /**
   * Opt-outs of opt-in MFA, given the account ID.
   *
   * This mutation requires an opt-in MFA action to be configured in the User Management profile.
   */
  optOutFromOptInMfaByAccountId?: Maybe<OptOutFromOptInMfaByAccountIdPayload>;
  /** Reset the MFA state, by account ID. Delete all configured factors if any, or reset opt-out. */
  resetOptInMfaStateByAccountId?: Maybe<ResetOptInMfaStateByAccountIdPayload>;
  /** Revokes all authorizations granted by an owner */
  revokeGrantedAuthorizationsByOwner?: Maybe<RevokeGrantedAuthorizationPayload>;
  /** Revokes all authorizations granted by an owner to a specific client */
  revokeGrantedAuthorizationsByOwnerAndClient?: Maybe<RevokeGrantedAuthorizationPayload>;
  /**
   * Sends a password reset email to the provided user's primary email address.
   * This mutation requires an HTML Form authenticator configured in the
   * associated user management profile to process the password reset, otherwise
   * it will fail.
   */
  sendPasswordResetEmail?: Maybe<SendPasswordResetPayload>;
  /** Update the state of the credential policies' rules for a particular user. */
  setCredentialPolicyRulesStateByUserName?: Maybe<CredentialPolicyRulesState>;
  /**
   * Starts the reset of the opt-in MFA recovery codes.
   *
   * This mutation requires an opt-in MFA action to be configured in the User Management profile.
   */
  startOptInMfaResetRecoveryCodesByAccountId?: Maybe<StartOptInMfaResetRecoveryCodesByAccountIdPayload>;
  /**
   * Starts the setup of opt-in MFA on an account
   *
   * This mutation requires an opt-in MFA action to be configured in the User Management profile.
   */
  startOptInMfaSetupByAccountId?: Maybe<StartOptInMfaSetupByAccountIdPayload>;
  /**
   * Starts the flow to register a new email address, by requesting a One Time Password to be sent to the
   * email address to be registered.
   */
  startVerifyEmailAddressByAccountId?: Maybe<StartVerifyEmailAddressByAccountIdPayload>;
  /**
   * Starts the flow to register a new Passkey, by requesting a credential options object.
   * This operation requires a Passkeys authenticator configured in the associated user management
   * profile, otherwise it will fail.
   */
  startVerifyPasskeyByAccountId?: Maybe<StartVerifyPasskeyByAccountIdPayload>;
  /**
   * Starts the flow to register a new phone number, by requesting a One Time Password to be sent to the
   * phone number to be registered.
   */
  startVerifyPhoneNumberByAccountId?: Maybe<StartVerifyPhoneNumberByAccountIdPayload>;
  /**
   * Starts the flow to register a new TOTP device, by requesting a secret to be used with the new device.
   * The fields for the TOTP device to set can also be rendered as a QR code.
   * This operation requires a TOTP authenticator configured in the associated user management
   * profile, otherwise it will fail.
   */
  startVerifyTotpDeviceByAccountId?: Maybe<StartVerifyTotpDeviceByAccountIdPayload>;
  /** Updates an account by ID. */
  updateAccountById?: Maybe<UpdateAccountByIdPayload>;
  /** Updates a device from an account, by account ID. */
  updateDeviceFromAccountByAccountId?: Maybe<UpdateDeviceFromAccountByAccountIdPayload>;
  /** Update an account to set an already registered and verified email address as primary email address. */
  updatePrimaryEmailAddressByAccountId?: Maybe<UpdatePrimaryEmailAddressByAccountIdPayload>;
  /** Update an account to set an already registered and verified phone number as the primary phone number. */
  updatePrimaryPhoneNumberByAccountId?: Maybe<UpdatePrimaryPhoneNumberByAccountIdPayload>;
  /** Updates an account by ID if the password passes validation. */
  validatePasswordAndUpdateAccountById?: Maybe<ValidatePasswordAndUpdateAccountByIdPayload>;
};


/** List of available Mutations. */
export type MutationAddDeviceToAccountByAccountIdArgs = {
  input: AddDeviceToAccountByAccountIdInput;
};


/** List of available Mutations. */
export type MutationAddOptInMfaFactorToAccountByAccountIdArgs = {
  input: AddOptInMfaFactorToAccountByAccountIdInput;
};


/** List of available Mutations. */
export type MutationCompleteOptInMfaResetRecoveryCodesByAccountIdArgs = {
  input: CompleteOptInMfaResetRecoveryCodesByAccountIdInput;
};


/** List of available Mutations. */
export type MutationCompleteOptInMfaSetupByAccountIdArgs = {
  input: CompleteOptInMfaSetupByAccountIdInput;
};


/** List of available Mutations. */
export type MutationCompleteVerifyEmailAddressByAccountIdArgs = {
  input: CompleteVerifyEmailAddressByAccountIdInput;
};


/** List of available Mutations. */
export type MutationCompleteVerifyPasskeyByAccountIdArgs = {
  input: CompleteVerifyPasskeyByAccountIdInput;
};


/** List of available Mutations. */
export type MutationCompleteVerifyPhoneNumberByAccountIdArgs = {
  input: CompleteVerifyPhoneNumberByAccountIdInput;
};


/** List of available Mutations. */
export type MutationCompleteVerifyTotpDeviceByAccountIdArgs = {
  input: CompleteVerifyTotpDeviceByAccountIdInput;
};


/** List of available Mutations. */
export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


/** List of available Mutations. */
export type MutationDeleteAccountByIdArgs = {
  input: DeleteAccountByIdInput;
};


/** List of available Mutations. */
export type MutationDeleteBucketByUserNameArgs = {
  input: DeleteBucketByUserNameInput;
};


/** List of available Mutations. */
export type MutationDeleteDeviceFromAccountByAccountIdArgs = {
  input: DeleteDeviceFromAccountByAccountIdInput;
};


/** List of available Mutations. */
export type MutationDeleteEmailAddressByAccountIdArgs = {
  input: DeleteEmailAddressByAccountIdInput;
};


/** List of available Mutations. */
export type MutationDeleteLinkFromAccountByAccountIdArgs = {
  input: DeleteLinkFromAccountByAccountIdInput;
};


/** List of available Mutations. */
export type MutationDeleteOptInMfaFactorFromAccountByAccountIdArgs = {
  input: DeleteOptInMfaFactorFromAccountByAccountIdInput;
};


/** List of available Mutations. */
export type MutationDeletePhoneNumberByAccountIdArgs = {
  input: DeletePhoneNumberByAccountIdInput;
};


/** List of available Mutations. */
export type MutationInitializeAccountActivationArgs = {
  input: InitializeAccountActivationInput;
};


/** List of available Mutations. */
export type MutationOptOutFromOptInMfaByAccountIdArgs = {
  input?: InputMaybe<OptOutFromOptInMfaByAccountIdInput>;
};


/** List of available Mutations. */
export type MutationResetOptInMfaStateByAccountIdArgs = {
  input: ResetOptInMfaStateByAccountIdInput;
};


/** List of available Mutations. */
export type MutationRevokeGrantedAuthorizationsByOwnerArgs = {
  input?: InputMaybe<RevokeGrantedAuthorizationsByOwnerInput>;
};


/** List of available Mutations. */
export type MutationRevokeGrantedAuthorizationsByOwnerAndClientArgs = {
  input?: InputMaybe<RevokeGrantedAuthorizationByOwnerAndClientInput>;
};


/** List of available Mutations. */
export type MutationSendPasswordResetEmailArgs = {
  input: SendPasswordResetInput;
};


/** List of available Mutations. */
export type MutationSetCredentialPolicyRulesStateByUserNameArgs = {
  input: CredentialPolicyRulesStateInput;
};


/** List of available Mutations. */
export type MutationStartOptInMfaResetRecoveryCodesByAccountIdArgs = {
  input: StartOptInMfaResetRecoveryCodesByAccountIdInput;
};


/** List of available Mutations. */
export type MutationStartOptInMfaSetupByAccountIdArgs = {
  input: StartOptInMfaSetupByAccountIdInput;
};


/** List of available Mutations. */
export type MutationStartVerifyEmailAddressByAccountIdArgs = {
  input: StartVerifyEmailAddressByAccountIdInput;
};


/** List of available Mutations. */
export type MutationStartVerifyPasskeyByAccountIdArgs = {
  input: StartVerifyPasskeyByAccountIdInput;
};


/** List of available Mutations. */
export type MutationStartVerifyPhoneNumberByAccountIdArgs = {
  input: StartVerifyPhoneNumberByAccountIdInput;
};


/** List of available Mutations. */
export type MutationStartVerifyTotpDeviceByAccountIdArgs = {
  input: StartVerifyTotpDeviceByAccountIdInput;
};


/** List of available Mutations. */
export type MutationUpdateAccountByIdArgs = {
  input: UpdateAccountByIdInput;
};


/** List of available Mutations. */
export type MutationUpdateDeviceFromAccountByAccountIdArgs = {
  input: UpdateDeviceFromAccountByAccountIdInput;
};


/** List of available Mutations. */
export type MutationUpdatePrimaryEmailAddressByAccountIdArgs = {
  input: UpdatePrimaryEmailAddressByAccountIdInput;
};


/** List of available Mutations. */
export type MutationUpdatePrimaryPhoneNumberByAccountIdArgs = {
  input: UpdatePrimaryPhoneNumberByAccountIdInput;
};


/** List of available Mutations. */
export type MutationValidatePasswordAndUpdateAccountByIdArgs = {
  input: ValidatePasswordAndUpdateAccountByIdInput;
};

/** The representation of an user account name */
export type Name = {
  __typename?: 'Name';
  /** Family name. */
  familyName?: Maybe<Scalars['String']['output']>;
  /** Formatted version of the name. */
  formatted?: Maybe<Scalars['String']['output']>;
  /** Given name. */
  givenName?: Maybe<Scalars['String']['output']>;
  /** Honorific prefix. */
  honorificPrefix?: Maybe<Scalars['String']['output']>;
  /** Honorific suffix. */
  honorificSuffix?: Maybe<Scalars['String']['output']>;
  /** Middle name. */
  middleName?: Maybe<Scalars['String']['output']>;
};

/** Abstract type to authenticate client through Mutual-TLS. */
export type NameAndCa = {
  /**
   * The CA's that can be the issuer of the client certificate that can be accepted
   * to authenticate this client.
   * If empty, then all profile certificates may be used to authenticate the client.
   */
  trusted_cas: Array<Scalars['String']['output']>;
};

/** The fields defining the created name attribute. */
export type NameCreateFields = {
  /** Family name. */
  familyName?: InputMaybe<Scalars['String']['input']>;
  /** Formatted version of the name. */
  formatted?: InputMaybe<Scalars['String']['input']>;
  /** Given name. */
  givenName?: InputMaybe<Scalars['String']['input']>;
  /** Honorific prefix. */
  honorificPrefix?: InputMaybe<Scalars['String']['input']>;
  /** Honorific suffix. */
  honorificSuffix?: InputMaybe<Scalars['String']['input']>;
  /** Middle name. */
  middleName?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Definition of the fields to update:
 * - A field with a `non-null` value means that the corresponding name filed will be updated with that value.
 * - A field with the `null` value means that the corresponding name attribute will be removed.
 * - An absent field means that the corresponding name attribute will remain the same.
 */
export type NameUpdateFields = {
  /** Family name. */
  familyName?: InputMaybe<Scalars['String']['input']>;
  /** Formatted version of the name. */
  formatted?: InputMaybe<Scalars['String']['input']>;
  /** Given name. */
  givenName?: InputMaybe<Scalars['String']['input']>;
  /** Honorific prefix. */
  honorificPrefix?: InputMaybe<Scalars['String']['input']>;
  /** Honorific suffix. */
  honorificSuffix?: InputMaybe<Scalars['String']['input']>;
  /** Middle name. */
  middleName?: InputMaybe<Scalars['String']['input']>;
};

/** Value used to indicate no authentication is required. */
export enum NoAuth {
  /** Value used to indicate no authentication is required. */
  NoAuth = 'no_auth'
}

/** Information about a recovery code */
export type OptInMfaRecoveryCode = {
  __typename?: 'OptInMfaRecoveryCode';
  /** The recovery code value */
  value: Scalars['String']['output'];
};

/** Input to the `optOutFromOptInMfaByAccountId` mutation. */
export type OptOutFromOptInMfaByAccountIdInput = {
  /** The ID of the account where the MFA opt-out is being done. */
  accountId: Scalars['String']['input'];
};

/** Result of the `optOutFromOptInMfaByAccountId` mutation. */
export type OptOutFromOptInMfaByAccountIdPayload = {
  __typename?: 'OptOutFromOptInMfaByAccountIdPayload';
  /** `true` if opt-out of MFA was successfully done. */
  optedOut: Scalars['Boolean']['output'];
};

/** The Opt-in MFA state and preferences of an account. */
export type OptinMfa = {
  __typename?: 'OptinMfa';
  /** Preferences. */
  preferences?: Maybe<OptinMfaPreferences>;
  /** Recovery code batch. */
  recoveryCodeBatch?: Maybe<RecoveryCodeBatch>;
  /** Registered factors. */
  registeredFactors: RegisteredFactors;
  /** Registrable factors. */
  registrableFactors?: Maybe<RegistrableFactors>;
};

/** Preferences for Opt-in MFA for an account. */
export type OptinMfaPreferences = {
  __typename?: 'OptinMfaPreferences';
  /** Number of seconds from when the account opted-out from MFA. */
  optOutAt?: Maybe<Scalars['Long']['output']>;
};

/** Information about pagination in a connection */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
};

/** Password age rule */
export type PasswordAge = {
  __typename?: 'PasswordAge';
  /** The instant (seconds since epoch) when the password was last set. The rule will require users to reset their password after the password age reaches a configured limit. */
  lastSetAt?: Maybe<Scalars['Long']['output']>;
};

/** Password age rule */
export type PasswordAgeInput = {
  /** The instant (seconds since epoch) when the password was last set. The rule will require users to reset their password after the password age reaches a configured limit. */
  lastSetAt?: InputMaybe<Scalars['Long']['input']>;
};

/** Password history rule. */
export type PasswordHistory = {
  __typename?: 'PasswordHistory';
  /** Length of the password history list. This may be used to truncate the password history, allowing users to re-use older passwords. */
  length?: Maybe<Scalars['Long']['output']>;
};

/** Password history rule. */
export type PasswordHistoryInput = {
  /** Length of the password history list. This may be used to truncate the password history, allowing users to re-use older passwords. */
  length?: InputMaybe<Scalars['Long']['input']>;
};

/** List of available Queries. */
export type Query = {
  __typename?: 'Query';
  /** Retrieves an account by email. */
  accountByEmail?: Maybe<Account>;
  /** Retrieves an account by account ID. */
  accountById?: Maybe<Account>;
  /** Retrieve an account by phone number. */
  accountByPhoneNumber?: Maybe<Account>;
  /** Retrieves an account by username. */
  accountByUserName?: Maybe<Account>;
  /** Retrieve all accounts with pagination */
  accounts: AccountConnection;
  /** Retrieves the buckets by user name and purposes. */
  bucketsByUserName: Array<Bucket>;
  /**
   * Retrieve the configured credential policy description.
   * EXPERIMENTAL: the schema for this field may change in non backwards-compatible ways.
   */
  credentialPolicy?: Maybe<CredentialPolicyDescriptor>;
  /** Retrieves the credential policies state by username. */
  credentialPolicyRulesStateByUserName?: Maybe<CredentialPolicyRulesState>;
  /** Obtains all authorizations granted by an owner */
  grantedAuthorizationsByOwner: GrantedAuthorizationConnection;
  /** Obtains all authorizations granted by an owner to a specific client */
  grantedAuthorizationsByOwnerAndClient: GrantedAuthorizationConnection;
};


/** List of available Queries. */
export type QueryAccountByEmailArgs = {
  email: Scalars['String']['input'];
};


/** List of available Queries. */
export type QueryAccountByIdArgs = {
  accountId: Scalars['String']['input'];
};


/** List of available Queries. */
export type QueryAccountByPhoneNumberArgs = {
  phoneNumber: Scalars['String']['input'];
};


/** List of available Queries. */
export type QueryAccountByUserNameArgs = {
  userName: Scalars['String']['input'];
};


/** List of available Queries. */
export type QueryAccountsArgs = {
  activeAccountsOnly?: InputMaybe<Scalars['Boolean']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  filtering?: InputMaybe<Filtering>;
  first?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<Scalars['Sorting']['input']>;
};


/** List of available Queries. */
export type QueryBucketsByUserNameArgs = {
  purposes: Array<Scalars['String']['input']>;
  userName: Scalars['String']['input'];
};


/** List of available Queries. */
export type QueryCredentialPolicyRulesStateByUserNameArgs = {
  userName: Scalars['String']['input'];
};


/** List of available Queries. */
export type QueryGrantedAuthorizationsByOwnerArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  owner: Scalars['String']['input'];
};


/** List of available Queries. */
export type QueryGrantedAuthorizationsByOwnerAndClientArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  clientId: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  owner: Scalars['String']['input'];
};

/** A batch of recovery codes. */
export type RecoveryCodeBatch = {
  __typename?: 'RecoveryCodeBatch';
  /** Recovery code batch ID. */
  batchId: Scalars['String']['output'];
  /** List of recovery codes. */
  codes: Array<RecoveryCodeValidation>;
  /** Creation time. */
  createdAt: Scalars['Long']['output'];
};

/** A recovery code, which may be consumed. */
export type RecoveryCodeValidation = {
  __typename?: 'RecoveryCodeValidation';
  /** Recovery code consumed indicator. */
  consumed: Scalars['Boolean']['output'];
  /** Consumption time. */
  consumedAt?: Maybe<Scalars['Long']['output']>;
};

/** A registered factor for opt-in MFA. */
export type RegisteredFactor = {
  __typename?: 'RegisteredFactor';
  /** Authentication Context Class Reference. */
  acr: Scalars['String']['output'];
  /** Changed at. */
  changedAt: Scalars['Long']['output'];
  /** A human-readable description for the authentication factor */
  description?: Maybe<Scalars['String']['output']>;
  /** Expected username. */
  expectedUserName: Scalars['String']['output'];
  /** A string with the authentication factor type (e.g. "totp") */
  type?: Maybe<Scalars['String']['output']>;
};

/** A list of registered factors for an account which opted in MFA. */
export type RegisteredFactors = {
  __typename?: 'RegisteredFactors';
  /** List of Opt-in MFA registered factors. */
  factors: Array<RegisteredFactor>;
};

/** A registrable factor available to be used with opt-in MFA */
export type RegistrableFactor = {
  __typename?: 'RegistrableFactor';
  /** Authentication Context Class Reference. */
  acr: Scalars['String']['output'];
  /** A human-readable description for the authentication factor */
  description?: Maybe<Scalars['String']['output']>;
  /** True if the user has devices associated to this factor and therefore can use the factor immediately */
  hasDevices?: Maybe<Scalars['Boolean']['output']>;
  /** A string with the authentication factor type (e.g. "totp") */
  type?: Maybe<Scalars['String']['output']>;
};

/** A list of registrable factors for an account which opted in MFA. */
export type RegistrableFactors = {
  __typename?: 'RegistrableFactors';
  /** List of Opt-in MFA registrable factors. */
  factors: Array<RegistrableFactor>;
};

/** Input to the `resetOptInMfaStateByAccountId` mutation. */
export type ResetOptInMfaStateByAccountIdInput = {
  /** The ID of the account from where the factor should be removed. */
  accountId: Scalars['String']['input'];
};

/** Result of the `resetOptInMfaStateByAccountId` mutation. */
export type ResetOptInMfaStateByAccountIdPayload = {
  __typename?: 'ResetOptInMfaStateByAccountIdPayload';
  /** `true` if MFA was configured and successfully deleted. */
  deleted: Scalars['Boolean']['output'];
};

/** Resource. */
export type Resource = {
  /** External ID */
  externalId?: Maybe<Scalars['String']['output']>;
  /** ID */
  id: Scalars['ID']['output'];
  /** Metadata */
  meta?: Maybe<Meta>;
};

/** Input to the revokeAuthorizationsByOwnerAndClient mutation */
export type RevokeGrantedAuthorizationByOwnerAndClientInput = {
  /** The client for which to revoke the authorizations. */
  clientId: Scalars['String']['input'];
  /** The resource owner for which to revoke the authorizations. */
  owner: Scalars['String']['input'];
};

/** Represents the result of a revoke operation */
export type RevokeGrantedAuthorizationPayload = {
  __typename?: 'RevokeGrantedAuthorizationPayload';
  /**
   * True if the revocation is going to be completed asynchronously,
   * meaning that it may take some time until being complete.
   */
  asynchronous: Scalars['Boolean']['output'];
  /**
   * True if the revocation is completed successful.
   * Note that there may be conditions that make it impossible for authorizations to be revoked,
   * event if the system is operating correctly.
   */
  success: Scalars['Boolean']['output'];
};

/** Input to the revokeAuthorizationsByOwner mutation */
export type RevokeGrantedAuthorizationsByOwnerInput = {
  /** The resource owner for which to revoke the authorizations. */
  owner: Scalars['String']['input'];
};

/**
 * Input to the 'sendPasswordResetEmail' mutation.
 * One of the accountId, username or email fields must be provided.
 */
export type SendPasswordResetInput = {
  /** The accountId of the user whom should a password reset email be sent. */
  accountId?: InputMaybe<Scalars['String']['input']>;
  /** The email of the user whom should a password reset email be sent. */
  email?: InputMaybe<Scalars['String']['input']>;
  /**
   * The locale to use for the email (e.g. en, sv...).
   * If not provided, the configured default-locale will be used.
   */
  locale?: InputMaybe<Scalars['String']['input']>;
  /** The username of the user whom should a password reset email be sent. */
  userName?: InputMaybe<Scalars['String']['input']>;
};

/** Result of the 'sendPasswordResetEmail' mutation. */
export type SendPasswordResetPayload = {
  __typename?: 'SendPasswordResetPayload';
  /** True if the password reset email was sent. */
  result: Scalars['Boolean']['output'];
};

/** Sort attribute. */
export enum SortAttribute {
  /** Created. */
  Created = 'created',
  /** Last modified. */
  LastModified = 'lastModified',
  /** Sort by resource name. Which field is used for sorting depends on the resource type. */
  Name = 'name'
}

/** Sort order. */
export enum SortOrder {
  /** Ascending */
  Ascending = 'ASCENDING',
  /** Descending */
  Descending = 'DESCENDING'
}

/** Input to the `startOptInMfaResetRecoveryCodesByAccountId` mutation. */
export type StartOptInMfaResetRecoveryCodesByAccountIdInput = {
  /** The ID of the account where to reset the recovery codes */
  accountId: Scalars['String']['input'];
};

/** Response of the `startOptInMfaResetRecoveryCodesByAccountId` mutation. */
export type StartOptInMfaResetRecoveryCodesByAccountIdPayload = {
  __typename?: 'StartOptInMfaResetRecoveryCodesByAccountIdPayload';
  /** Information about the recovery codes. */
  recoveryCodes: Array<OptInMfaRecoveryCode>;
  /** Transaction state. This value needs to be provided to the `completeOptInMfaResetRecoveryCodesByAccountId` mutation. */
  state: Scalars['String']['output'];
};

/** Input to the `startOptInMfaSetupByAccountId` mutation */
export type StartOptInMfaSetupByAccountIdInput = {
  /** The ID of the account where to setup opt-in MFA */
  accountId: Scalars['String']['input'];
  /** The list of factors to register (must have at least one factor) */
  factors: Array<FactorRegisterInput>;
};

/** Response of the `startOptInMfaSetupByAccountId` mutation */
export type StartOptInMfaSetupByAccountIdPayload = {
  __typename?: 'StartOptInMfaSetupByAccountIdPayload';
  /** Information about the factors that will be registered. */
  factors: Array<RegistrableFactor>;
  /** Information about the recovery codes, only present if recovery codes are enabled. */
  recoveryCodes?: Maybe<Array<OptInMfaRecoveryCode>>;
  /** Transaction state. This value needs to be provided to the `completeOptInMfaSetupByAccountId` mutation. */
  state: Scalars['String']['output'];
};

/** Input to the `startVerifyEmailAddressByAccountId` mutation. */
export type StartVerifyEmailAddressByAccountIdInput = {
  /** The accountId for which to register a new email address */
  accountId: Scalars['String']['input'];
  /** The email address to register */
  emailAddress: Scalars['String']['input'];
};

/** Result of the `startVerifyEmailAddressByAccountId` mutation. */
export type StartVerifyEmailAddressByAccountIdPayload = {
  __typename?: 'StartVerifyEmailAddressByAccountIdPayload';
  /**
   * The result of the `startVerifyEmailAddressByAccountId` mutation. When result is true, an OTP is sent to the email address
   * by the server, otherwise the email address was not accepted for verification.
   */
  result: Scalars['Boolean']['output'];
  /**
   * The state that needs to be included in the `completeVerifyEmailAddressByAccountId` mutation.
   * This state binds the Start request to the Complete request, and will only be valid for a limited time.
   */
  state?: Maybe<Scalars['String']['output']>;
};

/** Used when invoking the mutation to add a new Passkey. */
export type StartVerifyPasskeyByAccountIdInput = {
  /** The accountId for which to register a credential. */
  accountId: Scalars['String']['input'];
  /** The alias that the user wants to use to identify the new Passkey */
  alias: Scalars['String']['input'];
};

/** Result of the `startVerifyPasskeyByAccountId` mutation. */
export type StartVerifyPasskeyByAccountIdPayload = {
  __typename?: 'StartVerifyPasskeyByAccountIdPayload';
  /**
   * The Base64 URL encoded (no padding) credential options JSON object that is supposed to be passed to the WebAuthn API
   * (after being decoded).
   */
  credentialOptionsJson: Scalars['String']['output'];
  /**
   * The state that needs to be included in the `completeVerifyPasskeyByAccountId` mutation.
   * This state binds the Start request to the Complete request, and will only be valid for a limited time
   * (i.e. 300 seconds)
   */
  state: Scalars['String']['output'];
};

/** Used when invoking the mutation to verify a new phone number. */
export type StartVerifyPhoneNumberByAccountIdInput = {
  /** The accountId for which to register a new phone number */
  accountId: Scalars['String']['input'];
  /** The phone number to register */
  phoneNumber: Scalars['String']['input'];
};

/** Result of the `startVerifyPhoneNumberByAccountId` mutation. */
export type StartVerifyPhoneNumberByAccountIdPayload = {
  __typename?: 'StartVerifyPhoneNumberByAccountIdPayload';
  /**
   * When result is true, an OTP is sent to the provided phone number
   * by the server, otherwise the phone number was not accepted for verification.
   */
  result: Scalars['Boolean']['output'];
  /**
   * The state that needs to be included in the `completeVerifyPhoneNumberByAccountId` mutation.
   * This state binds the Start request to the Complete request, and will only be valid for a limited time.
   */
  state?: Maybe<Scalars['String']['output']>;
};

/** Input to the `startVerifyTotpDeviceByAccountId` mutation. */
export type StartVerifyTotpDeviceByAccountIdInput = {
  /** The accountId for which to register a new TOTP device */
  accountId: Scalars['String']['input'];
  /** The alias that the user wants to use to identify the new TOTP device */
  alias: Scalars['String']['input'];
};

/** Result of the `startVerifyTotpDeviceByAccountId` mutation. */
export type StartVerifyTotpDeviceByAccountIdPayload = {
  __typename?: 'StartVerifyTotpDeviceByAccountIdPayload';
  /** The algorithm to use on the TOTP device. */
  algorithm?: Maybe<Scalars['String']['output']>;
  /** The delayWindow that the TOTP authenticator uses */
  delayWindow?: Maybe<Scalars['Int']['output']>;
  /** The number of seconds after which a device expires, according to the TOTP authenticator. This is optional. */
  deviceExpiresIn?: Maybe<Scalars['Int']['output']>;
  /** The DeviceId that is to be registered. */
  deviceId: Scalars['String']['output'];
  /** The DeviceType of the TOTP autenticator */
  deviceType: Scalars['String']['output'];
  /** The number of digits to use on the TOTP device. */
  digits: Scalars['Int']['output'];
  /** The interval to use on the TOTP device. */
  interval?: Maybe<Scalars['Int']['output']>;
  /** The issuer to which the TOTP registration will be bound. */
  issuer: Scalars['String']['output'];
  /** The key to store in the TOTP device for the issuer. */
  key: Scalars['String']['output'];
  /** The link that can be encoded into a QR code that a TOTP device can use to initialize itself with the request. */
  qrLink: Scalars['String']['output'];
  /** The skew that the TOTP authenticator allows for */
  skew?: Maybe<Scalars['Int']['output']>;
  /**
   * The state that needs to be included in the `CompleteVerifyTotpDevice` mutation.
   * This state binds the Start request to the Complete request, and will only be valid for a limited time
   * (i.e. 300 seconds)
   */
  state: Scalars['String']['output'];
};

/**
 * Multi-valued values
 * (see [https://datatracker.ietf.org/doc/html/rfc7643#section-2.4](https://datatracker.ietf.org/doc/html/rfc7643#section-2.4))
 */
export type StringMultiValuedValue = {
  __typename?: 'StringMultiValuedValue';
  /** Element's representation for display purposes. */
  display?: Maybe<Scalars['String']['output']>;
  /** Primary indicator. */
  primary?: Maybe<Scalars['Boolean']['output']>;
  /** Element's type. */
  type?: Maybe<Scalars['String']['output']>;
  /** Element's value. */
  value?: Maybe<Scalars['String']['output']>;
};

/** Input required to define a multi-valued value. */
export type StringMultiValuedValueInput = {
  /** Element representation for display purposes. */
  display?: InputMaybe<Scalars['String']['input']>;
  /** Primary indicator. */
  primary?: InputMaybe<Scalars['Boolean']['input']>;
  /** Element type. */
  type?: InputMaybe<Scalars['String']['input']>;
  /** Elements value. */
  value: Scalars['String']['input'];
};

/**
 * Whether the client should issue pairwise pseudonym subject identifiers
 * or public identifiers.
 */
export enum SubjectType {
  /** Pairwise. */
  Pairwise = 'pairwise',
  /** Public. */
  Public = 'public'
}

/** Temporary lockout rule */
export type TemporaryLockout = {
  __typename?: 'TemporaryLockout';
  /** The instant (seconds since epoch) when the credential was last temporarily locked. */
  lockedAt?: Maybe<Scalars['Long']['output']>;
};

/** Temporary lockout rule */
export type TemporaryLockoutInput = {
  /** The instant (seconds since epoch) when the credential was last temporarily locked. */
  lockedAt?: InputMaybe<Scalars['Long']['input']>;
};

/** Token delivery mode. */
export enum TokenDeliveryMode {
  /** Ping. */
  Ping = 'ping',
  /** Poll. */
  Poll = 'poll',
  /** Push. */
  Push = 'push'
}

/** Information about a TOTP device. */
export type TotpDeviceDetails = {
  __typename?: 'TotpDeviceDetails';
  /**
   * Whether this device can be used to authenticate with the TOTP authenticator configured in
   * the user management profile.
   */
  canUseWithTotpAuthenticator?: Maybe<Scalars['Boolean']['output']>;
};

/** Input to the `UpdateAccountById` mutation */
export type UpdateAccountByIdInput = {
  /** The ID of the account to update. */
  accountId: Scalars['String']['input'];
  /** The fields to update. */
  fields: AccountUpdateFields;
};

/** Result of the `UpdateAccountById` mutation. */
export type UpdateAccountByIdPayload = {
  __typename?: 'UpdateAccountByIdPayload';
  /** The updated account. */
  account?: Maybe<Account>;
};

/**
 * Definition of the fields to update:
 * - A field with a `non-null` value means that the corresponding device attribute will be updated with that value.
 * - A field with the `null` value means that the corresponding device attribute will be removed.
 * - An absent field means that the corresponding device attribute will remain the same.
 */
export type UpdateDeviceFields = {
  /** Alias. */
  alias?: InputMaybe<Scalars['String']['input']>;
  /** Device type. */
  deviceType?: InputMaybe<Scalars['String']['input']>;
  /** Expires at. */
  expiresAt?: InputMaybe<Scalars['Long']['input']>;
  /** External ID. */
  externalId?: InputMaybe<Scalars['String']['input']>;
  /** Form factor. */
  formFactor?: InputMaybe<Scalars['String']['input']>;
  /** Owner */
  owner?: InputMaybe<Scalars['String']['input']>;
};

/** Input to the `UpdateDeviceFromAccountByAccountId` mutation. */
export type UpdateDeviceFromAccountByAccountIdInput = {
  /** Account ID. */
  accountId: Scalars['String']['input'];
  /** Definition of fields to update for a device. */
  deviceFields: UpdateDeviceFields;
  /** Device ID. */
  deviceId: Scalars['String']['input'];
};

/** Result of the `UpdateDeviceFromAccountByAccountId` mutation. */
export type UpdateDeviceFromAccountByAccountIdPayload = {
  __typename?: 'UpdateDeviceFromAccountByAccountIdPayload';
  /** The updated device. */
  device?: Maybe<Device>;
};

/** Input to the `updatePrimaryEmailAddressByAccountId` mutation. */
export type UpdatePrimaryEmailAddressByAccountIdInput = {
  /** The accountId for which to update the primary email address. */
  accountId: Scalars['String']['input'];
  /** The already existing and verified email address to set as the new primary email address. */
  newPrimaryEmailAddress: Scalars['String']['input'];
};

/** Result of the `updatePrimaryEmailAddressByAccountId` mutation. */
export type UpdatePrimaryEmailAddressByAccountIdPayload = {
  __typename?: 'UpdatePrimaryEmailAddressByAccountIdPayload';
  /**
   * Returns true when the new primary email address is set.
   * When the provided email address already was primary, this operation also returns true.
   */
  result: Scalars['Boolean']['output'];
};

/** Used when invoking the mutation to update the primary phone number. */
export type UpdatePrimaryPhoneNumberByAccountIdInput = {
  /** The accountId for which to update the primary phone number. */
  accountId: Scalars['String']['input'];
  /** The already existing and verified phone number to set as the new primary phone number. */
  newPrimaryPhoneNumber: Scalars['String']['input'];
};

/** Result of the `updatePrimaryPhoneNumberByAccountId` mutation. */
export type UpdatePrimaryPhoneNumberByAccountIdPayload = {
  __typename?: 'UpdatePrimaryPhoneNumberByAccountIdPayload';
  /**
   * Returns true when the new primary phone number is set.
   * When the provided phone number already was primary, this operation also returns true.
   */
  result: Scalars['Boolean']['output'];
};

/** Input to the `ValidatePasswordAndUpdateAccountById` mutation */
export type ValidatePasswordAndUpdateAccountByIdInput = {
  /** The ID of the account to update. */
  accountId: Scalars['String']['input'];
  /** The current password of the account to update. */
  currentPassword: Scalars['String']['input'];
  /** The fields to update. */
  fields: AccountUpdateFields;
};

/** Result of the `ValidatePasswordAndUpdateAccountById` mutation. */
export type ValidatePasswordAndUpdateAccountByIdPayload = {
  __typename?: 'ValidatePasswordAndUpdateAccountByIdPayload';
  /** The updated account. */
  account?: Maybe<Account>;
};

/** Information about a WebAuthn Authenticator. */
export type WebAuthnAuthenticator = {
  __typename?: 'WebAuthnAuthenticator';
  /** The dark version of the the WebAuthn Authenticator icon. */
  iconDarkUri?: Maybe<Scalars['String']['output']>;
  /** The light version of the the WebAuthn Authenticator icon. */
  iconLightUri?: Maybe<Scalars['String']['output']>;
  /** The name of the WebAuthn Authenticator. */
  name?: Maybe<Scalars['String']['output']>;
};

/** Information about a WebAuthnN device. */
export type WebAuthnDeviceDetails = {
  __typename?: 'WebAuthnDeviceDetails';
  /** The WebAuthn Authenticator where this WebAuthN device (credential) was created. */
  webAuthnAuthenticator?: Maybe<WebAuthnAuthenticator>;
};

export type RevokeGrantedAuthorizationsByOwnerMutationVariables = Exact<{
  input?: InputMaybe<RevokeGrantedAuthorizationsByOwnerInput>;
}>;


export type RevokeGrantedAuthorizationsByOwnerMutation = { __typename?: 'Mutation', revokeGrantedAuthorizationsByOwner?: { __typename?: 'RevokeGrantedAuthorizationPayload', success: boolean, asynchronous: boolean } | null };

export type RevokeGrantedAuthorizationsByOwnerAndClientMutationVariables = Exact<{
  input?: InputMaybe<RevokeGrantedAuthorizationByOwnerAndClientInput>;
}>;


export type RevokeGrantedAuthorizationsByOwnerAndClientMutation = { __typename?: 'Mutation', revokeGrantedAuthorizationsByOwnerAndClient?: { __typename?: 'RevokeGrantedAuthorizationPayload', success: boolean, asynchronous: boolean } | null };

export type GetGrantedAuthorizationsByOwnerQueryVariables = Exact<{
  owner: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGrantedAuthorizationsByOwnerQuery = { __typename?: 'Query', grantedAuthorizationsByOwner: { __typename?: 'GrantedAuthorizationConnection', totalCount: any, edges: Array<{ __typename?: 'GrantedAuthorizationEdge', node: { __typename?: 'GrantedAuthorization', owner: string, authorizedClient: { __typename?: 'AuthorizedOAuthClient', id: string, name?: string | null, description?: string | null, logoUri?: string | null }, authorizedScopes: Array<{ __typename?: 'AuthorizedScope', name: string, localizedName: string, description?: string | null }>, authorizedClaims: Array<{ __typename?: 'AuthorizedClaim', name: string, localizedName: string, description?: string | null }>, meta: { __typename?: 'Meta', created: any, lastModified: any } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean }, warnings?: Array<{ __typename?: 'GrantedAuthorizationQueryResultWarning', type: GrantedAuthorizationQueryResultWarningType }> | null } };

export type GetGrantedAuthorizationsByOwnerAndClientQueryVariables = Exact<{
  owner: Scalars['String']['input'];
  clientId: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGrantedAuthorizationsByOwnerAndClientQuery = { __typename?: 'Query', grantedAuthorizationsByOwnerAndClient: { __typename?: 'GrantedAuthorizationConnection', totalCount: any, edges: Array<{ __typename?: 'GrantedAuthorizationEdge', node: { __typename?: 'GrantedAuthorization', owner: string, authorizedClient: { __typename?: 'AuthorizedOAuthClient', id: string, name?: string | null, description?: string | null, logoUri?: string | null }, authorizedScopes: Array<{ __typename?: 'AuthorizedScope', name: string, localizedName: string, description?: string | null }>, authorizedClaims: Array<{ __typename?: 'AuthorizedClaim', name: string, localizedName: string, description?: string | null }>, meta: { __typename?: 'Meta', created: any, lastModified: any } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean }, warnings?: Array<{ __typename?: 'GrantedAuthorizationQueryResultWarning', type: GrantedAuthorizationQueryResultWarningType }> | null } };

export type Multi_Valued_Value_FieldsFragment = { __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null };

export type User_Accounts_List_FieldsFragment = { __typename?: 'Account', id: string, userName: string, displayName?: string | null, nickName?: string | null, title?: string | null, locale?: string | null, timeZone?: string | null, active: boolean, name?: { __typename?: 'Name', givenName?: string | null, familyName?: string | null } | null, emails?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, phoneNumbers?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, addresses?: Array<{ __typename?: 'Address', streetAddress?: string | null, locality?: string | null, region?: string | null, postalCode?: string | null, country?: string | null, primary?: boolean | null, type?: string | null } | null> | null, groups?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, entitlements?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, roles?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string } | null };

export type Device_FieldsFragment = { __typename?: 'Device', deviceId: string, deviceType?: string | null, expiresAt?: any | null, alias?: string | null, category?: { __typename?: 'DeviceCategory', name: string } | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string, timeZoneId?: string | null } | null, details?:
    | { __typename: 'TotpDeviceDetails', canUseWithTotpAuthenticator?: boolean | null }
    | { __typename: 'WebAuthnDeviceDetails', webAuthnAuthenticator?: { __typename?: 'WebAuthnAuthenticator', name?: string | null, iconDarkUri?: string | null, iconLightUri?: string | null } | null }
   | null };

export type Client_FieldsFragment = { __typename?: 'DynamicallyRegisteredClient', authenticated_user?: string | null, client_id: string, client_id_issued_at?: any | null, client_name?: string | null, grant_types: Array<string>, redirect_uris: Array<string>, response_types: Array<string>, scope: string, software_id?: string | null, status: DynamicallyRegisteredClientStatus, subject_type: SubjectType, token_endpoint_auth_methods: Array<string> };

export type User_Account_FieldsFragment = { __typename?: 'Account', id: string, userName: string, displayName?: string | null, nickName?: string | null, title?: string | null, locale?: string | null, timeZone?: string | null, active: boolean, devices?: Array<{ __typename?: 'Device', deviceId: string, deviceType?: string | null, expiresAt?: any | null, alias?: string | null, category?: { __typename?: 'DeviceCategory', name: string } | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string, timeZoneId?: string | null } | null, details?:
      | { __typename: 'TotpDeviceDetails', canUseWithTotpAuthenticator?: boolean | null }
      | { __typename: 'WebAuthnDeviceDetails', webAuthnAuthenticator?: { __typename?: 'WebAuthnAuthenticator', name?: string | null, iconDarkUri?: string | null, iconLightUri?: string | null } | null }
     | null } | null> | null, linkedAccounts?: Array<{ __typename?: 'LinkedAccount', value: string, domain: string, created: any } | null> | null, mfaOptIn?: { __typename?: 'OptinMfa', registeredFactors: { __typename?: 'RegisteredFactors', factors: Array<{ __typename?: 'RegisteredFactor', acr: string, expectedUserName: string, changedAt: any, description?: string | null, type?: string | null }> }, registrableFactors?: { __typename?: 'RegistrableFactors', factors: Array<{ __typename?: 'RegistrableFactor', acr: string, description?: string | null, type?: string | null, hasDevices?: boolean | null }> } | null, preferences?: { __typename?: 'OptinMfaPreferences', optOutAt?: any | null } | null, recoveryCodeBatch?: { __typename?: 'RecoveryCodeBatch', batchId: string, createdAt: any, codes: Array<{ __typename?: 'RecoveryCodeValidation', consumed: boolean, consumedAt?: any | null }> } | null } | null, dynamicClients?: Array<{ __typename?: 'DynamicallyRegisteredClient', authenticated_user?: string | null, client_id: string, client_id_issued_at?: any | null, client_name?: string | null, grant_types: Array<string>, redirect_uris: Array<string>, response_types: Array<string>, scope: string, software_id?: string | null, status: DynamicallyRegisteredClientStatus, subject_type: SubjectType, token_endpoint_auth_methods: Array<string> } | null> | null, name?: { __typename?: 'Name', givenName?: string | null, familyName?: string | null } | null, emails?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, phoneNumbers?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, addresses?: Array<{ __typename?: 'Address', streetAddress?: string | null, locality?: string | null, region?: string | null, postalCode?: string | null, country?: string | null, primary?: boolean | null, type?: string | null } | null> | null, groups?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, entitlements?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, roles?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string } | null };

export type AddDeviceToAccountByAccountIdMutationVariables = Exact<{
  input: AddDeviceToAccountByAccountIdInput;
}>;


export type AddDeviceToAccountByAccountIdMutation = { __typename?: 'Mutation', addDeviceToAccountByAccountId?: { __typename?: 'AddDeviceToAccountByAccountIdPayload', device?: { __typename?: 'Device', deviceId: string, deviceType?: string | null, expiresAt?: any | null, alias?: string | null, category?: { __typename?: 'DeviceCategory', name: string } | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string, timeZoneId?: string | null } | null, details?:
        | { __typename: 'TotpDeviceDetails', canUseWithTotpAuthenticator?: boolean | null }
        | { __typename: 'WebAuthnDeviceDetails', webAuthnAuthenticator?: { __typename?: 'WebAuthnAuthenticator', name?: string | null, iconDarkUri?: string | null, iconLightUri?: string | null } | null }
       | null } | null } | null };

export type UpdateDeviceFromAccountByAccountIdMutationVariables = Exact<{
  input: UpdateDeviceFromAccountByAccountIdInput;
}>;


export type UpdateDeviceFromAccountByAccountIdMutation = { __typename?: 'Mutation', updateDeviceFromAccountByAccountId?: { __typename?: 'UpdateDeviceFromAccountByAccountIdPayload', device?: { __typename?: 'Device', deviceId: string, deviceType?: string | null, expiresAt?: any | null, alias?: string | null, category?: { __typename?: 'DeviceCategory', name: string } | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string, timeZoneId?: string | null } | null, details?:
        | { __typename: 'TotpDeviceDetails', canUseWithTotpAuthenticator?: boolean | null }
        | { __typename: 'WebAuthnDeviceDetails', webAuthnAuthenticator?: { __typename?: 'WebAuthnAuthenticator', name?: string | null, iconDarkUri?: string | null, iconLightUri?: string | null } | null }
       | null } | null } | null };

export type DeleteOptInMfaFactorFromAccountByAccountIdMutationVariables = Exact<{
  input: DeleteOptInMfaFactorFromAccountByAccountIdInput;
}>;


export type DeleteOptInMfaFactorFromAccountByAccountIdMutation = { __typename?: 'Mutation', deleteOptInMfaFactorFromAccountByAccountId?: { __typename?: 'DeleteOptInMfaFactorFromAccountByAccountIdPayload', deleted: boolean } | null };

export type ResetOptInMfaStateByAccountIdMutationVariables = Exact<{
  input: ResetOptInMfaStateByAccountIdInput;
}>;


export type ResetOptInMfaStateByAccountIdMutation = { __typename?: 'Mutation', resetOptInMfaStateByAccountId?: { __typename?: 'ResetOptInMfaStateByAccountIdPayload', deleted: boolean } | null };

export type UpdateAccountByIdMutationVariables = Exact<{
  input: UpdateAccountByIdInput;
}>;


export type UpdateAccountByIdMutation = { __typename?: 'Mutation', updateAccountById?: { __typename?: 'UpdateAccountByIdPayload', account?: { __typename?: 'Account', id: string, userName: string, displayName?: string | null, nickName?: string | null, title?: string | null, locale?: string | null, timeZone?: string | null, active: boolean, devices?: Array<{ __typename?: 'Device', deviceId: string, deviceType?: string | null, expiresAt?: any | null, alias?: string | null, category?: { __typename?: 'DeviceCategory', name: string } | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string, timeZoneId?: string | null } | null, details?:
          | { __typename: 'TotpDeviceDetails', canUseWithTotpAuthenticator?: boolean | null }
          | { __typename: 'WebAuthnDeviceDetails', webAuthnAuthenticator?: { __typename?: 'WebAuthnAuthenticator', name?: string | null, iconDarkUri?: string | null, iconLightUri?: string | null } | null }
         | null } | null> | null, linkedAccounts?: Array<{ __typename?: 'LinkedAccount', value: string, domain: string, created: any } | null> | null, mfaOptIn?: { __typename?: 'OptinMfa', registeredFactors: { __typename?: 'RegisteredFactors', factors: Array<{ __typename?: 'RegisteredFactor', acr: string, expectedUserName: string, changedAt: any, description?: string | null, type?: string | null }> }, registrableFactors?: { __typename?: 'RegistrableFactors', factors: Array<{ __typename?: 'RegistrableFactor', acr: string, description?: string | null, type?: string | null, hasDevices?: boolean | null }> } | null, preferences?: { __typename?: 'OptinMfaPreferences', optOutAt?: any | null } | null, recoveryCodeBatch?: { __typename?: 'RecoveryCodeBatch', batchId: string, createdAt: any, codes: Array<{ __typename?: 'RecoveryCodeValidation', consumed: boolean, consumedAt?: any | null }> } | null } | null, dynamicClients?: Array<{ __typename?: 'DynamicallyRegisteredClient', authenticated_user?: string | null, client_id: string, client_id_issued_at?: any | null, client_name?: string | null, grant_types: Array<string>, redirect_uris: Array<string>, response_types: Array<string>, scope: string, software_id?: string | null, status: DynamicallyRegisteredClientStatus, subject_type: SubjectType, token_endpoint_auth_methods: Array<string> } | null> | null, name?: { __typename?: 'Name', givenName?: string | null, familyName?: string | null } | null, emails?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, phoneNumbers?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, addresses?: Array<{ __typename?: 'Address', streetAddress?: string | null, locality?: string | null, region?: string | null, postalCode?: string | null, country?: string | null, primary?: boolean | null, type?: string | null } | null> | null, groups?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, entitlements?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, roles?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string } | null } | null } | null };

export type CreateAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount?: { __typename?: 'CreateAccountPayload', account?: { __typename?: 'Account', id: string, userName: string, displayName?: string | null, nickName?: string | null, title?: string | null, locale?: string | null, timeZone?: string | null, active: boolean, devices?: Array<{ __typename?: 'Device', deviceId: string, deviceType?: string | null, expiresAt?: any | null, alias?: string | null, category?: { __typename?: 'DeviceCategory', name: string } | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string, timeZoneId?: string | null } | null, details?:
          | { __typename: 'TotpDeviceDetails', canUseWithTotpAuthenticator?: boolean | null }
          | { __typename: 'WebAuthnDeviceDetails', webAuthnAuthenticator?: { __typename?: 'WebAuthnAuthenticator', name?: string | null, iconDarkUri?: string | null, iconLightUri?: string | null } | null }
         | null } | null> | null, linkedAccounts?: Array<{ __typename?: 'LinkedAccount', value: string, domain: string, created: any } | null> | null, mfaOptIn?: { __typename?: 'OptinMfa', registeredFactors: { __typename?: 'RegisteredFactors', factors: Array<{ __typename?: 'RegisteredFactor', acr: string, expectedUserName: string, changedAt: any, description?: string | null, type?: string | null }> }, registrableFactors?: { __typename?: 'RegistrableFactors', factors: Array<{ __typename?: 'RegistrableFactor', acr: string, description?: string | null, type?: string | null, hasDevices?: boolean | null }> } | null, preferences?: { __typename?: 'OptinMfaPreferences', optOutAt?: any | null } | null, recoveryCodeBatch?: { __typename?: 'RecoveryCodeBatch', batchId: string, createdAt: any, codes: Array<{ __typename?: 'RecoveryCodeValidation', consumed: boolean, consumedAt?: any | null }> } | null } | null, dynamicClients?: Array<{ __typename?: 'DynamicallyRegisteredClient', authenticated_user?: string | null, client_id: string, client_id_issued_at?: any | null, client_name?: string | null, grant_types: Array<string>, redirect_uris: Array<string>, response_types: Array<string>, scope: string, software_id?: string | null, status: DynamicallyRegisteredClientStatus, subject_type: SubjectType, token_endpoint_auth_methods: Array<string> } | null> | null, name?: { __typename?: 'Name', givenName?: string | null, familyName?: string | null } | null, emails?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, phoneNumbers?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, addresses?: Array<{ __typename?: 'Address', streetAddress?: string | null, locality?: string | null, region?: string | null, postalCode?: string | null, country?: string | null, primary?: boolean | null, type?: string | null } | null> | null, groups?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, entitlements?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, roles?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string } | null } | null } | null };

export type DeleteAccountByIdMutationVariables = Exact<{
  input: DeleteAccountByIdInput;
}>;


export type DeleteAccountByIdMutation = { __typename?: 'Mutation', deleteAccountById?: { __typename?: 'DeleteAccountByIdPayload', deleted: boolean } | null };

export type DeleteDeviceFromAccountByAccountIdMutationVariables = Exact<{
  input: DeleteDeviceFromAccountByAccountIdInput;
}>;


export type DeleteDeviceFromAccountByAccountIdMutation = { __typename?: 'Mutation', deleteDeviceFromAccountByAccountId?: { __typename?: 'DeleteDeviceFromAccountByAccountIdPayload', deleted: boolean } | null };

export type DeleteLinkFromAccountByAccountIdMutationVariables = Exact<{
  input: DeleteLinkFromAccountByAccountIdInput;
}>;


export type DeleteLinkFromAccountByAccountIdMutation = { __typename?: 'Mutation', deleteLinkFromAccountByAccountId?: { __typename?: 'DeleteLinkFromAccountByAccountIdPayload', deleted: boolean } | null };

export type StartVerifyTotpDeviceByAccountIdMutationVariables = Exact<{
  input: StartVerifyTotpDeviceByAccountIdInput;
}>;


export type StartVerifyTotpDeviceByAccountIdMutation = { __typename?: 'Mutation', startVerifyTotpDeviceByAccountId?: { __typename?: 'StartVerifyTotpDeviceByAccountIdPayload', state: string, deviceId: string, issuer: string, key: string, digits: number, interval?: number | null, algorithm?: string | null, skew?: number | null, delayWindow?: number | null, deviceType: string, deviceExpiresIn?: number | null, qrLink: string } | null };

export type CompleteVerifyTotpDeviceByAccountIdMutationVariables = Exact<{
  input: CompleteVerifyTotpDeviceByAccountIdInput;
}>;


export type CompleteVerifyTotpDeviceByAccountIdMutation = { __typename?: 'Mutation', completeVerifyTotpDeviceByAccountId?: { __typename?: 'CompleteVerifyTotpDeviceByAccountIdPayload', result: boolean } | null };

export type StartVerifyEmailAddressByAccountIdMutationVariables = Exact<{
  input: StartVerifyEmailAddressByAccountIdInput;
}>;


export type StartVerifyEmailAddressByAccountIdMutation = { __typename?: 'Mutation', startVerifyEmailAddressByAccountId?: { __typename?: 'StartVerifyEmailAddressByAccountIdPayload', result: boolean, state?: string | null } | null };

export type CompleteVerifyEmailAddressByAccountIdMutationVariables = Exact<{
  input: CompleteVerifyEmailAddressByAccountIdInput;
}>;


export type CompleteVerifyEmailAddressByAccountIdMutation = { __typename?: 'Mutation', completeVerifyEmailAddressByAccountId?: { __typename?: 'CompleteVerifyEmailAddressByAccountIdPayload', result: boolean } | null };

export type DeleteEmailAddressByAccountIdMutationVariables = Exact<{
  input: DeleteEmailAddressByAccountIdInput;
}>;


export type DeleteEmailAddressByAccountIdMutation = { __typename?: 'Mutation', deleteEmailAddressByAccountId?: { __typename?: 'DeleteEmailAddressByAccountIdPayload', result: boolean } | null };

export type UpdatePrimaryEmailAddressByAccountIdMutationVariables = Exact<{
  input: UpdatePrimaryEmailAddressByAccountIdInput;
}>;


export type UpdatePrimaryEmailAddressByAccountIdMutation = { __typename?: 'Mutation', updatePrimaryEmailAddressByAccountId?: { __typename?: 'UpdatePrimaryEmailAddressByAccountIdPayload', result: boolean } | null };

export type StartVerifyPhoneNumberByAccountIdMutationVariables = Exact<{
  input: StartVerifyPhoneNumberByAccountIdInput;
}>;


export type StartVerifyPhoneNumberByAccountIdMutation = { __typename?: 'Mutation', startVerifyPhoneNumberByAccountId?: { __typename?: 'StartVerifyPhoneNumberByAccountIdPayload', result: boolean, state?: string | null } | null };

export type CompleteVerifyPhoneNumberByAccountIdMutationVariables = Exact<{
  input: CompleteVerifyPhoneNumberByAccountIdInput;
}>;


export type CompleteVerifyPhoneNumberByAccountIdMutation = { __typename?: 'Mutation', completeVerifyPhoneNumberByAccountId?: { __typename?: 'CompleteVerifyPhoneNumberByAccountIdPayload', result: boolean } | null };

export type DeletePhoneNumberByAccountIdMutationVariables = Exact<{
  input: DeletePhoneNumberByAccountIdInput;
}>;


export type DeletePhoneNumberByAccountIdMutation = { __typename?: 'Mutation', deletePhoneNumberByAccountId?: { __typename?: 'DeletePhoneNumberByAccountIdPayload', result: boolean } | null };

export type UpdatePrimaryPhoneNumberByAccountIdMutationVariables = Exact<{
  input: UpdatePrimaryPhoneNumberByAccountIdInput;
}>;


export type UpdatePrimaryPhoneNumberByAccountIdMutation = { __typename?: 'Mutation', updatePrimaryPhoneNumberByAccountId?: { __typename?: 'UpdatePrimaryPhoneNumberByAccountIdPayload', result: boolean } | null };

export type ValidatePasswordAndUpdateAccountByIdMutationVariables = Exact<{
  input: ValidatePasswordAndUpdateAccountByIdInput;
}>;


export type ValidatePasswordAndUpdateAccountByIdMutation = { __typename?: 'Mutation', validatePasswordAndUpdateAccountById?: { __typename?: 'ValidatePasswordAndUpdateAccountByIdPayload', account?: { __typename?: 'Account', id: string, userName: string, displayName?: string | null, nickName?: string | null, title?: string | null, locale?: string | null, timeZone?: string | null, active: boolean, devices?: Array<{ __typename?: 'Device', deviceId: string, deviceType?: string | null, expiresAt?: any | null, alias?: string | null, category?: { __typename?: 'DeviceCategory', name: string } | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string, timeZoneId?: string | null } | null, details?:
          | { __typename: 'TotpDeviceDetails', canUseWithTotpAuthenticator?: boolean | null }
          | { __typename: 'WebAuthnDeviceDetails', webAuthnAuthenticator?: { __typename?: 'WebAuthnAuthenticator', name?: string | null, iconDarkUri?: string | null, iconLightUri?: string | null } | null }
         | null } | null> | null, linkedAccounts?: Array<{ __typename?: 'LinkedAccount', value: string, domain: string, created: any } | null> | null, mfaOptIn?: { __typename?: 'OptinMfa', registeredFactors: { __typename?: 'RegisteredFactors', factors: Array<{ __typename?: 'RegisteredFactor', acr: string, expectedUserName: string, changedAt: any, description?: string | null, type?: string | null }> }, registrableFactors?: { __typename?: 'RegistrableFactors', factors: Array<{ __typename?: 'RegistrableFactor', acr: string, description?: string | null, type?: string | null, hasDevices?: boolean | null }> } | null, preferences?: { __typename?: 'OptinMfaPreferences', optOutAt?: any | null } | null, recoveryCodeBatch?: { __typename?: 'RecoveryCodeBatch', batchId: string, createdAt: any, codes: Array<{ __typename?: 'RecoveryCodeValidation', consumed: boolean, consumedAt?: any | null }> } | null } | null, dynamicClients?: Array<{ __typename?: 'DynamicallyRegisteredClient', authenticated_user?: string | null, client_id: string, client_id_issued_at?: any | null, client_name?: string | null, grant_types: Array<string>, redirect_uris: Array<string>, response_types: Array<string>, scope: string, software_id?: string | null, status: DynamicallyRegisteredClientStatus, subject_type: SubjectType, token_endpoint_auth_methods: Array<string> } | null> | null, name?: { __typename?: 'Name', givenName?: string | null, familyName?: string | null } | null, emails?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, phoneNumbers?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, addresses?: Array<{ __typename?: 'Address', streetAddress?: string | null, locality?: string | null, region?: string | null, postalCode?: string | null, country?: string | null, primary?: boolean | null, type?: string | null } | null> | null, groups?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, entitlements?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, roles?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string } | null } | null } | null };

export type AddOptInMfaFactorToAccountByAccountIdMutationVariables = Exact<{
  input: AddOptInMfaFactorToAccountByAccountIdInput;
}>;


export type AddOptInMfaFactorToAccountByAccountIdMutation = { __typename?: 'Mutation', addOptInMfaFactorToAccountByAccountId?: { __typename?: 'AddOptInMfaFactorToAccountByAccountIdPayload', added: boolean } | null };

export type OptOutFromOptInMfaByAccountIdMutationVariables = Exact<{
  input: OptOutFromOptInMfaByAccountIdInput;
}>;


export type OptOutFromOptInMfaByAccountIdMutation = { __typename?: 'Mutation', optOutFromOptInMfaByAccountId?: { __typename?: 'OptOutFromOptInMfaByAccountIdPayload', optedOut: boolean } | null };

export type StartOptInMfaSetupByAccountIdMutationVariables = Exact<{
  input: StartOptInMfaSetupByAccountIdInput;
}>;


export type StartOptInMfaSetupByAccountIdMutation = { __typename?: 'Mutation', startOptInMfaSetupByAccountId?: { __typename?: 'StartOptInMfaSetupByAccountIdPayload', state: string, factors: Array<{ __typename?: 'RegistrableFactor', acr: string, description?: string | null, type?: string | null, hasDevices?: boolean | null }>, recoveryCodes?: Array<{ __typename?: 'OptInMfaRecoveryCode', value: string }> | null } | null };

export type CompleteOptInMfaSetupByAccountIdMutationVariables = Exact<{
  input: CompleteOptInMfaSetupByAccountIdInput;
}>;


export type CompleteOptInMfaSetupByAccountIdMutation = { __typename?: 'Mutation', completeOptInMfaSetupByAccountId?: { __typename?: 'CompleteOptInMfaSetupByAccountIdPayload', account?: { __typename?: 'Account', id: string, userName: string, displayName?: string | null, nickName?: string | null, title?: string | null, locale?: string | null, timeZone?: string | null, active: boolean, devices?: Array<{ __typename?: 'Device', deviceId: string, deviceType?: string | null, expiresAt?: any | null, alias?: string | null, category?: { __typename?: 'DeviceCategory', name: string } | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string, timeZoneId?: string | null } | null, details?:
          | { __typename: 'TotpDeviceDetails', canUseWithTotpAuthenticator?: boolean | null }
          | { __typename: 'WebAuthnDeviceDetails', webAuthnAuthenticator?: { __typename?: 'WebAuthnAuthenticator', name?: string | null, iconDarkUri?: string | null, iconLightUri?: string | null } | null }
         | null } | null> | null, linkedAccounts?: Array<{ __typename?: 'LinkedAccount', value: string, domain: string, created: any } | null> | null, mfaOptIn?: { __typename?: 'OptinMfa', registeredFactors: { __typename?: 'RegisteredFactors', factors: Array<{ __typename?: 'RegisteredFactor', acr: string, expectedUserName: string, changedAt: any, description?: string | null, type?: string | null }> }, registrableFactors?: { __typename?: 'RegistrableFactors', factors: Array<{ __typename?: 'RegistrableFactor', acr: string, description?: string | null, type?: string | null, hasDevices?: boolean | null }> } | null, preferences?: { __typename?: 'OptinMfaPreferences', optOutAt?: any | null } | null, recoveryCodeBatch?: { __typename?: 'RecoveryCodeBatch', batchId: string, createdAt: any, codes: Array<{ __typename?: 'RecoveryCodeValidation', consumed: boolean, consumedAt?: any | null }> } | null } | null, dynamicClients?: Array<{ __typename?: 'DynamicallyRegisteredClient', authenticated_user?: string | null, client_id: string, client_id_issued_at?: any | null, client_name?: string | null, grant_types: Array<string>, redirect_uris: Array<string>, response_types: Array<string>, scope: string, software_id?: string | null, status: DynamicallyRegisteredClientStatus, subject_type: SubjectType, token_endpoint_auth_methods: Array<string> } | null> | null, name?: { __typename?: 'Name', givenName?: string | null, familyName?: string | null } | null, emails?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, phoneNumbers?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, addresses?: Array<{ __typename?: 'Address', streetAddress?: string | null, locality?: string | null, region?: string | null, postalCode?: string | null, country?: string | null, primary?: boolean | null, type?: string | null } | null> | null, groups?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, entitlements?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, roles?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string } | null } | null } | null };

export type StartOptInMfaResetRecoveryCodesByAccountIdMutationVariables = Exact<{
  input: StartOptInMfaResetRecoveryCodesByAccountIdInput;
}>;


export type StartOptInMfaResetRecoveryCodesByAccountIdMutation = { __typename?: 'Mutation', startOptInMfaResetRecoveryCodesByAccountId?: { __typename?: 'StartOptInMfaResetRecoveryCodesByAccountIdPayload', state: string, recoveryCodes: Array<{ __typename?: 'OptInMfaRecoveryCode', value: string }> } | null };

export type CompleteOptInMfaResetRecoveryCodesByAccountIdMutationVariables = Exact<{
  input: CompleteOptInMfaResetRecoveryCodesByAccountIdInput;
}>;


export type CompleteOptInMfaResetRecoveryCodesByAccountIdMutation = { __typename?: 'Mutation', completeOptInMfaResetRecoveryCodesByAccountId?: { __typename?: 'CompleteOptInMfaResetRecoveryCodesByAccountIdPayload', account?: { __typename?: 'Account', id: string, userName: string, displayName?: string | null, nickName?: string | null, title?: string | null, locale?: string | null, timeZone?: string | null, active: boolean, devices?: Array<{ __typename?: 'Device', deviceId: string, deviceType?: string | null, expiresAt?: any | null, alias?: string | null, category?: { __typename?: 'DeviceCategory', name: string } | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string, timeZoneId?: string | null } | null, details?:
          | { __typename: 'TotpDeviceDetails', canUseWithTotpAuthenticator?: boolean | null }
          | { __typename: 'WebAuthnDeviceDetails', webAuthnAuthenticator?: { __typename?: 'WebAuthnAuthenticator', name?: string | null, iconDarkUri?: string | null, iconLightUri?: string | null } | null }
         | null } | null> | null, linkedAccounts?: Array<{ __typename?: 'LinkedAccount', value: string, domain: string, created: any } | null> | null, mfaOptIn?: { __typename?: 'OptinMfa', registeredFactors: { __typename?: 'RegisteredFactors', factors: Array<{ __typename?: 'RegisteredFactor', acr: string, expectedUserName: string, changedAt: any, description?: string | null, type?: string | null }> }, registrableFactors?: { __typename?: 'RegistrableFactors', factors: Array<{ __typename?: 'RegistrableFactor', acr: string, description?: string | null, type?: string | null, hasDevices?: boolean | null }> } | null, preferences?: { __typename?: 'OptinMfaPreferences', optOutAt?: any | null } | null, recoveryCodeBatch?: { __typename?: 'RecoveryCodeBatch', batchId: string, createdAt: any, codes: Array<{ __typename?: 'RecoveryCodeValidation', consumed: boolean, consumedAt?: any | null }> } | null } | null, dynamicClients?: Array<{ __typename?: 'DynamicallyRegisteredClient', authenticated_user?: string | null, client_id: string, client_id_issued_at?: any | null, client_name?: string | null, grant_types: Array<string>, redirect_uris: Array<string>, response_types: Array<string>, scope: string, software_id?: string | null, status: DynamicallyRegisteredClientStatus, subject_type: SubjectType, token_endpoint_auth_methods: Array<string> } | null> | null, name?: { __typename?: 'Name', givenName?: string | null, familyName?: string | null } | null, emails?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, phoneNumbers?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, addresses?: Array<{ __typename?: 'Address', streetAddress?: string | null, locality?: string | null, region?: string | null, postalCode?: string | null, country?: string | null, primary?: boolean | null, type?: string | null } | null> | null, groups?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, entitlements?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, roles?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string } | null } | null } | null };

export type StartVerifyPasskeyByAccountIdMutationVariables = Exact<{
  input: StartVerifyPasskeyByAccountIdInput;
}>;


export type StartVerifyPasskeyByAccountIdMutation = { __typename?: 'Mutation', startVerifyPasskeyByAccountId?: { __typename?: 'StartVerifyPasskeyByAccountIdPayload', state: string, credentialOptionsJson: string } | null };

export type CompleteVerifyPasskeyByAccountIdMutationVariables = Exact<{
  input: CompleteVerifyPasskeyByAccountIdInput;
}>;


export type CompleteVerifyPasskeyByAccountIdMutation = { __typename?: 'Mutation', completeVerifyPasskeyByAccountId?: { __typename?: 'CompleteVerifyPasskeyByAccountIdPayload', result: boolean } | null };

export type GetAccountByUserNameQueryVariables = Exact<{
  userName: Scalars['String']['input'];
}>;


export type GetAccountByUserNameQuery = { __typename?: 'Query', accountByUserName?: { __typename?: 'Account', id: string, userName: string, displayName?: string | null, nickName?: string | null, title?: string | null, locale?: string | null, timeZone?: string | null, active: boolean, devices?: Array<{ __typename?: 'Device', deviceId: string, deviceType?: string | null, expiresAt?: any | null, alias?: string | null, category?: { __typename?: 'DeviceCategory', name: string } | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string, timeZoneId?: string | null } | null, details?:
        | { __typename: 'TotpDeviceDetails', canUseWithTotpAuthenticator?: boolean | null }
        | { __typename: 'WebAuthnDeviceDetails', webAuthnAuthenticator?: { __typename?: 'WebAuthnAuthenticator', name?: string | null, iconDarkUri?: string | null, iconLightUri?: string | null } | null }
       | null } | null> | null, linkedAccounts?: Array<{ __typename?: 'LinkedAccount', value: string, domain: string, created: any } | null> | null, mfaOptIn?: { __typename?: 'OptinMfa', registeredFactors: { __typename?: 'RegisteredFactors', factors: Array<{ __typename?: 'RegisteredFactor', acr: string, expectedUserName: string, changedAt: any, description?: string | null, type?: string | null }> }, registrableFactors?: { __typename?: 'RegistrableFactors', factors: Array<{ __typename?: 'RegistrableFactor', acr: string, description?: string | null, type?: string | null, hasDevices?: boolean | null }> } | null, preferences?: { __typename?: 'OptinMfaPreferences', optOutAt?: any | null } | null, recoveryCodeBatch?: { __typename?: 'RecoveryCodeBatch', batchId: string, createdAt: any, codes: Array<{ __typename?: 'RecoveryCodeValidation', consumed: boolean, consumedAt?: any | null }> } | null } | null, dynamicClients?: Array<{ __typename?: 'DynamicallyRegisteredClient', authenticated_user?: string | null, client_id: string, client_id_issued_at?: any | null, client_name?: string | null, grant_types: Array<string>, redirect_uris: Array<string>, response_types: Array<string>, scope: string, software_id?: string | null, status: DynamicallyRegisteredClientStatus, subject_type: SubjectType, token_endpoint_auth_methods: Array<string> } | null> | null, name?: { __typename?: 'Name', givenName?: string | null, familyName?: string | null } | null, emails?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, phoneNumbers?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, addresses?: Array<{ __typename?: 'Address', streetAddress?: string | null, locality?: string | null, region?: string | null, postalCode?: string | null, country?: string | null, primary?: boolean | null, type?: string | null } | null> | null, groups?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, entitlements?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, roles?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string } | null } | null };

export type GetAccountsQueryVariables = Exact<{
  activeAccountsOnly?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  sorting?: InputMaybe<Scalars['Sorting']['input']>;
  filtering?: InputMaybe<Filtering>;
}>;


export type GetAccountsQuery = { __typename?: 'Query', accounts: { __typename?: 'AccountConnection', totalCount: any, edges?: Array<{ __typename?: 'AccountEdge', node?: { __typename?: 'Account', id: string, userName: string, displayName?: string | null, nickName?: string | null, title?: string | null, locale?: string | null, timeZone?: string | null, active: boolean, name?: { __typename?: 'Name', givenName?: string | null, familyName?: string | null } | null, emails?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, phoneNumbers?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, addresses?: Array<{ __typename?: 'Address', streetAddress?: string | null, locality?: string | null, region?: string | null, postalCode?: string | null, country?: string | null, primary?: boolean | null, type?: string | null } | null> | null, groups?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, entitlements?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, roles?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string } | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } };

export type GetAccountsWithoutSortingQueryVariables = Exact<{
  activeAccountsOnly?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  filtering?: InputMaybe<Filtering>;
}>;


export type GetAccountsWithoutSortingQuery = { __typename?: 'Query', accounts: { __typename?: 'AccountConnection', totalCount: any, edges?: Array<{ __typename?: 'AccountEdge', node?: { __typename?: 'Account', id: string, userName: string, displayName?: string | null, nickName?: string | null, title?: string | null, locale?: string | null, timeZone?: string | null, active: boolean, devices?: Array<{ __typename?: 'Device', deviceId: string, deviceType?: string | null, expiresAt?: any | null, alias?: string | null, category?: { __typename?: 'DeviceCategory', name: string } | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string, timeZoneId?: string | null } | null, details?:
            | { __typename: 'TotpDeviceDetails', canUseWithTotpAuthenticator?: boolean | null }
            | { __typename: 'WebAuthnDeviceDetails', webAuthnAuthenticator?: { __typename?: 'WebAuthnAuthenticator', name?: string | null, iconDarkUri?: string | null, iconLightUri?: string | null } | null }
           | null } | null> | null, linkedAccounts?: Array<{ __typename?: 'LinkedAccount', value: string, domain: string, created: any } | null> | null, mfaOptIn?: { __typename?: 'OptinMfa', registeredFactors: { __typename?: 'RegisteredFactors', factors: Array<{ __typename?: 'RegisteredFactor', acr: string, expectedUserName: string, changedAt: any, description?: string | null, type?: string | null }> }, registrableFactors?: { __typename?: 'RegistrableFactors', factors: Array<{ __typename?: 'RegistrableFactor', acr: string, description?: string | null, type?: string | null, hasDevices?: boolean | null }> } | null, preferences?: { __typename?: 'OptinMfaPreferences', optOutAt?: any | null } | null, recoveryCodeBatch?: { __typename?: 'RecoveryCodeBatch', batchId: string, createdAt: any, codes: Array<{ __typename?: 'RecoveryCodeValidation', consumed: boolean, consumedAt?: any | null }> } | null } | null, dynamicClients?: Array<{ __typename?: 'DynamicallyRegisteredClient', authenticated_user?: string | null, client_id: string, client_id_issued_at?: any | null, client_name?: string | null, grant_types: Array<string>, redirect_uris: Array<string>, response_types: Array<string>, scope: string, software_id?: string | null, status: DynamicallyRegisteredClientStatus, subject_type: SubjectType, token_endpoint_auth_methods: Array<string> } | null> | null, name?: { __typename?: 'Name', givenName?: string | null, familyName?: string | null } | null, emails?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, phoneNumbers?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, addresses?: Array<{ __typename?: 'Address', streetAddress?: string | null, locality?: string | null, region?: string | null, postalCode?: string | null, country?: string | null, primary?: boolean | null, type?: string | null } | null> | null, groups?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, entitlements?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, roles?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string } | null } | null } | null> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } };

export type GetAccountByIdQueryVariables = Exact<{
  accountId: Scalars['String']['input'];
}>;


export type GetAccountByIdQuery = { __typename?: 'Query', accountById?: { __typename?: 'Account', id: string, userName: string, displayName?: string | null, nickName?: string | null, title?: string | null, locale?: string | null, timeZone?: string | null, active: boolean, devices?: Array<{ __typename?: 'Device', deviceId: string, deviceType?: string | null, expiresAt?: any | null, alias?: string | null, category?: { __typename?: 'DeviceCategory', name: string } | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string, timeZoneId?: string | null } | null, details?:
        | { __typename: 'TotpDeviceDetails', canUseWithTotpAuthenticator?: boolean | null }
        | { __typename: 'WebAuthnDeviceDetails', webAuthnAuthenticator?: { __typename?: 'WebAuthnAuthenticator', name?: string | null, iconDarkUri?: string | null, iconLightUri?: string | null } | null }
       | null } | null> | null, linkedAccounts?: Array<{ __typename?: 'LinkedAccount', value: string, domain: string, created: any } | null> | null, mfaOptIn?: { __typename?: 'OptinMfa', registeredFactors: { __typename?: 'RegisteredFactors', factors: Array<{ __typename?: 'RegisteredFactor', acr: string, expectedUserName: string, changedAt: any, description?: string | null, type?: string | null }> }, registrableFactors?: { __typename?: 'RegistrableFactors', factors: Array<{ __typename?: 'RegistrableFactor', acr: string, description?: string | null, type?: string | null, hasDevices?: boolean | null }> } | null, preferences?: { __typename?: 'OptinMfaPreferences', optOutAt?: any | null } | null, recoveryCodeBatch?: { __typename?: 'RecoveryCodeBatch', batchId: string, createdAt: any, codes: Array<{ __typename?: 'RecoveryCodeValidation', consumed: boolean, consumedAt?: any | null }> } | null } | null, dynamicClients?: Array<{ __typename?: 'DynamicallyRegisteredClient', authenticated_user?: string | null, client_id: string, client_id_issued_at?: any | null, client_name?: string | null, grant_types: Array<string>, redirect_uris: Array<string>, response_types: Array<string>, scope: string, software_id?: string | null, status: DynamicallyRegisteredClientStatus, subject_type: SubjectType, token_endpoint_auth_methods: Array<string> } | null> | null, name?: { __typename?: 'Name', givenName?: string | null, familyName?: string | null } | null, emails?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, phoneNumbers?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, addresses?: Array<{ __typename?: 'Address', streetAddress?: string | null, locality?: string | null, region?: string | null, postalCode?: string | null, country?: string | null, primary?: boolean | null, type?: string | null } | null> | null, groups?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, entitlements?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, roles?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string } | null } | null };

export type GetAccountByPhoneNumberQueryVariables = Exact<{
  phoneNumber: Scalars['String']['input'];
}>;


export type GetAccountByPhoneNumberQuery = { __typename?: 'Query', accountByPhoneNumber?: { __typename?: 'Account', id: string, userName: string, displayName?: string | null, nickName?: string | null, title?: string | null, locale?: string | null, timeZone?: string | null, active: boolean, devices?: Array<{ __typename?: 'Device', deviceId: string, deviceType?: string | null, expiresAt?: any | null, alias?: string | null, category?: { __typename?: 'DeviceCategory', name: string } | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string, timeZoneId?: string | null } | null, details?:
        | { __typename: 'TotpDeviceDetails', canUseWithTotpAuthenticator?: boolean | null }
        | { __typename: 'WebAuthnDeviceDetails', webAuthnAuthenticator?: { __typename?: 'WebAuthnAuthenticator', name?: string | null, iconDarkUri?: string | null, iconLightUri?: string | null } | null }
       | null } | null> | null, linkedAccounts?: Array<{ __typename?: 'LinkedAccount', value: string, domain: string, created: any } | null> | null, mfaOptIn?: { __typename?: 'OptinMfa', registeredFactors: { __typename?: 'RegisteredFactors', factors: Array<{ __typename?: 'RegisteredFactor', acr: string, expectedUserName: string, changedAt: any, description?: string | null, type?: string | null }> }, registrableFactors?: { __typename?: 'RegistrableFactors', factors: Array<{ __typename?: 'RegistrableFactor', acr: string, description?: string | null, type?: string | null, hasDevices?: boolean | null }> } | null, preferences?: { __typename?: 'OptinMfaPreferences', optOutAt?: any | null } | null, recoveryCodeBatch?: { __typename?: 'RecoveryCodeBatch', batchId: string, createdAt: any, codes: Array<{ __typename?: 'RecoveryCodeValidation', consumed: boolean, consumedAt?: any | null }> } | null } | null, dynamicClients?: Array<{ __typename?: 'DynamicallyRegisteredClient', authenticated_user?: string | null, client_id: string, client_id_issued_at?: any | null, client_name?: string | null, grant_types: Array<string>, redirect_uris: Array<string>, response_types: Array<string>, scope: string, software_id?: string | null, status: DynamicallyRegisteredClientStatus, subject_type: SubjectType, token_endpoint_auth_methods: Array<string> } | null> | null, name?: { __typename?: 'Name', givenName?: string | null, familyName?: string | null } | null, emails?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, phoneNumbers?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, addresses?: Array<{ __typename?: 'Address', streetAddress?: string | null, locality?: string | null, region?: string | null, postalCode?: string | null, country?: string | null, primary?: boolean | null, type?: string | null } | null> | null, groups?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, entitlements?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, roles?: Array<{ __typename?: 'StringMultiValuedValue', value?: string | null, primary?: boolean | null, type?: string | null } | null> | null, meta?: { __typename?: 'Meta', created: any, lastModified: any, resourceType: string } | null } | null };

export type GetCredentialPolicyQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCredentialPolicyQuery = { __typename?: 'Query', credentialPolicy?: { __typename?: 'CredentialPolicyDescriptor', credentialUpdateRules?: Array<
      | { __typename: 'MaximumSequencePasswordRule', maximum?: number | null, message?: string | null, detailedMessage?: string | null }
      | { __typename: 'MinimumDigitsPasswordRule', minimum?: number | null, message?: string | null, detailedMessage?: string | null }
      | { __typename: 'MinimumLengthPasswordRule', minimum?: number | null, message?: string | null, detailedMessage?: string | null }
      | { __typename: 'MinimumLowerCasePasswordRule', minimum?: number | null, message?: string | null, detailedMessage?: string | null }
      | { __typename: 'MinimumSpecialPasswordRule', minimum?: number | null, message?: string | null, detailedMessage?: string | null }
      | { __typename: 'MinimumUniquePasswordRule', minimum?: number | null, message?: string | null, detailedMessage?: string | null }
      | { __typename: 'MinimumUpperCasePasswordRule', minimum?: number | null, message?: string | null, detailedMessage?: string | null }
    > | null } | null };

export const Multi_Valued_Value_FieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringMultiValuedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<Multi_Valued_Value_FieldsFragment, unknown>;
export const User_Accounts_List_FieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entitlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringMultiValuedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<User_Accounts_List_FieldsFragment, unknown>;
export const Device_FieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DEVICE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Device"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"timeZoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TotpDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseWithTotpAuthenticator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebAuthnDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webAuthnAuthenticator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconDarkUri"}},{"kind":"Field","name":{"kind":"Name","value":"iconLightUri"}}]}}]}}]}}]}}]} as unknown as DocumentNode<Device_FieldsFragment, unknown>;
export const Client_FieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CLIENT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DynamicallyRegisteredClient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticated_user"}},{"kind":"Field","name":{"kind":"Name","value":"client_id"}},{"kind":"Field","name":{"kind":"Name","value":"client_id_issued_at"}},{"kind":"Field","name":{"kind":"Name","value":"client_name"}},{"kind":"Field","name":{"kind":"Name","value":"grant_types"}},{"kind":"Field","name":{"kind":"Name","value":"redirect_uris"}},{"kind":"Field","name":{"kind":"Name","value":"response_types"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"software_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subject_type"}},{"kind":"Field","name":{"kind":"Name","value":"token_endpoint_auth_methods"}}]}}]} as unknown as DocumentNode<Client_FieldsFragment, unknown>;
export const User_Account_FieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"}},{"kind":"Field","name":{"kind":"Name","value":"devices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DEVICE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mfaOptIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"expectedUserName"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrableFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"hasDevices"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optOutAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recoveryCodeBatch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batchId"}},{"kind":"Field","name":{"kind":"Name","value":"codes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consumed"}},{"kind":"Field","name":{"kind":"Name","value":"consumedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dynamicClients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CLIENT_FIELDS"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringMultiValuedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entitlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DEVICE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Device"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"timeZoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TotpDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseWithTotpAuthenticator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebAuthnDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webAuthnAuthenticator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconDarkUri"}},{"kind":"Field","name":{"kind":"Name","value":"iconLightUri"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CLIENT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DynamicallyRegisteredClient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticated_user"}},{"kind":"Field","name":{"kind":"Name","value":"client_id"}},{"kind":"Field","name":{"kind":"Name","value":"client_id_issued_at"}},{"kind":"Field","name":{"kind":"Name","value":"client_name"}},{"kind":"Field","name":{"kind":"Name","value":"grant_types"}},{"kind":"Field","name":{"kind":"Name","value":"redirect_uris"}},{"kind":"Field","name":{"kind":"Name","value":"response_types"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"software_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subject_type"}},{"kind":"Field","name":{"kind":"Name","value":"token_endpoint_auth_methods"}}]}}]} as unknown as DocumentNode<User_Account_FieldsFragment, unknown>;
export const RevokeGrantedAuthorizationsByOwnerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"revokeGrantedAuthorizationsByOwner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"RevokeGrantedAuthorizationsByOwnerInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeGrantedAuthorizationsByOwner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"asynchronous"}}]}}]}}]} as unknown as DocumentNode<RevokeGrantedAuthorizationsByOwnerMutation, RevokeGrantedAuthorizationsByOwnerMutationVariables>;
export const RevokeGrantedAuthorizationsByOwnerAndClientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"revokeGrantedAuthorizationsByOwnerAndClient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"RevokeGrantedAuthorizationByOwnerAndClientInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeGrantedAuthorizationsByOwnerAndClient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"asynchronous"}}]}}]}}]} as unknown as DocumentNode<RevokeGrantedAuthorizationsByOwnerAndClientMutation, RevokeGrantedAuthorizationsByOwnerAndClientMutationVariables>;
export const GetGrantedAuthorizationsByOwnerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getGrantedAuthorizationsByOwner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owner"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"grantedAuthorizationsByOwner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"owner"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owner"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"authorizedClient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUri"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authorizedScopes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"localizedName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authorizedClaims"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"localizedName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"warnings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<GetGrantedAuthorizationsByOwnerQuery, GetGrantedAuthorizationsByOwnerQueryVariables>;
export const GetGrantedAuthorizationsByOwnerAndClientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getGrantedAuthorizationsByOwnerAndClient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owner"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"grantedAuthorizationsByOwnerAndClient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"owner"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owner"}}},{"kind":"Argument","name":{"kind":"Name","value":"clientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"authorizedClient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logoUri"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authorizedScopes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"localizedName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authorizedClaims"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"localizedName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"warnings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<GetGrantedAuthorizationsByOwnerAndClientQuery, GetGrantedAuthorizationsByOwnerAndClientQueryVariables>;
export const AddDeviceToAccountByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addDeviceToAccountByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddDeviceToAccountByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addDeviceToAccountByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"device"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DEVICE_FIELDS"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DEVICE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Device"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"timeZoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TotpDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseWithTotpAuthenticator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebAuthnDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webAuthnAuthenticator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconDarkUri"}},{"kind":"Field","name":{"kind":"Name","value":"iconLightUri"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddDeviceToAccountByAccountIdMutation, AddDeviceToAccountByAccountIdMutationVariables>;
export const UpdateDeviceFromAccountByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateDeviceFromAccountByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDeviceFromAccountByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDeviceFromAccountByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"device"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DEVICE_FIELDS"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DEVICE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Device"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"timeZoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TotpDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseWithTotpAuthenticator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebAuthnDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webAuthnAuthenticator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconDarkUri"}},{"kind":"Field","name":{"kind":"Name","value":"iconLightUri"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateDeviceFromAccountByAccountIdMutation, UpdateDeviceFromAccountByAccountIdMutationVariables>;
export const DeleteOptInMfaFactorFromAccountByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteOptInMfaFactorFromAccountByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteOptInMfaFactorFromAccountByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteOptInMfaFactorFromAccountByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleted"}}]}}]}}]} as unknown as DocumentNode<DeleteOptInMfaFactorFromAccountByAccountIdMutation, DeleteOptInMfaFactorFromAccountByAccountIdMutationVariables>;
export const ResetOptInMfaStateByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"resetOptInMfaStateByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetOptInMfaStateByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetOptInMfaStateByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleted"}}]}}]}}]} as unknown as DocumentNode<ResetOptInMfaStateByAccountIdMutation, ResetOptInMfaStateByAccountIdMutationVariables>;
export const UpdateAccountByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateAccountById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAccountByIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAccountById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringMultiValuedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entitlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DEVICE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Device"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"timeZoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TotpDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseWithTotpAuthenticator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebAuthnDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webAuthnAuthenticator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconDarkUri"}},{"kind":"Field","name":{"kind":"Name","value":"iconLightUri"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CLIENT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DynamicallyRegisteredClient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticated_user"}},{"kind":"Field","name":{"kind":"Name","value":"client_id"}},{"kind":"Field","name":{"kind":"Name","value":"client_id_issued_at"}},{"kind":"Field","name":{"kind":"Name","value":"client_name"}},{"kind":"Field","name":{"kind":"Name","value":"grant_types"}},{"kind":"Field","name":{"kind":"Name","value":"redirect_uris"}},{"kind":"Field","name":{"kind":"Name","value":"response_types"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"software_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subject_type"}},{"kind":"Field","name":{"kind":"Name","value":"token_endpoint_auth_methods"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"}},{"kind":"Field","name":{"kind":"Name","value":"devices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DEVICE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mfaOptIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"expectedUserName"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrableFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"hasDevices"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optOutAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recoveryCodeBatch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batchId"}},{"kind":"Field","name":{"kind":"Name","value":"codes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consumed"}},{"kind":"Field","name":{"kind":"Name","value":"consumedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dynamicClients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CLIENT_FIELDS"}}]}}]}}]} as unknown as DocumentNode<UpdateAccountByIdMutation, UpdateAccountByIdMutationVariables>;
export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringMultiValuedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entitlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DEVICE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Device"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"timeZoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TotpDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseWithTotpAuthenticator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebAuthnDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webAuthnAuthenticator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconDarkUri"}},{"kind":"Field","name":{"kind":"Name","value":"iconLightUri"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CLIENT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DynamicallyRegisteredClient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticated_user"}},{"kind":"Field","name":{"kind":"Name","value":"client_id"}},{"kind":"Field","name":{"kind":"Name","value":"client_id_issued_at"}},{"kind":"Field","name":{"kind":"Name","value":"client_name"}},{"kind":"Field","name":{"kind":"Name","value":"grant_types"}},{"kind":"Field","name":{"kind":"Name","value":"redirect_uris"}},{"kind":"Field","name":{"kind":"Name","value":"response_types"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"software_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subject_type"}},{"kind":"Field","name":{"kind":"Name","value":"token_endpoint_auth_methods"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"}},{"kind":"Field","name":{"kind":"Name","value":"devices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DEVICE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mfaOptIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"expectedUserName"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrableFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"hasDevices"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optOutAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recoveryCodeBatch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batchId"}},{"kind":"Field","name":{"kind":"Name","value":"codes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consumed"}},{"kind":"Field","name":{"kind":"Name","value":"consumedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dynamicClients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CLIENT_FIELDS"}}]}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const DeleteAccountByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteAccountById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteAccountByIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAccountById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleted"}}]}}]}}]} as unknown as DocumentNode<DeleteAccountByIdMutation, DeleteAccountByIdMutationVariables>;
export const DeleteDeviceFromAccountByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteDeviceFromAccountByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteDeviceFromAccountByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDeviceFromAccountByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleted"}}]}}]}}]} as unknown as DocumentNode<DeleteDeviceFromAccountByAccountIdMutation, DeleteDeviceFromAccountByAccountIdMutationVariables>;
export const DeleteLinkFromAccountByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteLinkFromAccountByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteLinkFromAccountByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLinkFromAccountByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleted"}}]}}]}}]} as unknown as DocumentNode<DeleteLinkFromAccountByAccountIdMutation, DeleteLinkFromAccountByAccountIdMutationVariables>;
export const StartVerifyTotpDeviceByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"startVerifyTotpDeviceByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartVerifyTotpDeviceByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startVerifyTotpDeviceByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"digits"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"algorithm"}},{"kind":"Field","name":{"kind":"Name","value":"skew"}},{"kind":"Field","name":{"kind":"Name","value":"delayWindow"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"deviceExpiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"qrLink"}}]}}]}}]} as unknown as DocumentNode<StartVerifyTotpDeviceByAccountIdMutation, StartVerifyTotpDeviceByAccountIdMutationVariables>;
export const CompleteVerifyTotpDeviceByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"completeVerifyTotpDeviceByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompleteVerifyTotpDeviceByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeVerifyTotpDeviceByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<CompleteVerifyTotpDeviceByAccountIdMutation, CompleteVerifyTotpDeviceByAccountIdMutationVariables>;
export const StartVerifyEmailAddressByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"startVerifyEmailAddressByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartVerifyEmailAddressByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startVerifyEmailAddressByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]} as unknown as DocumentNode<StartVerifyEmailAddressByAccountIdMutation, StartVerifyEmailAddressByAccountIdMutationVariables>;
export const CompleteVerifyEmailAddressByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"completeVerifyEmailAddressByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompleteVerifyEmailAddressByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeVerifyEmailAddressByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<CompleteVerifyEmailAddressByAccountIdMutation, CompleteVerifyEmailAddressByAccountIdMutationVariables>;
export const DeleteEmailAddressByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteEmailAddressByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteEmailAddressByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEmailAddressByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<DeleteEmailAddressByAccountIdMutation, DeleteEmailAddressByAccountIdMutationVariables>;
export const UpdatePrimaryEmailAddressByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatePrimaryEmailAddressByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePrimaryEmailAddressByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePrimaryEmailAddressByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<UpdatePrimaryEmailAddressByAccountIdMutation, UpdatePrimaryEmailAddressByAccountIdMutationVariables>;
export const StartVerifyPhoneNumberByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"startVerifyPhoneNumberByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartVerifyPhoneNumberByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startVerifyPhoneNumberByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]} as unknown as DocumentNode<StartVerifyPhoneNumberByAccountIdMutation, StartVerifyPhoneNumberByAccountIdMutationVariables>;
export const CompleteVerifyPhoneNumberByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"completeVerifyPhoneNumberByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompleteVerifyPhoneNumberByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeVerifyPhoneNumberByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<CompleteVerifyPhoneNumberByAccountIdMutation, CompleteVerifyPhoneNumberByAccountIdMutationVariables>;
export const DeletePhoneNumberByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deletePhoneNumberByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeletePhoneNumberByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePhoneNumberByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<DeletePhoneNumberByAccountIdMutation, DeletePhoneNumberByAccountIdMutationVariables>;
export const UpdatePrimaryPhoneNumberByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatePrimaryPhoneNumberByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePrimaryPhoneNumberByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePrimaryPhoneNumberByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<UpdatePrimaryPhoneNumberByAccountIdMutation, UpdatePrimaryPhoneNumberByAccountIdMutationVariables>;
export const ValidatePasswordAndUpdateAccountByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"validatePasswordAndUpdateAccountById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ValidatePasswordAndUpdateAccountByIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validatePasswordAndUpdateAccountById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringMultiValuedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entitlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DEVICE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Device"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"timeZoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TotpDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseWithTotpAuthenticator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebAuthnDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webAuthnAuthenticator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconDarkUri"}},{"kind":"Field","name":{"kind":"Name","value":"iconLightUri"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CLIENT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DynamicallyRegisteredClient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticated_user"}},{"kind":"Field","name":{"kind":"Name","value":"client_id"}},{"kind":"Field","name":{"kind":"Name","value":"client_id_issued_at"}},{"kind":"Field","name":{"kind":"Name","value":"client_name"}},{"kind":"Field","name":{"kind":"Name","value":"grant_types"}},{"kind":"Field","name":{"kind":"Name","value":"redirect_uris"}},{"kind":"Field","name":{"kind":"Name","value":"response_types"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"software_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subject_type"}},{"kind":"Field","name":{"kind":"Name","value":"token_endpoint_auth_methods"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"}},{"kind":"Field","name":{"kind":"Name","value":"devices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DEVICE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mfaOptIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"expectedUserName"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrableFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"hasDevices"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optOutAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recoveryCodeBatch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batchId"}},{"kind":"Field","name":{"kind":"Name","value":"codes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consumed"}},{"kind":"Field","name":{"kind":"Name","value":"consumedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dynamicClients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CLIENT_FIELDS"}}]}}]}}]} as unknown as DocumentNode<ValidatePasswordAndUpdateAccountByIdMutation, ValidatePasswordAndUpdateAccountByIdMutationVariables>;
export const AddOptInMfaFactorToAccountByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addOptInMfaFactorToAccountByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddOptInMfaFactorToAccountByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOptInMfaFactorToAccountByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"added"}}]}}]}}]} as unknown as DocumentNode<AddOptInMfaFactorToAccountByAccountIdMutation, AddOptInMfaFactorToAccountByAccountIdMutationVariables>;
export const OptOutFromOptInMfaByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"optOutFromOptInMfaByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OptOutFromOptInMfaByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optOutFromOptInMfaByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optedOut"}}]}}]}}]} as unknown as DocumentNode<OptOutFromOptInMfaByAccountIdMutation, OptOutFromOptInMfaByAccountIdMutationVariables>;
export const StartOptInMfaSetupByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"startOptInMfaSetupByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartOptInMfaSetupByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startOptInMfaSetupByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"hasDevices"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]} as unknown as DocumentNode<StartOptInMfaSetupByAccountIdMutation, StartOptInMfaSetupByAccountIdMutationVariables>;
export const CompleteOptInMfaSetupByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"completeOptInMfaSetupByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompleteOptInMfaSetupByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeOptInMfaSetupByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringMultiValuedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entitlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DEVICE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Device"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"timeZoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TotpDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseWithTotpAuthenticator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebAuthnDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webAuthnAuthenticator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconDarkUri"}},{"kind":"Field","name":{"kind":"Name","value":"iconLightUri"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CLIENT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DynamicallyRegisteredClient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticated_user"}},{"kind":"Field","name":{"kind":"Name","value":"client_id"}},{"kind":"Field","name":{"kind":"Name","value":"client_id_issued_at"}},{"kind":"Field","name":{"kind":"Name","value":"client_name"}},{"kind":"Field","name":{"kind":"Name","value":"grant_types"}},{"kind":"Field","name":{"kind":"Name","value":"redirect_uris"}},{"kind":"Field","name":{"kind":"Name","value":"response_types"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"software_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subject_type"}},{"kind":"Field","name":{"kind":"Name","value":"token_endpoint_auth_methods"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"}},{"kind":"Field","name":{"kind":"Name","value":"devices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DEVICE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mfaOptIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"expectedUserName"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrableFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"hasDevices"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optOutAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recoveryCodeBatch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batchId"}},{"kind":"Field","name":{"kind":"Name","value":"codes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consumed"}},{"kind":"Field","name":{"kind":"Name","value":"consumedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dynamicClients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CLIENT_FIELDS"}}]}}]}}]} as unknown as DocumentNode<CompleteOptInMfaSetupByAccountIdMutation, CompleteOptInMfaSetupByAccountIdMutationVariables>;
export const StartOptInMfaResetRecoveryCodesByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"startOptInMfaResetRecoveryCodesByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartOptInMfaResetRecoveryCodesByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startOptInMfaResetRecoveryCodesByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recoveryCodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]} as unknown as DocumentNode<StartOptInMfaResetRecoveryCodesByAccountIdMutation, StartOptInMfaResetRecoveryCodesByAccountIdMutationVariables>;
export const CompleteOptInMfaResetRecoveryCodesByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"completeOptInMfaResetRecoveryCodesByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompleteOptInMfaResetRecoveryCodesByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeOptInMfaResetRecoveryCodesByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringMultiValuedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entitlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DEVICE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Device"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"timeZoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TotpDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseWithTotpAuthenticator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebAuthnDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webAuthnAuthenticator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconDarkUri"}},{"kind":"Field","name":{"kind":"Name","value":"iconLightUri"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CLIENT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DynamicallyRegisteredClient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticated_user"}},{"kind":"Field","name":{"kind":"Name","value":"client_id"}},{"kind":"Field","name":{"kind":"Name","value":"client_id_issued_at"}},{"kind":"Field","name":{"kind":"Name","value":"client_name"}},{"kind":"Field","name":{"kind":"Name","value":"grant_types"}},{"kind":"Field","name":{"kind":"Name","value":"redirect_uris"}},{"kind":"Field","name":{"kind":"Name","value":"response_types"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"software_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subject_type"}},{"kind":"Field","name":{"kind":"Name","value":"token_endpoint_auth_methods"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"}},{"kind":"Field","name":{"kind":"Name","value":"devices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DEVICE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mfaOptIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"expectedUserName"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrableFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"hasDevices"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optOutAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recoveryCodeBatch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batchId"}},{"kind":"Field","name":{"kind":"Name","value":"codes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consumed"}},{"kind":"Field","name":{"kind":"Name","value":"consumedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dynamicClients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CLIENT_FIELDS"}}]}}]}}]} as unknown as DocumentNode<CompleteOptInMfaResetRecoveryCodesByAccountIdMutation, CompleteOptInMfaResetRecoveryCodesByAccountIdMutationVariables>;
export const StartVerifyPasskeyByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"startVerifyPasskeyByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartVerifyPasskeyByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startVerifyPasskeyByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"credentialOptionsJson"}}]}}]}}]} as unknown as DocumentNode<StartVerifyPasskeyByAccountIdMutation, StartVerifyPasskeyByAccountIdMutationVariables>;
export const CompleteVerifyPasskeyByAccountIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"completeVerifyPasskeyByAccountId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompleteVerifyPasskeyByAccountIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeVerifyPasskeyByAccountId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<CompleteVerifyPasskeyByAccountIdMutation, CompleteVerifyPasskeyByAccountIdMutationVariables>;
export const GetAccountByUserNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAccountByUserName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountByUserName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringMultiValuedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entitlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DEVICE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Device"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"timeZoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TotpDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseWithTotpAuthenticator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebAuthnDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webAuthnAuthenticator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconDarkUri"}},{"kind":"Field","name":{"kind":"Name","value":"iconLightUri"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CLIENT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DynamicallyRegisteredClient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticated_user"}},{"kind":"Field","name":{"kind":"Name","value":"client_id"}},{"kind":"Field","name":{"kind":"Name","value":"client_id_issued_at"}},{"kind":"Field","name":{"kind":"Name","value":"client_name"}},{"kind":"Field","name":{"kind":"Name","value":"grant_types"}},{"kind":"Field","name":{"kind":"Name","value":"redirect_uris"}},{"kind":"Field","name":{"kind":"Name","value":"response_types"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"software_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subject_type"}},{"kind":"Field","name":{"kind":"Name","value":"token_endpoint_auth_methods"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"}},{"kind":"Field","name":{"kind":"Name","value":"devices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DEVICE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mfaOptIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"expectedUserName"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrableFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"hasDevices"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optOutAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recoveryCodeBatch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batchId"}},{"kind":"Field","name":{"kind":"Name","value":"codes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consumed"}},{"kind":"Field","name":{"kind":"Name","value":"consumedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dynamicClients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CLIENT_FIELDS"}}]}}]}}]} as unknown as DocumentNode<GetAccountByUserNameQuery, GetAccountByUserNameQueryVariables>;
export const GetAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAccounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"activeAccountsOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sorting"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Sorting"}},"defaultValue":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"EnumValue","value":"created"}},{"kind":"ObjectField","name":{"kind":"Name","value":"sortOrder"},"value":{"kind":"EnumValue","value":"DESCENDING"}}]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filtering"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Filtering"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"activeAccountsOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"activeAccountsOnly"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"sorting"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sorting"}}},{"kind":"Argument","name":{"kind":"Name","value":"filtering"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filtering"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringMultiValuedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entitlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}}]}}]} as unknown as DocumentNode<GetAccountsQuery, GetAccountsQueryVariables>;
export const GetAccountsWithoutSortingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAccountsWithoutSorting"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"activeAccountsOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filtering"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Filtering"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"activeAccountsOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"activeAccountsOnly"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"filtering"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filtering"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringMultiValuedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entitlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DEVICE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Device"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"timeZoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TotpDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseWithTotpAuthenticator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebAuthnDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webAuthnAuthenticator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconDarkUri"}},{"kind":"Field","name":{"kind":"Name","value":"iconLightUri"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CLIENT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DynamicallyRegisteredClient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticated_user"}},{"kind":"Field","name":{"kind":"Name","value":"client_id"}},{"kind":"Field","name":{"kind":"Name","value":"client_id_issued_at"}},{"kind":"Field","name":{"kind":"Name","value":"client_name"}},{"kind":"Field","name":{"kind":"Name","value":"grant_types"}},{"kind":"Field","name":{"kind":"Name","value":"redirect_uris"}},{"kind":"Field","name":{"kind":"Name","value":"response_types"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"software_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subject_type"}},{"kind":"Field","name":{"kind":"Name","value":"token_endpoint_auth_methods"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"}},{"kind":"Field","name":{"kind":"Name","value":"devices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DEVICE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mfaOptIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"expectedUserName"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrableFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"hasDevices"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optOutAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recoveryCodeBatch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batchId"}},{"kind":"Field","name":{"kind":"Name","value":"codes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consumed"}},{"kind":"Field","name":{"kind":"Name","value":"consumedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dynamicClients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CLIENT_FIELDS"}}]}}]}}]} as unknown as DocumentNode<GetAccountsWithoutSortingQuery, GetAccountsWithoutSortingQueryVariables>;
export const GetAccountByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAccountById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringMultiValuedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entitlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DEVICE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Device"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"timeZoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TotpDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseWithTotpAuthenticator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebAuthnDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webAuthnAuthenticator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconDarkUri"}},{"kind":"Field","name":{"kind":"Name","value":"iconLightUri"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CLIENT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DynamicallyRegisteredClient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticated_user"}},{"kind":"Field","name":{"kind":"Name","value":"client_id"}},{"kind":"Field","name":{"kind":"Name","value":"client_id_issued_at"}},{"kind":"Field","name":{"kind":"Name","value":"client_name"}},{"kind":"Field","name":{"kind":"Name","value":"grant_types"}},{"kind":"Field","name":{"kind":"Name","value":"redirect_uris"}},{"kind":"Field","name":{"kind":"Name","value":"response_types"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"software_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subject_type"}},{"kind":"Field","name":{"kind":"Name","value":"token_endpoint_auth_methods"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"}},{"kind":"Field","name":{"kind":"Name","value":"devices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DEVICE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mfaOptIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"expectedUserName"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrableFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"hasDevices"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optOutAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recoveryCodeBatch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batchId"}},{"kind":"Field","name":{"kind":"Name","value":"codes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consumed"}},{"kind":"Field","name":{"kind":"Name","value":"consumedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dynamicClients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CLIENT_FIELDS"}}]}}]}}]} as unknown as DocumentNode<GetAccountByIdQuery, GetAccountByIdQueryVariables>;
export const GetAccountByPhoneNumberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAccountByPhoneNumber"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phoneNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountByPhoneNumber"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"phoneNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phoneNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringMultiValuedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"givenName"}},{"kind":"Field","name":{"kind":"Name","value":"familyName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"nickName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"locale"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetAddress"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"region"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"primary"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entitlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MULTI_VALUED_VALUE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DEVICE_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Device"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"deviceType"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"alias"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastModified"}},{"kind":"Field","name":{"kind":"Name","value":"resourceType"}},{"kind":"Field","name":{"kind":"Name","value":"timeZoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TotpDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseWithTotpAuthenticator"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebAuthnDeviceDetails"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webAuthnAuthenticator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconDarkUri"}},{"kind":"Field","name":{"kind":"Name","value":"iconLightUri"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CLIENT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DynamicallyRegisteredClient"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticated_user"}},{"kind":"Field","name":{"kind":"Name","value":"client_id"}},{"kind":"Field","name":{"kind":"Name","value":"client_id_issued_at"}},{"kind":"Field","name":{"kind":"Name","value":"client_name"}},{"kind":"Field","name":{"kind":"Name","value":"grant_types"}},{"kind":"Field","name":{"kind":"Name","value":"redirect_uris"}},{"kind":"Field","name":{"kind":"Name","value":"response_types"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"software_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subject_type"}},{"kind":"Field","name":{"kind":"Name","value":"token_endpoint_auth_methods"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"USER_ACCOUNT_FIELDS"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"USER_ACCOUNTS_LIST_FIELDS"}},{"kind":"Field","name":{"kind":"Name","value":"devices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DEVICE_FIELDS"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mfaOptIn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"expectedUserName"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrableFactors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acr"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"hasDevices"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"preferences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optOutAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recoveryCodeBatch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batchId"}},{"kind":"Field","name":{"kind":"Name","value":"codes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consumed"}},{"kind":"Field","name":{"kind":"Name","value":"consumedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dynamicClients"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CLIENT_FIELDS"}}]}}]}}]} as unknown as DocumentNode<GetAccountByPhoneNumberQuery, GetAccountByPhoneNumberQueryVariables>;
export const GetCredentialPolicyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCredentialPolicy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"credentialPolicy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"credentialUpdateRules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"detailedMessage"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MinimumLowerCasePasswordRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MinimumUpperCasePasswordRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MinimumDigitsPasswordRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MinimumSpecialPasswordRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MinimumUniquePasswordRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MinimumLengthPasswordRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MaximumSequencePasswordRule"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maximum"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCredentialPolicyQuery, GetCredentialPolicyQueryVariables>;