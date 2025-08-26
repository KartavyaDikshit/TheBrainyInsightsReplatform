'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
export default function AIStagingPage() {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const t = useTranslations('AIStagingPage');
    const fetchQueue = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/ai/staging');
            if (!response.ok) {
                throw new Error('Failed to fetch AI queue');
            }
            const data = await response.json();
            setQueue(data);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchQueue();
    }, []);
    const handleApprove = async (id) => {
        try {
            const response = await fetch('/api/ai/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) {
                throw new Error('Failed to approve item');
            }
            fetchQueue(); // Refresh the list
        }
        catch (err) {
            setError(err.message);
        }
    };
    const handleReject = async (id) => {
        try {
            const response = await fetch('/api/ai/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) {
                throw new Error('Failed to reject item');
            }
            fetchQueue(); // Refresh the list
        }
        catch (err) {
            setError(err.message);
        }
    };
    if (loading)
        return <div className="text-center py-8">{t('loading')}</div>;
    if (error)
        return <div className="text-center py-8 text-red-500">{t('error')}: {error}</div>;
    return (<div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t('aiStagingTitle')}</h1>
      {queue.length === 0 ? (<p>{t('noItems')}</p>) : (<div className="grid grid-cols-1 gap-4">
          {queue.map((item) => (<div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{t('prompt')}: {item.prompt}</h2>
              <p className="text-gray-700 mb-2">{t('locale')}: {item.locale}</p>
              <p className="text-gray-700 mb-2">{t('status')}: {item.status}</p>
              <div className="bg-gray-100 p-3 rounded-md text-sm max-h-40 overflow-auto mb-4">
                <pre>{item.outputJson}</pre>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleApprove(item.id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                  {t('approveButton')}
                </button>
                <button onClick={() => handleReject(item.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                  {t('rejectButton')}
                </button>
              </div>
            </div>))}
        </div>)}
    </div>);
}
