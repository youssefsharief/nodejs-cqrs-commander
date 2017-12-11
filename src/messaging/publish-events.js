const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

function publishEvent( payload) {
    const params = {
        DelaySeconds: 0,
        MessageAttributes: { },
        QueueUrl: process.env.AWS_PUBLISHED_EVENTS_QUEUE_URL
    };
    return new Promise((resolve, reject) => {
        params.MessageBody = JSON.stringify(payload)        
        sqs.sendMessage(params, function (err, data) {
            if (err) reject(err);
            else resolve(data.MessageId);
        });
    })
}



module.exports = { publishEvent }