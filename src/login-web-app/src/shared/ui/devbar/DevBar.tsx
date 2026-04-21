import { useEffect, useState } from 'react';
import { Spinner } from '../Spinner';
import classes from './devbar.module.css';
import JsonPrettify from './PrettyPrint';
import { JsonValue } from './types';
import { useHaapiStepper } from '../../../haapi-stepper/feature/stepper/HaapiStepperHook';

export const DevBar = () => {
  const [showDevNav, setShowDevNav] = useState(false);
  const { currentStep, loading } = useHaapiStepper();

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showDevNav) {
        setShowDevNav(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showDevNav]);
  return (
    <div
      className={`${classes.devbar} flex flex-center flex-gap-1 justify-between w100 border-top-light ${showDevNav ? classes.active : ''}`}
    >
      <main className="flex justify-center flex-column flex-center w100">
        <header
          className={`flex flex-gap-1 flex-center w100 p1 cursor-pointer ${showDevNav ? 'border-bottom-light' : ''}`}
          onClick={() => setShowDevNav(!showDevNav)}
        >
          <div className="flex flex-gap-2 justify-between w100">
            <div className="flex flex-gap-1">
              Click to {showDevNav ? 'hide' : 'view'} JSON representation{' '}
              {showDevNav ? (
                <div className="inline-flex ml1">
                  <span className="pill pill-grey">Esc</span> to close
                </div>
              ) : null}
            </div>

            {loading && (
              <div className="flex flex-center flex-gap-2">
                <Spinner width={16} height={16} />
                Loading...
              </div>
            )}
          </div>
        </header>

        {showDevNav ? <JsonPrettify data={(currentStep as JsonValue) ?? null} /> : null}
      </main>
    </div>
  );
};
