import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from '../styles/HomePage.module.css';

const features = [
  {
    title: 'AI Risk Detection',
    description: 'Capture early loneliness signs with an intuitive AI assessment engine.',
  },
  {
    title: 'Behavioral Analysis',
    description: 'Review patterns across meals, outings, and social contacts in one view.',
  },
  {
    title: 'Smart Recommendations',
    description: 'Provide meaningful care actions that support emotional wellbeing.',
  },
  {
    title: 'Family Monitoring',
    description: 'Share insights with family members to strengthen support networks.',
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homePage}>
      <section className={styles.heroSection}>
        <div className={styles.heroCopy}>
          <span className={styles.mission}>Empowering compassionate elder care</span>
          <h1>Welcome to ElderGuard AI</h1>
          <p>
            Supporting NGOs and caregivers with pastel-powered analytics, compassionate alerts, and actionable care guidance.
          </p>
          <div className={styles.statsGrid}>
            <div>
              <strong>72%</strong>
              <span>Elderly report feeling isolated monthly</span>
            </div>
            <div>
              <strong>94%</strong>
              <span>Improved support connection after intervention</span>
            </div>
          </div>
          <div className={styles.heroActions}>
            <Button onClick={() => navigate('/admin-dashboard')}>Open NGO Admin Dashboard</Button>
            <Button variant="ghost" onClick={() => navigate('/input')}>Start Assessment</Button>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroGlow} />
          <div className={styles.heroCard}>
            <span>Daily Care Pulse</span>
            <strong>Comfort, connection, and calm insights.</strong>
          </div>
        </div>
      </section>

      <section className={styles.featureGrid}>
        {features.map((feature) => (
          <Card key={feature.title} className={styles.featureCard}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
