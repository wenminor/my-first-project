import { getBridge, updateText } from '../../bridge';
import { TextContainerProperty } from '@evenrealities/even_hub_sdk';
import { CONTAINER_IDS, COLORS, gameState, i18n } from '../constants';
import { showHomePage } from './home';

const SUDOKU_PUZZLE = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 0],
];

export const initGame = () => {
  gameState.initialBoard = JSON.parse(JSON.stringify(SUDOKU_PUZZLE));
  gameState.currentBoard = JSON.parse(JSON.stringify(SUDOKU_PUZZLE));
  gameState.activePanel = 'keypad';
  gameState.selectedNumber = 1;

  gameState.emptyCells = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (gameState.initialBoard[row][col] === 0) {
        gameState.emptyCells.push({ row, col });
      }
    }
  }
  gameState.emptyCellIndex = 0;
  gameState.selectedCell = gameState.emptyCells[0];
};

// 胜利完整校验
export const checkGameWin = (): boolean => {
  const board = gameState.currentBoard;

  // 全部填满
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) return false;
    }
  }

  // 每行不重复
  for (let row = 0; row < 9; row++) {
    const set = new Set<number>();
    for (let col = 0; col < 9; col++) {
      const val = board[row][col];
      if (set.has(val)) return false;
      set.add(val);
    }
  }

  // 每列不重复
  for (let col = 0; col < 9; col++) {
    const set = new Set<number>();
    for (let row = 0; row < 9; row++) {
      const val = board[row][col];
      if (set.has(val)) return false;
      set.add(val);
    }
  }

  // 每个3*3宫格不重复
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const set = new Set<number>();
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const val = board[br * 3 + r][bc * 3 + c];
          if (set.has(val)) return false;
          set.add(val);
        }
      }
    }
  }

  return true;
};

// 棋盘渲染 选中符号常驻
const generateBoardText = (): string => {
  let text = '';
  for (let row = 0; row < 9; row++) {
    let rowText = '';
    for (let col = 0; col < 9; col++) {
      const val = gameState.currentBoard[row][col];
      const isSelected = row === gameState.selectedCell.row && col === gameState.selectedCell.col;

      if (val === 0) {
        rowText += isSelected ? ' > ' : '   ';
      } else {
        rowText += isSelected ? `>${val} ` : ` ${val} `;
      }

      if ((col + 1) % 3 === 0 && col < 8) rowText += '||';
      else if (col < 8) rowText += '|';
    }
    text += rowText + '\n';
  }
  return text.trim();
};

// 右侧键盘渲染
const generateKeypadText = (): string => {
  const t = i18n[gameState.currentLanguage].game;
  let text = '';

  text += gameState.selectedNumber === 1 ? '>1  ' : ' 1  ';
  text += gameState.selectedNumber === 2 ? '>2  ' : ' 2  ';
  text += gameState.selectedNumber === 3 ? '>3\n' : ' 3\n';

  text += gameState.selectedNumber === 4 ? '>4  ' : ' 4  ';
  text += gameState.selectedNumber === 5 ? '>5  ' : ' 5  ';
  text += gameState.selectedNumber === 6 ? '>6\n' : ' 6\n';

  text += gameState.selectedNumber === 7 ? '>7  ' : ' 7  ';
  text += gameState.selectedNumber === 8 ? '>8  ' : ' 8  ';
  text += gameState.selectedNumber === 9 ? '>9\n' : ' 9\n';

  text += gameState.selectedNumber === 12 ? '>删除\n' : '  删除\n';
  text += gameState.selectedNumber === 10 ? `> ${t.restart}\n` : `  ${t.restart}\n`;
  text += gameState.selectedNumber === 11 ? `> ${t.exit}` : `  ${t.exit}`;

  return text;
};

export const showGamePage = async () => {
  initGame();
  gameState.currentPage = 'game';
  const bridge = getBridge();

  const boardContainer: TextContainerProperty = {
    xPosition: 20,
    yPosition: 10,
    width: 330,
    height: 270,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    paddingLength: 5,
    containerID: CONTAINER_IDS.GAME_BOARD,
    containerName: 'gameBoard',
    content: generateBoardText(),
    isEventCapture: 0,
  };

  const keypadContainer: TextContainerProperty = {
    xPosition: 360,
    yPosition: 20,
    width: 180,
    height: 248,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingLength: 20,
    containerID: CONTAINER_IDS.GAME_KEYPAD,
    containerName: 'gameKeypad',
    content: generateKeypadText(),
    isEventCapture: 1,
  };

  await bridge.rebuildPageContainer({
    containerTotalNum: 2,
    textObject: [boardContainer, keypadContainer],
  });
};

export const updateBoard = async () => {
  await updateText(CONTAINER_IDS.GAME_BOARD, 'gameBoard', generateBoardText());
};

export const updateKeypad = async () => {
  await updateText(CONTAINER_IDS.GAME_KEYPAD, 'gameKeypad', generateKeypadText());
};

// 通用弹窗底层
const showCenteredDialog = async (title: string) => {
  const bridge = getBridge();
  const dialog = {
    xPosition: 0, yPosition: 0, width: 576, height: 288,
    borderWidth: 0, borderColor: 0, paddingLength: 100,
    containerID: CONTAINER_IDS.DIALOG_OVERLAY, containerName: 'dialogOverlay',
    content: title,
    isEventCapture: 1,
  };
  await bridge.rebuildPageContainer({
    containerTotalNum: 3,
    textObject: [
      { containerID: CONTAINER_IDS.GAME_BOARD, containerName: 'gameBoard' },
      { containerID: CONTAINER_IDS.GAME_KEYPAD, containerName: 'gameKeypad' },
      dialog,
    ],
  });
};

export const showRestartDialog = async () => {
  gameState.currentPage = 'restartDialog';
  gameState.dialogIndex = 0;
  await showCenteredDialog(i18n[gameState.currentLanguage].dialog.restart);
};

export const showExitDialog = async () => {
  gameState.currentPage = 'exitDialog';
  gameState.dialogIndex = 0;
  await showCenteredDialog(i18n[gameState.currentLanguage].dialog.exit);
};

// 胜利弹窗：无按钮、2秒自动关闭、预留图片动画位置
export const showWinDialog = async () => {
  gameState.currentPage = 'winDialog';
  const t = i18n[gameState.currentLanguage].dialog;
  
  await showCenteredDialog(`🎉 ${t.win}`);

  // 2秒自动消失 返回游戏
  setTimeout(async () => {
    await closeDialog();
  }, 2000);
};

// ✅ 关键修复：确保 closeDialog 被导出
export const closeDialog = async () => {
  gameState.currentPage = 'game';
  await showGamePage();
};