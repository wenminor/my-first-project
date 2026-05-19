// 眼镜屏幕固定尺寸
export const SCREEN = {
  WIDTH: 576,
  HEIGHT: 288,
} as const;

// 4位灰度颜色
export const COLORS = {
  BORDER: 5,
  HIGHLIGHT: 12,
  TEXT: 15,
} as const;

// 全局容器ID（必须唯一，数字越大越靠上层）
export const CONTAINER_IDS = {
  HOME_MENU: 1,
  GAME_BOARD: 3,
  GAME_KEYPAD: 4,
  DIALOG_OVERLAY: 6,
} as const;

// 事件类型数值常量（SDK定义）
export const EVENT = {
  CLICK: 0,
  SCROLL_TOP: 1,
  SCROLL_BOTTOM: 2,
  DOUBLE_CLICK: 3,
} as const;

// 语言枚举
export enum Language {
  ZH = 'zh',
  EN = 'en',
  JA = 'ja',
}

// 多语言文本包
export const i18n = {
  [Language.ZH]: {
    home: {
      startGame: '开始游戏',
      gameInstructions: '游戏说明',
      operationInstructions: '操作说明',
      language: '语言选择',
    },
    dialog: {
      restart: '重新开始?',
      exit: '结束当前进程?',
      yes: '是',
      no: '否',
      win: '游戏胜利！',
    },
    game: {
      restart: '重新开始',
      exit: '退出',
    },
    instructions: {
      gameTitle: '【游戏规则】',
      gameRule1: '每行、每列、每个3×3宫格',
      gameRule2: '都必须包含1-9的数字',
      gameRule3: '且不能重复',
      operationTitle: '【基本操作】',
      operation1: '上下滑动：选择选项',
      operation2: '单击：确认选择',
      operation3: '双击：切换左右面板',
      gameOperationTitle: '【游戏操作】',
      gameOperation1: '右侧面板：选择数字',
      gameOperation2: '左侧面板：选择空格',
      gameOperation3: '单击：填入数字',
      exitTitle: '【退出方式】',
      exit1: '任意界面双击',
      exit2: '调出退出确认弹窗',
      back: '返回首页',
    },
    operation: {
      title: '【详细操作说明】',
      op1: '1. 首页上下滑动选择菜单',
      op2: '2. 单击"开始游戏"进入游戏',
      op3: '3. 游戏界面默认选中右侧键盘',
      op4: '4. 上下滑动选择要填入的数字',
      op5: '5. 双击切换到左侧棋盘面板',
      op6: '6. 上下滑动选择要填入的空格',
      op7: '7. 单击将数字填入空格',
      op8: '8. 滑到"重新开始"重置游戏',
      op9: '9. 滑到"退出"返回首页',
      back: '返回首页',
    },
    language: {
      title: '选择语言',
      zh: '中文',
      en: 'English',
      ja: '日本語',
      back: '返回首页',
    },
  },
  [Language.EN]: {
    home: {
      startGame: 'Start Game',
      gameInstructions: 'Game Rules',
      operationInstructions: 'How to Play',
      language: 'Language',
    },
    dialog: {
      restart: 'Restart Game?',
      exit: 'Exit Game?',
      yes: 'Yes',
      no: 'No',
      win: 'Game Win！',
    },
    game: {
      restart: 'Restart',
      exit: 'Exit',
    },
    instructions: {
      gameTitle: '【Game Rules】',
      gameRule1: 'Each row, column and 3×3 box',
      gameRule2: 'must contain all digits 1-9',
      gameRule3: 'without repetition',
      operationTitle: '【Basic Controls】',
      operation1: 'Swipe up/down: Select option',
      operation2: 'Click: Confirm selection',
      operation3: 'Double click: Switch panels',
      gameOperationTitle: '【Game Controls】',
      gameOperation1: 'Right panel: Select number',
      gameOperation2: 'Left panel: Select cell',
      gameOperation3: 'Click: Fill number',
      exitTitle: '【How to Exit】',
      exit1: 'Double click anywhere',
      exit2: 'to open exit dialog',
      back: 'Back to Home',
    },
    operation: {
      title: '【Detailed Instructions】',
      op1: '1. Swipe to select menu on home',
      op2: '2. Click "Start Game" to play',
      op3: '3. Right keypad is selected by default',
      op4: '4. Swipe to select a number',
      op5: '5. Double click to switch to board',
      op6: '6. Swipe to select an empty cell',
      op7: '7. Click to fill the number',
      op8: '8. Select "Restart" to reset',
      op9: '9. Select "Exit" to go home',
      back: 'Back to Home',
    },
    language: {
      title: 'Select Language',
      zh: '中文',
      en: 'English',
      ja: '日本語',
      back: 'Back to Home',
    },
  },
  [Language.JA]: {
    home: {
      startGame: 'ゲーム開始',
      gameInstructions: 'ゲームルール',
      operationInstructions: '操作方法',
      language: '言語設定',
    },
    dialog: {
      restart: 'リスタートしますか？',
      exit: '終了しますか？',
      yes: 'はい',
      no: 'いいえ',
      win: 'クリア成功！',
    },
    game: {
      restart: 'リスタート',
      exit: '終了',
    },
    instructions: {
      gameTitle: '【ゲームルール】',
      gameRule1: '各行、各列、各3×3ブロックに',
      gameRule2: '1から9までの数字が',
      gameRule3: '重複なく入ります',
      operationTitle: '【基本操作】',
      operation1: '上下スワイプ：選択',
      operation2: 'クリック：決定',
      operation3: 'ダブルクリック：パネル切替',
      gameOperationTitle: '【ゲーム操作】',
      gameOperation1: '右パネル：数字選択',
      gameOperation2: '左パネル：マス選択',
      gameOperation3: 'クリック：数字入力',
      exitTitle: '【終了方法】',
      exit1: 'どこでもダブルクリック',
      exit2: '終了ダイアログ表示',
      back: 'ホームに戻る',
    },
    operation: {
      title: '【詳細操作説明】',
      op1: '1. ホームでスワイプしてメニュー選択',
      op2: '2. 「ゲーム開始」をクリック',
      op3: '3. 初期状態は右キーパッド選択',
      op4: '4. スワイプして数字を選択',
      op5: '5. ダブルクリックで盤面に切替',
      op6: '6. スワイプして空マスを選択',
      op7: '7. クリックで数字を入力',
      op8: '8. 「リスタート」で初期化',
      op9: '9. 「終了」でホームに戻る',
      back: 'ホームに戻る',
    },
    language: {
      title: '言語を選択',
      zh: '中文',
      en: 'English',
      ja: '日本語',
      back: 'ホームに戻る',
    },
  },
};

// 首页菜单（现在4个选项）
export const HOME_MENU = [
  () => i18n[gameState.currentLanguage].home.startGame,
  () => i18n[gameState.currentLanguage].home.gameInstructions,
  () => i18n[gameState.currentLanguage].home.operationInstructions,
  () => i18n[gameState.currentLanguage].home.language,
];

// 游戏状态
export const gameState = {
  currentPage: 'home' as 'home' | 'game' | 'restartDialog' | 'exitDialog' | 'homeExitDialog' | 'gameInstructions' | 'operationInstructions' | 'languageSelect' | 'winDialog',
  currentLanguage: Language.ZH as Language,
  // 首页状态
  homeMenuIndex: 0,
  // 游戏界面状态
  activePanel: 'keypad' as 'board' | 'keypad',
  selectedNumber: 1,// 1-9=数字, 10=重新开始, 11=退出
  selectedCell: { row: 0, col: 0 },// 当前选中的空单元格
  boardScrollOffset: 0,
  // 数独数据
  initialBoard: [] as number[][],// 初始棋盘（不可修改的数字）
  currentBoard: [] as number[][],// 当前棋盘（可修改）
  emptyCells: [] as { row: number, col: number }[],// 所有空单元格列表
  emptyCellIndex: 0,// 当前选中的空单元格索引
  // 弹窗状态
  dialogIndex: 0,// 0=否, 1=是
  // 页面滚动状态
  scrollIndex: 0,
};