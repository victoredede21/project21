import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Generate a wordlist for security testing based on domain name, parameters,
 * or technical stack information.
 */
export function generateWordlist(
  type: 'subdomain' | 'endpoint' | 'parameter',
  input: string,
  additionalContext?: string
): string[] {
  const baseWords: string[] = [];

  // Common words for each type of wordlist
  switch (type) {
    case 'subdomain':
      baseWords.push(
        'admin', 'api', 'app', 'beta', 'blog', 'cdn', 'cms', 'dev',
        'dashboard', 'demo', 'docs', 'forum', 'ftp', 'git', 'internal',
        'login', 'mail', 'my', 'new', 'old', 'portal', 'preview', 'private',
        'secure', 'shop', 'stage', 'staging', 'support', 'test', 'uat',
        'vpn', 'web', 'www', 'intranet', 'extranet', 'assets', 'images',
        'media', 'files', 'upload', 'download', 'static', 'jenkins'
      );
      break;

    case 'endpoint':
      baseWords.push(
        'admin', 'api', 'account', 'auth', 'backup', 'cart', 'checkout',
        'config', 'dashboard', 'debug', 'export', 'files', 'import',
        'login', 'logout', 'profile', 'register', 'reset', 'search',
        'settings', 'setup', 'status', 'test', 'upload', 'user', 
        'users', 'admin.php', 'wp-admin', 'administrator', 'phpinfo',
        'install', 'console', 'shell', 'cmd', 'stats', 'file', 'backup',
        'robots.txt', 'sitemap.xml', '.git', '.svn', '.env', '.DS_Store',
        'wp-login', 'wp-config', 'server-status'
      );
      break;

    case 'parameter':
      baseWords.push(
        'id', 'user', 'username', 'password', 'pass', 'key', 'api_key',
        'token', 'auth', 'q', 'query', 'search', 'file', 'filepath',
        'path', 'url', 'uri', 'redirect', 'return_url', 'next', 'page',
        'data', 'input', 'cmd', 'command', 'exec', 'sql', 'debug', 'test',
        'email', 'user_id', 'admin', 'action', 'type', 'mode', 'json',
        'callback', 'jsonp', 'format', 'view', 'template', 'style'
      );
      break;
  }

  // Extract potential words from the input
  const inputWords = input.replace(/[^a-zA-Z0-9]/g, ' ').split(' ')
    .filter(word => word.length > 2) // Filter out too short words
    .map(word => word.toLowerCase());
  
  // Add variations of input words
  const variations: string[] = [];
  inputWords.forEach(word => {
    variations.push(word);
    variations.push(`${word}-dev`);
    variations.push(`${word}-test`);
    variations.push(`${word}-staging`);
    variations.push(`${word}-admin`);
    variations.push(`${word}-api`);
  });

  // Process additional context if provided
  let contextWords: string[] = [];
  if (additionalContext) {
    contextWords = additionalContext.replace(/[^a-zA-Z0-9]/g, ' ').split(' ')
      .filter(word => word.length > 2)
      .map(word => word.toLowerCase());
  }

  // Combine and deduplicate all words
  const combinedWordlist = [...new Set([...baseWords, ...variations, ...contextWords])];
  
  return combinedWordlist;
}

/**
 * Generate a wordlist specifically targeting the provided technology stack
 */
export function generateTechStackWordlist(techStack: string): string[] {
  const wordlist: string[] = [];

  // Common web frameworks and their associated endpoints/files
  if (techStack.match(/wordpress|wp/i)) {
    wordlist.push(
      'wp-admin', 'wp-login.php', 'wp-config.php', 'wp-content',
      'wp-includes', 'xmlrpc.php', 'readme.html', 'license.txt'
    );
  }

  if (techStack.match(/php/i)) {
    wordlist.push(
      'index.php', 'info.php', 'phpinfo.php', 'admin.php',
      'config.php', 'configuration.php', 'install.php', 'update.php'
    );
  }

  if (techStack.match(/laravel/i)) {
    wordlist.push(
      '.env', 'storage', 'public', 'artisan', 'server.php',
      'composer.json', 'app', 'bootstrap/cache', 'vendor'
    );
  }

  if (techStack.match(/django|python/i)) {
    wordlist.push(
      'admin', 'static', 'media', 'settings.py', 'urls.py',
      'manage.py', 'requirements.txt', 'views.py'
    );
  }

  if (techStack.match(/node|express|javascript/i)) {
    wordlist.push(
      'node_modules', 'package.json', 'server.js', 'app.js',
      'config.js', '.npmrc', 'api', 'public', 'dist'
    );
  }

  if (techStack.match(/react|angular|vue/i)) {
    wordlist.push(
      'static', 'assets', 'build', 'dist', 'js', 'css',
      'app.js', 'main.js', 'bundle.js', 'index.html'
    );
  }

  if (techStack.match(/ruby|rails/i)) {
    wordlist.push(
      'config', 'db', 'app', 'public', 'Gemfile',
      'config/database.yml', 'config/routes.rb'
    );
  }

  if (techStack.match(/java|spring/i)) {
    wordlist.push(
      'WEB-INF', 'META-INF', 'web.xml', 'application.properties',
      'application.yml', 'beans.xml', 'pom.xml', 'build.gradle'
    );
  }

  if (techStack.match(/asp|\.net/i)) {
    wordlist.push(
      'web.config', 'global.asax', 'bin', 'App_Data',
      'Default.aspx', 'appsettings.json', 'csproj'
    );
  }

  // Common database endpoints
  if (techStack.match(/mysql|mariadb|postgres|sql/i)) {
    wordlist.push(
      'phpmyadmin', 'adminer', 'dbadmin', 'sql', 'mysql',
      'postgres', 'db', 'database', 'admin/db'
    );
  }

  // Add some general endpoints that might be common in any web application
  wordlist.push(
    'admin', 'login', 'api', 'api/v1', 'api/v2',
    'dashboard', 'user', 'account', 'profile',
    'settings', 'upload', 'images', 'files'
  );

  return [...new Set(wordlist)]; // Remove duplicates
}
