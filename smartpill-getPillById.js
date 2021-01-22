'use strict'
var aws= require('aws-sdk');
const documentClient = new aws.DynamoDB.DocumentClient({region: 'eu-west-1'});


exports.handler = async (event, context, callback) => {
    //const pillId = '2f0c8f1c-d969-44cc-b495-740154ac199d';
    const pillId = event.pathParameters.id;
    
    console.log('pillId:' + pillId);
    console.log(context);
    
    console.log(event)
    //console.log('Event: \n'+JSON.stringify(event))
    
    await getPill(pillId).then(data => {
        console.log(data.Item);
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(data.Item),
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

function getPill(pillId) {
    var params = {
        TableName: 'smartpill-pills',
        Key: {
            id: pillId
        }
    };
    
    return documentClient.get(params).promise();
}