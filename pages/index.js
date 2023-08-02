import mqtt from "mqtt";
import Head from "next/head";
import { useState, useEffect } from "react";

const mqttHost = "monsys.cloud";
const protocol = "ws";
const port = "9001";
var suhuMQ;
var kelembabanMQ;
var client;
export default function Home() {
  const [suhu, setSuhu] = useState(0);
  const [food, setFood] = useState(null);
  const [memex, setMemex] = useState(null);
  const [waterLevel, setWaterLevel] = useState(null);
  const [tombol, setTombol] = useState(1);
  function startBroker() {
    const connectUrl = `${protocol}://${mqttHost}:${port}`;
    const options = {
      keepalive: 60,
      clientId: "client",
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    };
    client = mqtt.connect(connectUrl, options);
  }

  function startSubscribe(topic) {
    client.subscribe(topic, { qos: 0 });
  }

  function getMessage() {
    client.on("message", (topic, message) => {
      if (topic == "/API/suhu") {
        suhuMQ = message.toString();
      }
      if (topic == "/API/kelembaban") {
        kelembabanMQ = message.toString();
      }
      setSuhu(suhuMQ);
      setFood(kelembabanMQ);
    });
  }
  function handleTombol() {
    if (tombol == 0) {
      setTombol(1);
      client.publish("/testLampu", tombol.toString(), {
        qos: 0,
        retain: false,
      });
    } else {
      setTombol(0);
      client.publish("/testLampu", tombol.toString(), {
        qos: 0,
        retain: false,
      });
    }
  }
  useEffect(() => {
    startBroker();
    startSubscribe("/API/suhu");
    startSubscribe("/API/kelembaban");
    getMessage();
  }, []);
  console.log(tombol);
  // client.subscribe("/agus/API", { qos: 0 });

  // variable

  // client.on("message", (topic, message) => {
  //   if (topic == "/agus/API") {
  //     pesan = message.toString();
  //   }
  //   console.log(pesan);
  // const data = JSON.parse(message.toString());

  // setNtu(data?.ntu);
  // setFood(data?.food);
  // setWaterLevel(data?.waterLevel);
  // });

  return (
    <div className="font-Poppins">
      <Head>
        <title>Water Meter</title>
      </Head>
      <div className="fixed w-full px-2 py-4 bg-blue-500 shadow-xl">
        <h1 className="text-xl font-semibold text-center text-white">
          Water Meter
        </h1>
      </div>

      <div className="grid gap-2 px-4 pt-[72px] space-y-4 ">
        <div className="px-4 py-8 mt-4 space-y-5 border rounded-xl">
          <h5 className="text-xl font-semibold text-center">
            Aquarium Water
            <br />
            Turbidity
          </h5>
          <div className="grid justify-center gap-4">
            <div className="flex gap-4 justify-center">
              <div className="border-[10px] w-32 h-32 flex flex-col justify-center items-center rounded-full border-blue-300">
                <h5 className="text-3xl font-bold text-center">{suhu}</h5>
                <h6 className="text-sm text-center">NTU</h6>
              </div>
              <div className="border-[10px] w-32 h-32 flex flex-col justify-center items-center rounded-full border-blue-300">
                <h5 className="text-3xl font-bold text-center">{food}</h5>
                <h6 className="text-sm text-center">NTU</h6>
              </div>
            </div>
            {tombol == 0 ? (
              <button
                onClick={() => handleTombol()}
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
              >
                Nyala
              </button>
            ) : (
              <button
                onClick={() => handleTombol()}
                className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
              >
                Mati
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x">
          <div>
            <h6 className="text-xs text-center">
              Water
              <br />
              Condition
            </h6>
            {suhu > 19 ? (
              <h6 className="text-sm font-semibold text-center text-red-500">
                Dirty
              </h6>
            ) : (
              <h6 className="text-sm font-semibold text-center text-blue-500">
                Clean
              </h6>
            )}
          </div>

          <div>
            <h6 className="text-xs text-center">
              Food
              <br />
              Tank
            </h6>
            {food ? (
              <h6 className="text-sm font-semibold text-center text-green-500">
                Filled
              </h6>
            ) : (
              <h6 className="text-sm font-semibold text-center text-red-500">
                Empty
              </h6>
            )}
          </div>
          <div>
            <h6 className="text-xs text-center">
              Water
              <br />
              Level
            </h6>
            {waterLevel ? (
              <h6 className="text-sm font-semibold text-center text-green-500">
                Enough Water
              </h6>
            ) : (
              <h6 className="text-sm font-semibold text-center text-red-500">
                Low Water
              </h6>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
