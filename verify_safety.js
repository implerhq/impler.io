
const XLSX = require('xlsx');

// Simulate a worksheet with different cell types
const ws = {
  // A1: A Date (Should be modified)
  'A1': { t: 'd', v: new Date(2025, 10, 1), w: '11/1/25', z: 'm/d/yy' },
  
  // A2: A String/Dropdown selection (Should be IGNORED)
  'A2': { t: 's', v: 'Option 1', w: 'Option 1', z: '@' },
  
  // A3: A Number (Should be IGNORED)
  'A3': { t: 'n', v: 123, w: '123', z: '0' },
  
  '!ref': 'A1:A3'
};

console.log('--- Before Loop ---');
console.log('Date Cell (A1):', ws['A1']);
console.log('Dropdown/String Cell (A2):', ws['A2']);

// The Loop
for (const key in ws) {
  if (ws[key] && typeof ws[key] === 'object' && ws[key].t === 'd') {
    delete ws[key].w;
    delete ws[key].z;
  }
}

console.log('\n--- After Loop ---');
console.log('Date Cell (A1):', ws['A1']);
console.log('Dropdown/String Cell (A2):', ws['A2']);
