import Link from 'next/link';
import styles from './admin.module.css'; // Import the CSS module

export default async function AdminPage() {
  // Removed auth and redirect as middleware handles it

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <h2>Admin Panel</h2>
        <nav className={styles.sidebarNav}>
          <ul>
            <li><Link href="/admin" className={styles.active}>Dashboard</Link></li>
            <li><Link href="/admin/reports">Reports</Link></li>
            <li><Link href="/admin/staging">AI Staging</Link></li>
            <li><Link href="/admin/users/create">Users</Link></li>
            <li><Link href="/admin/redirects">Redirects</Link></li>
            <li><Link href="/admin/leads">Leads</Link></li>
          </ul>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.dashboardHeader}>
          <h1>Dashboard Overview</h1>
        </header>
        <section className={styles.cardGrid}>
          <div className={styles.card}>
            <h3>Total Reports</h3>
            <p>1,234</p>
          </div>
          <div className={styles.card}>
            <h3>AI Generated (Pending)</h3>
            <p>42</p>
          </div>
          <div className={styles.card}>
            <h3>Users</h3>
            <p>123</p>
          </div>
        </section>

        <section className={styles.formSection} style={{ marginTop: '30px' }}>
          <h2>AI Content Generation</h2>
          <p>This section will allow you to generate new content using the OpenAI API.</p>
          {/* Placeholder for AI generation form */}
          <div className={styles.formGroup}>
            <label htmlFor="aiTopic">Topic for AI Generation:</label>
            <input type="text" id="aiTopic" placeholder="e.g., 'Quantum Computing Market'" />
          </div>
          <button className={styles.buttonPrimary}>Generate AI Content</button>
        </section>

        <section className={styles.formSection} style={{ marginTop: '30px' }}>
          <h2>AI Content Approval Queue</h2>
          <p>Review and approve AI-generated content before publishing.</p>
          {/* Placeholder for AI approval list */}
          <div className={styles.card}>
            <h3>Report: AI Generated Draft 1</h3>
            <p>Status: PENDING_REVIEW</p>
            <button className={styles.buttonPrimary}>Approve</button>
            <button className={styles.buttonSecondary}>Reject</button>
          </div>
        </section>
      </main>
    </div>
  );
}
