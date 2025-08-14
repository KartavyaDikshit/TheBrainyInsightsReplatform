import { Table } from '@/components';
import { listLeads } from '@/lib/data/adapter';

async function getLeads() {
  return await listLeads();
}

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <h1>Leads</h1>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Message</th>
            <th>Locale</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead: any) => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.company}</td>
              <td>{lead.message}</td>
              <td>{lead.locale}</td>
              <td>{lead.createdAt?.toDateString() || ''}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
