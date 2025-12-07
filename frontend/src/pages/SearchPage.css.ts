import { style } from '@vanilla-extract/css';
import { BOTTOM_NAV_HEIGHT } from '../shared/ui/constants';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  height: `calc(100vh - ${BOTTOM_NAV_HEIGHT}px - env(safe-area-inset-bottom))`,
  backgroundColor: '#f8f9fa',
});

export const header = style({
  padding: '20px 16px',
  paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)',
  backgroundColor: '#fff',
  borderBottom: '1px solid #e0e0e0',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const results = style({
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const resultList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const resultCount = style({
  fontSize: '14px',
  color: '#666',
  fontWeight: '500',
  marginBottom: '8px',
});

export const loading = style({
  textAlign: 'center',
  padding: '40px 20px',
  fontSize: '16px',
  color: '#666',
});

export const error = style({
  textAlign: 'center',
  padding: '40px 20px',
  fontSize: '16px',
  color: '#d32f2f',
  backgroundColor: '#ffebee',
  borderRadius: '8px',
});

export const empty = style({
  textAlign: 'center',
  padding: '40px 20px',
  fontSize: '16px',
  color: '#999',
});

export const hint = style({
  textAlign: 'center',
  padding: '40px 20px',
  fontSize: '14px',
  color: '#999',
});

export const welcome = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 20px',
  gap: '16px',
});

export const welcomeIcon = style({
  fontSize: '48px',
});

export const welcomeText = style({
  fontSize: '16px',
  color: '#999',
  margin: 0,
});
