import { CurityLogo } from '@components/CurityLogo';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header
      className="bg-primary-dark sticky flex flex-center justify-between w100 p2 z-1"
      style={{ top: '0', height: '50px' }}
      role="banner"
    >
      <a className="flex flex-center justify-between flex-gap-2" role="presentation" href="/">
        <CurityLogo />
        <span className="uppercasecaps tertiary">{title}</span>
      </a>
      <a className="white" href="https://curity.io">
        Visit curity.io
      </a>
    </header>
  );
};
