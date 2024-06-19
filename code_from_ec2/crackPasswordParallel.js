const express = require('express');
const { buildParamsForParallelTime } = require('./bin/passwordUtils');
const { createEntry } = require('./bin/dbAccessor');
const { crackPasswordWithParallelAlgorithm } = require('./bin/localParallel');

const app = express();

app.use(express.json());

app.post("/", async (request, response) => {
    const { passwordHash, alphabet, passwordLength, workerAmount, startTime } = request.body;
    const startProcessingTime = Date.now();

    console.log("request came in");

    let result = await crackPasswordWithParallelAlgorithm(alphabet, passwordHash, workerAmount, passwordLength, startTime, startProcessingTime);

    await createEntry(buildParamsForParallelTime(alphabet, workerAmount, passwordLength, startTime, startProcessingTime, result.found, result.password));

    console.log("request done");
    
    response.json({
        found: result.found,
        password: result.password
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}!!!`));