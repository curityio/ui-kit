import { SlashDivider } from './Divider.tsx';
import { NavLink, useLocation } from 'react-router';

interface BreadcrumbsProps {
  pageTitle: string;
}

export const Breadcrumbs = ({ pageTitle }: BreadcrumbsProps) => {
  const location = useLocation();
  const pageTitleParts = pageTitle.split(' / ');

  return (
    <nav className="flex flex-center flex-gap-1" aria-label="Breadcrumb">
      {pageTitleParts.map((part, index) => {
        const isLast = index === pageTitleParts.length - 1;
        const segments = location.pathname.split('/').filter(Boolean);
        const relativePath = segments.slice(0, index + 1).join('/');

        if (pageTitleParts.length === 1) {
          return (
            <div className="flex flex-center flex-gap-1" data-testid="breadcrumb" key={index}>
              <small className="flex flex-center flex-gap-1">{part}</small>
            </div>
          );
        }

        return (
          <div className="flex flex-center flex-gap-1" data-testid="breadcrumb" key={`${relativePath || '/'}-${index}`}>
            <small className="flex flex-center flex-gap-1">
              {!isLast ? <NavLink to={`/${relativePath}`}>{part}</NavLink> : part}
              {!isLast && (
                <span className="inline-flex ml1 mr1">
                  <SlashDivider />
                </span>
              )}
            </small>
          </div>
        );
      })}
    </nav>
  );
};
