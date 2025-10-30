
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import api from '../../lib/api';
import { Button } from '../../components/ui/Button';

export default function InviteLinkGenerator() {
    const [inviteLink, setInviteLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateLink = async () => {
        setLoading(true);
        try {
            const res = await api.post('/users/connect');
            const fullLink = `${window.location.origin}/connect/${res.data.inviteId}`;
            setInviteLink(fullLink);
        } catch (error) {
            console.error('Failed to generate invite link', error);
        } finally {
            setLoading(false);
        }
    };
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (inviteLink) {
        return (
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    readOnly
                    value={inviteLink}
                    className="w-full bg-lavender-100 dark:bg-slate-700 text-sm rounded-md px-2 py-1 border border-lavender-200 dark:border-slate-600 focus:outline-none"
                />
                <button
                    onClick={copyToClipboard}
                    className="p-2 bg-lavender-500 text-white rounded-md hover:bg-lavender-600"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            </div>
        );
    }

    return (
        <Button onClick={generateLink} disabled={loading} className="w-full">
            {loading ? 'Generating...' : 'Connect with a Friend'}
        </Button>
    );
}
