import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

interface ExcelPackage {
  ID: number;
  Title: string;
  Duration: string;
  "Departure Cities": string;
  "Fixed Departures": string;
  "Cost Details": string;
  Inclusions: string;
  Notes: string;
  "Items to Carry": string;
  "Payment Terms": string;
  "Cancellation Terms": string;
  Images: string;
}

async function migratePackages() {
  console.log('📦 Migrating packages from Excel...');
  
  const excelPath = path.join(process.cwd(), 'public', 'packages_summary.xlsx');
  
  if (!fs.existsSync(excelPath)) {
    console.log('⚠️  packages_summary.xlsx not found, skipping package migration');
    return;
  }

  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json<ExcelPackage>(worksheet);

  console.log(`Found ${data.length} packages to migrate`);

  for (const row of data) {
    try {
      await prisma.package.create({
        data: {
          id: row.ID,
          title: row.Title || '',
          duration: row.Duration || '',
          departureCities: row["Departure Cities"] || '',
          fixedDepartures: row["Fixed Departures"] || '',
          costDetails: row["Cost Details"] || '',
          inclusions: row.Inclusions || '',
          notes: row.Notes || '',
          itemsToCarry: row["Items to Carry"] || '',
          paymentTerms: row["Payment Terms"] || '',
          cancellationTerms: row["Cancellation Terms"] || '',
          images: row.Images || ''
        }
      });
      console.log(`✓ Migrated package: ${row.Title}`);
    } catch (error) {
      console.error(`✗ Error migrating package ${row.Title}:`, error);
    }
  }

  console.log('✅ Package migration complete!');
}

async function migrateDestinations() {
  console.log('🗺️  Migrating destinations...');
  
  const destinations = [
    { id: 1, title: "Ladakh", description: "High-altitude desert region with stunning landscapes", images: "/eg7.jpg" },
    { id: 2, title: "Spiti Valley", description: "Remote mountain valley with ancient monasteries", images: "/eg8.jpg" },
    { id: 3, title: "Meghalaya", description: "Lush green hills and living root bridges", images: "/eg9.jpg" },
    { id: 4, title: "Rajasthan", description: "Royal heritage and desert landscapes", images: "/desert.jpg" },
    { id: 5, title: "Kerala", description: "Backwaters and tropical paradise", images: "/kerela.jpg" }
  ];

  for (const dest of destinations) {
    try {
      await prisma.destination.create({ data: dest });
      console.log(`✓ Migrated destination: ${dest.title}`);
    } catch (error) {
      console.error(`✗ Error migrating destination ${dest.title}:`, error);
    }
  }

  console.log('✅ Destination migration complete!');
}

async function main() {
  console.log('🚀 Starting database migration...\n');
  
  try {
    await migratePackages();
    console.log('');
    await migrateDestinations();
    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
