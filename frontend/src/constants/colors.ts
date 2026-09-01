export type NoteColorHex = '#DF301C' | '#FFEDB9' | '#2BBBD7' | '#76C457';

export const NOTE_COLOR_LABELS: Record<NoteColorHex, string> = {
  '#DF301C': 'red',
  '#FFEDB9': 'yellow',
  '#2BBBD7': 'blue',
  '#76C457': 'green',
};

export function getColorLabel(color: string): string {
  return NOTE_COLOR_LABELS[color as NoteColorHex] || color;
}