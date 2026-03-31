import { useState, useEffect } from "react";

function App() {
const [theme, setTheme] = useState(() => {
  const saved = localStorage.getItem('user-theme');
  // If 'light' was specifically saved, use it. Otherwise, DEFAULT to 'dark'.
  return saved === 'light' ? 'light' : 'dark';
});

useEffect(() => {
  // Save the preference
  localStorage.setItem('user-theme', theme);
  
  // Apply to body
  if (theme === 'dark') {
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  } else {
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  }
}, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`app-container ${theme}`}>
       <button onClick={toggleTheme}>
         Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
       </button>
       {/* Your other components */}
    </div>
  );
}