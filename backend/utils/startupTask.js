import fs from 'fs';
import path from 'path';

export function runStartupTask() {
  const uploadsDir = path.resolve(process.cwd(), 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  console.log('Startup task: backend environment ready and uploads folder confirmed.');
}

const isDirectRun = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (isDirectRun) {
  runStartupTask();
}
