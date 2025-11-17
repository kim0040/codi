import { PROJECT_COLUMNS } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

const columnLabels: Record<string, string> = {
  [PROJECT_COLUMNS.TODO]: '할 일',
  [PROJECT_COLUMNS.IN_PROGRESS]: '진행 중',
  [PROJECT_COLUMNS.REVIEW]: '검수'
};

const projectColumns = Object.values(PROJECT_COLUMNS);

const formatDate = (value: Date) => new Intl.DateTimeFormat('ko', { month: '2-digit', day: '2-digit' }).format(value);

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ include: { tasks: true, members: { include: { user: true } } } });
  const allTasks = projects.flatMap((project) => project.tasks);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white py-12 dark:from-[#050a11] dark:to-[#0b121b]">
      <div className="mx-auto max-w-6xl space-y-8 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl dark:border-slate-800 dark:bg-[#101a28]">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Git-Lite</p>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">프로젝트 협업 공간</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">버전 히스토리, 멤버 채팅, Cloudinary 파일 업로드를 제공하는 경량 Git 워크플로</p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-white/5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-primary">{project.status}</span>
                <span>{project.tasks.length} Tasks</span>
              </div>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{project.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                멤버 {project.members.map((member) => member.user?.name ?? member.role).join(', ')}
              </p>
              <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {projectColumns.map((column) => (
            <div key={column} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{columnLabels[column] ?? column}</h4>
                <span className="text-xs text-slate-500">
                  {allTasks.filter((task) => task.column === column).length}개
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {allTasks
                  .filter((task) => task.column === column)
                  .map((task) => (
                    <div key={task.id} className="rounded-xl border border-slate-100 bg-white/80 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/40">
                      <p className="font-semibold text-slate-900 dark:text-white">{task.title}</p>
                      <p>
                        {task.owner} · {formatDate(task.dueDate)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
