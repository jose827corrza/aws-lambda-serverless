const { v4} = require('uuid')
const AWS = require('aws-sdk')
const middy = require('@middy/core')
const jsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const validator = require('@middy/validator')
const {transpileSchema} = require('@middy/validator/transpile')
 
const addTask = async(event) => {
    // Connects using the acces key given before when stablishing the project
    const dynamoDb = new AWS.DynamoDB.DocumentClient()
    // const {title, description} = JSON.parse(event.body); // Very important to parse
    const {title, description} = event.body
    const createAt = new Date()
    const id = v4()

const newTask = {
    id,
    title,
    description,
    createdAt: createAt.toDateString(),
    done: false
}

    await dynamoDb.put({
        TableName: 'TaskTable',
        Item: newTask
    }).promise()

    return {
        statusCode: 201,
        body: JSON.stringify(newTask),
        headers: {
            'Content-Type': 'application/json',
        }
    }

}
const eventSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties:{
                description: {type: 'string', minLength: 4, maxLength: 35},
                title: {type: 'string', minLength: 4, maxLength: 15},
            },
            required: ['title']
        }
    }
}
module.exports = {
    addTask: middy(addTask) // Middlewares
        .use(jsonBodyParser())
        .use(validator({eventSchema: transpileSchema(eventSchema)}))
        .use(httpErrorHandler())
}