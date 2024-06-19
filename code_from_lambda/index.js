const { createEntry } = require('./bin/dbAccessor');
const { crackPasswordWithBruteForce } = require('./bin/bruteForce');
const { buildParamsForTime } = require('./bin/passwordUtils');

module.exports.handler = async (event) => {
    const body = JSON.parse(event.body); // id, alphabet, passwordHash, passwordLength, totalWorkerAmount
    
    let { id, alphabet, passwordHash, passwordLength, workerAmount, startTime } = body;
    id = parseInt(id);
    passwordLength = parseInt(passwordLength);
    workerAmount = parseInt(workerAmount);
    startTime = parseInt(startTime);
    const startProcessingTime = Date.now();

    let result = await crackPasswordWithBruteForce(id, alphabet, passwordHash, workerAmount, passwordLength, startTime, startProcessingTime);

    await createEntry(buildParamsForTime(alphabet, workerAmount, passwordLength, startTime, startProcessingTime, result.found, result.password));

    return {
        statusCode: 200,
        body: JSON.stringify({
            found: result.found,
            password: result.password
        }),
    };
};