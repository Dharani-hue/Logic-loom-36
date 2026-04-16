import { FormEvent, useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import RiskBadge from '../components/RiskBadge';
import styles from '../styles/AdminDashboardPage.module.css';
import { createProfile, fetchProfiles, ElderlyProfile, ProfileInput } from '../api/admin';

const defaultForm: ProfileInput = {
  name: '',
  age: '',
  gender: 'Female',
  location: '',
  familyContact: '',
  appetite: '',
  mood: 'Neutral',
  mobility: 'Stable',
  sleepQuality: 'Good',
  lonelinessScore: 10,
  notes: '',
};

const AdminDashboardPage = () => {
  const [form, setForm] = useState(defaultForm);
  const [profiles, setProfiles] = useState<ElderlyProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const lastEntry = profiles[0];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchProfiles();
        setProfiles(data);
      } catch (err) {
        setError('Unable to load saved profiles.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (field: keyof ProfileInput, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.age.trim() || !form.familyContact.trim()) {
      setError('Name, age, and family contact are required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const savedProfile = await createProfile({
        ...form,
        location: form.location.trim() || 'Not specified',
      });

      setProfiles((current) => [savedProfile, ...current]);
      setForm(defaultForm);
    } catch (err) {
      setError('Unable to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const summaryText = useMemo(
    () =>
      lastEntry
        ? `Latest entry for ${lastEntry.name}: ${lastEntry.risk} risk, score ${lastEntry.lonelinessScore}.`
        : 'Add the first geriatric profile to begin tracking care needs and loneliness risk.',
    [lastEntry],
  );

  return (
    <div className={styles.adminPage}>
      <section className={styles.headerSection}>
        <div>
          <span className={styles.subTitle}>NGO Admin Dashboard</span>
          <h1>Geriatric Profile Entry</h1>
          <p>
            Record daily observations and care indicators for older adults. Use this dashboard to manage
            each geriatric profile, track loneliness score, and prioritize timely support.
          </p>
        </div>
        <Card className={styles.summaryCard}>
          <h3>Current Intake Summary</h3>
          <p>{summaryText}</p>
          {lastEntry && (
            <div className={styles.summaryDetails}>
              <span>{lastEntry.name}</span>
              <RiskBadge risk={lastEntry.risk} />
            </div>
          )}
        </Card>
      </section>

      <section className={styles.bodyGrid}>
        <Card title="Geriatric Profile" className={styles.formCard}>
          {error ? <p className={styles.errorMessage}>{error}</p> : null}
          <form className={styles.profileForm} onSubmit={handleSave}>
            <div className={styles.fieldGroup}>
              <label>
                Name
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="Elderly person name"
                />
              </label>
              <label>
                Age
                <input
                  type="number"
                  min="60"
                  value={form.age}
                  onChange={(event) => handleChange('age', event.target.value)}
                  placeholder="e.g. 78"
                />
              </label>
            </div>

            <div className={styles.fieldGroup}>
              <label>
                Gender
                <select value={form.gender} onChange={(event) => handleChange('gender', event.target.value)}>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                Location
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => handleChange('location', event.target.value)}
                  placeholder="Living location / facility"
                />
              </label>
            </div>

            <div className={styles.fieldGroup}>
              <label>
                Family Contact
                <input
                  type="text"
                  value={form.familyContact}
                  onChange={(event) => handleChange('familyContact', event.target.value)}
                  placeholder="Primary family member / phone"
                />
              </label>
              <label>
                Appetite
                <select value={form.appetite} onChange={(event) => handleChange('appetite', event.target.value)}>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </label>
            </div>

            <div className={styles.fieldGroup}>
              <label>
                Mood
                <select value={form.mood} onChange={(event) => handleChange('mood', event.target.value)}>
                  <option value="Positive">Positive</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Low">Low</option>
                </select>
              </label>
              <label>
                Mobility
                <select value={form.mobility} onChange={(event) => handleChange('mobility', event.target.value)}>
                  <option value="Stable">Stable</option>
                  <option value="Reduced">Reduced</option>
                  <option value="Limited">Limited</option>
                </select>
              </label>
            </div>

            <div className={styles.fieldGroup}>
              <label>
                Sleep Quality
                <select value={form.sleepQuality} onChange={(event) => handleChange('sleepQuality', event.target.value)}>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </label>
              <label>
                Loneliness Score
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={form.lonelinessScore}
                  onChange={(event) => handleChange('lonelinessScore', Number(event.target.value))}
                />
                <span className={styles.rangeValue}>{form.lonelinessScore}</span>
              </label>
            </div>

            <label className={styles.fullWidth}>
              Notes / Observations
              <textarea
                value={form.notes}
                onChange={(event) => handleChange('notes', event.target.value)}
                placeholder="Enter care notes, concerns, or action items"
              />
            </label>

            <div className={styles.actionsRow}>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </Card>

        <div className={styles.activityPanel}>
          <Card title="Recent Entries" className={styles.recentCard}>
            {loading ? (
              <p>Loading saved profiles…</p>
            ) : profiles.length === 0 ? (
              <p>No profiles added yet. Fill the form to begin tracking individual geriatric care plans.</p>
            ) : (
              <div className={styles.entryList}>
                {profiles.map((profile) => (
                  <div key={profile.id} className={styles.entryItem}>
                    <div>
                      <h4>{profile.name}</h4>
                      <p>{profile.age} years • {profile.location}</p>
                    </div>
                    <div className={styles.entryMeta}>
                      <RiskBadge risk={profile.risk} />
                      <span>{profile.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Care Actions" className={styles.careCard}>
            <ul>
              <li>✔ Verify family check-in schedule.</li>
              <li>✔ Watch for changes in appetite or mobility.</li>
              <li>✔ Update care notes after each visit.</li>
              <li>✔ Escalate high-risk cases quickly.</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
