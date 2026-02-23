import { type ReactNode, useEffect, useState } from 'react';
import { Assignment, CheckCircle, PendingActions, PlayCircle } from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { backofficeApi } from '@/lib/api/backoffice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setMyTasks } from '@/store/taskSlice';
import { TaskStatus } from '@/types';
import type { Task } from '@/types';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const myTasks = useAppSelector((state) => state.task.myTasks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const pendingTasks = myTasks.filter((t) => t.status === TaskStatus.PENDING);
  const inProgressTasks = myTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS);
  const completedTasks = myTasks.filter((t) => t.status === TaskStatus.COMPLETED);

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box
        sx={{
          mb: 3,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        }}
      >
        <StatsCard title="Total Tasks" value={myTasks.length} icon={<Assignment />} />
        <StatsCard title="Pending" value={pendingTasks.length} icon={<PendingActions />} />
        <StatsCard title="In Progress" value={inProgressTasks.length} icon={<PlayCircle />} />
        <StatsCard title="Completed" value={completedTasks.length} icon={<CheckCircle />} />
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Recent Tasks
          </Typography>
          {loading ? (
            <Typography color="text.secondary">Loading...</Typography>
          ) : myTasks.length === 0 ? (
            <Typography color="text.secondary">No tasks yet</Typography>
          ) : (
            <Stack spacing={1.5}>
              {myTasks.slice(0, 5).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </Stack>
          )}
          <MuiLink component={Link} to="/tasks" underline="hover" sx={{ mt: 2, display: 'inline-block' }}>
            View all tasks →
          </MuiLink>
        </CardContent>
      </Card>
    </Box>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <Box
      sx={{
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1,
      }}
    >
      <Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" fontWeight={600}>
            Task #{task.id}
          </Typography>
          <Chip size="small" label={task.status} color={getStatusColor(task.status)} />
          <Chip size="small" label={task.entityType} variant="outlined" />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Priority: {task.priority} | System: {task.system?.name || task.systemId}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {new Date(task.createdAt).toLocaleString()}
      </Typography>
    </Box>
  );
}

function getStatusColor(status: TaskStatus): 'default' | 'primary' | 'success' | 'warning' | 'error' {
  if (status === TaskStatus.ASSIGNED) return 'primary';
  if (status === TaskStatus.IN_PROGRESS || status === TaskStatus.PENDING) return 'warning';
  if (status === TaskStatus.COMPLETED) return 'success';
  if (status === TaskStatus.FAILED) return 'error';
  return 'default';
}

function StatsCard({ title, value, icon }: { title: string; value: number; icon: ReactNode }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800}>
              {value}
            </Typography>
          </Box>
          <Box color="primary.main">{icon}</Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
