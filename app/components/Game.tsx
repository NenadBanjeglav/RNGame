import {
  Alert,
  SafeAreaView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useState } from "react";
import { ballRadius, blockW, boardHeight } from "@/constants";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { BallData, BlockData } from "@/types";
import { Ball } from "./Ball";
import { GameContext } from "../GameContext";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Block from "./Block";
import { generateBlocksRow } from "../utils";

const Game = () => {
  const [score, setscore] = useState(0);
  const { width } = useWindowDimensions();

  const ball = useSharedValue<BallData>({
    x: width / 2,
    y: boardHeight - ballRadius,
    r: ballRadius,
    dx: -1,
    dy: -1,
  });

  const blocks = useSharedValue<BlockData[]>(
    Array(4)
      .fill(0)
      .flatMap((_, row) => generateBlocksRow(row + 1))
  );

  const isUserTurn = useSharedValue(true);

  const incrementScore = () => {
    setscore((s) => s + 1);
  };

  const onGameOver = () => {
    Alert.alert("Game Over", "Score: " + score, [
      {
        text: "Restart",
        onPress: () => {
          blocks.value = [];

          blocks.value = Array(3)
            .fill(0)
            .flatMap((_, row) => generateBlocksRow(row + 1));

          setscore(1);
        },
      },
    ]);
  };

  const onEndTurn = () => {
    "worklet";
    if (isUserTurn.value) {
      return;
    }
    isUserTurn.value = true;

    //check if game is over

    const gameOver = blocks.value.some(
      (block) => block.val > 0 && block.y + (block.w + 10) * 2 > boardHeight
    );

    if (gameOver) {
      console.log("game over");
      runOnJS(onGameOver)();
      return;
    }

    blocks.modify((blocks) => {
      blocks.forEach((block) => {
        block.y += blockW + 10;
      });

      blocks.push(...generateBlocksRow(1));

      return blocks;
    });

    runOnJS(incrementScore)();
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (!isUserTurn.value) {
        return;
      }

      const x = e.translationX;
      const y = e.translationY;

      const mag = Math.sqrt(x * x + y * y);

      ball.value = {
        ...ball.value,
        dx: -x / mag,
        dy: -y / mag,
      };
    })
    .onEnd(() => {
      if (ball.value.dy < 0) {
        isUserTurn.value = false;
      }
    });

  const pathStyle = useAnimatedStyle(() => {
    const { x, y, dx, dy } = ball.value;

    const angle = Math.atan2(-dx, dy);
    return {
      display: isUserTurn.value ? "flex" : "none",
      top: y,
      left: x,
      transform: [
        {
          rotate: `${angle}rad`,
        },
      ],
    };
  });

  return (
    <GameContext.Provider
      value={{
        ball,
        //@ts-ignore
        isUserTurn,
        onEndTurn,
        blocks,
      }}
    >
      <GestureDetector gesture={pan}>
        <SafeAreaView className="flex-1 bg-gray-800">
          <View className="items-center ">
            <Text className="text-7xl font-bold text-gray-50 mt-8">
              Score: {score}
            </Text>
          </View>
          <View
            className={`bg-gray-900 my-auto overflow-hidden w-auto relative`}
            style={{ position: "relative", height: boardHeight }}
          >
            {blocks.value.map((block, index) => (
              <Block key={index} index={index} />
            ))}

            <Ball />

            <Animated.View
              style={[
                {
                  width: 0,
                  height: 1000,
                  borderWidth: 1,
                  borderColor: "#ffffff99",
                  borderStyle: "dotted",
                  position: "absolute",
                  transformOrigin: "top-center",
                },
                pathStyle,
              ]}
            />
          </View>
        </SafeAreaView>
      </GestureDetector>
    </GameContext.Provider>
  );
};

export default Game;
