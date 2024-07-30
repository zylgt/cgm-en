// 检查是否已有监听器
export function hasEventListener(eventBus, eventName) {
    const cache = eventBus._events; // 访问Vue的事件缓存
    if (cache && cache[eventName]) {
      // 如果缓存存在并且事件已有监听器，返回true
      return true;
    }
    return false;
}

  