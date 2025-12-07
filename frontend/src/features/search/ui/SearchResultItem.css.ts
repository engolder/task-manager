import { style } from '@vanilla-extract/css';

export const resultItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px',
  backgroundColor: '#fff',
  borderRadius: '12px',
  border: '1px solid #e0e0e0',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#f8f9fa',
    borderColor: '#007AFF',
    transform: 'translateY(-2px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  ':active': {
    transform: 'translateY(0)',
  },
  ':focus': {
    outline: '2px solid #007AFF',
    outlineOffset: '2px',
  },
});

export const content = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  minWidth: 0, // flexbox에서 텍스트 overflow 방지
});

export const text = style({
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#333',
  wordBreak: 'break-word',
  // 하이라이트 스타일
  selectors: {
    '& mark': {
      backgroundColor: '#ffeb3b',
      color: '#000',
      fontWeight: '600',
      padding: '2px 4px',
      borderRadius: '4px',
    },
  },
});

export const metadata = style({
  display: 'flex',
  gap: '12px',
  fontSize: '13px',
  color: '#666',
});

export const score = style({
  fontWeight: '500',
  color: '#007AFF',
});

export const date = style({
  color: '#999',
});

export const statusBadge = style({
  fontSize: '24px',
  flexShrink: 0,
});
