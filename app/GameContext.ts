import { BallData, BlockData } from "@/types";
import { createContext, useContext } from "react";
import { SharedValue } from "react-native-reanimated";

export const GameContext = createContext<{
  ball?: SharedValue<BallData>;
  isUserTurn?: SharedValue<Boolean>;
  onEndTurn: VoidFunction;
  blocks?: SharedValue<BlockData[]>;
}>({
  onEndTurn: () => {},
});

export const useGameContext = () => useContext(GameContext);
