/*
 * Copyright (C) 2026 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { Button, Card, List, Typography } from 'antd';
import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { useHaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepperHook';
import { ExamplePreviewer } from './ExamplePreviewer';

const { Title, Text } = Typography;

/**
 * UI Customization with UI composition: full customization with a component library. Drive the flow with
 * the headless `HaapiStepper` + `useHaapiStepper` and render everything with Ant Design components —
 * actions, client operations and links as `Button`s — plus a `List` view of the authentication `history`
 * the stepper records as the user moves through the flow.
 */
function CustomFlowUI() {
  const { currentStep, history, loading, error, nextStep } = useHaapiStepper();

  if (loading || !currentStep) {
    return <Text>Loading authentication…</Text>;
  }

  if (error?.app) {
    return <Text type="danger">Error: {error.app.title}</Text>;
  }

  const { actions, links } = currentStep.dataHelpers;

  return (
    <Card>
      <Title level={4}>Step: {currentStep.type}</Title>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {actions?.form.map(action => (
          <Button key={action.id} type="primary" block onClick={() => nextStep(action)}>
            {action.title}
          </Button>
        ))}
        {actions?.clientOperation.map(action => (
          <Button key={action.id} block onClick={() => nextStep(action)}>
            {action.title}
          </Button>
        ))}
        {links.map(link => (
          <Button key={link.id} type="link" onClick={() => nextStep(link)}>
            {link.title}
          </Button>
        ))}
      </div>

      <Title level={5}>Authentication journey</Title>
      <List
        size="small"
        dataSource={history}
        renderItem={entry => (
          <List.Item>
            <Text>
              {entry.step.type} — {entry.timestamp.toLocaleTimeString()}
              {/* Only the bootstrap entry has no triggering action title, so guard on it. */}
              {entry.triggeredByAction?.title ? ` (via ${entry.triggeredByAction.title})` : ''}
            </Text>
          </List.Item>
        )}
      />
    </Card>
  );
}

export default function App() {
  return (
    <ExamplePreviewer showStepSelect>
      <HaapiStepper>
        <CustomFlowUI />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}
