import { Table } from '@/components';

export default function AdminRedirectsPage() {
  return (
    <div>
      <h1>Redirects</h1>
      <Table>
        <thead>
          <tr>
            <th>Old Path</th>
            <th>New Path</th>
            <th>Locale</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Redirect data will be loaded here */}
        </tbody>
      </Table>
    </div>
  );
}
