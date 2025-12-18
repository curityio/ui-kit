import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressSteps } from './ProgressSteps';
import { translationFunctionMock } from '@/utils/test.ts';

describe('ProgressSteps', () => {
  it('renders default steps', () => {
    render(<ProgressSteps currentStep={1} t={translationFunctionMock} />);
    expect(screen.getByTestId('progress-steps-label-1')).toBeInTheDocument();
    expect(screen.getByTestId('progress-steps-label-2')).toBeInTheDocument();
    expect(screen.getByTestId('progress-steps-label-3')).toBeInTheDocument();
  });

  it('renders custom steps', () => {
    const steps = [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }, { label: 'Step 4' }];
    render(<ProgressSteps currentStep={2} steps={steps} t={translationFunctionMock} />);
    steps.forEach((_, index) => {
      const label = steps[index].label;
      const labelElement = screen.getByTestId(`progress-steps-label-${index + 1}`);
      expect(labelElement).toBeInTheDocument();
      expect(labelElement).toHaveTextContent(label);
    });
  });

  it('applies correct class to done, active, and upcoming steps', () => {
    render(<ProgressSteps currentStep={2} t={translationFunctionMock} />);

    const firstCircle = screen.getByText('1').parentElement;
    expect(firstCircle?.className).toMatch(/done/);

    const secondCircle = screen.getByText('2').parentElement;
    expect(secondCircle?.className).toMatch(/active/);

    const thirdCircle = screen.getByText('3').parentElement;
    expect(thirdCircle?.className).not.toMatch(/done|active/);
  });

  it('sets data-steps attribute correctly', () => {
    const { container } = render(<ProgressSteps currentStep={1} t={translationFunctionMock} />);
    const progressContainer = container.querySelector('[data-steps]');
    expect(progressContainer).toHaveAttribute('data-steps', '3');
  });

  it('updates correctly when currentStep prop changes', () => {
    const { rerender } = render(<ProgressSteps currentStep={1} t={translationFunctionMock} />);

    let firstCircle = screen.getByText('1').parentElement;
    expect(firstCircle?.className).toMatch(/active/);
    expect(firstCircle?.className).not.toMatch(/done/);

    let secondCircle = screen.getByText('2').parentElement;
    expect(secondCircle?.className).not.toMatch(/active|done/);

    rerender(<ProgressSteps currentStep={2} t={translationFunctionMock} />);

    firstCircle = screen.getByText('1').parentElement;
    expect(firstCircle?.className).toMatch(/done/);
    expect(firstCircle?.className).not.toMatch(/active/);

    secondCircle = screen.getByText('2').parentElement;
    expect(secondCircle?.className).toMatch(/active/);
    expect(secondCircle?.className).not.toMatch(/done/);

    const thirdCircle = screen.getByText('3').parentElement;
    expect(thirdCircle?.className).not.toMatch(/active|done/);
  });
});
