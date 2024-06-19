const axios = require('axios');

function crackPasswordWithParallelAlgorithmInLambda(alphabet, passwordHash, workerAmount, passwordLength, startTime) {
    return new Promise((resolve, reject) => {
        let falseCount = 0;

        for (let id = 0; id < workerAmount; id++) {
            axios.post(`https://f9kcqqjj2k.execute-api.eu-central-1.amazonaws.com/`, {
                id: id,
                alphabet: alphabet,
                passwordHash: passwordHash,
                passwordLength: passwordLength,
                workerAmount: workerAmount,
                startTime: startTime
            }).then(response => {
                if (response.data.found) {
                    resolve(response.data);
                } else {
                    falseCount++;

                    if (falseCount === parseInt(workerAmount)) {
                        resolve(response.data);
                    }
                }
            }).catch(error => {
                console.error('Error 1:', error);
            });
        }
    });
}

module.exports = {
    crackPasswordWithParallelAlgorithmInLambda
};