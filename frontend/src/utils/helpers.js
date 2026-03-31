export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export const getInitials = (name) =>
  name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

export const calcProgress = (completed, total) =>
  total > 0 ? Math.round((completed / total) * 100) : 0;

export const CATEGORIES = {
  web: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js'],
  programming: ['Java', 'Python', 'C++', 'SQL']
};

export const CATEGORY_ICONS = {
  HTML: '🌐', CSS: '🎨', JavaScript: '⚡', React: '⚛️',
  'Node.js': '🟢', 'Express.js': '🚂', Java: '☕',
  Python: '🐍', 'C++': '⚙️', SQL: '🗄️'
};

export const CODING_CATEGORIES = ['Arrays', 'Strings', 'LinkedList', 'Trees', 'DP', 'Sorting', 'DBMS', 'Graphs', 'Math'];
export const LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++', 'SQL'];
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
