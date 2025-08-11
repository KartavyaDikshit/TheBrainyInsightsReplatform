'use client';
import React, { useState, useEffect } from 'react';
import { Table, Button } from '@/components';
import { listAIQueue, approveAIItem, rejectAIItem } from '@/lib/data/adapter';

export default function AdminStagingPage() {
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    const fetchQueue = async () => {
      const items = await listAIQueue();
      setQueue(items);
    };
    fetchQueue();
  }, []);

  const handleApprove = async (id: string) => {
    const updatedItem = await approveAIItem(id);
    if (updatedItem) {
      setQueue(prev => prev.map(item => item.id === id ? updatedItem : item));
    }
  };

  const handleReject = async (id: string) => {
    const updatedItem = await rejectAIItem(id);
    if (updatedItem) {
      setQueue(prev => prev.map(item => item.id === id ? updatedItem : item));
    }
  };

  return (
    <div>
      <h1>AI Staging Queue</h1>
      <Table>
        <thead>
          <tr>
            <th>Prompt</th>
            <th>Locale</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {queue.map((item: any) => (
            <tr key={item.id}>
              <td>{item.prompt}</td>
              <td>{item.locale}</td>
              <td>{item.status}</td>
              <td>
                <Button onClick={() => handleApprove(item.id)}>Approve</Button>
                <Button onClick={() => handleReject(item.id)}>Reject</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
