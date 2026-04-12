import postgres from 'postgres';
import { loadEnvConfig } from '@next/env';

// 加载环境变量
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL 环境变量未设置');
  process.exit(1);
}

const sql = postgres(POSTGRES_URL, { ssl: 'require' });

async function testConnection() {
  try {
    console.log('🔄 正在连接数据库...');
    
    const result = await sql`SELECT NOW() as time, current_database() as db`;
    console.log('✅ 数据库连接成功！');
    console.log(`   数据库: ${result[0].db}`);
    console.log(`   服务器时间: ${result[0].time}`);
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log(`\n📋 公共表 (${tables.length} 个):`);
    tables.forEach(t => console.log(`   - ${t.table_name}`));
    
    await sql.end();
    console.log('\n✅ 测试完成');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    process.exit(1);
  }
}

testConnection();
