const AWS = require('aws-sdk')

const deleteTask = async(event) => {
    try {
        const dynamodb = new AWS.DynamoDB.DocumentClient()
        const {id} = event.pathParameter
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