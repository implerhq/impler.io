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
  let rowIndexToUpdate, combinedErrors, isErrorsEmpty;
  errors.forEach(error => {
    rowIndexToUpdate = error.index - Math.max(0, ((batchData.batchCount - 1)* input.chunkSize));
    if(
      rowIndexToUpdate <= batchData.batchCount * input.chunkSize && 
      (typeof error.errors === 'object' && !Array.isArray(error.errors) && error.errors !== null)
    ) {
      combinedErrors = Object.assign(batchData.data[rowIndexToUpdate]?.errors || {}, error.errors);
      isErrorsEmpty = isObjectEmpty(combinedErrors);
      batchData.data[rowIndexToUpdate] = {
        ...batchData.data[rowIndexToUpdate],
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
