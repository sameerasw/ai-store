// Single launcher to start backend and frontend together
// Works on Windows using Node's child_process.spawn

const { spawn } = require('child_process');
const path = require('path');

function run(name, cmd, args, cwd) {
  const p = spawn(cmd, args, { cwd, stdio: 'pipe', shell: true, env: process.env });
  p.stdout.on('data', (d) => process.stdout.write(`[${name}] ${d}`));
  p.stderr.on('data', (d) => process.stderr.write(`[${name}] ${d}`));
  p.on('close', (code) => {
    console.log(`[${name}] exited with code ${code}`);
  });
  return p;
}

const procs = [];

// Start backend
procs.push(run('backend', 'npm', ['run', 'dev'], path.join(__dirname, 'backend')));

// Start frontend
procs.push(run('frontend', 'npm', ['run', 'dev'], path.join(__dirname, 'frontend')));

function shutdown() {
  console.log('Shutting down...');
  for (const p of procs) {
    if (!p.killed) {
      p.kill('SIGINT');
    }
  }
  setTimeout(() => process.exit(0), 500);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
