
'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { User } from 'lucide-react';

interface Inviter {
    username: string;
    email: string;
}

export default function ConnectPage() {
    const { inviteId } = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [inviter, setInviter] = useState<Inviter | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInviterInfo = async () => {
            try {
                const res = await api.get(`/users/connect/${inviteId}`);
                setInviter(res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Invalid or expired invite link.');
            } finally {
                setLoading(false);
            }
        };

        if (inviteId) {
            fetchInviterInfo();
        }
    }, [inviteId]);

    const handleAccept = async () => {
        if (!isAuthenticated) {
            // Store invite link and redirect to login
            localStorage.setItem('pendingInviteId', inviteId as string);
            router.push('/login');
            return;
        }

        try {
            setLoading(true);
            const res = await api.post(`/users/connect/${inviteId}/accept`);
            const { chat } = res.data;
            router.push(`/${chat._id}`);
        } catch (err: any) {
            if(err.response?.data?.chatId) {
                router.push(`/${err.response.data.chatId}`);
            } else {
                setError(err.response?.data?.message || 'Failed to accept invite.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-lavender-100 to-white dark:from-dark-bg dark:to-dark-surface">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg dark:bg-dark-primary text-center">
                <h1 className="text-3xl font-bold text-lavender-700 dark:text-lavender-300">Chat Invitation</h1>
                {loading && <p>Loading invite...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {inviter && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-lavender-100 rounded-full dark:bg-lavender-900">
                            <User className="w-12 h-12 text-lavender-500" />
                        </div>
                        <p className="text-lg">
                            <span className="font-semibold">{inviter.username}</span> has invited you to chat!
                        </p>
                        <Button onClick={handleAccept} disabled={loading} className="w-full">
                            {loading ? 'Connecting...' : 'Accept & Chat'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
