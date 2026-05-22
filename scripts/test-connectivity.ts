/**
 * Test actual service connectivity
 */

import { createConnection } from 'net';

async function testPort(host: string, port: number, serviceName: string, timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`   Testing ${serviceName} at ${host}:${port}...`);

    const socket = createConnection({ host, port, timeout });

    const timer = setTimeout(() => {
      socket.destroy();
      console.log(`   ⏱️  Timeout - ${serviceName} may be unreachable`);
      resolve(false);
    }, timeout);

    socket.on('connect', () => {
      clearTimeout(timer);
      socket.destroy();
      console.log(`   ✅ ${serviceName} is reachable at ${host}:${port}`);
      resolve(true);
    });

    socket.on('error', (err) => {
      clearTimeout(timer);
      console.log(`   ❌ ${serviceName} connection failed: ${err.message}`);
      resolve(false);
    });
  });
}

async function main() {
  console.log('🔌 Testing Service Connectivity\n');
  console.log('=' .repeat(60));

  // Test PostgreSQL
  console.log('\n🐘 PostgreSQL:');
  const pgOk = await testPort('83.166.253.250', 5432, 'PostgreSQL');

  // Test Redis (local)
  console.log('\n📦 Redis:');
  const redisOk = await testPort('localhost', 6379, 'Redis');

  // Test Neo4j (local)
  console.log('\n🕸️  Neo4j:');
  const neo4jOk = await testPort('localhost', 7687, 'Neo4j');

  console.log('\n' + '=' .repeat(60));
  console.log('\n📊 Connectivity Results:');
  console.log(`   ${pgOk ? '✅' : '❌'} PostgreSQL (83.166.253.250:5432)`);
  console.log(`   ${redisOk ? '✅' : '❌'} Redis (localhost:6379)`);
  console.log(`   ${neo4jOk ? '✅' : '❌'} Neo4j (localhost:7687)`);

  console.log('\n💡 Note:');
  if (!redisOk) {
    console.log('   - Redis: Start with `docker compose up -d redis`');
  }
  if (!neo4jOk) {
    console.log('   - Neo4j: Start with `docker compose up -d neo4j`');
  }
}

main().catch(console.error);
