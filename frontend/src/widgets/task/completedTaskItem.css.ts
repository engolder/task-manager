import { style } from '@vanilla-extract/css';

export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem',
  backgroundColor: '#f9fafb',
  borderRadius: '0.375rem',
  border: '1px solid #e5e7eb',
});

export const content = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

export const text = style({
  fontSize: '1rem',
  color: '#9ca3af',
  textDecoration: 'line-through',
});

export const time = style({
  fontSize: '0.75rem',
  color: '#6b7280',
});

export const restoreButton = style({
  width: '2rem',
  height: '2rem',
  backgroundColor: '#f59e0b',
  color: 'white',
  borderRadius: '0.375rem',
  border: 'none',
  fontSize: '1.25rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ':hover': {
    backgroundColor: '#d97706',
  },
});

export const deleteButton = style({
  width: '2rem',
  height: '2rem',
  backgroundColor: '#ef4444',
  color: 'white',
  borderRadius: '0.375rem',
  border: 'none',
  fontSize: '1.25rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ':hover': {
    backgroundColor: '#dc2626',
  },
});
