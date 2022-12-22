import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import init from "react_native_mqtt";
import { AsyncStorage } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Surface, Stack, Switch, Icon } from "@react-native-material/core";
import { IconComponentProvider } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Card from "./components/card";
import Gause from "./components/gauge";

const FEED_IDS = [
  "LAB_IOT/f/door",
  "LAB_IOT/f/fan",
  "LAB_IOT/f/led",
  "LAB_IOT/f/temp",
  "LAB_IOT/f/humi",
];
init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [temp, setTemp] = useState(0);
  const [fan, setFan] = useState(false);
  const [led, setLed] = useState(false);
  const [humi, setHumi] = useState(0);
  const [door, setDoor] = useState(false);
  const [client, setClient] = useState();
  const [time, setTime] = useState({
    door: "",
    fan: "",
    leb: "",
  });
  useEffect(() => {
    const client = new Paho.MQTT.Client(
      "io.adafruit.com/LAB_IOT",
      1883,
      Math.random(12312313131).toString()
    );
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
      }
    }
    function onMessageArrived(message) {
      console.log("onMessageArrived:" + message.payloadString);
    }

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
      onSuccess: () => {
        setIsConnected(true);
        setClient(client);
        FEED_IDS.forEach((id) => {
          client.subscribe(id);
        });
        client.onMessageArrived = (message) => {
          if (message.destinationName == "LAB_IOT/f/door")
            setDoor(message.payloadString == "5" ? true : false);
          if (message.destinationName == "LAB_IOT/f/fan")
            setFan(message.payloadString == "3" ? true : false);
          if (message.destinationName == "LAB_IOT/f/temp")
            setTemp(message.payloadString);
          if (message.destinationName == "LAB_IOT/f/humi")
            setHumi(message.payloadString);
          if (message.destinationName == "LAB_IOT/f/led")
            setLed(message.payloadString == "1" ? true : false);
        };
      },
      onFailure: (e) => {
        setIsConnected(false);
        setClient(null);
      },
      useSSL: true,
      userName: "LAB_IOT",
      password: "aio_IafX74QMkin1DvorWDyPaE6hEs9y",
    });

    return () => {
      client?.disconnect();
    };
  }, []);
  const publish = (idx) => {
    return (e) => {
      const payloadString =
        idx == 0
          ? e
            ? "5"
            : "4"
          : idx == 1
          ? e
            ? "3"
            : "2"
          : idx == 2
          ? e
            ? "1"
            : "0"
          : "";
      const message = new Paho.MQTT.Message(payloadString);
      message.destinationName = FEED_IDS[idx];
      if (isConnected) {
        client.send(message);
      }
    };
  };
  useEffect(() => {
    setTime({
      ...time,
      door: `${new Date().getHours().toString().padStart(2, "0")}:${new Date()
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
    });
  }, [door]);
  useEffect(() => {
    setTime({
      ...time,
      fan: `${new Date().getHours().toString().padStart(2, "0")}:${new Date()
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
    });
  }, [fan]);
  useEffect(() => {
    setTime({
      ...time,
      led: `${new Date().getHours().toString().padStart(2, "0")}:${new Date()
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
    });
  }, [led]);
  return (
    <IconComponentProvider IconComponent={MaterialCommunityIcons}>
      <ScrollView>
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              marginBottom: 6,
            }}
          >
            DASHBOARD
          </Text>
          <Text
            style={{
              marginBottom: 20,
            }}
          >
            Trạng thái kết nối với hệ thống:{" "}
            <Text
              style={
                isConnected
                  ? {
                      color: "#00cec9",
                    }
                  : {
                      color: "#d63031",
                    }
              }
            >
              {isConnected ? "Thành công" : "Thất bại"}
            </Text>
          </Text>
          <Stack spacing={30}>
            <Card
              name="Cửa nhà"
              time={time.door}
              setValue={() => setDoor(!door)}
              value={door}
              openIcon="door-closed"
              closeIcon="door-open"
              publishMessage={publish(0)}
              disabled={isConnected}
            />
            <Card
              name="Quạt trần"
              time={time.fan}
              setValue={setFan}
              value={fan}
              openIcon="fan"
              closeIcon="fan-off"
              publishMessage={publish(1)}
              disabled={isConnected}
            />
            <Card
              name="Đèn trần"
              time={time.led}
              setValue={setLed}
              value={led}
              openIcon="ceiling-light"
              closeIcon="ceiling-light-outline"
              publishMessage={publish(2)}
              disabled={isConnected}
            />
            <Gause
              cur={parseInt(temp)}
              min={0}
              max={60}
              isC
              name={"Nhiệt độ trong nhà"}
            />
            <Gause
              cur={parseInt(humi)}
              min={0}
              max={100}
              name={"Độ ẩm trong nhà"}
            />
          </Stack>
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </IconComponentProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "start",
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 2,
    color: "#3d3d3d",
  },
  time: {
    color: "#aaaaaa",
  },
});
