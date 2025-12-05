
const XLSX = require('xlsx');

function getMemory() {
  const m = process.memoryUsage();
  return {
    rss: Math.round(m.rss / 1024 / 1024),
    heapUsed: Math.round(m.heapUsed / 1024 / 1024),
  };
}

// 1. Generate a large dataset (50,000 rows to make memory usage visible)
console.log('Generating dataset (50,000 rows)...');
const rows = [['Date', 'Name', 'Amount']];
for (let i = 0; i < 50000; i++) {
  rows.push([new Date(), `User ${i}`, i * 100]);
}
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(rows);
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

console.log('Dataset generated. Size:', (buffer.length / 1024 / 1024).toFixed(2), 'MB');
global.gc && global.gc(); // Force GC if available
const baselineMem = getMemory();

// --- Test 1: Standard Read ---
console.log('\n--- Standard Read (Before Fix) ---');
const startStandard = process.hrtime();
const wbStandard = XLSX.read(buffer);
const wsStandard = wbStandard.Sheets[wbStandard.SheetNames[0]];
XLSX.utils.sheet_to_csv(wsStandard, { blankrows: false, skipHidden: true, forceQuotes: true });
const endStandard = process.hrtime(startStandard);
const timeStandard = (endStandard[0] * 1000 + endStandard[1] / 1e6).toFixed(2);
const memStandard = getMemory();

console.log(`Time: ${timeStandard} ms`);
console.log(`Memory (Heap Used): ${memStandard.heapUsed} MB (Delta: ${memStandard.heapUsed - baselineMem.heapUsed} MB)`);

// Clean up
global.gc && global.gc();

// --- Test 2: Fix Read ---
console.log('\n--- Fix Read (With cellDates: true + Loop) ---');
const startFix = process.hrtime();
const wbFix = XLSX.read(buffer, { cellDates: true });
const wsFix = wbFix.Sheets[wbFix.SheetNames[0]];

// The Loop
for (const key in wsFix) {
  if (wsFix[key] && typeof wsFix[key] === 'object' && wsFix[key].t === 'd') {
    delete wsFix[key].w;
    delete wsFix[key].z;
  }
}

XLSX.utils.sheet_to_csv(wsFix, { 
  blankrows: false, 
  skipHidden: true, 
  forceQuotes: true, 
  dateNF: 'dd/mm/yyyy' 
});
const endFix = process.hrtime(startFix);
const timeFix = (endFix[0] * 1000 + endFix[1] / 1e6).toFixed(2);
const memFix = getMemory();

console.log(`Time: ${timeFix} ms`);
console.log(`Memory (Heap Used): ${memFix.heapUsed} MB (Delta: ${memFix.heapUsed - baselineMem.heapUsed} MB)`);

console.log('\n--- Comparison ---');
console.log(`Time Difference: +${(timeFix - timeStandard).toFixed(2)} ms`);
console.log(`Memory Difference: +${memFix.heapUsed - memStandard.heapUsed} MB`);
