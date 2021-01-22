'use strict'
var aws= require('aws-sdk');
const documentClient = new aws.DynamoDB.DocumentClient({region: 'eu-west-1'});


exports.handler = async (event, context, callback) => {
    const requestId = context.awsRequestId;
    console.log('RequestId:' + requestId);
    console.log(context);
    console.log('Event: \n'+event)
    
    var pill = JSON.parse(event.body);
    
    console.log('Pill: \n'+pill);
    console.log('Pill name: '+pill.pill);

    await createPill(requestId, pill).then(() => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify(pill),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
    }).catch((err) => {
        console.error(err)
    });

};

function createPill(requestId, pill) {
    var params = {
        TableName: 'smartpill-pills',
        
        Item: {
            'id': requestId,
            'pill': pill.pill,
            'weight': pill.weight,
            'deposit': pill.deposit,
            'image_url': pill.image_url,
            'morning': pill.morning,
            'afternoon': pill.afternoon,
            'night': pill.night
        }
    }
    
    return documentClient.put(params).promise();
}