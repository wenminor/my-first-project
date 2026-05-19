import { initEvenBridge } from './bridge';
import { showHomePage } from './ui/pages/home';
import { setupGlobalEvents } from './ui/events';

async function bootstrap() {
  try {
    await initEvenBridge();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setupGlobalEvents();
    await showHomePage();
    
    console.log('🚀 Even 数独应用启动成功');
  } catch (error) {
    console.error('💥 应用启动失败:', error);
  }
}

bootstrap();