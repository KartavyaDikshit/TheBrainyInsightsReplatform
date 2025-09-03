import { DatabaseClient } from '@tbi/database';

async function testConnection() {
  const db = new DatabaseClient(); // Instantiate the class
  try {
    console.log('Testing database connection...');
    const count = await db.getCategoryCount();
    console.log('Category count:', count);
  } catch (error) {
    console.error('Error testing database connection:', error);
  } finally {
    // Disconnect the client if it was connected
  }
}

testConnection();