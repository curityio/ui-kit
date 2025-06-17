import { StartVerifyPasskeyMutation } from '@/shared/data-access/API';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { FetchResult, useMutation } from '@apollo/client';
import { create, parseCreationOptionsFromJSON } from '@github/webauthn-json/browser-ponyfill';
import toast from 'react-hot-toast';

export const useVerifyPasskey = () => {
  const [
    startVerifyPasskey,
    { data: verificationStartData, loading: verificationStartLoading, error: verificationStartError },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.startVerifyPasskey);
  const [
    completeVerifyPasskey,
    { data: verificationCompleteData, loading: verificationCompleteLoading, error: verificationCompleteError },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.completeVerifyPasskey);

  const verifyPasskey = async (accountId: string, alias: string, onSuccess?: () => void) => {
    startVerifyPasskey({
      variables: {
        input: {
          accountId,
          alias,
        },
      },
    })
      .then(parseCredentialOptions)
      .then(async ({ transactionId, credentialOptionsParsed }) => {
        const credential = await create(credentialOptionsParsed);
        const credentialBase64String = btoa(JSON.stringify(credential));

        return completeVerifyPasskey({
          variables: {
            input: {
              accountId,
              transactionId,
              credentialResponseJson: credentialBase64String,
            },
          },
        });
      })
      .then(() => onSuccess?.())
      .catch(error => toast.error(error?.message || error?.name || String(error)));
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

const parseCredentialOptions = (verificationStartResponse: FetchResult<StartVerifyPasskeyMutation>) => {
  const transactionId = verificationStartResponse!.data!.startVerifyPasskey!.transactionId!;
  const credentialResponseJsonEncoded = verificationStartResponse!.data!.startVerifyPasskey!.credentialOptionsJson!;
  const credentialResponseJsonDecodedString = atob(credentialResponseJsonEncoded);
  const credentialOptionsJson = JSON.parse(credentialResponseJsonDecodedString);
  const credentialOptionsParsed = parseCreationOptionsFromJSON(credentialOptionsJson);

  return { transactionId, credentialOptionsParsed };
};
