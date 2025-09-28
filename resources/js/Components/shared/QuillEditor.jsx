import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({
  data,
  onChange,
  disabled = false,
  placeholder = "Enter description...",
  height = "150px"
}) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  return (
    <div className="quill-editor-wrapper">
      <ReactQuill
        theme="snow"
        value={data || ''}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={disabled}
        modules={modules}
        formats={formats}
        style={{
          height: height,
          marginBottom: '42px' // Account for toolbar height
        }}
      />

      <style jsx>{`
        .quill-editor-wrapper .ql-editor {
          min-height: ${height};
          font-size: 14px;
          line-height: 1.5;
          background-color: white !important;
          color: #333;
        }

        .quill-editor-wrapper .ql-toolbar {
          border-top: 1px solid #dee2e6;
          border-left: 1px solid #dee2e6;
          border-right: 1px solid #dee2e6;
          border-radius: 0.375rem 0.375rem 0 0;
          background-color: #f8f9fa;
        }

        .quill-editor-wrapper .ql-container {
          border-bottom: 1px solid #dee2e6;
          border-left: 1px solid #dee2e6;
          border-right: 1px solid #dee2e6;
          border-radius: 0 0 0.375rem 0.375rem;
          background-color: white;
        }

        .quill-editor-wrapper .ql-editor.ql-blank::before {
          color: #6c757d;
          font-style: italic;
        }

        .quill-editor-wrapper .ql-toolbar .ql-stroke {
          stroke: #495057;
        }

        .quill-editor-wrapper .ql-toolbar .ql-fill {
          fill: #495057;
        }

        .quill-editor-wrapper .ql-toolbar button:hover {
          background-color: #e9ecef;
        }

        .quill-editor-wrapper .ql-toolbar button:hover .ql-stroke {
          stroke: #007bff;
        }

        .quill-editor-wrapper .ql-toolbar button:hover .ql-fill {
          fill: #007bff;
        }

        .quill-editor-wrapper .ql-toolbar button.ql-active {
          background-color: #007bff;
          color: white;
        }

        .quill-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: white;
        }

        .quill-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: white;
        }

        .quill-editor-wrapper .ql-toolbar .ql-picker {
          color: #495057;
        }

        .quill-editor-wrapper .ql-toolbar .ql-picker:hover {
          color: #007bff;
        }

        .quill-editor-wrapper .ql-toolbar .ql-picker.ql-expanded {
          color: #007bff;
        }

        .quill-editor-wrapper .ql-toolbar .ql-picker-options {
          background-color: white;
          border: 1px solid #dee2e6;
          border-radius: 0.25rem;
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        }

        .quill-editor-wrapper .ql-toolbar .ql-picker-item:hover {
          background-color: #f8f9fa;
        }

        .quill-editor-wrapper .ql-toolbar .ql-picker-item.ql-selected {
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default QuillEditor;
