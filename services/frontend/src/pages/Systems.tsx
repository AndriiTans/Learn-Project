import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { backofficeApi } from '@/lib/api/backoffice';
import type { System } from '@/types';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'react-toastify';

export function Systems() {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadSystems();
  }, []);

  const loadSystems = async () => {
    try {
      setLoading(true);
      const data = await backofficeApi.getSystems();
      setSystems(data);
    } catch (err) {
      setError('Failed to load systems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await backofficeApi.createSystem(formData);
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      await loadSystems();
      toast.success('System created');
    } catch (err) {
      setError('Failed to create system');
      toast.error('Failed to create system');
      console.error(err);
    }
  };

  const handleToggleActive = async (system: System) => {
    try {
      setError(null);
      await backofficeApi.updateSystem(system.id, { isActive: !system.isActive });
      await loadSystems();
      toast.success(system.isActive ? 'System deactivated' : 'System activated');
    } catch (err) {
      setError('Failed to update system');
      toast.error('Failed to update system');
      console.error(err);
    }
  };

  const requestDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      setError(null);
      await backofficeApi.deleteSystem(deleteId);
      await loadSystems();
      toast.success('System deleted');
      setShowDeleteDialog(false);
      setDeleteId(null);
    } catch (err) {
      setError('Failed to delete system');
      toast.error('Failed to delete system');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Systems
        </Typography>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} variant="contained">
          {showCreateForm ? 'Cancel' : 'Create System'}
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {showCreateForm && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Create New System
            </Typography>
            <Box component="form" onSubmit={handleCreate}>
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Football Stream 1"
                />
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={3}
                />
                <Box>
                  <Button type="submit" variant="contained">Create</Button>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          {loading ? (
            <Typography color="text.secondary">Loading...</Typography>
          ) : systems.length === 0 ? (
            <Typography color="text.secondary">No systems yet</Typography>
          ) : (
            <Stack spacing={1.5}>
              {systems.map((system) => (
                <Box
                  key={system.id}
                  sx={{
                    p: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1" fontWeight={700}>
                        {system.name}
                      </Typography>
                      <Chip
                        size="small"
                        color={system.isActive ? 'success' : 'default'}
                        label={system.isActive ? 'Active' : 'Inactive'}
                      />
                    </Stack>
                    {system.description ? (
                      <Typography variant="body2" color="text.secondary">
                        {system.description}
                      </Typography>
                    ) : null}
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(system.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      onClick={() => handleToggleActive(system)}
                    >
                      {system.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => requestDelete(system.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete system?"
        description="This action cannot be undone."
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
