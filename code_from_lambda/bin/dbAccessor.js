const { DynamoDB } = require('@aws-sdk/client-dynamodb')

let client = new DynamoDB({
    region: process.env.region,
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

module.exports = {
    createEntry
};