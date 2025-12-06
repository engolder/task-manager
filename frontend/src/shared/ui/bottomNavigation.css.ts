import { style } from '@vanilla-extract/css';
import { BOTTOM_NAV_HEIGHT } from './constants';

export const nav = style({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
  backgroundColor: '#ffffff',
  borderTop: '1px solid #e0e0e0',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  zIndex: 1000,
});

export const navItem = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  padding: '8px',
  textDecoration: 'none',
  color: '#666',
  fontSize: '12px',
  fontWeight: 500,
  transition: 'color 0.2s',
  cursor: 'pointer',
  border: 'none',
  background: 'none',

  ':hover': {
    color: '#333',
  },
});

export const navItemActive = style({
  color: '#007AFF',

  ':hover': {
    color: '#007AFF',
  },
});

export const icon = style({
  fontSize: '24px',
});
