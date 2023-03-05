const AWS = require('aws-sdk')
const middy = require('@middy/core')
const httpErrorHandler = require('@middy/http-error-handler')

const getTasks = async(event) => {
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient();

        const result = await dynamodb.scan({
            TableName: 'TaskTable'
        }).promise()

        const tasks = result.Items
        return {
            status: 200,
            headers:{
                'Content-Type': 'application/json',
            },
            body: {
                tasks
            }
        }
    } catch (error) {
        console.log(error)
    }
}


const getTask = async(event) => {
    try {
        const {id} = event.pathParameters
        const dynamodb = new AWS.DynamoDB.DocumentClient();

        const result = await dynamodb.get({
            TableName: 'TaskTable',
            Key: {id}
        }).promise()
        const task = result.Item

        if(task){
            return {
                status: 200,
                headers:{
                    'Content-Type': 'application/json',
                },
                body: task
            }
        }
        else {
            return {
                status: 404,
                headers:{
                    'Content-Type': 'application/json',
                },
                body: {
                    message: `The task with ID: ${id}. does not exist`
                }
            }
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getTasks: middy(getTasks).use(httpErrorHandler),
    getTask: middy(getTask).use(httpErrorHandler)
}