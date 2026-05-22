/**
 * Environment Configuration Validator
 * Tests all environment variables and service connections
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file
const envPath = resolve(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf-8');

// Parse .env
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();
    if (key && value) {
      env[key.replace(/^#.*\n/, '')] = value;
    }
  }
});

// Also load from process.env (already loaded by dotenv)
const getEnv = (key: string): string => {
  return process.env[key] || env[key] || '';
};

console.log('🔍 AVG Lab — Environment Configuration Check\n');
console.log('=' .repeat(60));

// 1. Check OPENAI_API_KEY
console.log('\n📡 OpenAI API Key:');
const openaiKey = getEnv('OPENAI_API_KEY');
if (openaiKey && openaiKey.startsWith('sk-proj-') && openaiKey.length > 50) {
  console.log('   ✅ Present and valid');
  console.log(`   Key: ${openaiKey.slice(0, 20)}...${openaiKey.slice(-4)}`);
} else if (!openaiKey) {
  console.log('   ❌ Missing - AI features will not work');
} else {
  console.log('   ⚠️  Present but may be invalid format');
}

// 2. Check PostgreSQL
console.log('\n🐘 PostgreSQL:');
const dbUrl = getEnv('DATABASE_URL');
const dbHost = getEnv('POSTGRES_SERVER');
const dbUser = getEnv('POSTGRES_USER');
const dbPass = getEnv('POSTGRES_PASSWORD');
const dbName = getEnv('POSTGRES_DB');

if (dbUrl) {
  console.log('   ✅ DATABASE_URL configured');
  console.log(`   URL: ${dbUrl.replace(/\/\/.*@/, '//***@')}`);
}
if (dbHost && dbUser && dbName) {
  console.log('   ✅ Individual parameters set');
  console.log(`   Host: ${dbHost}`);
  console.log(`   Database: ${dbName}`);
  console.log(`   User: ${dbUser}`);
  console.log(`   Password: ${dbPass ? '***' + dbPass.slice(-4) : 'NOT SET'}`);
}

// 3. Check Redis
console.log('\n📦 Redis:');
const redisUrl = getEnv('REDIS_URL');
if (redisUrl) {
  console.log(`   ✅ Configured: ${redisUrl}`);
} else {
  console.log('   ⚠️  Not configured - caching disabled');
}

// 4. Check Neo4j
console.log('\n🕸️  Neo4j:');
const neo4jUri = getEnv('NEO4J_URI');
const neo4jUser = getEnv('NEO4J_USER');
const neo4jPass = getEnv('NEO4J_PASSWORD');
if (neo4jUri) {
  console.log(`   ✅ URI: ${neo4jUri}`);
  console.log(`   User: ${neo4jUser || 'NOT SET'}`);
  console.log(`   Password: ${neo4jPass ? '***' : 'NOT SET'}`);
} else {
  console.log('   ⚠️  Not configured - graph features disabled');
}

// 5. Check S3
console.log('\n📁 S3 Storage:');
const s3Bucket = getEnv('S3_BUCKET');
const s3Region = getEnv('S3_REGION');
const s3Endpoint = getEnv('S3_ENDPOINT');
if (s3Bucket) {
  console.log(`   ✅ Bucket: ${s3Bucket}`);
  console.log(`   Region: ${s3Region}`);
  console.log(`   Endpoint: ${s3Endpoint || 'default'}`);
} else {
  console.log('   ⚠️  Not configured - file uploads disabled');
}

// 6. Check Monitoring
console.log('\n📊 Monitoring & Observability:');
const sentryDsn = getEnv('SENTRY_DSN');
const langfusePublic = getEnv('LANGFUSE_PUBLIC_KEY');
const langfuseSecret = getEnv('LANGFUSE_SECRET_KEY');
const posthogKey = getEnv('POSTHOG_KEY');

if (sentryDsn) {
  console.log('   ✅ Sentry configured');
} else {
  console.log('   ⚠️  Sentry not configured');
}

if (langfusePublic && langfuseSecret) {
  console.log('   ✅ Langfuse configured');
} else {
  console.log('   ⚠️  Langfuse not configured');
}

if (posthogKey) {
  console.log('   ✅ PostHog configured');
} else {
  console.log('   ⚠️  PostHog not configured');
}

// 7. Summary
console.log('\n' + '=' .repeat(60));
console.log('\n📋 Summary:');

const requiredOk = [
  ['OpenAI API Key', openaiKey.length > 0],
  ['DATABASE_URL', dbUrl.length > 0],
  ['PostgreSQL Server', dbHost.length > 0],
];

const optionalOk = [
  ['Redis', redisUrl.length > 0],
  ['Neo4j', neo4jUri.length > 0],
  ['S3', s3Bucket.length > 0],
  ['Sentry', sentryDsn.length > 0],
  ['Langfuse', langfusePublic.length > 0],
  ['PostHog', posthogKey.length > 0],
];

console.log('\nRequired:');
requiredOk.forEach(([name, ok]) => {
  console.log(`   ${ok ? '✅' : '❌'} ${name}`);
});

console.log('\nOptional:');
optionalOk.forEach(([name, ok]) => {
  console.log(`   ${ok ? '✅' : '⚠️'} ${name}`);
});

const allRequired = requiredOk.every(([, ok]) => ok);
console.log('\n' + '=' .repeat(60));
if (allRequired) {
  console.log('\n✅ All required parameters are configured!\n');
} else {
  console.log('\n❌ Some required parameters are missing!\n');
  process.exit(1);
}
