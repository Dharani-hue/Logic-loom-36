import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from '../styles/LoginPage.module.css';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('ngo');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    setError('');
    onLogin(role);
    navigate(role === 'ngo' ? '/home' : '/family');
  };

  return (
    <div className={styles.loginPage}>
      <Card className={styles.loginCard}>
        <div className={styles.intro}>
          <span className={styles.tiny}>AI-Powered Geriatric Loneliness Risk Monitoring</span>
          <h1>Welcome to ElderGuard AI</h1>
          <p>Securely access the care dashboard and help families stay connected with elderly loved ones.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Role
            <select value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
              <option value="ngo">NGO / Caregiver</option>
              <option value="family">Family Member</option>
            </select>
          </label>

          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" className={styles.submitButton}>
            {role === 'ngo' ? 'Enter NGO Dashboard' : 'Enter Family Panel'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
