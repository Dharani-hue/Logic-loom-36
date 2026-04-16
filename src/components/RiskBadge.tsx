import styles from '../styles/RiskBadge.module.css';

interface RiskBadgeProps {
  risk: 'Low' | 'Medium' | 'High';
}

const RiskBadge = ({ risk }: RiskBadgeProps) => (
  <span className={`${styles.badge} ${styles[risk.toLowerCase()]}`}>{risk} Risk</span>
);

export default RiskBadge;
