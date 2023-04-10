import { Card as MuiCard, CardProps } from '@mui/material';

export default function Card({ ...rest }: CardProps) {
  return (
    <MuiCard sx={{
      borderRadius: 8,
      boxShadow: 'none',
      border: '1px solid #e0e0e0',
    }} elevation={0} {...rest} />
  );
}