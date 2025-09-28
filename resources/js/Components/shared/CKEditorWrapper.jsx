import React, { useRef, useEffect } from 'react';

const CKEditorWrapper = ({ data, onChange, disabled = false, placeholder = "Enter description..." }) => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !disabled) {
      // Set initial content
      editorRef.current.innerHTML = data || '';
    }
  }, [data, disabled]);

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  if (disabled) {
    return (
      <div className="ck-editor-wrapper">
        <textarea
          ref={textareaRef}
          className="form-control"
          rows={6}
          value={data || ''}
          disabled={true}
          placeholder={placeholder}
          style={{
            minHeight: '150px',
            resize: 'vertical'
          }}
        />
      </div>
    );
  }

  return (
    <div className="ck-editor-wrapper">
      {/* Toolbar */}
      <div className="p-2 border ck-toolbar rounded-top bg-light" style={{ borderBottom: 'none' }}>
        <div className="btn-group btn-group-sm me-2" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => execCommand('bold')}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => execCommand('italic')}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => execCommand('underline')}
            title="Underline"
          >
            <u>U</u>
          </button>
        </div>

        <div className="btn-group btn-group-sm me-2" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => execCommand('insertUnorderedList')}
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => execCommand('insertOrderedList')}
            title="Numbered List"
          >
            1. List
          </button>
        </div>

        <div className="btn-group btn-group-sm me-2" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={insertLink}
            title="Insert Link"
          >
            🔗 Link
          </button>
        </div>

        <div className="btn-group btn-group-sm" role="group">
          <select
            className="form-select form-select-sm"
            onChange={(e) => execCommand('formatBlock', e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="div">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
            <option value="p">Paragraph</option>
          </select>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        className="border form-control rounded-bottom"
        style={{
          minHeight: '150px',
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '12px',
          borderTop: 'none',
          borderRadius: '0 0 0.375rem 0.375rem'
        }}
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: var(--secondary-lighter);
          font-style: italic;
        }
        .ck-toolbar .btn {
          border-color: var(--secondary-lightest);
        }
        .ck-toolbar .btn:hover {
          background-color: var(--secondary-lightest);
        }
        .ck-toolbar .btn:active,
        .ck-toolbar .btn.active {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default CKEditorWrapper;
