import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import TrendChart from '../components/TrendChart';
import RiskBadge from '../components/RiskBadge';
import styles from '../styles/FamilyDashboardPage.module.css';
import { ElderlyProfile, fetchProfiles } from '../api/admin';

interface FamilyDashboardPageProps {
  familyUsername: string;
}

const FamilyDashboardPage = ({ familyUsername }: FamilyDashboardPageProps) => {
  const [profiles, setProfiles] = useState<ElderlyProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchProfiles(familyUsername);
        setProfiles(data);
      } catch (err) {
        setError('Unable to load your assigned elder profiles.');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [familyUsername]);

  const summary = useMemo(() => {
    const total = profiles.length;
    const high = profiles.filter((profile) => profile.risk === 'High').length;
    const medium = profiles.filter((profile) => profile.risk === 'Medium').length;
    const low = profiles.filter((profile) => profile.risk === 'Low').length;
    return { total, high, medium, low };
  }, [profiles]);

  const activeProfile = profiles[0];

  return (
    <div className={styles.familyPage}>
      <section className={styles.profileSection}>
        <Card className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <span className={styles.tiny}>Family member dashboard</span>
              <h2>{familyUsername}</h2>
              <p>
                {summary.total
                  ? `${summary.total} elder profile${summary.total > 1 ? 's' : ''} assigned to your account.`
                  : 'No elder profiles have been assigned to your family username yet.'}
              </p>
            </div>
            <div className={styles.profileStatus}>
              <span className={styles.profileBadge}>Assigned family</span>
            </div>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {loading && <p>Loading elder profiles…</p>}
        </Card>
      </section>

      <section className={styles.metricsGrid}>
        <Card title="Assigned Elderly Summary" className={styles.conditionCard}>
          <div className={styles.conditionContent}>
            <div className={styles.metric}>
              <span className={styles.label}>Total elders</span>
              <span className={styles.value}>{summary.total}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.label}>High risk</span>
              <span className={styles.value} style={{ color: '#dc2626' }}>{summary.high}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.label}>Medium risk</span>
              <span className={styles.value} style={{ color: '#f59e0b' }}>{summary.medium}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.label}>Low risk</span>
              <span className={styles.value} style={{ color: '#16a34a' }}>{summary.low}</span>
            </div>
            <p className={styles.insight}>
              This view is filtered for your family username only. You can see elders assigned to you and their current risk levels.
            </p>
          </div>
        </Card>

        <Card title="Primary Elder Profile" className={styles.activitiesCard}>
          {activeProfile ? (
            <div className={styles.profileDetail}>
              <div className={styles.profileRow}>
                <div>
                  <h3>{activeProfile.name}</h3>
                  <p>{activeProfile.age} years • {activeProfile.gender}</p>
                </div>
                <RiskBadge risk={activeProfile.risk} />
              </div>
              <div className={styles.profileMeta}>
                <span>Location: {activeProfile.location}</span>
                <span>Mobility: {activeProfile.mobility}</span>
                <span>Appetite: {activeProfile.appetite}</span>
                <span>Sleep quality: {activeProfile.sleepQuality}</span>
                <span>Loneliness score: {activeProfile.lonelinessScore}</span>
              </div>
              <div className={styles.profileNotes}>
                <h4>Care notes</h4>
                <p>{activeProfile.notes || 'No notes entered yet.'}</p>
              </div>
            </div>
          ) : (
            <p>No assigned elder profile is available yet.</p>
          )}
        </Card>
      </section>

      <section className={styles.engagementSection}>
        <Card title="Your Assigned Elders" className={styles.metricsCard}>
          {loading ? (
            <p>Loading assigned elders…</p>
          ) : profiles.length === 0 ? (
            <p>No elder profiles assigned to your account yet.</p>
          ) : (
            <div className={styles.entryList}>
              {profiles.map((profile) => (
                <div key={profile.id} className={styles.activityItem}>
                  <div>
                    <h4>{profile.name}</h4>
                    <p>{profile.age} years • {profile.location}</p>
                  </div>
                  <div className={styles.entryMeta}>
                    <RiskBadge risk={profile.risk} />
                    <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
};

export default FamilyDashboardPage;
  { time: '8:00 AM', activity: '✓ Breakfast taken', mood: 'Neutral' },
  { time: '11:30 AM', activity: '✓ Short walk in garden', mood: 'Positive' },
  { time: '1:00 PM', activity: '✓ Phone call with Sarah', mood: 'Happy' },
  { time: '3:00 PM', activity: '⚠ Resting alone', mood: 'Withdrawn' },
];

const engagementMetrics = [
  { label: 'Social interactions', value: '3', target: '5', percentage: 60 },
  { label: 'Outdoor time', value: '45 mins', target: '60 mins', percentage: 75 },
  { label: 'Family contact', value: '1 call', target: '2-3 calls', percentage: 33 },
  { label: 'Physical activity', value: 'Light', target: 'Moderate', percentage: 50 },
];

const recommendations = [
  '📞 Schedule an extra family video call this week',
  '🚶 Encourage an afternoon outing tomorrow',
  '👥 Organize a visit from close family member',
  '🎵 Share favorite music or movies together',
  '🧩 Engage in familiar hobbies (gardening, puzzles)',
];

const alerts = [
  '⏰ Family contact decreased 25% this week.',
  '😔 Observed social withdrawal during late afternoon.',
  '💡 Reminder: schedule a meaningful interaction today.',
  '📊 Mood stability trending downward - needs attention.',
];

const FamilyDashboardPage = () => (
  <div className={styles.familyPage}>
    {/* Elder Profile Header */}
    <section className={styles.profileSection}>
      <Card className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <h2>{elderProfile.name}</h2>
            <p>Age {elderProfile.age} • Last update: {elderProfile.lastUpdate}</p>
          </div>
          <div className={styles.profileStatus}>
            <RiskBadge risk={elderProfile.riskLevel as 'Low' | 'Medium' | 'High'} />
          </div>
        </div>
      </Card>
    </section>

    {/* Key Metrics Grid */}
    <section className={styles.metricsGrid}>
      <Card title="Current Condition" className={styles.conditionCard}>
        <div className={styles.conditionContent}>
          <div className={styles.metric}>
            <span className={styles.label}>Overall Risk</span>
            <span className={styles.value} style={{ color: '#f59e0b' }}>Medium</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Mood Status</span>
            <span className={styles.value} style={{ color: '#8b5cf6' }}>Neutral → Withdrawn</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Engagement Level</span>
            <span className={styles.value} style={{ color: '#7dd3fc' }}>3 interactions</span>
          </div>
          <p className={styles.insight}>
            🔍 The assessment shows declining engagement patterns, especially in late afternoon. More frequent family touchpoints recommended.
          </p>
        </div>
      </Card>

      <Card title="Today's Activities" className={styles.activitiesCard}>
        <div className={styles.activityList}>
          {recentActivities.map((item) => (
            <div key={item.time} className={styles.activityItem}>
              <span className={styles.activityTime}>{item.time}</span>
              <span className={styles.activityDesc}>{item.activity}</span>
              <span className={styles.activityMood}>{item.mood}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>

    {/* Engagement Metrics */}
    <section className={styles.engagementSection}>
      <Card title="Weekly Engagement Metrics" className={styles.metricsCard}>
        <div className={styles.metricsList}>
          {engagementMetrics.map((metric) => (
            <div key={metric.label} className={styles.metricBar}>
              <div className={styles.metricLabel}>
                <span>{metric.label}</span>
                <span className={styles.metricValue}>{metric.value}</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: `${metric.percentage}%` }} />
              </div>
              <span className={styles.target}>Target: {metric.target}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>

    {/* Trend Analysis & Insights */}
    <section className={styles.trendSection}>
      <Card title="📊 Weekly Trend Analysis" className={styles.trendCard}>
        <TrendChart type="line" />
      </Card>
    </section>

    {/* Recommendations & Alerts */}
    <section className={styles.actionGrid}>
      <Card title="💡 Family Action Items" className={styles.recommendationCard}>
        <ul className={styles.actionList}>
          {recommendations.map((rec) => (
            <li key={rec} className={styles.actionItem}>{rec}</li>
          ))}
        </ul>
        <p className={styles.actionNote}>
          ℹ️ These actions help maintain emotional wellbeing and reduce loneliness risk.
        </p>
      </Card>

      <Card title="🚨 Important Alerts" className={styles.alertsCard}>
        <ul className={styles.alertList}>
          {alerts.map((alert) => (
            <li key={alert} className={styles.alertItem}>{alert}</li>
          ))}
        </ul>
      </Card>
    </section>

    {/* Behavioral Insights */}
    <section className={styles.insightsSection}>
      <Card title="🧠 AI Behavioral Analysis" className={styles.insightCard}>
        <div className={styles.insightContent}>
          <h4>Pattern Recognition</h4>
          <p>
            ElderGuard AI has identified a recurring pattern where mood declines in late afternoon hours. Social engagement dips significantly after 2 PM, suggesting increased vulnerability to loneliness during these times.
          </p>
          <h4>Recent Observations</h4>
          <ul>
            <li>✓ Positive morning meals and light activities</li>
            <li>✓ Good response to family phone calls</li>
            <li>⚠ Afternoon isolation and mood withdrawal</li>
            <li>⚠ Limited spontaneous social interactions</li>
          </ul>
          <h4>Recommendation</h4>
          <p>
            Schedule meaningful family interactions during mid-morning (10-11 AM) and early evening (5-6 PM) for optimal engagement. Consider arranging visits from close family members or trusted companions during vulnerable afternoon hours.
          </p>
        </div>
      </Card>
    </section>

    {/* Last Sync Info */}
    <section className={styles.footerInfo}>
      <p>Data last synced: Today 2:30 PM • Next assessment: Tomorrow 10:00 AM</p>
    </section>
  </div>
);

export default FamilyDashboardPage;
