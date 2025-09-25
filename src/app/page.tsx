'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  // 型定義
  type Board = number[][];
  type Coordinate = { x: number; y: number };
  type Direction = 0 | 1 | 2 | 3; // 0:右, 1:左, 2:下, 3:上 に対応

  // ボードの初期定義
  // 0:道, 1:壁(初期配置される内壁), 2:スタート, 3:ゴール, 4:外壁
  const INITIAL_BOARD: Board = [
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 1, 0, 1, 0, 1, 0, 1, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 1, 0, 1, 0, 1, 0, 1, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 1, 0, 1, 0, 1, 0, 1, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 1, 0, 1, 0, 1, 0, 1, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  ];

  // ステートの定義
  const [currentMaze, setCurrentMaze] = useState<Board>(INITIAL_BOARD); // 現在表示される迷路
  const [playerPosition, setPlayerPosition] = useState<Coordinate>({ x: 1, y: 1 }); // キャラクターの現在位置 (初期位置は (1,1) )
  const [playerDirection, setPlayerDirection] = useState<Direction>(0); // キャラクターの現在の向き (初期は右を向いていると仮定: DIRECTIONS[0])

  // 方向の定義: [dx, dy]
  // 0:右, 1:左, 2:下, 3:上
  const DIRECTIONS: [number, number][] = [
    [1, 0], // 右
    [-1, 0], // 左
    [0, 1], // 下
    [0, -1], // 上
  ];

  // 配列からランダムな要素を取得する汎用関数
  const getRandomElement = <T,>(arr: T[]): T | undefined => {
    if (arr.length === 0) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  // 現在の向きから相対的な方向（左、前、右、後ろ）のDIRECTIONSインデックスを取得する関数
  const getRelativeDirection = (currentDirection: Direction, relativeOffset: number): Direction => {
    // DIRECTIONS配列のインデックスを、一般的な思考（上、右、下、左）にマッピング
    const mappedDirections: Direction[] = [3, 0, 2, 1]; // 0:上, 1:右, 2:下, 3:左

    const currentIndex = mappedDirections.indexOf(currentDirection);
    // 新しいインデックスを計算。+4 は負のインデックスを防ぐため
    const newIndex = (currentIndex + relativeOffset + 4) % 4;
    return mappedDirections[newIndex];
  };

  // 迷路をランダムに作成するハンドラー
  const createMazeHandler = () => {
    // INITIAL_BOARDのコピーから開始
    const newGeneratedBoard = structuredClone(INITIAL_BOARD);

    // 既存の壁（1）を探し、その周囲にランダムに新しい壁（1）を生成するロジック
    const ones: Coordinate[] = [];
    newGeneratedBoard.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          ones.push({ x, y });
        }
      });
    });

    ones.forEach(({ x, y }) => {
      const zerosAroundOne: Coordinate[] = [];
      DIRECTIONS.forEach(([dx, dy]) => {
        const newX = x + dx;
        const newY = y + dy;

        // 新しい座標がボードの範囲内であり、かつ道(0)である場合のみ候補に入れる
        // スタート(2)とゴール(3)のセルは上書きしない
        if (
          newY >= 0 &&
          newY < newGeneratedBoard.length &&
          newX >= 0 &&
          newX < newGeneratedBoard[newY].length &&
          newGeneratedBoard[newY][newX] === 0
        ) {
          zerosAroundOne.push({ x: newX, y: newY });
        }
      });

      const targetZero = getRandomElement(zerosAroundOne);
      if (targetZero) {
        newGeneratedBoard[targetZero.y][targetZero.x] = 1; // 周囲の道に壁(1)を生成
      }
    });

    setCurrentMaze(newGeneratedBoard); // 生成された新しい迷路をステートにセット
    setPlayerPosition({ x: 1, y: 1 }); // キャラクターを初期位置に戻す
    setPlayerDirection(0); // キャラクターの向きも初期に戻す
  };

  // キャラクターを左手法で移動させるハンドラー
  const movePlayerHandler = () => {
    const currentX = playerPosition.x;
    const currentY = playerPosition.y;
    let nextX = currentX;
    let nextY = currentY;
    let nextDirection: Direction = playerDirection; // 次の向き

    // ゴールに到達していれば何もしない
    if (currentX === 9 && currentY === 9) {
      // ゴール地点の座標 (x:9, y:9)
      alert('ゴール！おめでとう！');
      return;
    }

    // 左手法の優先順位: 左 → 前 → 右 → 後ろ

    // 1. 左手方向を試す
    const leftDirIdx = getRelativeDirection(playerDirection, -1);
    const [ldx, ldy] = DIRECTIONS[leftDirIdx];
    const leftX = currentX + ldx;
    const leftY = currentY + ldy;

    // 移動先がボードの範囲内で、かつ道 (0) であるかチェック
    if (
      leftY >= 0 &&
      leftY < currentMaze.length &&
      leftX >= 0 &&
      leftX < currentMaze[leftY].length &&
      currentMaze[leftY][leftX] === 0
    ) {
      // 左手が道なら、左に曲がって前に進む
      nextX = leftX;
      nextY = leftY;
      nextDirection = leftDirIdx; // 向きも左手方向に変える
    }
    // 2. 左手が壁なら、前方向を試す
    else {
      const forwardDirIdx = getRelativeDirection(playerDirection, 0);
      const [fdx, fdy] = DIRECTIONS[forwardDirIdx];
      const forwardX = currentX + fdx;
      const forwardY = currentY + fdy;

      if (
        forwardY >= 0 &&
        forwardY < currentMaze.length &&
        forwardX >= 0 &&
        forwardX < currentMaze[forwardY].length &&
        currentMaze[forwardY][forwardX] === 0
      ) {
        // 前が道なら、そのまま前に進む
        nextX = forwardX;
        nextY = forwardY;
        // nextDirection は playerDirection のまま (向きは変わらない)
      }
      // 3. 前も壁なら、右方向を試す
      else {
        const rightDirIdx = getRelativeDirection(playerDirection, 1);
        const [rdx, rdy] = DIRECTIONS[rightDirIdx];
        const rightX = currentX + rdx;
        const rightY = currentY + rdy;

        if (
          rightY >= 0 &&
          rightY < currentMaze.length &&
          rightX >= 0 &&
          rightX < currentMaze[rightY].length &&
          currentMaze[rightY][rightX] === 0
        ) {
          // 右手が道なら、右に曲がって前に進む
          nextX = rightX;
          nextY = rightY;
          nextDirection = rightDirIdx; // 向きも右手方向に変える
        }
        // 4. 全方向が壁なら、後ろ方向（Uターン）
        else {
          const backDirIdx = getRelativeDirection(playerDirection, 2);
          const [bdx, bdy] = DIRECTIONS[backDirIdx];
          const backX = currentX + bdx;
          const backY = currentY + bdy;

          // Uターンなので、移動できるはずだが、念のため範囲チェック
          if (
            backY >= 0 &&
            backY < currentMaze.length &&
            backX >= 0 &&
            backX < currentMaze[backY].length
          ) {
            nextX = backX;
            nextY = backY;
            nextDirection = backDirIdx; // 向きも後ろ方向に変える
          }
        }
      }
    }

    // 新しい位置と向きをステートにセット
    setPlayerPosition({ x: nextX, y: nextY });
    setPlayerDirection(nextDirection);
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <button onClick={createMazeHandler}>迷路を作成</button>
        <button onClick={movePlayerHandler}>左手法で進む</button>
      </div>
      <div className={styles.board}>
        {currentMaze.map(
          (
            row,
            y, // currentMaze をレンダリング
          ) =>
            row.map((cellValue, x) => (
              <div className={styles.cell} key={`${x}-${y}`}>
                {cellValue === 1 && <div className={styles.pillar} />} {/* 内壁 */}
                {cellValue === 3 && <div className={styles.goalCell} />} {/* ゴール */}
                {cellValue === 4 && <div className={styles.wall} />} {/* 外壁 */}
                {/* playerPosition が現在のセルと一致する場合にキャラクターを表示 */}
                {playerPosition.x === x && playerPosition.y === y && (
                  <div className={styles.character} />
                )}
              </div>
            )),
        )}
      </div>
    </div>
  );
}
