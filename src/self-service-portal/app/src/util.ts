const colorList = [
  { letter: 'A', color: '#2e87ba' },
  { letter: 'B', color: '#2e87ba' },
  { letter: 'C', color: '#27b197' },
  { letter: 'D', color: '#4451a3' },
  { letter: 'E', color: '#26415a' },
  { letter: 'F', color: '#4b3046' },
  { letter: 'G', color: '#6778a5' },
  { letter: 'H', color: '#7b181a' },
  { letter: 'I', color: '#ba3a17' },
  { letter: 'J', color: '#7a2c52' },
  { letter: 'K', color: '#88315c' },
  { letter: 'L', color: '#b02929' },
  { letter: 'M', color: '#34d399' },
  { letter: 'N', color: '#6366f1' },
  { letter: 'O', color: '#5799a8' },
  { letter: 'P', color: '#8EB29A' },
  { letter: 'Q', color: '#c00000' },
  { letter: 'R', color: '#00549f' },
  { letter: 'S', color: '#fdba31' },
  { letter: 'T', color: '#fdba31' },
  { letter: 'U', color: '#64748b' },
  { letter: 'V', color: '#fb7185' },
  { letter: 'W', color: '#dbc6ec' },
  { letter: 'X', color: '#a351a9' },
  { letter: 'Y', color: '#c6e2ff' },
  { letter: 'Z', color: '#92a8d1' },
];

const getProfileImageColor = (letter?: string) => {
  const selectedColor = colorList.find(color => color.letter === letter);
  return selectedColor?.color ?? '#2e87ba';
};

function getUserInitial(name?: string) {
  if (!name) {
    return '';
  }

  return name.charAt(0).toUpperCase();
}

const appToastConfig = {
  className: 'app-toast',
  duration: 5000,
  position: 'bottom-center' as const,
  style: {
    background: 'var(--color-grey-subtle, #363636)',
    color: '#fff',
  },
  success: {
    style: {
      background: 'var(--color-success, green)',
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: 'var(--color-success, green)',
    },
  },
  error: {
    style: {
      background: 'var(--color-danger, red)',
      color: '#fff',
    },
    iconTheme: {
      secondary: 'var(--color-danger, red)',
      primary: '#fff',
    },
  },
};

export { getProfileImageColor, getUserInitial, appToastConfig };
