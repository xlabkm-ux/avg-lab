/**
 * Test OpenAI API Key
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file directly
const envPath = resolve(process.cwd(), '.env');
const envContent = readFileSync(envPath, 'utf-8');

const apiKeyMatch = envContent.match(/^OPENAI_API_KEY=(.+)$/m);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

if (!apiKey) {
  console.log('❌ OPENAI_API_KEY not found in .env file');
  process.exit(1);
}
