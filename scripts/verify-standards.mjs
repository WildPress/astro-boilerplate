import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();

const allowedDependencies = new Set([
  '@astrojs/preact',
  '@astrojs/sitemap',
  '@floating-ui/dom',
  '@fontsource/inter',
  '@fontsource/newsreader',
  '@tailwindcss/typography',
  '@tailwindcss/vite',
  'astro',
  'lucide',
  'pagefind',
  'preact',
  'swiper',
  'tailwindcss',
]);

const allowedDevDependencies = new Set([
  'eslint',
  'eslint-plugin-astro',
  'eslint-plugin-jsx-a11y',
  'globals',
  'typescript',
  'typescript-eslint',
]);

const ignoredDirs = new Set(['.astro', '.git', 'dist', 'node_modules', 'coverage']);
const sourceExtensions = new Set(['.astro', '.js', '.jsx', '.mjs', '.ts', '.tsx']);
const failures = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue;

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(absolutePath));
    } else {
      files.push(absolutePath);
    }
  }

  return files;
}

function relative(filePath) {
  return path.relative(root, filePath);
}

function fail(filePath, message) {
  failures.push(`${filePath}: ${message}`);
}

function assertAllowedPackageEntries(packageJson, key, allowed) {
  const entries = Object.keys(packageJson[key] ?? {});
  for (const dependency of entries) {
    if (!allowed.has(dependency)) {
      fail('package.json', `${key} contains unapproved dependency "${dependency}"`);
    }
  }
}

const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));

if (packageJson.engines?.node !== '24.x') {
  fail('package.json', 'engines.node must be pinned to "24.x"');
}

assertAllowedPackageEntries(packageJson, 'dependencies', allowedDependencies);
assertAllowedPackageEntries(packageJson, 'devDependencies', allowedDevDependencies);

for (const script of ['verify:standards', 'lint', 'validate', 'build']) {
  if (!packageJson.scripts?.[script]) {
    fail('package.json', `missing required script "${script}"`);
  }
}

if (!packageJson.scripts?.validate?.includes('verify:standards')) {
  fail('package.json', 'validate must run verify:standards');
}

if (!packageJson.scripts?.build?.includes('verify:standards')) {
  fail('package.json', 'build must run verify:standards before astro build');
}

const files = (await walk(root)).filter((file) => {
  const projectPath = relative(file);
  return projectPath.startsWith('src/') || projectPath.startsWith('scripts/');
});

for (const absolutePath of files) {
  const file = relative(absolutePath);
  const extension = path.extname(file);

  if (extension === '.css' && file !== 'src/styles/global.css') {
    fail(file, 'CSS files are restricted to src/styles/global.css');
  }

  if (!sourceExtensions.has(extension)) continue;

  const content = await readFile(absolutePath, 'utf8');

  if (file !== 'scripts/verify-standards.mjs' && /<style(?:\s|>)/i.test(content)) {
    fail(file, 'component/page style blocks are not allowed; use Tailwind classes or approved global tokens');
  }

  if (/\sstyle=(?:"|'|{)/.test(content)) {
    fail(file, 'inline style attributes are not allowed');
  }

  if (/\bclass(Name)?=\{`/.test(content)) {
    fail(file, 'template-string classes are not allowed; use class:list or explicit class strings');
  }

  if (file !== 'scripts/verify-standards.mjs' && /\bReact\b|from ['"]react['"]|from ['"]react-dom/.test(content)) {
    fail(file, 'React imports are not part of the default boilerplate; use Preact islands or document an opt-in');
  }

  if (extension === '.astro' && file !== 'src/components/OptimizedImage.astro' && /<img(?:\s|>)/i.test(content)) {
    fail(file, 'raw img elements are not allowed; use OptimizedImage.astro or astro:assets Image/Picture');
  }
}

if (failures.length > 0) {
  console.error('Standards verification failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Standards verification passed.');
