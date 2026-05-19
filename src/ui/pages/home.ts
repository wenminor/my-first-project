import { getBridge, updateText } from '../../bridge';
import { TextContainerProperty } from '@evenrealities/even_hub_sdk';
import { CONTAINER_IDS, COLORS, HOME_MENU, gameState, i18n, Language } from '../constants';

// 标志位：是否已经调用过createStartUpPageContainer
let isFirstPageCreated = false;

export const showHomePage = async () => {
  const bridge = getBridge();
  gameState.currentPage = 'home';
  gameState.homeMenuIndex = 0;

  // ✅ 修复：减少选项间距，避免内容超出容器
  const menuContent = HOME_MENU
    .map((item, index) => index === gameState.homeMenuIndex ? `> ${item()}` : `  ${item()}`)
    .join('\n\n'); // 从三个换行改为两个

  const menuContainer: TextContainerProperty = {
    xPosition: 40,
    yPosition: 40,
    width: 496,
    height: 200,
    borderWidth: 0, // ✅ 修复：完全去除绿色边框
    borderColor: 0,
    paddingLength: 20, // ✅ 修复：减小内边距，让内容完全显示
    containerID: CONTAINER_IDS.HOME_MENU,
    containerName: 'homeMenu',
    content: menuContent,
    isEventCapture: 1,
  };

  let result;
  console.log('🏠 准备显示首页，isFirstPageCreated:', isFirstPageCreated);
  
  if (!isFirstPageCreated) {
    // 首次启动：必须用createStartUpPageContainer
    result = await bridge.createStartUpPageContainer({
      containerTotalNum: 1,
      textObject: [menuContainer],
    });
    isFirstPageCreated = true;
    console.log('✅ 首次创建首页结果:', result);
  } else {
    // 后续返回首页：用rebuildPageContainer
    try {
      result = await bridge.rebuildPageContainer({
        containerTotalNum: 1,
        textObject: [menuContainer],
      });
      console.log('✅ 返回首页重建结果:', result);
      
      if (!result) {
        console.warn('⚠️ 首页重建失败，重试中...');
        await new Promise(resolve => setTimeout(resolve, 50));
        result = await bridge.rebuildPageContainer({
          containerTotalNum: 1,
          textObject: [menuContainer],
        });
        console.log('🔄 重试结果:', result);
      }
    } catch (error) {
      console.error('❌ 首页重建异常:', error);
    }
  }

  if (result === 0 || result === true) {
    console.log('✅ 首页显示成功');
  } else {
    console.error('❌ 首页显示失败');
  }
};

export const updateHomeMenu = async () => {
  // ✅ 修复：和首页保持一致的间距
  const content = HOME_MENU
    .map((item, index) => index === gameState.homeMenuIndex ? `> ${item()}` : `  ${item()}`)
    .join('\n\n');
  
  await updateText(CONTAINER_IDS.HOME_MENU, 'homeMenu', content);
  console.log('✅ 菜单更新完成');
};

// ==================== 游戏说明页面 ====================
export const getGameInstructionsContent = () => {
  const t = i18n[gameState.currentLanguage].instructions;
  return [
    t.gameTitle,
    t.gameRule1,
    t.gameRule2,
    t.gameRule3,
    '',
    t.operationTitle,
    t.operation1,
    t.operation2,
    t.operation3,
    '',
    t.gameOperationTitle,
    t.gameOperation1,
    t.gameOperation2,
    t.gameOperation3,
    '',
    t.exitTitle,
    t.exit1,
    t.exit2,
    '',
    t.back,
  ];
};

export const showGameInstructionsPage = async () => {
  const bridge = getBridge();
  gameState.currentPage = 'gameInstructions';
  const content = getGameInstructionsContent();
  gameState.scrollIndex = content.length - 1; // 默认选中最后一行返回

  const container: TextContainerProperty = {
    xPosition: 20,
    yPosition: 20,
    width: 536,
    height: 248,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingLength: 16,
    containerID: CONTAINER_IDS.HOME_MENU,
    containerName: 'pageContent',
    content: content.map((line, index) => index === gameState.scrollIndex ? `> ${line}` : `  ${line}`).join('\n'),
    isEventCapture: 1,
  };

  await bridge.rebuildPageContainer({
    containerTotalNum: 1,
    textObject: [container],
  });
  console.log('✅ 游戏说明页面创建成功');
};

// ==================== 操作说明页面 ====================
export const getOperationInstructionsContent = () => {
  const t = i18n[gameState.currentLanguage].operation;
  return [
    t.title,
    '',
    t.op1,
    t.op2,
    t.op3,
    t.op4,
    t.op5,
    t.op6,
    t.op7,
    t.op8,
    t.op9,
    '',
    t.back,
  ];
};

export const showOperationInstructionsPage = async () => {
  const bridge = getBridge();
  gameState.currentPage = 'operationInstructions';
  const content = getOperationInstructionsContent();
  gameState.scrollIndex = content.length - 1;

  const container: TextContainerProperty = {
    xPosition: 20,
    yPosition: 20,
    width: 536,
    height: 248,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingLength: 16,
    containerID: CONTAINER_IDS.HOME_MENU,
    containerName: 'pageContent',
    content: content.map((line, index) => index === gameState.scrollIndex ? `> ${line}` : `  ${line}`).join('\n'),
    isEventCapture: 1,
  };

  await bridge.rebuildPageContainer({
    containerTotalNum: 1,
    textObject: [container],
  });
  console.log('✅ 操作说明页面创建成功');
};

// ==================== 语言选择页面 ====================
export const getLanguageContent = () => {
  const t = i18n[gameState.currentLanguage].language;
  return [
    t.title,
    '',
    t.zh,
    t.en,
    t.ja,
    '',
    t.back,
  ];
};

export const showLanguageSelectPage = async () => {
  const bridge = getBridge();
  gameState.currentPage = 'languageSelect';
  const content = getLanguageContent();
  gameState.scrollIndex = 2; // 默认选中当前语言

  const container: TextContainerProperty = {
    xPosition: 20,
    yPosition: 20,
    width: 536,
    height: 248,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingLength: 30, // ✅ 修复：减小内边距，避免内容超出
    containerID: CONTAINER_IDS.HOME_MENU,
    containerName: 'pageContent',
    content: content.map((line, index) => index === gameState.scrollIndex ? `> ${line}` : `  ${line}`).join('\n'),
    isEventCapture: 1,
  };

  await bridge.rebuildPageContainer({
    containerTotalNum: 1,
    textObject: [container],
  });
  console.log('✅ 语言选择页面创建成功');
};

// 通用页面滚动更新
export const updatePageScroll = async (getContent: () => string[]) => {
  const content = getContent();
  const rendered = content.map((line, index) => index === gameState.scrollIndex ? `> ${line}` : `  ${line}`).join('\n');
  await updateText(CONTAINER_IDS.HOME_MENU, 'pageContent', rendered);
};

// 切换语言
export const switchLanguage = async (lang: Language) => {
  gameState.currentLanguage = lang;
  console.log('✅ 语言已切换为:', lang);
  await showHomePage(); // 切换后自动返回首页
};