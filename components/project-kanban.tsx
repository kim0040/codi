'use client';

import { useMemo, useState } from 'react';
import { PROJECT_COLUMNS } from '@/lib/constants';

export type ProjectTaskPayload = {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  column: string;
  projectId: string;
};

export type ProjectCardPayload = {
  id: string;
  slug: string;
  title: string;
  status: string;
  progress: number;
  members: string[];
  tasks: ProjectTaskPayload[];
};

const columnLabels: Record<string, string> = {
  [PROJECT_COLUMNS.TODO]: '할 일',
  [PROJECT_COLUMNS.IN_PROGRESS]: '진행 중',
  [PROJECT_COLUMNS.REVIEW]: '검수'
};

const projectColumns = Object.values(PROJECT_COLUMNS);

const formatDate = (value: string) => new Intl.DateTimeFormat('ko', { month: '2-digit', day: '2-digit' }).format(new Date(value));

export function ProjectKanbanBoard({ initialProjects }: { initialProjects: ProjectCardPayload[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [draggingTask, setDraggingTask] = useState<ProjectTaskPayload | null>(null);

  const allTasks = useMemo(() => projects.flatMap((project) => project.tasks), [projects]);

  const updateTaskLocal = (taskId: string, updates: Partial<ProjectTaskPayload>) => {
    setProjects((prev) =>
      prev.map((project) => ({
        ...project,
        tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
      }))
    );
  };

  const removeTaskLocal = (taskId: string) => {
    setProjects((prev) =>
      prev.map((project) => ({
        ...project,
        tasks: project.tasks.filter((task) => task.id !== taskId)
      }))
    );
  };

  const handleColumnChange = async (task: ProjectTaskPayload, nextColumn: string) => {
    if (task.column === nextColumn) return;
    setLoadingTaskId(task.id);
    updateTaskLocal(task.id, { column: nextColumn });

    const response = await fetch(`/api/projects/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ column: nextColumn })
    });

    if (!response.ok) {
      // revert
      updateTaskLocal(task.id, { column: task.column });
    }
    setLoadingTaskId(null);
  };

  const handleDelete = async (task: ProjectTaskPayload) => {
    if (!confirm('정말 삭제할까요?')) return;
    setLoadingTaskId(task.id);
    removeTaskLocal(task.id);
    const response = await fetch(`/api/projects/tasks/${task.id}`, { method: 'DELETE' });
    if (!response.ok) {
      // revert by re-inserting task
      setProjects((prev) =>
        prev.map((project) => (project.id === task.projectId ? { ...project, tasks: [...project.tasks, task] } : project))
      );
    }
    setLoadingTaskId(null);
  };

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {projectColumns.map((column) => (
        <div
          key={column}
          className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-white/5"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (draggingTask) {
              handleColumnChange(draggingTask, column);
              setDraggingTask(null);
            }
          }}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{columnLabels[column] ?? column}</h4>
            <span className="text-xs text-slate-500">{allTasks.filter((task) => task.column === column).length}개</span>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {allTasks
              .filter((task) => task.column === column)
              .map((task) => (
                <div
                  key={task.id}
                  className={`rounded-xl border border-slate-100 bg-white/80 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/40 ${draggingTask?.id === task.id ? 'opacity-60' : ''}`}
                  draggable
                  onDragStart={() => setDraggingTask(task)}
                  onDragEnd={() => setDraggingTask(null)}
                >
                  <p className="font-semibold text-slate-900 dark:text-white">{task.title}</p>
                  <p>
                    {task.owner} · {formatDate(task.dueDate)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <select
                      value={task.column}
                      onChange={(event) => handleColumnChange(task, event.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
                      disabled={loadingTaskId === task.id}
                    >
                      {projectColumns.map((col) => (
                        <option key={col} value={col}>
                          {columnLabels[col] ?? col}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="rounded-full bg-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-white"
                      onClick={() => handleDelete(task)}
                      disabled={loadingTaskId === task.id}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            {allTasks.filter((task) => task.column === column).length === 0 ? (
              <p className="text-xs text-slate-400">등록된 작업이 없습니다.</p>
            ) : null}
          </div>
        </div>
      ))}
    </section>
  );
}
