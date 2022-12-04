import React from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import { Icon } from "@react-native-material/core";

export default function Card({
  name,
  time,
  value,
  setValue,
  openIcon,
  closeIcon,
  publishMessage,
}) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.heading}>{name}</Text>
        <Text style={styles.time}>Thay đổi mới nhất: {time}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon
          name={value ? openIcon : closeIcon}
          size={36}
          color={value ? "#34495e" : "#b2bec3"}
          style={{
            marginRight: 26,
          }}
        ></Icon>
        <Switch
          value={value}
          trackColor={{ false: "#767577", true: "#81ecec" }}
          thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#b2bec3"
          onValueChange={publishMessage}
          onChange={setValue}
        ></Switch>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    width: 360,
    height: 120,
    borderRadius: 20,
    backgroundColor: "#ecf0f1",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderRadius: 10,
    marginBottom: 30,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    color: "#3d3d3d",
  },
  time: {
    color: "#34495e",
    fontStyle: "italic",
  },
});
