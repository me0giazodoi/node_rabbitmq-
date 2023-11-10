const amqp = require("amqplib");
const queue = "node_channel";

const publishQueue = async (text)=>{
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();

        // close after sending message
        process.once("SIGINT",async ()=>{
            await channel.close();
            connection.close();
        })

        await channel.assertQueue(queue);
        channel.sendToQueue(queue,Buffer.from(JSON.stringify(text)));
        console.log("SENT MESSAGE");
    } catch (error) {
        console.log(error);
    }
}

///
const express = require("express");
const app = express();
const port = 2207;
app.listen(port,function(err){
    if(err) console.log(err);
    else console.log("Server is running...");
});

app.get("/create-order",(req,res)=>{
    const order = {
        orderId: 2,
        grandTotal: 120000,
        status:1,
        customerName: "QUang Hoa"
    }
    publishQueue(order);
    res.send("Create order successfully");
})