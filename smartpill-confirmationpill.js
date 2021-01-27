'use strict'
var aws= require('aws-sdk');
const documentClient = new aws.DynamoDB.DocumentClient({region: 'eu-west-1'});

exports.handler = async (event, context, callback) => {
    const event_time = event.time; // Store event time given in a variable = morning, afternoon or night
    const event_date = new Date; // Get log time from server clock in UTC time, needs to be corrected in frontend!
    console.log(event_date)

    const requestId = context.awsRequestId;
    console.log('RequestId:' + requestId);
    console.log(context);
    console.log('Event: \n'+event)
    
    var pills = []; // Store the correct pills
    
     // Call getPills method in order to get the pills from the database
    await getPills().then(data => {
        data.Items.forEach(function(item) {
            if(item[event_time]){
                console.log(item);
                pills.push(item);
            }
        })
        console.log(pills)
        
    }).catch((err) => {
        console.error(err)
    });
    
    var event = {};
    event.time = event_time;
    event.date = event_date.toISOString();

    // Patient name -> Hardcoded, needs to be improved for future versions
    event.patient_name = 'John Stewart'
    
    event.pills = ''; // Initialize event.pills
    
    pills.forEach(function(pill) {
        if(event.pills === ''){
            event.pills = pill.pill;
        }else{
            event.pills = event.pills + `, ${pill.pill}`;
        }
    });
    console.log(event);
        
    
   await createEvent(requestId, event).then(() => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify(event),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
    }).catch((err) => {
        console.error(err)
    });
    
};

function createEvent(requestId, event) {
    var params = {
        TableName: 'smartpill-history',
        
        Item: {
            'id': requestId,
            'pills': event.pills,
            'date': event.date,
            'time': event.time,
            'patient_name': event.patient_name
        }
    }
    
    return documentClient.put(params).promise();
}

function getPills() {
    var params = {
        TableName: 'smartpill-pills',
        Limit: 10
    }

    
    return documentClient.scan(params).promise();
}
