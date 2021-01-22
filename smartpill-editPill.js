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
    
    var pill = JSON.parse(event.body);
    //var pill = event;
    
    console.log('Pill: \n'+pill);
    console.log('Pill name: '+pill.pill);

    await editPill(pillId, pill).then(() => {
        callback(null, {
            statusCode: 200,
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

function editPill(pillId, pill) {
    var params = {
        TableName: 'smartpill-pills',
        HashKey: 'pillId',
        Item: {
            'id': pillId,
            'pill': pill.pill,
            'weight': pill.weight,
            'deposit': pill.deposit,
            'image_url': pill.image_url
        }
    }
    
    return documentClient.put(params).promise();
}