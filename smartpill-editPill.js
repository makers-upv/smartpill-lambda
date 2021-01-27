'use strict'
var aws= require('aws-sdk');
const documentClient = new aws.DynamoDB.DocumentClient({region: 'eu-west-1'});


exports.handler = async (event, context, callback) => {
    // Get pillId as the UUID for the lambda event in order to be random and unique
    const pillId = event.pathParameters.id;
    
    // Get pill data from request body and print it for debug
    var pill = JSON.parse(event.body);

    console.log('Pill: \n'+pill);
    console.log('Pill name: '+pill.pill);
    
    // Launch database request to edit database
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

// Edit database function

function editPill(pillId, pill) {
    var params = {
        TableName: 'smartpill-pills',
        HashKey: 'pillId',
        Item: {
            'id': pillId,
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
