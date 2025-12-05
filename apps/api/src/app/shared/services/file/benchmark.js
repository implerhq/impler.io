const XLSX = require('xlsx');

// 1. Generate a large dataset (e.g., 10,000 rows)
const rows = [['Date', 'Name', 'Amount']];
for (let i = 0; i < 10000; i++) {
  rows.push([new Date(), `User ${i}`, i * 100]);
}
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(rows);
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

console.log('Dataset size: 10,000 rows');

// 2. Measure "Before" (Standard Read)
console.time('Standard Read');
const wbStandard = XLSX.read(buffer);
const wsStandard = wbStandard.Sheets[wbStandard.SheetNames[0]];
XLSX.utils.sheet_to_csv(wsStandard, { blankrows: false, skipHidden: true, forceQuotes: true });
console.timeEnd('Standard Read');

// 3. Measure "After" (Fix: cellDates + Loop)
console.time('Fix Read (cellDates + Loop)');
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
  dateNF: 'dd/mm/yyyy',
});
console.timeEnd('Fix Read (cellDates + Loop)');
