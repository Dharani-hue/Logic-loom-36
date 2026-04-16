import { ReactNode } from 'react';
import styles from '../styles/Card.module.css';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const Card = ({ title, children, className = '' }: CardProps) => (
  <section className={`${styles.card} ${className}`}>
    {title && <h3 className={styles.title}>{title}</h3>}
    {children}
  </section>
);

export default Card;
