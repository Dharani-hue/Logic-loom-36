import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from '../styles/Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'solid' | 'ghost';
}

const Button = ({ children, variant = 'solid', className = '', ...props }: ButtonProps) => (
  <button className={`${styles.button} ${styles[variant]} ${className}`} {...props}>
    {children}
  </button>
);

export default Button;
