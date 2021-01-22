'use strict'
var aws= require('aws-sdk');
const documentClient = new aws.DynamoDB.DocumentClient({region: 'eu-west-1'});


exports.handler = async (event, context, callback) => {

    await getEvents().then(data => {
        data.Items.forEach(function(item) {
            //console.log(item.name);
        })
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(data.Items),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
    }).catch((err) => {
        console.error(err)
    });

};

function getEvents() {
    var params = {
        TableName: 'smartpill-history',
        Limit: 10
    }
    
    return documentClient.scan(params).promise();
}