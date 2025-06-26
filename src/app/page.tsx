// 'use client';

// import { useState } from 'react';
// import styles from './page.module.css';

// export default function Home() {
//   type Board = number[][];
//   type Coordinate = { x: number; y: number };
//   const [board, setBoard] = useState<Board>([
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 1, 0, 1, 0, 1, 0, 1, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 1, 0, 1, 0, 1, 0, 1, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 1, 0, 1, 0, 1, 0, 1, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 1, 0, 1, 0, 1, 0, 1, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   ]);

//   const direction = [
//     [1, 0],
//     [-1, 0],
//     [0, 1],
//     [0, -1],
//   ];

//   const clickHandler = () => {
//     const newBoard = structuredClone(board);

//     const getRandomElement = <T,>(arr: T[]): T | undefined => {
//       if (arr.length === 0) {
//         return undefined;
//       }

//       const randomIndex = Math.floor(Math.random() * arr.length);
//       return arr[randomIndex];
//     };

//     const ones: Coordinate[] = [];
//     newBoard.forEach((row, y) => {
//       row.forEach((cell, x) => {
//         if (cell === 1) {
//           ones.push({ x, y });
//         }
//       });
//     });
//   };

//   ones.forEach(({ x, y }) =>{
//     const zerosAroundOne: Coordinate[] = [];
//       direction.forEach(([dx, dy]) => {
//         const newX = x + dx;
//         const newY = y + dy;

//         if (
//           newY >= 0 && newY < newBoard.length &&
//           newX >= 0 && newX < newBoard[newY].length &&
//           newBoard[newY][newX] === 0
//         ) {
//           zerosAroundOne.push({ x: newX, y: newY });
//         }
//   });

//   return (
//     <div className={styles.container}>
//       <button onClick={() => clickHandler}>迷路作成</button>
//       <div className={styles.board}>
//         {board.map((row, y) =>
//           row.map((color, x) => (
//             <div className={styles.cell} key={`${x}-${y}`}>
//               {color === 1 && <div className={styles.pillar} />}
//             </div>
//           )),
//         )}
//       </div>
//     </div>
//   );
// }
// }

'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  type Board = number[][];
  type Coordinate = { x: number; y: number };

  // 毎回使う初期ボードの定義を定数として外に出す
  const INITIAL_BOARD: Board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const [board, setBoard] = useState<Board>(INITIAL_BOARD); // 初期ボードをセット

  const DIRECTIONS: [number, number][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const getRandomElement = <T,>(arr: T[]): T | undefined => {
    if (arr.length === 0) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  const clickHandler = () => {
    // まず、常にINITIAL_BOARDのコピーから始める
    const newBoard = structuredClone(INITIAL_BOARD);

    // 以降のロジックは前回と同じ
    const ones: Coordinate[] = [];
    newBoard.forEach((row, y) => {
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

        if (
          newY >= 0 &&
          newY < newBoard.length &&
          newX >= 0 &&
          newX < newBoard[newY].length &&
          newBoard[newY][newX] === 0
        ) {
          zerosAroundOne.push({ x: newX, y: newY });
        }
      });

      const targetZero = getRandomElement(zerosAroundOne);
      if (targetZero) {
        newBoard[targetZero.y][targetZero.x] = 1;
      }
    });

    // 変更が加えられた新しいボードでReactのステートを更新する
    setBoard(newBoard);
  };

  return (
    <div className={styles.container}>
      <button onClick={clickHandler}>迷路作成</button>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`}>
              {color === 1 && <div className={styles.pillar} />}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
