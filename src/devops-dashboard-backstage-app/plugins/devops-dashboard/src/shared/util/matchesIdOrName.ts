/**
 * Case-insensitive client-side search over items with an `id` and a `name`,
 * as `useTable`'s `searchFn` expects.
 */
export const matchesIdOrName = <T extends { id: string; name: string }>(
  items: T[],
  term: string,
): T[] =>
  items.filter(item =>
    `${item.id} ${item.name}`.toLowerCase().includes(term.toLowerCase()),
  );
