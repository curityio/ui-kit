import styles from './progress-steps.module.css';
import { TranslationFunction } from '@/types/util.type.ts';

interface Step {
  label: string;
}

interface ProgressStepsProps {
  currentStep: number;
  t: TranslationFunction;
  steps?: Step[];
}

export const ProgressSteps = ({ currentStep, steps, t }: ProgressStepsProps) => {
  const defaultSteps: Step[] = [
    { label: t('start', 'Start') },
    { label: t('add-methods', 'Add methods') },
    { label: t('confirm', 'Confirm') },
  ];
  const stepsToRender = steps ?? defaultSteps;
  const getCircleClass = (stepIndex: number) => {
    const stepNumber = stepIndex + 1;
    if (stepNumber < currentStep) return `${styles.circle} ${styles.done}`;
    if (stepNumber === currentStep) return `${styles.circle} ${styles.active}`;
    return styles.circle;
  };

  return (
    <div
      className={`mb4 ${styles.progressContainer} relative  flex flex-center justify-between mw-40 mx-auto`}
      data-steps={stepsToRender.length}
      data-testid="progress-steps"
    >
      {stepsToRender.map((step, index) => (
        <div key={index} className={`${styles.progressStep} ${styles[`progressStep${index + 1}`]}`}>
          <div className={getCircleClass(index)}>
            <span className="number">{index + 1}</span>
          </div>
          <span data-testid={`progress-steps-label-${index + 1}`}>{step.label}</span>
        </div>
      ))}
    </div>
  );
};
