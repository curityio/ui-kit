import { HaapiBankIdClientOperationAction } from '../../../data-access/types/haapi-action.types';
import { isMobileDevice } from '../../../util/isMobileDevice';

export function openBankIdApp(action: HaapiBankIdClientOperationAction) {
  const token = action.model.arguments.autoStartToken;
  const bankIDAppHref = isMobileDevice()
    ? `https://app.bankid.com/?autostarttoken=${token}`
    : `bankid:///?autostarttoken=${token}`;

  const anchor = document.createElement('a');
  anchor.href = bankIDAppHref;
  anchor.referrerPolicy = 'origin';
  anchor.click();
}
