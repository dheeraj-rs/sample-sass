'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Zap, Shield } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [upgrading, setUpgrading] = useState(false);
    const [name, setName] = useState('');
    const [accountName, setAccountName] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setName(data.user.name);
                setAccountName(data.user.accountName || '');
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch('/api/user/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                alert('Profile updated successfully');
                fetchUserData();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleUpgrade = async (plan: string) => {
        if (!accountName || accountName.trim().length === 0) {
            alert('Please enter an account name');
            return;
        }

        setUpgrading(true);
        setSelectedPlan(plan);

        try {
            const response = await fetch('/api/user/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan, accountName: accountName.toLowerCase() }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(
                    `🎉 ${data.message}\n\n` +
                    `Database: ${data.databaseName}\n` +
                    `Max Projects: ${data.features.maxProjects}\n` +
                    `Storage: ${data.features.storage}\n` +
                    `API Access: ${data.features.apiAccess ? 'Enabled' : 'Disabled'}\n\n` +
                    `You can now create projects!`
                );
                fetchUserData();
                router.push('/projects');
            } else {
                alert(data.error || 'Failed to upgrade plan');
            }
        } catch (error) {
            console.error('Failed to upgrade plan:', error);
            alert('Failed to upgrade plan. Please try again.');
        } finally {
            setUpgrading(false);
            setSelectedPlan('');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

                {/* Profile Settings */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <Input
                                label="Full Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={user?.email}
                                disabled
                            />
                            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                                Email cannot be changed. Contact support if you need to update your email address.
                            </div>
                            <Button type="submit" loading={saving}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Shield className="w-5 h-5 mr-2" />
                            Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                                    <p className="text-sm text-gray-600">
                                        {user?.twoFactorEnabled
                                            ? 'Your account is protected with 2FA'
                                            : 'Add an extra layer of security to your account'}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user?.twoFactorEnabled
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                            {user?.role === 'owner' && (
                                <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded-lg text-sm">
                                    As the owner, 2FA is mandatory and always enabled for your account.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Plan & Billing */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Zap className="w-5 h-5 mr-2" />
                            Plan & Billing
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="font-medium text-gray-900">Current Plan</h4>
                                    <p className="text-2xl font-bold text-purple-600 uppercase mt-1">{user?.plan}</p>
                                </div>
                                {user?.accountName && (
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Account Name</p>
                                        <p className="font-medium text-gray-900">{user.accountName}</p>
                                    </div>
                                )}
                            </div>

                            {user?.plan === 'free' && (
                                <>
                                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm mb-6">
                                        Upgrade to unlock project management, isolated databases, and more features!
                                    </div>

                                    <Input
                                        label="Account Name (for your isolated database)"
                                        type="text"
                                        placeholder="my-company"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        className="mb-6"
                                    />

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="border-2 border-purple-600 rounded-lg p-4">
                                            <h5 className="font-bold text-lg mb-2">Pro Plan</h5>
                                            <p className="text-3xl font-bold text-gray-900 mb-2">$29<span className="text-sm text-gray-600">/mo</span></p>
                                            <ul className="space-y-2 mb-4 text-sm">
                                                <li>✓ Isolated database</li>
                                                <li>✓ Up to 10 projects</li>
                                                <li>✓ Priority support</li>
                                                <li>✓ Advanced features</li>
                                            </ul>
                                            <Button
                                                className="w-full"
                                                onClick={() => handleUpgrade('pro')}
                                                loading={upgrading && selectedPlan === 'pro'}
                                                disabled={upgrading}
                                            >
                                                Upgrade to Pro
                                            </Button>
                                        </div>

                                        <div className="border-2 border-indigo-600 rounded-lg p-4">
                                            <h5 className="font-bold text-lg mb-2">Max Plan</h5>
                                            <p className="text-3xl font-bold text-gray-900 mb-2">$99<span className="text-sm text-gray-600">/mo</span></p>
                                            <ul className="space-y-2 mb-4 text-sm">
                                                <li>✓ Dedicated database</li>
                                                <li>✓ Up to 100 projects</li>
                                                <li>✓ 24/7 priority support</li>
                                                <li>✓ All features included</li>
                                            </ul>
                                            <Button
                                                className="w-full"
                                                onClick={() => handleUpgrade('max')}
                                                loading={upgrading && selectedPlan === 'max'}
                                                disabled={upgrading}
                                            >
                                                Upgrade to Max
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {user?.plan !== 'free' && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                                    You're currently on the {user?.plan.toUpperCase()} plan with isolated database access.
                                    Your database: <code className="font-mono font-bold">d-{user?.accountName}</code>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
