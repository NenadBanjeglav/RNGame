import React, { useState } from "react";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useGameContext } from "../GameContext";
import { Text } from "react-native";

const Block = ({ index }: { index: number }) => {
  const { blocks } = useGameContext();
  const [value, setvalue] = useState(blocks?.value[index].val || 0);

  useAnimatedReaction(
    () => blocks?.value[index]?.val,
    (val) => {
      if (val !== undefined) {
        runOnJS(setvalue)(val);
      }
    }
  );

  const styles = useAnimatedStyle(() => {
    const block = blocks!.value[index];
    if (!block || block.val <= 0) {
      return {
        display: "none",
      };
    }

    const { w, x, y, val } = block;

    return {
      display: "flex",
      width: w,
      height: w,
      position: "absolute",
      top: withTiming(y),
      left: x,
      backgroundColor: "#F5B52F",
      alignItems: "center",
      justifyContent: "center",
    };
  });

  return (
    <Animated.View style={styles}>
      <Text className="font-bold color-white">{value}</Text>
    </Animated.View>
  );
};

export default Block;
