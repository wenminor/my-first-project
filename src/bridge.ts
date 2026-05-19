import { waitForEvenAppBridge, EvenAppBridge } from '@evenrealities/even_hub_sdk';

let bridgeInstance: EvenAppBridge | null = null;

export const initEvenBridge = async (): Promise<EvenAppBridge> => {
  if (bridgeInstance) return bridgeInstance;
  bridgeInstance = await waitForEvenAppBridge();
  console.log('✅ Even App Bridge 初始化成功');
  return bridgeInstance;
};

export const getBridge = (): EvenAppBridge => {
  if (!bridgeInstance) throw new Error('桥接未初始化');
  return bridgeInstance;
};

// 通用文本更新（使用增量更新API）
export const updateText = async (
  containerID: number,
  containerName: string,
  content: string
) => {
  const bridge = getBridge();
  return await bridge.textContainerUpgrade({
    containerID,
    containerName,
    contentOffset: 0,
    contentLength: content.length,
    content,
  });
};

// 重建页面（所有页面切换使用）
export const rebuildPage = async (containers: any[]) => {
  const bridge = getBridge();
  return await bridge.rebuildPageContainer({
    containerTotalNum: containers.length,
    textObject: containers,
  });
};