const { faker } = require("@faker-js/faker");
const mqtt = require("mqtt");

// connection
const options = {
  protocol: "ws",
  username: "admin",
  password: "public",
  keepalive: 20,
  clientId: "emqx_publisher",
};

const connectUrl = "mqtt://192.168.0.102:8083/mqtt";

const client = mqtt.connect(connectUrl, options);

function waterPublisher(topic, message) {
  // show log
  console.log(`Topic: ${topic}, Message: ${message}`);

  // publish
  client.publish(topic, message, { qos: 0, retain: false });
}

setInterval(() => {
  // initiate
  const topic = "test.publisher";
  const message = {
    ntu: faker.number.float({ min: 0, max: 70, precision: 0.01 }),
    food: faker.datatype.boolean(),
    waterLevel: faker.datatype.boolean(),
  };

  // call func
  waterPublisher(topic, JSON.stringify(message));
}, 1000);
