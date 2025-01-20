import { BallData, BlockData } from "@/types";
import { blocksPerRow, blockW } from "@/constants";

export const generateBlocksRow = (row: number) => {
  "worklet";
  const blocks: BlockData[] = [];

  for (let col = 0; col < blocksPerRow; col++) {
    const shouldAdd = Math.random() < 0.5;

    if (shouldAdd) {
      const val = Math.ceil(Math.random() * 3);
      blocks.push({
        x: col * (blockW + 10) + 5,
        y: row * (blockW + 10) + 5,
        w: blockW,
        val: val,
      });
    }
  }

  return blocks;
};

// Function to check if the ball is colliding with the block
export const checkCollision = (ball: BallData, block: BlockData): boolean => {
  "worklet";
  // Calculate block boundaries
  const blockRight = block.x + block.w;
  const blockBottom = block.y + block.w;

  // Find the closest point to the ball within the block
  const closestX = Math.max(block.x, Math.min(ball.x, blockRight));
  const closestY = Math.max(block.y, Math.min(ball.y, blockBottom));

  // Calculate the distance from the ball's center to the closest point
  const distanceX = ball.x - closestX;
  const distanceY = ball.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // Return true if the distance is less than the ball's radius
  return distanceSquared < ball.r * ball.r;
};

export const getResetPositionAndDirection = (
  ball: BallData,
  block: BlockData
): BallData | null => {
  "worklet";
  // Only calculate if there's a collision
  if (!checkCollision(ball, block)) return null;

  // Calculate block boundaries
  const blockRight = block.x + block.w;
  const blockBottom = block.y + block.w;

  let newDx = ball.dx;
  let newDy = ball.dy;
  const r = ball.r;

  // Determine the side of collision and reset the ball's position and direction
  if (Math.abs(ball.y - block.y) < ball.r && ball.dy > 0) {
    // Top side collision
    newDy = -ball.dy; // Reverse vertical direction
    return { x: ball.x, y: block.y - ball.r, dx: newDx, dy: newDy, r };
  } else if (Math.abs(ball.y - blockBottom) < ball.r && ball.dy < 0) {
    // Bottom side collision
    newDy = -ball.dy; // Reverse vertical direction
    return { x: ball.x, y: blockBottom + ball.r, dx: newDx, dy: newDy, r };
  } else if (Math.abs(ball.x - block.x) < ball.r && ball.dx > 0) {
    // Left side collision
    newDx = -ball.dx; // Reverse horizontal direction
    return { x: block.x - ball.r, y: ball.y, dx: newDx, dy: newDy, r };
  } else if (Math.abs(ball.x - blockRight) < ball.r && ball.dx < 0) {
    // Right side collision
    newDx = -ball.dx; // Reverse horizontal direction
    return { x: blockRight + ball.r, y: ball.y, dx: newDx, dy: newDy, r };
  }

  // In case of a collision but no clear side is detected
  return null;
};
