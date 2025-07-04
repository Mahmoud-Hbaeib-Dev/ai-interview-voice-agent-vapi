'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '../../provider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Settings, 
  Edit, 
  Trash2,
  Plus,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  Mic,
  Brain,
  MessageSquare,
  Save,
  X,
  Volume2,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function AssistantsPage() {
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    personality: '',
    voice: 'jennifer',
    model: 'gpt-4'
  });
  
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll simulate the assistant data since you mentioned you have one
      // In a real implementation, this would fetch from your database
      const mockAssistants = [
        {
          id: 1,
          name: "AI Recruiter",
          description: "Professional AI assistant for conducting technical interviews",
          personality: "Friendly, engaging, and professional interviewer",
          voice: "jennifer",
          model: "gpt-4",
          status: "active",
          created_at: new Date().toISOString(),
          interviews_conducted: 7, // Based on your completed interviews
          success_rate: 85
        }
      ];
      
      setAssistants(mockAssistants);
    } catch (err) {
      console.error('Error fetching assistants:', err);
      setError('Failed to load assistants');
      toast.error('Failed to load assistants');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssistant = async () => {
    try {
      const newAssistant = {
        id: Date.now(),
        ...formData,
        status: 'active',
        created_at: new Date().toISOString(),
        interviews_conducted: 0,
        success_rate: 0
      };
      
      setAssistants(prev => [...prev, newAssistant]);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', personality: '', voice: 'jennifer', model: 'gpt-4' });
      toast.success('Assistant created successfully!');
    } catch (error) {
      console.error('Error creating assistant:', error);
      toast.error('Failed to create assistant');
    }
  };

  const handleEditAssistant = async () => {
    try {
      setAssistants(prev => prev.map(assistant => 
        assistant.id === selectedAssistant.id 
          ? { ...assistant, ...formData }
          : assistant
      ));
      
      setShowEditModal(false);
      setSelectedAssistant(null);
      setFormData({ name: '', description: '', personality: '', voice: 'jennifer', model: 'gpt-4' });
      toast.success('Assistant updated successfully!');
    } catch (error) {
      console.error('Error updating assistant:', error);
      toast.error('Failed to update assistant');
    }
  };

  const handleDeleteAssistant = async (assistantId) => {
    if (!confirm('Are you sure you want to delete this assistant? This action cannot be undone.')) {
      return;
    }

    try {
      setAssistants(prev => prev.filter(assistant => assistant.id !== assistantId));
      toast.success('Assistant deleted successfully!');
    } catch (error) {
      console.error('Error deleting assistant:', error);
      toast.error('Failed to delete assistant');
    }
  };

  const openEditModal = (assistant) => {
    setSelectedAssistant(assistant);
    setFormData({
      name: assistant.name,
      description: assistant.description,
      personality: assistant.personality,
      voice: assistant.voice,
      model: assistant.model
    });
    setShowEditModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'training':
        return <Badge className="bg-blue-100 text-blue-800">Training</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading assistants...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="w-8 h-8 mr-2" />
            <span>{error}</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Assistants</h1>
            <p className="text-gray-600">
              Manage your AI interview assistants and their configurations
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Assistant
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{assistants.length}</div>
              <div className="text-sm text-gray-600">Total Assistants</div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {assistants.filter(a => a.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {assistants.reduce((sum, a) => sum + a.interviews_conducted, 0)}
              </div>
              <div className="text-sm text-gray-600">Interviews Conducted</div>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Assistants List */}
      {assistants.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assistants yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first AI assistant to start conducting interviews
            </p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Assistant
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {assistants.map((assistant) => (
            <Card key={assistant.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {assistant.name}
                      </h3>
                      {getStatusBadge(assistant.status)}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{assistant.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Voice: {assistant.voice}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Model: {assistant.model}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{assistant.interviews_conducted} interviews</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{assistant.success_rate}% success</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Created {formatDate(assistant.created_at)}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(assistant)}
                    className="flex items-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAssistant(assistant.id)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Assistant Modal */}
      {showCreateModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50">
          <Card className="p-6 m-4 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Create New Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assistant Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., AI Recruiter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what this assistant does..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personality
                </label>
                <Textarea
                  value={formData.personality}
                  onChange={(e) => setFormData({...formData, personality: e.target.value})}
                  placeholder="Describe the assistant's personality and interview style..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice
                  </label>
                  <select
                    value={formData.voice}
                    onChange={(e) => setFormData({...formData, voice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="jennifer">Jennifer</option>
                    <option value="ryan">Ryan</option>
                    <option value="sarah">Sarah</option>
                    <option value="michael">Michael</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Model
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3">Claude 3</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateAssistant}
                disabled={!formData.name}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Assistant
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Assistant Modal */}
      {showEditModal && selectedAssistant && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50">
          <Card className="p-6 m-4 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Edit Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assistant Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., AI Recruiter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what this assistant does..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personality
                </label>
                <Textarea
                  value={formData.personality}
                  onChange={(e) => setFormData({...formData, personality: e.target.value})}
                  placeholder="Describe the assistant's personality and interview style..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice
                  </label>
                  <select
                    value={formData.voice}
                    onChange={(e) => setFormData({...formData, voice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="jennifer">Jennifer</option>
                    <option value="ryan">Ryan</option>
                    <option value="sarah">Sarah</option>
                    <option value="michael">Michael</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Model
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3">Claude 3</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-6">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditAssistant}
                disabled={!formData.name}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AssistantsPage; 