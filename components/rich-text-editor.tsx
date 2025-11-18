'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';

const lowlight = createLowlight();
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('python', python);
import { useEffect } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ codeBlock: false }),
        Link.configure({ openOnClick: false }),
        CodeBlockLowlight.configure({ lowlight })
      ],
      content: value,
      editorProps: {
        attributes: {
          class: 'prose prose-sm max-w-none dark:prose-invert focus:outline-none'
        }
      },
      onUpdate({ editor: instance }) {
        onChange(instance.getHTML());
      },
      immediatelyRender: false
    },
    []
  );

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
          Bold
        </button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
          Italic
        </button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
          List
        </button>
        <button type="button" onClick={() => editor?.chain().focus().toggleCodeBlock().run()} className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
          Code
        </button>
      </div>
      <div className="mt-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
