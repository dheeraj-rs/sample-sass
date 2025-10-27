'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FolderKanban, Trash2, Edit } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ProjectsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchProjects();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Allow viewing in demo mode
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Allow viewing in demo mode
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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewProject({ name: '', description: '' });
        fetchProjects();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!user) {
      router.push('/login?redirect=/projects');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProjects();
      } else {
        alert('Failed to delete project. Please login to continue.');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  };

  const handleEditClick = (projectId: string) => {
    if (!user) {
      router.push('/login?redirect=/projects');
    } else {
      alert('Edit functionality - coming soon!');
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

  const handleCreateClick = () => {
    if (!user) {
      // Not logged in - redirect to register
      router.push('/register?redirect=/projects');
    } else if (user.plan === 'free') {
      // Free plan - redirect to upgrade
      router.push('/settings');
    } else {
      // Paid plan - show create modal
      setShowCreateModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Banner for Non-Logged-In Users */}
        {!user && (
          <div className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🚀 Unlock Project Management</h2>
                <p className="text-purple-100">
                  Create an account to start building your projects with isolated databases
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={() => router.push('/login')}>
                  Login
                </Button>
                <Button className="bg-white text-purple-600 hover:bg-gray-100" onClick={() => router.push('/register')}>
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Free Plan Upgrade Banner */}
        {user && user.plan === 'free' && (
          <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 text-yellow-900 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">⚡ Upgrade to Create Projects</h2>
                <p className="text-yellow-800">
                  Upgrade to Pro or Max plan to unlock project management features
                </p>
              </div>
              <Button onClick={() => router.push('/settings')}>
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">
              {user && user.plan !== 'free' 
                ? `Manage your projects (${projects.length} / ${user.plan === 'pro' ? '10' : '100'})`
                : 'Explore project management features'}
            </p>
          </div>
          <Button onClick={handleCreateClick}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {!user ? 'Preview Project Management' : user.plan === 'free' ? 'Upgrade to Create Projects' : 'No Projects Yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {!user 
                  ? 'Sign up to start creating and managing your projects'
                  : user.plan === 'free'
                  ? 'Upgrade to Pro or Max plan to unlock project features'
                  : 'Create your first project to get started'}
              </p>
              <Button onClick={handleCreateClick}>
                <Plus className="w-4 h-4 mr-2" />
                {!user ? 'Sign Up to Create' : user.plan === 'free' ? 'Upgrade Now' : 'Create Project'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <FolderKanban className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    {project.description || 'No description provided'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase">
                      {project.status}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(project.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <Input
                  label="Project Name"
                  placeholder="My Awesome Project"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Describe your project..."
                    rows={3}
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>
                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1" loading={creating}>
                    Create Project
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
