const amqp = require("amqplib");
const queue = "node_channel";

const listen = async ()=>{
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();

        await channel.assertQueue(queue);

        channel.consume(queue, (message)=>{
            if(message){
                const data = JSON.parse(message.content);
                console.log(data);
            }
        }, {noAck: true}
        );
    } catch (error) {
        console.log(error);
    }
}
// running...
listen();