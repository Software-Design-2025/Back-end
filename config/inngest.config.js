const { serve } = require('inngest/express');
const { inngest } = require('../inngest/client');
const { RenderCloudVideo } = require('../inngest/function');

module.exports = serve({
  client: inngest,
  functions: [RenderCloudVideo],
});
