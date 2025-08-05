import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PATCHES_DIR = path.resolve('./patches');

export default function handlePatchCommand(command, file = '') {
  switch (command) {
    case 'apply':
      return applyPatch(file);
    case 'clean':
      return cleanPatches();
    case 'list':
      return listPatches();
    default:
      console.error(`Unknown patch command: ${command}`);
      process.exit(1);
  }
}

function applyPatch(patchFile) {
  const fullPath = path.resolve(PATCHES_DIR, patchFile);
  if (!fs.existsSync(fullPath)) {
    console.error(`Patch file not found: ${patchFile}`);
    process.exit(1);
  }
  try {
    execSync(`git apply "${fullPath}"`, { stdio: 'inherit' });
    console.log(`Patch applied: ${patchFile}`);
  } catch (error) {
    console.error(`Failed to apply patch: ${patchFile}`);
    process.exit(1);
  }
}

function cleanPatches() {
  if (!fs.existsSync(PATCHES_DIR)) {
    console.log('No patches to clean.');
    return;
  }
  const files = fs.readdirSync(PATCHES_DIR);
  files.forEach(f => fs.unlinkSync(path.join(PATCHES_DIR, f)));
  console.log('All patches deleted from /patches folder.');
}

function listPatches() {
  if (!fs.existsSync(PATCHES_DIR)) {
    console.log('No patches found.');
    return;
  }
  const files = fs.readdirSync(PATCHES_DIR);
  if (files.length === 0) {
    console.log('No patches in the folder.');
    return;
  }
  console.log('Available patches:');
  files.forEach(f => console.log(`- ${f}`));
}
