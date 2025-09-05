export const getFormattedDate = (dateInSeconds: number): string => new Date(dateInSeconds * 1000).toLocaleDateString();
