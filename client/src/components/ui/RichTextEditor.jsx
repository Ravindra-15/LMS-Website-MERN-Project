import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const RichTextEditor = ({ input, setInput }) => {
  // Functional update: Quill can fire onChange while the form is loading, and
  // copying an old "input" here would wipe the other fields (title, price...).
  const handleChange = (content) => {
    setInput((prev) => ({ ...prev, description: content }));
  };

  return <ReactQuill theme="snow" value={input.description} onChange={handleChange} />;
};

export default RichTextEditor;
