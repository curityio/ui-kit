import { useEffect, useRef, useState } from 'react';
import { pageOrder, sectionOrder } from './sidebar/prio';
import type { MDXInstance } from 'astro';
import packageJson from '../../../lib/package.json';

interface SidebarProps {
  pages: MDXInstance<Record<string, any>>[];
}

export const Sidebar: React.FC<SidebarProps> = ({ pages }) => {
  const [currentPath, setCurrentPath] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  // Handle the change in search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Function to filter pages based on the search query
  const filterPages = (pages: MDXInstance<Record<string, any>>[]) => {
    return pages.filter((page) =>
      page.frontmatter.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  useEffect(() => {
    const pathname = window.location.pathname;
    const pagename = pathname.substring(pathname.lastIndexOf('/') + 1);
    setCurrentPath(pagename);
  }, []);

  // Scroll to active link on mount or when currentPath changes
  useEffect(() => {
    if (activeLinkRef.current) {
      const element = activeLinkRef.current;
      const parent = element.closest('.sidebar');

      if (parent) {
        const elementRect = element.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();

        // Only scroll if the element is not fully visible
        const isVisible =
          elementRect.top >= parentRect.top &&
          elementRect.bottom <= parentRect.bottom;

        if (!isVisible) {
          element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }
  }, [currentPath]);

  const getPath = (file: string) => {
    const parts = file.split('/');
    const path = parts[parts.length - 1].split('.')[0];

    return path.replace('.mdx', '');
  };

  const extractFolderStructure = () => {
    const folderStructure: { [key: string]: { name: string; pages: any[] } } = {};

    pages.forEach((page) => {
      // Safety check: ensure page.file exists
      if (!page.file) return;

      const folderPath = page.file.replace(/.*\/(.*?)\/[^/]+$/, '$1');
      const folderName = folderPath.split('/').pop();

      if (folderName && !folderStructure[folderName]) {
        folderStructure[folderName] = {
          name: folderName,
          pages: [],
        };
      }

      folderName && folderStructure[folderName].pages.push(page);
    });

    return Object.values(folderStructure);
  };

  const folderStructure = extractFolderStructure();

  return (
    <aside className="sidebar p2">
      <div className="flex flex-gap-1 flex-center mb2">
        <span>Version</span>
        <span className="pill pill-primary">{packageJson.version}</span>
      </div>
      <input
        type="text"
        placeholder="Find in docs..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-4 p-2"
      />

      <ul className="list-reset">
        {folderStructure
          .filter((folder) => folder.name !== 'pages')
          .sort((a, b) => sectionOrder.indexOf(a.name) - sectionOrder.indexOf(b.name))
          .map((folder) => {
            const filteredPages = filterPages(folder.pages);

            if (filteredPages.length === 0) return null;

            return (
              <div key={folder.name}>
                <h3 className="capitalize">{folder.name}</h3>
                <ul className="list-reset">
                  {filteredPages.map((page) => {
                    const isActive = currentPath === getPath(page.file);
                    return (
                      <li key={page.file}>
                        <a
                          href={`/${folder.name}/${getPath(page.file)}`}
                          className={`button button-small ${
                            isActive ? 'button-primary' : 'button-transparent'
                          }`}
                          ref={isActive ? activeLinkRef : undefined}
                        >
                          {page.frontmatter.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
      </ul>
    </aside>
  );
};
