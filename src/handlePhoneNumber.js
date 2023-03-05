const {SNSClient, PublishCommand} = require('@aws-sdk/client-sns')

const REGION = 'us-east-2'
let myVar = process.env.JOSEDEV_VAR
let topicSnsArn = process.env.TOPIC_SNS_ARN
const params = {
    Message: `Thank you for visiting the page message, and my var is ${myVar}`,
    TopicArn: topicSnsArn
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

module.exports = {
    sendMessage,
}