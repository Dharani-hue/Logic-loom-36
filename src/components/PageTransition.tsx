import { ReactNode } from 'react';
import styles from '../styles/PageTransition.module.css';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => (
  <div className={styles.transitionWrapper}>{children}</div>
);

export default PageTransition;
