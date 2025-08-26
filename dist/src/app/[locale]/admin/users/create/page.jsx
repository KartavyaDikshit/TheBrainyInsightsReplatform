'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
export default function CreateUserPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('VIEWER'); // Default role
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const t = useTranslations('CreateUserPage');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(t('userCreatedSuccess'));
                setEmail('');
                setPassword('');
                setRole('VIEWER');
            }
            else {
                setError(data.error || t('userCreationError'));
            }
        }
        catch (err) {
            setError(t('userCreationError'));
        }
    };
    return (<div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">{t('createUserTitle')}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">{t('emailLabel')}</label>
              <input type="email" placeholder={t('emailPlaceholder')} className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">{t('passwordLabel')}</label>
              <input type="password" placeholder={t('passwordPlaceholder')} className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="role">{t('roleLabel')}</label>
              <select id="role" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="VIEWER">{t('roleViewer')}</option>
                <option value="EDITOR">{t('roleEditor')}</option>
                <option value="ADMIN">{t('roleAdmin')}</option>
              </select>
            </div>
            {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex items-baseline justify-between">
              <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                {t('createUserButton')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>);
}
