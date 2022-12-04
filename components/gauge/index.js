import React from "react";
import { View, Text } from "react-native";
import CircularProgress from "../circularProgress";

export default function Gause({ name, min, max, cur, isC }) {
  const unit = isC ? "°C" : "%";
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 30,
        width: 360,
        height: 360,
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
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "600",
          color: "#3d3d3d",
          textAlign: "left",
          marginBottom: 30,
        }}
      >
        {name}
      </Text>
      <CircularProgress
        progressPercent={parseInt(((cur - min) / (max - min)) * 100)}
        size={200}
        strokeWidth={20}
        text={`${cur}${unit}`}
        textSize={30}
        pgColor={"#81ecec"}
        bgColor={"#b2bec3"}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "600",
            color: "#3d3d3d",
            marginBottom: 30,
          }}
        >
          Min: {`${min}${unit}`}
        </Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "600",
            color: "#3d3d3d",
            marginBottom: 30,
          }}
        >
          Max:{`${max}${unit}`}
        </Text>
      </View>
    </View>
  );
}
