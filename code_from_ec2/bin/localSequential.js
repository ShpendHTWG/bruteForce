const { crackPasswordWithBruteForce } = require('./bruteForce');

async function crackPasswordWithSequentialAlgorithm(alphabet, passwordHash, passwordLength, startTime, startProcessingTime) {
    passwordLength = parseInt(passwordLength);

    return await crackPasswordWithBruteForce(0, alphabet, passwordHash, 1, passwordLength, startTime, startProcessingTime);
}

module.exports = {
    crackPasswordWithSequentialAlgorithm
};