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

import {
  HAAPI_STEPS,
  HAAPI_PROBLEM_STEPS,
  HAAPI_STEPPER_ELEMENT_TYPES,
  HaapiLink,
  HaapiUserMessage,
  HAAPI_ACTION_TYPES,
  HaapiAction,
  HaapiActionStep,
  HaapiCompletedStep,
} from '../../../data-access/types';
import {
  HaapiStepperAction,
  HaapiStepperClientOperationAction,
  HaapiStepperDataHelpers,
  HaapiStepperDataHelpersActionsMap,
  HaapiStepperLink,
  HaapiStepperStep,
  HaapiStepperUserMessage,
} from '../haapi-stepper.types';
import {
  isWebAuthnRegistrationClientOperation,
  splitWebAuthnRegistrationAction,
} from '../../actions/client-operation/operations/webauthn';

export function formatNextStepData<T extends HaapiActionStep | HaapiCompletedStep | HaapiStepperStep>(
  step: T
): T & HaapiStepperDataHelpers {
  const isStepWithoutActions =
    step.type === HAAPI_STEPS.COMPLETED_WITH_SUCCESS || step.type === HAAPI_PROBLEM_STEPS.COMPLETED_WITH_ERROR;
  const linksWithDataHelpers = step.links?.map(link => getElementWithDataHelpers(link)) ?? [];
  const messagesWithDataHelpers = step.messages?.map(message => getElementWithDataHelpers(message)) ?? [];
  const dataHelpers = {
    messages: messagesWithDataHelpers,
    links: linksWithDataHelpers,
  };

  if (isStepWithoutActions) {
    return {
      ...step,
      dataHelpers,
    };
  }

  const actions = getNextStepActions(step.actions);
  const actionsWithDataHelpers = actions.map(action => addActionDataHelpers(action, step));
  const actionsWithDataHelpersMap = buildActionsMap(actionsWithDataHelpers);

  return {
    ...step,
    dataHelpers: {
      ...dataHelpers,
      actions: actionsWithDataHelpersMap,
    },
  };
}

function getNextStepActions(actions: HaapiAction[]): HaapiAction[] {
  return actions.flatMap(action =>
    isWebAuthnRegistrationClientOperation(action) ? splitWebAuthnRegistrationAction(action) : [action]
  );
}

function addActionDataHelpers(
  action: HaapiAction,
  step: HaapiActionStep | HaapiCompletedStep | HaapiStepperStep
): HaapiStepperAction {
  const actionWithDataHelpers = getElementWithDataHelpers(action);

  if (actionWithDataHelpers.subtype === HAAPI_ACTION_TYPES.FORM && actionWithDataHelpers.model.fields) {
    return {
      ...actionWithDataHelpers,
      model: {
        ...actionWithDataHelpers.model,
        fields: actionWithDataHelpers.model.fields.map(field => ({ ...field, id: crypto.randomUUID() })),
      },
    };
  }

  if (actionWithDataHelpers.subtype === HAAPI_ACTION_TYPES.SELECTOR) {
    return {
      ...actionWithDataHelpers,
      model: {
        ...actionWithDataHelpers.model,
        options: actionWithDataHelpers.model.options.map(optionAction => addActionDataHelpers(optionAction, step)),
      },
    };
  }

  if (step.type === HAAPI_STEPS.POLLING && actionWithDataHelpers.subtype === HAAPI_ACTION_TYPES.CLIENT_OPERATION) {
    const clientOperationPollingAction = {
      ...actionWithDataHelpers,
      ...(step.properties.maxWaitTime != null && { maxWaitTime: step.properties.maxWaitTime }),
      ...(step.properties.maxWaitRemainingTime != null && {
        maxWaitRemainingTime: step.properties.maxWaitRemainingTime,
      }),
    };

    return clientOperationPollingAction as HaapiStepperClientOperationAction;
  }

  return { ...action, ...actionWithDataHelpers };
}

function buildActionsMap(actions: HaapiStepperAction[]): HaapiStepperDataHelpersActionsMap {
  return actions.reduce(
    (actionsMapValue: HaapiStepperDataHelpersActionsMap, action) => {
      switch (action.template) {
        case HAAPI_ACTION_TYPES.FORM: {
          return {
            ...actionsMapValue,
            form: [...actionsMapValue.form, action],
            formByKind: {
              ...actionsMapValue.formByKind,
              [action.kind]: [...(actionsMapValue.formByKind[action.kind] ?? []), action],
            },
          };
        }

        case HAAPI_ACTION_TYPES.SELECTOR: {
          return {
            ...actionsMapValue,
            selector: [...actionsMapValue.selector, action],
          };
        }

        case HAAPI_ACTION_TYPES.CLIENT_OPERATION: {
          return {
            ...actionsMapValue,
            clientOperation: [...actionsMapValue.clientOperation, action],
          };
        }
      }
    },
    {
      all: actions,
      form: [],
      formByKind: {},
      selector: [],
      clientOperation: [],
    }
  );
}

export function getElementWithDataHelpers(element: HaapiAction): HaapiStepperAction;
export function getElementWithDataHelpers(element: HaapiLink): HaapiStepperLink;
export function getElementWithDataHelpers(element: HaapiUserMessage): HaapiStepperUserMessage;
export function getElementWithDataHelpers(
  element: HaapiAction | HaapiUserMessage | HaapiLink
): HaapiStepperAction | HaapiStepperUserMessage | HaapiStepperLink {
  const id = crypto.randomUUID();

  if ('template' in element) {
    return {
      ...element,
      id,
      type: HAAPI_STEPPER_ELEMENT_TYPES.ACTION,
      subtype: element.template,
    } as HaapiStepperAction;
  }

  if ('rel' in element) {
    return {
      ...element,
      id,
      type: HAAPI_STEPPER_ELEMENT_TYPES.LINK,
      subtype: element.type,
    };
  }

  return {
    ...element,
    id,
    type: HAAPI_STEPPER_ELEMENT_TYPES.MESSAGE,
  };
}
