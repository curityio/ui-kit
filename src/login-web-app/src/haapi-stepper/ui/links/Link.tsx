import { HaapiStepperLink } from '../../feature/stepper/haapi-stepper.types';

export const Link = ({ link, onClick }: { link: HaapiStepperLink; onClick: (action: HaapiStepperLink) => void }) => {
  const isImageLink = link.subtype?.startsWith('image/');
  const imageLinkElement = (
    <figure className="haapi-stepper-link-image">
      <img src={link.href} alt={link.title ?? link.rel} />
      {link.title && <figcaption className="haapi-stepper-link-image-title">{link.title}</figcaption>}
    </figure>
  );
  const buttonLinkElement = (
    <button type="button" className="haapi-stepper-link" onClick={() => onClick(link)}>
      {link.title ?? link.rel}
    </button>
  );

  return isImageLink ? imageLinkElement : buttonLinkElement;
};
