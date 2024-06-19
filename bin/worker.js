const { parentPort } = require('worker_threads');
const { crackPasswordWithBruteForce } = require('./bruteForce');

parentPort.on('message', async ({ id, alphabet, passwordHash, workerAmount, passwordLength, startTime }) => {
    const result = await crackPasswordWithBruteForce(id, alphabet, passwordHash, workerAmount, passwordLength, startTime, startTime);
    
    parentPort.postMessage({ found: result.found, password: result.password, id });
    return;
});