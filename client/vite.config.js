// vite.config.js (Set base back to root for Firebase Hosting)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
  const isProd = command === 'build';
  
  return {
    // 🔥 CHANGE THIS BACK TO ABSOLUTE ROOT '/'
    // Since bca-dept-pro.web.app is a root deployment, this is correct.
    base: '/', 

    plugins: [react()], 
  };
});