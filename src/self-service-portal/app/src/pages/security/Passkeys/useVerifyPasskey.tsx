import { StartVerifyPasskeyByAccountIdMutation } from '@/shared/data-access/API';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { FetchResult, useMutation } from '@apollo/client';
import { create, parseCreationOptionsFromJSON } from '@github/webauthn-json/browser-ponyfill';

export const useVerifyPasskey = () => {
  const [
    startVerifyPasskeyByAccountId,
    { data: verificationStartData, loading: verificationStartLoading, error: verificationStartError },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.startVerifyPasskeyByAccountId);
  const [
    completeVerifyPasskeyByAccountId,
    { data: verificationCompleteData, loading: verificationCompleteLoading, error: verificationCompleteError },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.completeVerifyPasskeyByAccountId);

  const verifyPasskey = async (accountId: string, alias: string, onSuccess?: () => void) => {
    startVerifyPasskeyByAccountId({
      variables: {
        input: {
          accountId,
          alias,
        },
      },
    })
      .then(parseCredentialOptions)
      .then(async ({ state, credentialOptionsParsed }) => {
        const credential = await create(credentialOptionsParsed);
        const credentialBase64String = btoa(JSON.stringify(credential));

        return completeVerifyPasskeyByAccountId({
          variables: {
            input: {
              accountId,
              state,
              credentialResponseJson: credentialBase64String,
            },
          },
        });
      })
      .then(() => onSuccess?.());
  };

  return {
    verifyPasskey,
    verificationStartData,
    verificationStartError,
    verificationStartLoading,
    verificationCompleteData,
    verificationCompleteError,
    verificationCompleteLoading,
    loading: verificationStartLoading || verificationCompleteLoading,
    error: verificationStartError || verificationCompleteError,
  };
};

const parseCredentialOptions = (verificationStartResponse: FetchResult<StartVerifyPasskeyByAccountIdMutation>) => {
  const state = verificationStartResponse!.data!.startVerifyPasskeyByAccountId!.state!;
  const credentialResponseJsonEncoded =
    verificationStartResponse!.data!.startVerifyPasskeyByAccountId!.credentialOptionsJson!;
  const credentialResponseJsonDecodedString = atob(credentialResponseJsonEncoded);
  const credentialOptionsJson = JSON.parse(credentialResponseJsonDecodedString);
  const credentialOptionsParsed = parseCreationOptionsFromJSON(credentialOptionsJson);

  return { state, credentialOptionsParsed };
};
