import { getBridge, updateText } from '../bridge';
import { EVENT, CONTAINER_IDS, gameState, Language, i18n } from './constants';
import { 
  showHomePage, 
  updateHomeMenu, 
  showGameInstructionsPage, 
  showOperationInstructionsPage, 
  showLanguageSelectPage, 
  updatePageScroll, 
  switchLanguage,
  getGameInstructionsContent,
  getOperationInstructionsContent,
  getLanguageContent
} from './pages/home';
import { 
  showGamePage, 
  updateBoard, 
  updateKeypad, 
  showRestartDialog, 
  showExitDialog, 
  initGame, 
  closeDialog,
  checkGameWin,
  showWinDialog
} from './pages/game';

export const setupGlobalEvents = () => {
  const bridge = getBridge();
  
  bridge.onEvenHubEvent(async (event) => {
    const textEvent = event.textEvent;
    const sysEvent = event.sysEvent;
    
    let eventType: number | undefined;
    if (textEvent?.eventType !== undefined) {
      eventType = textEvent.eventType;
    } else if (sysEvent?.eventType !== undefined) {
      eventType = sysEvent.eventType;
    }
    
    switch (gameState.currentPage) {
      case 'home':
        await handleHomeEvents(eventType);
        break;
      case 'homeExitDialog':
        await handleHomeExitDialogEvents(eventType);
        break;
      case 'gameInstructions':
        await handleGameInstructionsEvents(eventType);
        break;
      case 'operationInstructions':
        await handleOperationInstructionsEvents(eventType);
        break;
      case 'languageSelect':
        await handleLanguageSelectEvents(eventType);
        break;
      case 'game':
        await handleGameEvents(eventType);
        break;
      case 'restartDialog':
        await handleRestartDialogEvents(eventType);
        break;
      case 'exitDialog':
        await handleExitDialogEvents(eventType);
        break;
      case 'winDialog':
        await handleWinDialogEvents(eventType);
        break;
    }
  });
};

// 首页事件
const handleHomeEvents = async (eventType: number | undefined) => {
  if (eventType === EVENT.CLICK || eventType === undefined) {
    switch (gameState.homeMenuIndex) {
      case 0:
        await showGamePage();
        break;
      case 1:
        await showGameInstructionsPage();
        break;
      case 2:
        await showOperationInstructionsPage();
        break;
      case 3:
        await showLanguageSelectPage();
        break;
    }
    return;
  }

  if (eventType === EVENT.DOUBLE_CLICK) {
    gameState.currentPage = 'homeExitDialog';
    gameState.dialogIndex = 0;
    const t = i18n[gameState.currentLanguage].dialog;
    const content = `
  ${t.exit}
  
> ${t.no}
  ${t.yes}
    `.trim();
    await updateText(CONTAINER_IDS.HOME_MENU, 'homeMenu', content);
    return;
  }

  if (eventType === EVENT.SCROLL_TOP) {
    gameState.homeMenuIndex = Math.max(0, gameState.homeMenuIndex - 1);
    await updateHomeMenu();
    return;
  }

  if (eventType === EVENT.SCROLL_BOTTOM) {
    gameState.homeMenuIndex = Math.min(3, gameState.homeMenuIndex + 1);
    await updateHomeMenu();
    return;
  }
};

// 首页退出弹窗
const handleHomeExitDialogEvents = async (eventType: number | undefined) => {
  if (eventType === EVENT.SCROLL_TOP || eventType === EVENT.SCROLL_BOTTOM) {
    gameState.dialogIndex = gameState.dialogIndex === 0 ? 1 : 0;
    const t = i18n[gameState.currentLanguage].dialog;
    const content = `
  ${t.exit}
  
${gameState.dialogIndex === 0 ? '> ' + t.no : '  ' + t.no}
${gameState.dialogIndex === 1 ? '> ' + t.yes : '  ' + t.yes}
    `.trim();
    await updateText(CONTAINER_IDS.HOME_MENU, 'homeMenu', content);
    return;
  }

  if (eventType === EVENT.CLICK || eventType === undefined) {
    if (gameState.dialogIndex === 1) {
      const bridge = getBridge();
      await bridge.shutDownPageContainer(0);
    } else {
      gameState.currentPage = 'home';
      await updateHomeMenu();
    }
    return;
  }
};

// 游戏说明
const handleGameInstructionsEvents = async (eventType: number | undefined) => {
  if (eventType === EVENT.CLICK || eventType === undefined) {
    const content = getGameInstructionsContent();
    if (gameState.scrollIndex === content.length - 1) {
      await showHomePage();
    }
    return;
  }
  if (eventType === EVENT.DOUBLE_CLICK) {
    await showHomePage();
    return;
  }
  if (eventType === EVENT.SCROLL_TOP || eventType === EVENT.SCROLL_BOTTOM) {
    const content = getGameInstructionsContent();
    const direction = eventType === EVENT.SCROLL_TOP ? -1 : 1;
    gameState.scrollIndex = Math.max(0, Math.min(content.length - 1, gameState.scrollIndex + direction));
    await updatePageScroll(getGameInstructionsContent);
    return;
  }
};

// 操作说明
const handleOperationInstructionsEvents = async (eventType: number | undefined) => {
  if (eventType === EVENT.CLICK || eventType === undefined) {
    const content = getOperationInstructionsContent();
    if (gameState.scrollIndex === content.length - 1) {
      await showHomePage();
    }
    return;
  }
  if (eventType === EVENT.DOUBLE_CLICK) {
    await showHomePage();
    return;
  }
  if (eventType === EVENT.SCROLL_TOP || eventType === EVENT.SCROLL_BOTTOM) {
    const content = getOperationInstructionsContent();
    const direction = eventType === EVENT.SCROLL_TOP ? -1 : 1;
    gameState.scrollIndex = Math.max(0, Math.min(content.length - 1, gameState.scrollIndex + direction));
    await updatePageScroll(getOperationInstructionsContent);
    return;
  }
};

// 语言选择
const handleLanguageSelectEvents = async (eventType: number | undefined) => {
  if (eventType === EVENT.CLICK || eventType === undefined) {
    switch (gameState.scrollIndex) {
      case 2:
        await switchLanguage(Language.ZH);
        break;
      case 3:
        await switchLanguage(Language.EN);
        break;
      case 4:
        await switchLanguage(Language.JA);
        break;
      case 6:
        await showHomePage();
        break;
    }
    return;
  }
  if (eventType === EVENT.DOUBLE_CLICK) {
    await showHomePage();
    return;
  }
  if (eventType === EVENT.SCROLL_TOP || eventType === EVENT.SCROLL_BOTTOM) {
    const content = getLanguageContent();
    const direction = eventType === EVENT.SCROLL_TOP ? -1 : 1;
    let newIndex = gameState.scrollIndex + direction;
    if (newIndex < 2) newIndex = 6;
    if (newIndex > 6) newIndex = 2;
    if (newIndex === 5) newIndex = direction === 1 ? 6 : 4;
    gameState.scrollIndex = newIndex;
    await updatePageScroll(getLanguageContent);
    return;
  }
};

// 游戏主事件
const handleGameEvents = async (eventType: number | undefined) => {
  if (eventType === EVENT.DOUBLE_CLICK) {
    gameState.activePanel = gameState.activePanel === 'board' ? 'keypad' : 'board';
    await updateBoard();
    return;
  }

  if (eventType === EVENT.CLICK || eventType === undefined) {
    if (gameState.activePanel === 'keypad') {
      if (gameState.selectedNumber <= 9) {
        const { row, col } = gameState.selectedCell;
        gameState.currentBoard[row][col] = gameState.selectedNumber;
        await updateBoard();

        // 填完自动检测胜利
        if (checkGameWin()) {
          await showWinDialog();
          return;
        }
      }
      // 删除
      else if (gameState.selectedNumber === 12) {
        const { row, col } = gameState.selectedCell;
        if (gameState.initialBoard[row][col] === 0) {
          gameState.currentBoard[row][col] = 0;
          await updateBoard();
        }
      }
      // 重启
      else if (gameState.selectedNumber === 10) {
        await showRestartDialog();
      }
      // 退出
      else if (gameState.selectedNumber === 11) {
        await showExitDialog();
      }
    } else {
      if (gameState.selectedNumber <= 9) {
        const { row, col } = gameState.selectedCell;
        gameState.currentBoard[row][col] = gameState.selectedNumber;
        await updateBoard();

        if (checkGameWin()) {
          await showWinDialog();
          return;
        }
      }
    }
    return;
  }

  if (eventType === EVENT.SCROLL_TOP || eventType === EVENT.SCROLL_BOTTOM) {
    const direction = eventType === EVENT.SCROLL_TOP ? -1 : 1;

    if (gameState.activePanel === 'keypad') {
      // 固定顺序 1~9→删除→重启→退出 不跳过
      const KEYPAD_ORDER = [1,2,3,4,5,6,7,8,9,12,10,11];
      const currentIndex = KEYPAD_ORDER.indexOf(gameState.selectedNumber);
      let newIndex = currentIndex + direction;
      if (newIndex < 0) newIndex = KEYPAD_ORDER.length - 1;
      if (newIndex >= KEYPAD_ORDER.length) newIndex = 0;
      gameState.selectedNumber = KEYPAD_ORDER[newIndex];
      await updateKeypad();
    } else {
      gameState.emptyCellIndex += direction;
      if (gameState.emptyCellIndex < 0) gameState.emptyCellIndex = gameState.emptyCells.length - 1;
      if (gameState.emptyCellIndex >= gameState.emptyCells.length) gameState.emptyCellIndex = 0;
      gameState.selectedCell = gameState.emptyCells[gameState.emptyCellIndex];
      await updateBoard();
    }
    return;
  }
};

// 重新开始弹窗
const handleRestartDialogEvents = async (eventType: number | undefined) => {
  if (eventType === EVENT.SCROLL_TOP || eventType === EVENT.SCROLL_BOTTOM) {
    gameState.dialogIndex = gameState.dialogIndex === 0 ? 1 : 0;
    const t = i18n[gameState.currentLanguage].dialog;
    const content = `
      ${t.restart}
      
    ${gameState.dialogIndex === 0 ? '> ' + t.no : '  ' + t.no}
    ${gameState.dialogIndex === 1 ? '> ' + t.yes : '  ' + t.yes}
    `.trim();
    await updateText(CONTAINER_IDS.DIALOG_OVERLAY, 'dialogOverlay', content);
    return;
  }
  if (eventType === EVENT.CLICK || eventType === undefined) {
    if (gameState.dialogIndex === 1) {
      initGame();
      await showGamePage();
    } else {
      await closeDialog();
    }
    return;
  }
};

// 退出弹窗
const handleExitDialogEvents = async (eventType: number | undefined) => {
  if (eventType === EVENT.SCROLL_TOP || eventType === EVENT.SCROLL_BOTTOM) {
    gameState.dialogIndex = gameState.dialogIndex === 0 ? 1 : 0;
    const t = i18n[gameState.currentLanguage].dialog;
    const content = `
      ${t.exit}
      
    ${gameState.dialogIndex === 0 ? '> ' + t.no : '  ' + t.no}
    ${gameState.dialogIndex === 1 ? '> ' + t.yes : '  ' + t.yes}
    `.trim();
    await updateText(CONTAINER_IDS.DIALOG_OVERLAY, 'dialogOverlay', content);
    return;
  }
  if (eventType === EVENT.CLICK || eventType === undefined) {
    if (gameState.dialogIndex === 1) {
      await showHomePage();
    } else {
      await closeDialog();
    }
    return;
  }
};

// 胜利弹窗事件：任意操作直接关掉
const handleWinDialogEvents = async (eventType: number | undefined) => {
  await closeDialog();
};