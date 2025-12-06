import { NavLink } from 'react-router-dom';
import * as styles from './bottomNavigation.css';

export default function BottomNavigation() {
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? `${styles.navItem} ${styles.navItemActive}`
            : styles.navItem
        }
      >
        <span className={styles.icon}>☐</span>
        <span>Tasks</span>
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          isActive
            ? `${styles.navItem} ${styles.navItemActive}`
            : styles.navItem
        }
      >
        <span className={styles.icon}>🕐</span>
        <span>History</span>
      </NavLink>
    </nav>
  );
}
