const { Worker } = require('worker_threads');

function crackPasswordWithParallelAlgorithm(alphabet, passwordHash, workerAmount, passwordLength, startTime, startProcessingTime) {
    return new Promise((resolve, reject) => {

        passwordLength = parseInt(passwordLength);
        workerAmount = parseInt(workerAmount);

        let falseCount = 0;
        let workers = [];

        for (let i = 0; i < workerAmount; i++) {
            const worker = new Worker('./app/ec2/bin/worker.js');
            workers.push(worker);
            worker.postMessage({
                id: i,
                alphabet: alphabet,
                passwordHash: passwordHash,
                workerAmount: workerAmount,
                passwordLength: passwordLength,
                startTime: startTime,
                startProcessingTime: startProcessingTime
            });

            worker.on('message', (message) => {
                if (message.found === false) {
                    falseCount++;

                    if (falseCount === workerAmount) {
                        resolve(message);
                        for (let j = 0; j < workerAmount; j++) {
                            workers[j].terminate();
                        }
                    }
                } else {
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