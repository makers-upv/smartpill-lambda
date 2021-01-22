'use strict'
var aws= require('aws-sdk');
const documentClient = new aws.DynamoDB.DocumentClient({region: 'eu-west-1'});


exports.handler = async (event, context, callback) => {
    //const pillId = 'bce7690a-0981-43ec-9757-9601c565b581';
    const pillId = event.pathParameters.id;
    
    console.log('pillId:' + pillId);
    console.log(context);
    
    console.log(event)
    //console.log('Event: \n'+JSON.stringify(event))
    
    await deletePill(pillId).then(() => {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(event),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
    }).catch((err) => {
        console.error(err)
        callback({
            statusCode: 400,
            body: err,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }, null)
    });

};

function deletePill(pillId) {
    var params = {
        TableName: 'smartpill-pills',
        Key: {
            id: pillId
        }
    };
    
    return documentClient.delete(params).promise();
}