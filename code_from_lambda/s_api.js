
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'shpend',
  applicationName: 'pw-cracker',
  appUid: '6ykLsbkXHnqcVnNk2W',
  orgUid: 'a0077b6e-001b-44d8-bf19-f2dd191630bb',
  deploymentUid: '05ddd4bb-b049-4405-b50a-dec325658a5d',
  serviceName: 'pwCracker',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '7.2.3',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'pwCracker-dev-api', timeout: 6 };

try {
  const userHandler = require('./index.js');
  module.exports.handler = serverlessSDK.handler(userHandler.handler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}