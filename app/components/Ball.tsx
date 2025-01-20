import { ballSpeed, boardHeight } from "@/constants";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useFrameCallback,
} from "react-native-reanimated";

import { useWindowDimensions } from "react-native";
import { useGameContext } from "../GameContext";
import { getResetPositionAndDirection } from "../utils";

export function Ball() {
  const { ball, isUserTurn, onEndTurn, blocks } = useGameContext();
  const { width } = useWindowDimensions();

  const frameCallback = useFrameCallback((frameInfo) => {
    const delta = (frameInfo.timeSincePreviousFrame || 0) / 1000;
    let { x, y, r, dx, dy } = ball!.value;

    x = x + dx * ballSpeed * delta;
    y = y + dy * ballSpeed * delta;

    // touched top wall
    if (y < r) {
      dy *= -1;
      y = r;
    }
    // touched bottom wall
    if (y > boardHeight - r) {
      y = boardHeight - r;
      onEndTurn();
      // return;
    }
    // touched left wall
    if (x < r) {
      dx *= -1;
      x = r;
    }
    // touched right wall
    if (x > width - r) {
      dx *= -1;
      x = width - r;
    }

    ball!.value = { r, x, y, dx, dy };

    // check collision with blocks
    blocks!.modify((blocks) => {
      blocks
        .filter((block) => block.val > 0)
        .some((block) => {
          const newBallData = getResetPositionAndDirection(ball!.value, block);

          if (newBallData) {
            ball!.value = newBallData;
            block.val -= 1;
          }
        });

      return blocks;
    });
  }, false);

  const startFrameCallback = (val: boolean) => {
    frameCallback.setActive(val);
  };

  useAnimatedReaction(
    () => isUserTurn!.value,
    (val) => runOnJS(startFrameCallback)(!val)
  );

  const ballStyle = useAnimatedStyle(() => {
    const { x, y, r } = ball!.value;
    return {
      width: r * 2,
      aspectRatio: 1,
      borderRadius: r * 2,
      backgroundColor: "white",
      position: "absolute",
      top: y - r,
      left: x - r,
    };
  });

  return <Animated.View style={ballStyle} />;
}
