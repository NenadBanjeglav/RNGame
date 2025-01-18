import { Button, SafeAreaView, View } from "react-native";
import React from "react";

import { boardHeight } from "@/constants";
import Animated, { useSharedValue } from "react-native-reanimated";

const Game = () => {
  const x = useSharedValue(0);
  const moveBall = () => {
    //move
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-800">
      <View
        className={`bg-gray-900 my-auto overflow-hidden w-auto relative`}
        style={{ position: "relative", height: boardHeight }}
      >
        <Animated.View
          className="w-14 h-14 bg-white rounded-full"
          style={{ position: "absolute", left: x, top: boardHeight / 2 }}
        />
      </View>

      <Button title="Move" onPress={moveBall} />
    </SafeAreaView>
  );
};

export default Game;
