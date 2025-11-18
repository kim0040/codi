import dynamic from 'next/dynamic';

export const ProjectChat = dynamic(() => import('./project-chat.client'), { ssr: false });
