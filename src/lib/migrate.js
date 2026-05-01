import dbConnect from './src/lib/db';
import Lawyer from './src/models/Lawyer';
import Settings from './src/models/Settings';
import fs from 'fs';
import path from 'path';

async function migrate() {
  await dbConnect();
  console.log('Connected to MongoDB');

  // Migrate Lawyers
  const lawyersPath = path.join(process.cwd(), 'src/data/lawyers.json');
  if (fs.existsSync(lawyersPath)) {
    const lawyersData = JSON.parse(fs.readFileSync(lawyersPath, 'utf8'));
    for (const l of lawyersData) {
      const { id, ...data } = l; // Strip legacy ID
      const exists = await Lawyer.findOne({ name: data.name });
      if (!exists) {
        await Lawyer.create(data);
        console.log(`Migrated Lawyer: ${data.name}`);
      }
    }
  }

  // Migrate Settings
  const settingsPath = path.join(process.cwd(), 'src/data/settings.json');
  if (fs.existsSync(settingsPath)) {
    const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    await Settings.findOneAndUpdate(
      { key: 'platform_settings' },
      { $set: settingsData },
      { upsert: true }
    );
    console.log('Migrated Settings');
  }

  console.log('Migration Complete');
  process.exit(0);
}

// Note: This script is intended to be run manually or via an API endpoint.
// I'll create an API route for it so the user can just hit a URL to migrate.
