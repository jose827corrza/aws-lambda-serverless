
const {SNSClient, PublishCommand} = require('@aws-sdk/client-sns')
const AWS = require('aws-sdk')

const REGION = 'us-east-2'
let myVar = process.env.JOSEDEV_VAR
const params = {
    Message: `Thank you for visiting the page message, and my var is ${myVar}`,
    TopicArn: 'arn:aws:sns:us-east-2:321868722454:test-topic'
}

const snsClient = new SNSClient({region: REGION})

const sendMessage = async(event) => {
    try {
        const data = await snsClient.send(new PublishCommand(params))
        console.log(data);
        return {
            status: 200,
            // body: JSON.stringify(data),
            body: data,
            headers: {
                'Content-Type': 'application/json',
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const updateTask = async(event) => {
    try {
        const { id } = event.pathParameters
        const {done, title = '', description = '' } = JSON.parse(event.body)
        const dynamodb = new AWS.DynamoDB.DocumentClient()
        
        await dynamodb.update({
            TableName: "TaskTable",
            Key: {id},
            UpdateExpression: "set done = :done, title = :title, description = :description",
            ExpressionAttributeValues: {
                ":done": done,
                ":title": title,
                ":description": description
            },
            ReturnValues: "ALL_NEW",
        }).promise()

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Task successfully updated',
            })
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    updateTask,
    sendMessage
}