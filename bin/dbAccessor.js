const { DynamoDB } = require('@aws-sdk/client-dynamodb')

let client = new DynamoDB({
    region: "eu-central-1",
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    }
});

async function createEntry(params) {
    try {
        await client.putItem(params);
    } catch (error) {
        console.error("Error creating entry:", error);
    }
}

async function createTimesTable() {
    const paramsTimes = {
        TableName: "Times",
        AttributeDefinitions: [{ AttributeName: "Id", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "Id", KeyType: "HASH" }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };

    try {
        await client.createTable(paramsTimes);
    } catch (error) {
        console.error("Error creating table:", error);
    }
}

async function createPercentagesTable() {
    const paramsPercentages = {
        TableName: "Percentages",
        AttributeDefinitions: [{ AttributeName: "Id", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "Id", KeyType: "HASH" }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };

    try {
        await client.createTable(paramsPercentages);
    } catch (error) {
        console.error("Error creating table:", error);
    }
}

module.exports = {
    createEntry,
    createTimesTable,
    createPercentagesTable
};