import { useTheme } from '../contexts/ThemeContext'
import Editor from '@monaco-editor/react'

const CodeEditor = ({ value, onChange, language = 'python', height = '400px' }) => {
  const { darkMode } = useTheme()

  return (
    <div className="rounded-xl overflow-hidden border"
      style={{ borderColor: darkMode ? 'rgba(139,92,246,0.2)' : '#e1e9ff' }}>
      <div className="flex items-center justify-between px-4 py-2"
        style={{
          background: darkMode ? '#0d1224' : '#f5f3ff',
          borderBottom: `1px solid ${darkMode ? 'rgba(139,92,246,0.2)' : '#e1e9ff'}`
        }}>
        <span className={`text-sm font-medium ${darkMode ? 'text-dark-300' : 'text-dark-700'}`}>
          {language.charAt(0).toUpperCase() + language.slice(1)}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
      </div>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        theme={darkMode ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Fira Code, monospace',
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8
          },
        }}
        beforeMount={(monaco) => {
          monaco.editor.defineTheme('aurora-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '6A9955' },
              { token: 'keyword', foreground: 'C586C0' },
              { token: 'string', foreground: 'CE9178' },
              { token: 'number', foreground: 'B5CEA8' },
              { token: 'type', foreground: '4EC9B0' },
            ],
            colors: {
              'editor.background': '#0d1224',
              'editor.foreground': '#D4D4D4',
              'editorLineNumber.foreground': '#4a5fa8',
              'editor.selectionBackground': '#264F78',
              'editor.lineHighlightBackground': '#1a1a3a',
            }
          })
        }}
        onMount={(editor, monaco) => {
          if (darkMode) {
            monaco.editor.setTheme('aurora-dark')
          }
        }}
      />
    </div>
  )
}

export default CodeEditor
