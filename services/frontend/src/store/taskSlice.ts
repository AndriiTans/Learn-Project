import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '@/types';

interface TaskState {
  currentTask: Task | null;
  myTasks: Task[];
}

const initialState: TaskState = {
  currentTask: null,
  myTasks: [],
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
    setMyTasks: (state, action: PayloadAction<Task[]>) => {
      state.myTasks = action.payload;
    },
    updateTask: (state, action: PayloadAction<{ taskId: string; updates: Partial<Task> }>) => {
      const { taskId, updates } = action.payload;
      if (state.currentTask?.id === taskId) {
        state.currentTask = { ...state.currentTask, ...updates };
      }
      state.myTasks = state.myTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      );
    },
  },
});

export const { setCurrentTask, setMyTasks, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
