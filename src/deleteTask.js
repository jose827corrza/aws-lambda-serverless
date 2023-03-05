const AWS = require('aws-sdk')

const deleteTask = async(event) => {
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient()
        const {id} = event.pathParameter

        // Check if exist the task
        const result = await dynamodb.get({
            TableName: 'TaskTable',
            Key: {id}
        }).promise()
        const task = result.Item

        if(task){
            await dynamodb.delete({
                TableName: "TaskTable",
                Key: {id}
            }).promise()
            return {
                status: 200,
                body : {
                    message: `Task with ID ${id} deleted`
                }
            }
        } else {
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
        return {
            status: 500,
            body: {
                message: " Its not you, its us, sorry :C"
            }
        }
    }

}

module.exports = {
    deleteTask,
}