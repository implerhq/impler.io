export const BATCH_LIMIT = 500;

export const MAIN_CODE = `
const fs = require('fs');
const { code } = require('./code');
let input = fs.readFileSync('./input.json', 'utf8');

const startTime = Date.now();
input = JSON.parse(input);

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function saveCodeOutput(output) {
  fs.writeFileSync('./code-output.json', JSON.stringify(output));
}

function saveOutput(output, startTime) {
  fs.writeFileSync('./output.json', JSON.stringify({
    output,
    status: "OK"
  }));
  fs.writeFileSync('./meta.txt', 'time: ' + ((Date.now() - startTime) / 1000));
}

function saveError(error, startTime) {
  console.error(error);
  fs.writeFileSync('./meta.txt', 'time: ' + ((Date.now() - startTime) / 1000));
  fs.writeFileSync('./output.json', JSON.stringify({
    status: "ERROR",
    output: error.message
  }))
}

function isObjectEmpty(obj) {
  for(let i in obj) return false; 
  return true;
}

function processErrors(batchData, errors) {
  if(!Array.isArray(errors) || (Array.isArray(errors) && errors.length === 0)) {
    return batchData;
  }

  errors.forEach(error => {
    if (error.warnings && typeof error.warnings === 'object') {
      const rowIndexToUpdate = batchData.data.findIndex(data => data.index === error.index);

      if (rowIndexToUpdate > -1) {
        // Initialize warnings object if it doesn't exist
        if (!batchData.data[rowIndexToUpdate].warnings) {
          batchData.data[rowIndexToUpdate].warnings = {};
        }

        batchData.data[rowIndexToUpdate].warnings = {
          ...batchData.data[rowIndexToUpdate].warnings,
          ...error.warnings
        };
      }
    }
  });

  let rowIndexToUpdate, combinedErrors, isErrorsEmpty, combinedWarnings;
  errors.forEach(error => {
    rowIndexToUpdate = batchData.data.findIndex(data => data.index === error.index);
    if(
      rowIndexToUpdate > -1 && 
      (typeof error.errors === 'object' && !Array.isArray(error.errors) && error.errors !== null)
    ) {
      combinedErrors = Object.assign(batchData.data[rowIndexToUpdate]?.errors || {}, error.errors);
      combinedWarnings = batchData.data[rowIndexToUpdate]?.warnings || {};
      isErrorsEmpty = isObjectEmpty(combinedErrors);
      batchData.data[rowIndexToUpdate] = {
        ...batchData.data[rowIndexToUpdate],
        warnings: combinedWarnings,
        errors: combinedErrors,
        isValid: isErrorsEmpty
      }
    }
  });
  return batchData;
}


if (typeof code === 'function') {
  if(code.constructor.name === 'AsyncFunction') {
    code(input).then((outputErrors) => {
      saveCodeOutput(outputErrors);
      let output = processErrors(input, outputErrors);
      saveOutput(output, startTime);
      process.exit(0);
    }).catch((error) => {
      saveError(error, startTime);
    });
  } else {
    try {
      const outputErrors = code(input);
      saveCodeOutput(outputErrors);
      let output = processErrors(input, outputErrors);
      saveOutput(output, startTime);
      process.exit(0);
    } catch (error) {
      saveError(error, startTime);
    }
  }
}
`;
