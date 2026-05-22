/**
 * Debug OpenAI API Key - try different approaches
 */

const apiKey = process.env.OPENAI_API_KEY || '';

console.log('🔍 OpenAI API Key Debug\n');
console.log('=' .repeat(60));
console.log(`\nKey length: ${apiKey.length}`);
console.log(`Key starts with: ${apiKey.slice(0, 10)}...`);
console.log(`Key ends with: ...${apiKey.slice(-10)}`);

// Check key format
if (apiKey.startsWith('sk-proj-')) {
  console.log('\n✅ Key format: sk-proj- (Project key)');
} else if (apiKey.startsWith('sk-')) {
  console.log('\n✅ Key format: sk- (Standard key)');
} else {
  console.log('\n⚠️  Key format: Unknown prefix');
}

// Check for common issues
const issues = [];
if (apiKey.includes(' ')) {
  issues.push('Contains spaces');
}
if (apiKey.includes('\n') || apiKey.includes('\r')) {
  issues.push('Contains newlines');
}
if (apiKey.length < 50) {
  issues.push('Key too short (< 50 chars)');
}

if (issues.length > 0) {
  console.log('\n⚠️  Potential issues:');
  issues.forEach(i => console.log(`   - ${i}`));
} else {
  console.log('\n✅ No obvious formatting issues detected');
}

// Try testing with trimmed key
const trimmedKey = apiKey.trim();
console.log(`\nTrimmed key length: ${trimmedKey.length}`);

async function testWithKey(key: string, baseUrl?: string) {
  const url = baseUrl || 'https://api.openai.com/v1/models';
  console.log(`\nTesting against: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json() as { data: Array<{ id: string }> };
      console.log(`✅ Success! Models: ${data.data.length}`);
      return true;
    } else {
      const error = await response.text();
      console.log(`Error: ${error.slice(0, 200)}`);
      return false;
    }
  } catch (error) {
    console.log(`Request failed: ${(error as Error).message}`);
    return false;
  }
}

(async () => {
  // Test with original key
  await testWithKey(apiKey);

  // Test with trimmed key
  if (apiKey !== trimmedKey) {
    console.log('\n--- Testing with trimmed key ---');
    await testWithKey(trimmedKey);
  }

  // Try alternative endpoint
  console.log('\n--- Testing alternative endpoint ---');
  await testWithKey(apiKey, 'https://api.openai.com/v1/chat/completions');

  console.log('\n' + '=' .repeat(60));
  console.log('\n💡 Possible issues:');
  console.log('   1. Key is from different provider (Azure, Groq, etc.)');
  console.log('   2. Key has been revoked or expired');
  console.log('   3. Key requires specific base URL');
  console.log('   4. Key is for OpenAI Enterprise with custom endpoint');
  console.log('\n🔗 Verify key at: https://platform.openai.com/account/api-keys');
})();
