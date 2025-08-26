import { Table } from '@tbi/ui';

export default function AdminReportsPage() {
  return (
    <div>
      <h1>Reports (View Only)</h1>
      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Report data will be loaded here */}
        </tbody>
      </Table>
    </div>
  );
}
