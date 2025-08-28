'use client'

import React, { useEffect, useRef } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
  height?: number
}

export default function RichTextEditor({ value, onChange, placeholder, className, height = 320 }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const exec = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg)
    editorRef.current?.focus()
    onChange(editorRef.current?.innerHTML || '')
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2 border border-gray-200 rounded-t px-2 py-1 bg-gray-50">
        <button type="button" className="px-2 py-1 text-sm" onClick={() => exec('bold')} title="굵게"><b>B</b></button>
        <button type="button" className="px-2 py-1 text-sm italic" onClick={() => exec('italic')} title="기울임">I</button>
        <button type="button" className="px-2 py-1 text-sm underline" onClick={() => exec('underline')} title="밑줄">U</button>
        <span className="mx-2 text-gray-300">|</span>
        <button type="button" className="px-2 py-1 text-sm" onClick={() => exec('insertUnorderedList')} title="불릿">• 목록</button>
        <button type="button" className="px-2 py-1 text-sm" onClick={() => exec('insertOrderedList')} title="번호">1. 목록</button>
        <span className="mx-2 text-gray-300">|</span>
        <button type="button" className="px-2 py-1 text-sm" onClick={() => exec('justifyLeft')} title="좌">좌</button>
        <button type="button" className="px-2 py-1 text-sm" onClick={() => exec('justifyCenter')} title="중앙">중</button>
        <button type="button" className="px-2 py-1 text-sm" onClick={() => exec('justifyRight')} title="우">우</button>
        <span className="mx-2 text-gray-300">|</span>
        <button type="button" className="px-2 py-1 text-sm" onClick={() => exec('formatBlock', '<h3>')} title="소제목">H3</button>
        <button type="button" className="px-2 py-1 text-sm" onClick={() => exec('removeFormat')} title="서식제거">지우기</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        className="w-full border border-t-0 border-gray-200 rounded-b px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        style={{ minHeight: height, lineHeight: 1.6 }}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  )
}

