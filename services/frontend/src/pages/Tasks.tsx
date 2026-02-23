import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Download, ExpandLess, ExpandMore } from '@mui/icons-material';
import { backofficeApi } from '@/lib/api/backoffice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setMyTasks, updateTask, setCurrentTask } from '@/store/taskSlice';
import { TaskEntityType, TaskStatus } from '@/types';
import type { Task } from '@/types';
import { toast } from 'react-toastify';

export function Tasks() {
  const dispatch = useAppDispatch();
  const myTasks = useAppSelector((state) => state.task.myTasks);
  const currentTask = useAppSelector((state) => state.task.currentTask);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasks = await backofficeApi.getMyTasks();
      dispatch(setMyTasks(tasks));
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetNextTask = async () => {
    try {
      setError(null);
      const task = await backofficeApi.getNextTask('shift-1');
      if (task) {
        dispatch(setCurrentTask(task));
        await loadTasks();
        toast.info('Next task assigned');
      } else {
        setError('No pending tasks available');
        toast.info('No pending tasks available');
      }
    } catch (err) {
      setError('Failed to get next task');
      toast.error('Failed to get next task');
      console.error(err);
    }
  };

  const handleStartTask = async () => {
    if (!currentTask) return;
    try {
      setError(null);
      const updated = await backofficeApi.startTask(currentTask.id);
      dispatch(updateTask({ taskId: currentTask.id, updates: updated }));
      dispatch(setCurrentTask(updated));
      toast.success('Task started');
    } catch (err) {
      setError('Failed to start task');
      toast.error('Failed to start task');
      console.error(err);
    }
  };

  const handleApproveTask = async () => {
    if (!currentTask) return;
    try {
      setError(null);
      const updated = await backofficeApi.approveTask(currentTask.id, comment);
      dispatch(updateTask({ taskId: currentTask.id, updates: updated }));
      dispatch(setCurrentTask(null));
      setComment('');
      await loadTasks();
      toast.success('Task approved');
    } catch (err) {
      setError('Failed to approve task');
      toast.error('Failed to approve task');
      console.error(err);
    }
  };

  const handleDisapproveTask = async () => {
    if (!currentTask) return;
    try {
      setError(null);
      const updated = await backofficeApi.disapproveTask(currentTask.id, comment);
      dispatch(updateTask({ taskId: currentTask.id, updates: updated }));
      dispatch(setCurrentTask(null));
      setComment('');
      await loadTasks();
      toast.warn('Task disapproved');
    } catch (err) {
      setError('Failed to disapprove task');
      toast.error('Failed to disapprove task');
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Tasks
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Current Task
          </Typography>
          {currentTask ? (
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'primary.light', borderRadius: 2, bgcolor: 'primary.50' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Task #{currentTask.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {currentTask.entityType} | Priority: {currentTask.priority}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    System: {currentTask.system?.name || currentTask.systemId}
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2}>
                <TextField
                  label="Comment (optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                />
                <Stack direction="row" spacing={1}>
                  {currentTask.status === TaskStatus.ASSIGNED && (
                    <Button onClick={handleStartTask} variant="contained">
                      Start Task
                    </Button>
                  )}
                  {currentTask.status === TaskStatus.IN_PROGRESS && (
                    <>
                      <Button onClick={handleApproveTask} variant="contained" color="success">
                        Approve
                      </Button>
                      <Button onClick={handleDisapproveTask} variant="contained" color="error">
                        Disapprove
                      </Button>
                    </>
                  )}
                </Stack>
              </Stack>
            </Box>
          ) : (
            <Box textAlign="center" py={3}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                No active task
              </Typography>
              <Button onClick={handleGetNextTask} variant="contained">
                Get Next Task
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            My Tasks
          </Typography>
          {loading ? (
            <Typography color="text.secondary">Loading...</Typography>
          ) : myTasks.length === 0 ? (
            <Typography color="text.secondary">No tasks yet</Typography>
          ) : (
            <Stack spacing={1.5}>
              {myTasks
                .filter((task) =>
                  [TaskStatus.PENDING, TaskStatus.ASSIGNED, TaskStatus.IN_PROGRESS].includes(
                    task.status,
                  ),
                )
                .map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    expanded={expandedTaskId === task.id}
                    onToggle={() =>
                      setExpandedTaskId((prev) => (prev === task.id ? null : task.id))
                    }
                  />
                ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

function TaskRow({
  task,
  expanded,
  onToggle,
}: {
  task: Task;
  expanded: boolean;
  onToggle: () => void;
}) {
  const media = getTaskMedia(task);
  const isVideo = task.entityType === TaskEntityType.EVENT_VIDEO;

  return (
    <Box
      sx={{
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        cursor: 'pointer',
      }}
      onClick={onToggle}
    >
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
          <Box
            component="img"
            src={media.thumbnailUrl}
            alt={`${task.entityType} thumbnail`}
            sx={{
              width: 72,
              height: 48,
              borderRadius: 1,
              objectFit: 'cover',
              border: '1px solid',
              borderColor: 'divider',
              flexShrink: 0,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="body2" fontWeight={600}>
                #{task.id}
              </Typography>
              <Chip size="small" label={task.entityType} variant="outlined" />
              <Typography variant="caption" color="text.secondary">
                Priority: {task.priority}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" noWrap>
              System: {task.system?.name || task.systemId}
              {task.workerComment ? ` | Comment: ${task.workerComment}` : ''}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {task.completedAt
              ? new Date(task.completedAt).toLocaleString()
              : new Date(task.createdAt).toLocaleString()}
          </Typography>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
            {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
        </Stack>
      </Stack>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ pl: 0.5 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Box sx={{ minWidth: 260 }}>
              {isVideo && media.videoUrl ? (
                <video
                  controls
                  preload="metadata"
                  poster={media.thumbnailUrl}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    background: '#0f172a',
                  }}
                >
                  <source src={media.videoUrl} type="video/mp4" />
                </video>
              ) : (
                <Box
                  component="img"
                  src={media.imageUrl || media.thumbnailUrl}
                  alt={`${task.entityType} preview`}
                  sx={{
                    width: '100%',
                    borderRadius: 1,
                    objectFit: 'cover',
                    border: '1px solid',
                    borderColor: 'divider',
                    maxHeight: 220,
                  }}
                />
              )}
            </Box>
            <Stack spacing={1} sx={{ minWidth: 220 }}>
              <Typography variant="subtitle2">Media Info</Typography>
              <Typography variant="body2" color="text.secondary">
                Entity: {task.entityId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Captured: {media.capturedAt ? new Date(media.capturedAt).toLocaleString() : '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                File: {media.fileName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Size: {media.sizeLabel ?? '—'}
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  component="a"
                  href={media.downloadUrl}
                  download={media.fileName}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Download
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}

function getTaskMedia(task: Task) {
  if (task.media) {
    return task.media;
  }

  if (task.entityType === TaskEntityType.EVENT_VIDEO) {
    return {
      thumbnailUrl:
        'https://images.unsplash.com/photo-1508098682722-e99c643e7485?auto=format&fit=crop&w=240&q=80',
      videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      downloadUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      fileName: `${task.entityId}.mp4`,
      capturedAt: task.createdAt,
      sizeLabel: '—',
    };
  }

  return {
    thumbnailUrl:
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=240&q=80',
    imageUrl:
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    downloadUrl:
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    fileName: `${task.entityId}.jpg`,
    capturedAt: task.createdAt,
    sizeLabel: '—',
  };
}

