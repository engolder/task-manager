import { style } from '@vanilla-extract/css';

export const searchContainer = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  backgroundColor: '#f5f5f5',
  borderRadius: '12px',
  padding: '12px 16px',
  gap: '8px',
});

export const searchIcon = style({
  fontSize: '20px',
  color: '#666',
  flexShrink: 0,
});

export const searchInput = style({
  flex: 1,
  border: 'none',
  backgroundColor: 'transparent',
  fontSize: '16px',
  outline: 'none',
  color: '#333',
  '::placeholder': {
    color: '#999',
  },
});

export const clearButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  border: 'none',
  backgroundColor: '#ddd',
  borderRadius: '50%',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#666',
  flexShrink: 0,
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#ccc',
  },
  ':active': {
    backgroundColor: '#bbb',
  },
});
