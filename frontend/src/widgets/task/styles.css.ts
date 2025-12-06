import { style } from '@vanilla-extract/css'

export const container = style({
  maxWidth: "600px",
  margin: "0 auto",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  paddingTop: "env(safe-area-inset-top, 1rem)",
});

export const header = style({
  marginBottom: '2rem',
  textAlign: 'center',
})

export const title = style({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: 0,
})

export const form = style({
  display: "flex",
  gap: "0.5rem",
  padding: "1rem",
  background: "#f9fafb",
  borderTop: "1px solid #e5e7eb",
  flexShrink: 0,
});

export const input = style({
  flex: 1,
  padding: '0.5rem',
  borderRadius: '0.375rem',
  border: '1px solid #e5e7eb',
  fontSize: '1rem',
  ':focus': {
    outline: 'none',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
  },
})

export const addButton = style({
  padding: '0.5rem 1rem',
  backgroundColor: '#3b82f6',
  color: 'white',
  borderRadius: '0.375rem',
  border: 'none',
  fontSize: '1rem',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#2563eb',
  },
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  flex: 1,
  overflowY: 'auto',
  minHeight: 0,
  paddingLeft: '1rem',
  paddingRight: '1rem',
})

export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem',
  backgroundColor: 'white',
  borderRadius: '0.375rem',
  border: '1px solid #e5e7eb',
})

export const text = style({
  flex: 1,
  fontSize: '1rem',
  color: '#1f2937',
})

export const completeButton = style({
  width: '2rem',
  height: '2rem',
  backgroundColor: '#10b981',
  color: 'white',
  borderRadius: '0.375rem',
  border: 'none',
  fontSize: '1.25rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ':hover': {
    backgroundColor: '#059669',
  },
})

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
})

export const empty = style({
  textAlign: 'center',
  color: '#9ca3af',
  fontSize: '1rem',
  padding: '2rem',
}) 