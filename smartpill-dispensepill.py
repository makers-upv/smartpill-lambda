import boto3 # AWS SDK for python
import json  # JSON encoder and decoder
import datetime # Datetime library

client = boto3.client('dynamodb')

# Name of the AWS IoT Core thing and mqtt_topic to pusblish
smartpillThing = '16a86b586d4a097cbc8f62af34b3c6cdd3002d43'
mqtt_topic = "dispensepill"

# Main function
def lambda_handler(event, context):

    # Get time from event bridge (from scheduler)
    print(event)
    time = event["time"] # time  = morning, afternoon, night

    # Initialize the  message 
    dispensepill_cmd = {
        "cmd": "dispensepill",
        "npills": 1,
        "intake": {
            "time": time
        },
        "pills": {
    
        }   
    }

    # Check which pill has the intake specified in variable time from database and construct the message
    
    pills = getPills() # Call to the database to get the configured pills, maximum of 4

    npills = 0 # Initialize npills to 0
    
    for pill in pills:
        if(pill[time]['BOOL']):
            print(pill['pill']['S'])

            npills += 1
            
            # Set values to construct the message
            dispensepill_cmd["pills"][npills] = {}
            dispensepill_cmd["pills"][npills]["pill"] = pill["pill"]["S"]
            
            # Set qty to one (hardcoded, needs to be improved)
            dispensepill_cmd["pills"][npills]["qty"] = 1
            
            dispensepill_cmd["pills"][npills]["deposit"] = int(pill["deposit"]["S"])
            dispensepill_cmd["pills"][npills]["weight"] = int(pill["weight"]["S"])
            
    # Get the number of different types of pills to dispense
    dispensepill_cmd["npills"] = npills
    
    print(dispensepill_cmd)
    
    # Update device shadow to send the message to the device
    response = mqtt_publish(dispensepill_cmd, mqtt_topic)
    print(response)
    
# Publish mqtt message
def mqtt_publish(message, mqtt_topic):
    
    # Initialize AWS IoT Core SDK communicaiton client
    IoT_client = boto3.client('iot-data', 'eu-west-1')
    
    response = IoT_client.publish(
        topic=mqtt_topic,
        qos=1,
        payload=json.dumps(message)
    )



def getPills():
    
    response = client.scan(
        TableName = 'smartpill-pills',
        Limit = 4
    )
    
    items = response['Items'];

    return items
