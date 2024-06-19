const { Worker } = require('worker_threads');
const { createEntry } = require('./dbAccessor');
const { buildParamsForParallelTime } = require('./passwordUtils');
const { start } = require('repl');

function crackPasswordWithParallelAlgorithm(alphabet, passwordHash, workerAmount, passwordLength, startTime) {
    return new Promise((resolve, reject) => {

        passwordLength = parseInt(passwordLength);
        workerAmount = parseInt(workerAmount);

        let falseCount = 0;
        let workers = [];

        for (let i = 0; i < workerAmount; i++) {
            const worker = new Worker('./bin/worker.js');
            workers.push(worker);
            worker.postMessage({
                id: i,
                alphabet: alphabet,
                passwordHash: passwordHash,
                workerAmount: workerAmount,
                passwordLength: passwordLength,
                startTime: startTime
            });

            worker.on('message', async (message) => {
                if (message.found === false) {
                    falseCount++;
                    if (falseCount === workerAmount) {
                        await createEntry(buildParamsForParallelTime(alphabet, workerAmount, passwordLength, startTime, startTime, message.found, message.password));

                        resolve(message);
                        for (let j = 0; j < workerAmount; j++) {
                            workers[j].terminate();
                        }
                    }
                } else {
                    await createEntry(buildParamsForParallelTime(alphabet, workerAmount, passwordLength, startTime, startTime, message.found, message.password));

                    resolve(message);
                    for (let j = 0; j < workerAmount; j++) {
                        workers[j].terminate();
                    }
                }
            });
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });
        }
    });
}

module.exports = {
    crackPasswordWithParallelAlgorithm
};