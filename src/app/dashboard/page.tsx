'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Users, FolderKanban, TrendingUp, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [accountName, setAccountName] = useState('');

    useEffect(() => {
        fetchUserData();
        fetchProjects();

        // Check if URL has #upgrade hash to open modal
        if (window.location.hash === '#upgrade') {
            setShowUpgradeModal(true);
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                // User not logged in - allow viewing in demo mode
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            // Allow viewing even if fetch fails
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            if (response.ok) {
                const data = await response.json();
                setProjects(data.projects || []);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };

    const handleUpgradeClick = (plan: string) => {
        if (!user) {
            router.push('/login?redirect=/dashboard');
            return;
        }
        setSelectedPlan(plan);
        setShowUpgradeModal(true);
    };

    const handleUpgrade = async () => {
        if (!accountName || accountName.trim().length === 0) {
            alert('Please enter an account name for your isolated database');
            return;
        }

        setUpgrading(true);

        try {
            const response = await fetch('/api/user/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: selectedPlan,
                    accountName: accountName.toLowerCase()
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(
                    `🎉 Payment Successful!\n\n` +
                    `${data.message}\n\n` +
                    `Database: ${data.databaseName}\n` +
                    `Max Projects: ${data.features.maxProjects}\n` +
                    `Storage: ${data.features.storage}\n` +
                    `API Access: Enabled\n\n` +
                    `Your account has been upgraded!`
                );
                setShowUpgradeModal(false);
                // Use window.location for full page reload to ensure updated plan is reflected
                setTimeout(() => {
                    window.location.href = '/projects';
                }, 1500);
            } else {
                alert(data.error || 'Failed to upgrade plan');
            }
        } catch (error) {
            console.error('Failed to upgrade plan:', error);
            alert('Failed to upgrade plan. Please try again.');
        } finally {
            setUpgrading(false);
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Demo Banner for Non-Logged-In Users */}
                {!user && (
                    <div className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">👋 Viewing Demo Dashboard</h2>
                                <p className="text-purple-100">
                                    Login or sign up to unlock all features and create your own projects
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <Button variant="secondary" onClick={() => router.push('/login')}>
                                    Login
                                </Button>
                                <Button className="bg-white text-purple-600 hover:bg-gray-100" onClick={() => router.push('/register')}>
                                    Sign Up Free
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upgrade Banner for Free Users */}
                {user && user.plan === 'free' && (
                    <div className="mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white p-8 rounded-xl shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Sparkles className="w-6 h-6" />
                                    <h2 className="text-2xl font-bold">Unlock Premium Features</h2>
                                </div>
                                <p className="text-white/90 text-lg">
                                    Upgrade to Pro or Max to create projects, get isolated database, and more!
                                </p>
                            </div>
                            <Button
                                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg"
                                onClick={() => setShowUpgradeModal(true)}
                            >
                                View Plans
                            </Button>
                        </div>
                    </div>
                )}
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {user ? `Welcome back, ${user.name}!` : 'Welcome to Dashboard'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {user ? "Here's what's happening with your account today." : 'Explore features - login to unlock full access'}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{projects.length}</p>
                                </div>
                                <FolderKanban className="w-8 h-8 text-purple-600" />
                            </div>
                            <div className="flex items-center mt-4 text-sm text-green-600">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                <span>Active</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Current Plan</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1 uppercase">{user?.plan || 'FREE'}</p>
                                </div>
                                <BarChart3 className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div className="flex items-center mt-4 text-sm">
                                {user?.plan === 'free' && (
                                    <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={() => router.push('/settings')}>
                                        Upgrade <ArrowUpRight className="w-3 h-3 ml-1" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Account Role</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1 uppercase">{user?.role || 'GUEST'}</p>
                                </div>
                                <Users className="w-8 h-8 text-purple-600" />
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                {user?.role === 'owner' && '2FA Enabled'}
                                {user?.role === 'admin' && 'Full Access'}
                                {user?.role === 'user' && 'Standard Access'}
                                {!user && 'View Only'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Database</p>
                                    <p className="text-lg font-bold text-gray-900 mt-1">
                                        {user?.accountName ? user.accountName : 'Shared'}
                                    </p>
                                </div>
                                <BarChart3 className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                {user?.plan === 'free' ? 'Read-only' : 'Isolated'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Projects Section */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Your Projects</CardTitle>
                            {user?.plan !== 'free' && (
                                <Button onClick={() => router.push('/projects')}>
                                    View All Projects
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {user?.plan === 'free' ? (
                            <div className="text-center py-12">
                                <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upgrade to Create Projects</h3>
                                <p className="text-gray-600 mb-6">
                                    Get access to project management features by upgrading to Pro or Max plan
                                </p>
                                <Button onClick={() => router.push('/settings')}>
                                    Upgrade Now
                                </Button>
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-12">
                                <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h3>
                                <p className="text-gray-600 mb-6">
                                    Create your first project to get started
                                </p>
                                <Button onClick={() => router.push('/projects')}>
                                    Create Project
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {projects.slice(0, 5).map((project) => (
                                    <div
                                        key={project.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => router.push(`/projects`)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                                <FolderKanban className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                                                <p className="text-sm text-gray-600">{project.description || 'No description'}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase">
                                            {project.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upgrade Modal */}
                {showUpgradeModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
                                <p className="text-gray-600 mt-2">Upgrade to unlock premium features</p>
                            </div>

                            <div className="p-6">
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    {/* Pro Plan */}
                                    <Card className={`cursor-pointer transition-all ${selectedPlan === 'pro' ? 'ring-2 ring-purple-600 shadow-lg' : 'hover:shadow-md'}`}>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900">Pro Plan</h3>
                                                    <p className="text-gray-600 mt-1">For growing teams</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-3xl font-bold text-purple-600">$29</p>
                                                    <p className="text-sm text-gray-600">/month</p>
                                                </div>
                                            </div>

                                            <ul className="space-y-3 mb-6">
                                                <li className="flex items-center text-sm">
                                                    <Check className="w-5 h-5 text-green-500 mr-2" />
                                                    <span>Up to 10 projects</span>
                                                </li>
                                                <li className="flex items-center text-sm">
                                                    <Check className="w-5 h-5 text-green-500 mr-2" />
                                                    <span>Isolated database</span>
                                                </li>
                                                <li className="flex items-center text-sm">
                                                    <Check className="w-5 h-5 text-green-500 mr-2" />
                                                    <span>Full CRUD operations</span>
                                                </li>
                                                <li className="flex items-center text-sm">
                                                    <Check className="w-5 h-5 text-green-500 mr-2" />
                                                    <span>Priority support</span>
                                                </li>
                                                <li className="flex items-center text-sm">
                                                    <Check className="w-5 h-5 text-green-500 mr-2" />
                                                    <span>API access</span>
                                                </li>
                                            </ul>

                                            <Button
                                                className="w-full"
                                                onClick={() => handleUpgradeClick('pro')}
                                                variant={selectedPlan === 'pro' ? 'primary' : 'outline'}
                                            >
                                                {selectedPlan === 'pro' ? 'Selected' : 'Select Pro'}
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    {/* Max Plan */}
                                    <Card className={`cursor-pointer transition-all ${selectedPlan === 'max' ? 'ring-2 ring-indigo-600 shadow-lg' : 'hover:shadow-md'}`}>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900">Max Plan</h3>
                                                    <p className="text-gray-600 mt-1">For large organizations</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-3xl font-bold text-indigo-600">$99</p>
                                                    <p className="text-sm text-gray-600">/month</p>
                                                </div>
                                            </div>

                                            <ul className="space-y-3 mb-6">
                                                <li className="flex items-center text-sm">
                                                    <Check className="w-5 h-5 text-green-500 mr-2" />
                                                    <span>Up to 100 projects</span>
                                                </li>
                                                <li className="flex items-center text-sm">
                                                    <Check className="w-5 h-5 text-green-500 mr-2" />
                                                    <span>Dedicated database</span>
                                                </li>
                                                <li className="flex items-center text-sm">
                                                    <Check className="w-5 h-5 text-green-500 mr-2" />
                                                    <span>Full CRUD operations</span>
                                                </li>
                                                <li className="flex items-center text-sm">
                                                    <Check className="w-5 h-5 text-green-500 mr-2" />
                                                    <span>24/7 priority support</span>
                                                </li>
                                                <li className="flex items-center text-sm">
                                                    <Check className="w-5 h-5 text-green-500 mr-2" />
                                                    <span>Advanced API access</span>
                                                </li>
                                                <li className="flex items-center text-sm">
                                                    <Check className="w-5 h-5 text-green-500 mr-2" />
                                                    <span>Custom integrations</span>
                                                </li>
                                            </ul>

                                            <Button
                                                className="w-full"
                                                onClick={() => handleUpgradeClick('max')}
                                                variant={selectedPlan === 'max' ? 'primary' : 'outline'}
                                            >
                                                {selectedPlan === 'max' ? 'Selected' : 'Select Max'}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Account Name Input */}
                                {selectedPlan && (
                                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Complete Your Upgrade
                                        </h3>
                                        <div className="mb-4">
                                            <Input
                                                label="Account Name (for your isolated database)"
                                                type="text"
                                                value={accountName}
                                                onChange={(e) => setAccountName(e.target.value)}
                                                placeholder="my-company"
                                                required
                                            />
                                            <p className="text-sm text-gray-600 mt-2">
                                                This will create a database named: d-{accountName.toLowerCase() || 'your-name'}
                                            </p>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                            <p className="text-sm text-blue-900 font-semibold mb-2">
                                                💳 Demo Payment - No Real Charges
                                            </p>
                                            <p className="text-sm text-blue-800">
                                                This is a demonstration system. Clicking "Complete Payment" will upgrade your account without any actual charges.
                                            </p>
                                        </div>

                                        <div className="flex space-x-4">
                                            <Button
                                                className="flex-1"
                                                onClick={handleUpgrade}
                                                disabled={upgrading || !accountName}
                                            >
                                                {upgrading ? 'Processing...' : `Complete Payment - $${selectedPlan === 'pro' ? '29' : '99'}`}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setShowUpgradeModal(false);
                                                    setSelectedPlan('');
                                                    setAccountName('');
                                                }}
                                                disabled={upgrading}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {!selectedPlan && (
                                    <div className="text-center">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowUpgradeModal(false)}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
