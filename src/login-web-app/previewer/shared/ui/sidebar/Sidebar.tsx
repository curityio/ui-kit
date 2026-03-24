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

import { useState } from 'react';
import { examples, PreviewItem, PreviewSection } from '../../../examples';
import { ChevronDown } from './icons/ChevronDown';
import { ChevronUp } from './icons/ChevronUp';
import { FolderClosed } from './icons/FolderClosed';
import { FolderOpen } from './icons/FolderOpen';
import { PageIcon } from './icons/PageIcon';
import { SearchIcon } from './icons/SearchIcon';
import classes from './sidebar.module.css';

interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

function filterExamples(items: PreviewItem[], query: string, parentMatches = false): PreviewItem[] {
  const q = query.toLowerCase();
  return items.flatMap((item): PreviewItem[] => {
    if ('items' in item) {
      const sectionMatches = item.title.toLowerCase().includes(q);
      const filtered = filterExamples(item.items, q, sectionMatches);
      return filtered.length > 0 ? [{ ...item, items: filtered } as PreviewSection] : [];
    }
    return parentMatches || item.title.toLowerCase().includes(q) ? [item] : [];
  });
}

export const Sidebar = ({ onNavigate, currentPage }: SidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => new Set());
  const [search, setSearch] = useState('');

  const isSearching = search.trim() !== '';
  const visibleExamples = isSearching ? filterExamples(examples, search) : examples;

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  function renderItem(example: PreviewItem) {
    if ('items' in example) {
      const isExpanded = isSearching || expandedSections.has(example.id);
      const listId = `section-list-${example.id}`;
      return (
        <li key={example.id}>
          <div className={classes.sectionHeader}>
            <button
              type="button"
              onClick={() => toggleSection(example.id)}
              className="button button-small button-transparent"
              aria-expanded={isExpanded}
              aria-controls={listId}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${example.title} section`}
            >
              <span>{isExpanded ? <ChevronUp /> : <ChevronDown />}</span>
              <span>{isExpanded ? <FolderOpen /> : <FolderClosed />}</span>
              <span className={classes.sectionTitle}>
                {isExpanded ? <strong>{example.title}</strong> : example.title}
              </span>
            </button>
          </div>
          {isExpanded && (
            <ul id={listId} className={`list-reset m0 ${classes.nestedList}`}>
              {example.items.map(renderItem)}
            </ul>
          )}
        </li>
      );
    } else {
      return (
        <li key={example.id}>
          <button
            type="button"
            onClick={() => onNavigate(example.id)}
            className={`button button-small button-transparent ${currentPage === example.id ? classes.active : ''}`}
            aria-current={currentPage === example.id ? 'page' : undefined}
          >
            <PageIcon />
            <span>{example.title}</span>
          </button>
        </li>
      );
    }
  }

  return (
    <aside className={classes.sidebar} aria-label="Component navigation">
      <div className="relative pl2 mb2">
        <SearchIcon className={classes['search-icon']} />
        <input
          type="search"
          placeholder="Search by title"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`field w100 ${classes['search-input']}`}
          aria-label="Search pages"
        />
      </div>
      <nav aria-label="Primary navigation">
        <ul className="list-reset m0">{visibleExamples.map(renderItem)}</ul>
      </nav>
    </aside>
  );
};
