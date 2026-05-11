#!/usr/bin/env node

/**
 * Build script that orchestrates frontend and backend building
 * Usage: node build.js
 */

import { execSync } from "child_process";
import { existsSync, statSync } from "fs";
import path from "path";

const isDev = process.argv.includes("--dev");

console.log("🔨 Building Mausam App...\n");

try {
  // Build Frontend
  console.log("📦 Building frontend...");
  execSync("npm run build --prefix frontend", { stdio: "inherit" });

  // Bundle Backend
  console.log("\n🔗 Bundling backend...");
  execSync("npm run bundle --prefix backend", { stdio: "inherit" });

  // Show results
  console.log("\n✅ Build complete!\n");
  const bundlePath = "backend/dist/app.js";
  
  if (existsSync(bundlePath)) {
    const stat = statSync(bundlePath);
    const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
    console.log(`📊 Bundle Size: ${sizeMB} MB`);
    console.log(`📍 Location: ${bundlePath}`);
    console.log("\n🚀 Ready to deploy!");
    console.log("   Run: node backend/dist/app.js");
  }
} catch (error) {
  console.error("\n❌ Build failed:", error.message);
  process.exit(1);
}
