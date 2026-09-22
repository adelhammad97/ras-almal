@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #07111d;
  color: #e2e8f0;
  font-family: "Segoe UI", Tahoma, sans-serif;
}

* {
  box-sizing: border-box;
}

button {
  transition: all 0.18s ease;
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
