import { useState, useRef, useEffect } from 'react';
import { IconGeneralChevron, IconGeneralLock } from '@curity/ui-kit-icons';
import { Button } from '@shared/ui/Button';
import { useTranslation } from 'react-i18next';
import styles from './user-menu.module.css';

type UserMenuProps = {
  username?: string;
  onSignOut: () => void;
};
export const UserMenu = ({ username, onSignOut }: UserMenuProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeMenuOnOutsideClick = (event: MouseEvent) => {
      const clickedOutsideMenu = menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node);

      if (clickedOutsideMenu) {
        setIsOpen(false);
      }
    };

    const closeMenuOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', closeMenuOnOutsideClick);
    document.addEventListener('keydown', closeMenuOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeMenuOnOutsideClick);
      document.removeEventListener('keydown', closeMenuOnEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuContainerRef}>
      <Button
        ref={menuButtonRef}
        onClick={() => setIsOpen(currentIsOpen => !currentIsOpen)}
        className="button button-tiny button-transparent"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="user-dropdown-menu"
        data-testid="user-menu-button"
      >
        <span className={`${styles['user-menu-username']}`}>{username}</span>
        <span className={`${styles['user-menu-chevron']} ${isOpen ? styles['user-menu-chevron-open'] : ''}`}>
          <IconGeneralChevron width={16} height={16} aria-hidden="true" />
        </span>
      </Button>
      {isOpen && (
        <div
          id="user-dropdown-menu"
          className={`flex flex-column flex-gap-0 br-8 ${styles['user-menu']} ${
            isOpen ? styles['user-menu-open'] : ''
          }`}
          role="menu"
          tabIndex={-1}
        >
          <Button
            icon={<IconGeneralLock width={24} height={24} aria-hidden="true" />}
            title={t('sign-out')}
            className="button-tiny button-link"
            onClick={onSignOut}
            data-testid="logout-button"
            role="menuitem"
            tabIndex={0}
          />
        </div>
      )}
    </div>
  );
};
