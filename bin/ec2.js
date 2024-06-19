const axios = require('axios');

const DNS = "ec2-35-159-166-91.eu-central-1.compute.amazonaws.com";

function crackPasswordWithSequentialAlgorithmInEc2(alphabet, passwordHash, passwordLength, startTime) {
    return new Promise((resolve, reject) => {
        axios.post(`http://${DNS}:3000/`, {
            alphabet: alphabet,
            passwordHash: passwordHash,
            passwordLength: passwordLength,
            startTime: startTime
        }).then(response => {
            resolve(response.data)
        }).catch(error => {
            console.error('Error:', error.code);
        });
    });
}

function crackPasswordWithParallelAlgorithmInEc2(alphabet, passwordHash, workerAmount, passwordLength, startTime) {
    return new Promise((resolve, reject) => {
        axios.post(`http://${DNS}:3000/`, {
            alphabet: alphabet,
            passwordHash: passwordHash,
            passwordLength: passwordLength,
            workerAmount: workerAmount,
            startTime: startTime
        }).then(response => {
            resolve(response.data)
        }).catch(error => {
            console.error('Error:', error.code);
        });
    });
}

module.exports = {
    crackPasswordWithSequentialAlgorithmInEc2,
    crackPasswordWithParallelAlgorithmInEc2
};