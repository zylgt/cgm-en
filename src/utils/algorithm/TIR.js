/* 本文件提供计算TIR的方法
 */

/**
 * 用于表示TIR分布的结果
 *
 * @class TIRResult
 */
class TIRResult {
  constructor(veryHighCount, highCount, normalCount, lowCount, veryLowCount,arrayLength) {
    this.veryHighRate = veryHighCount / arrayLength;
    this.highRate = highCount / arrayLength;
    this.normalRate = normalCount / arrayLength;
    this.lowRate = lowCount / arrayLength;
    this.veryLowRate = veryLowCount / arrayLength;
    this.veryHighDuration = veryHighCount
    this.highDuration = highCount
    this.normalDuration = normalCount
    this.lowDuration = lowCount
    this.veryLowDuration = veryLowCount
  }
}

/**
 * 用于计算TIR分布
 *
 * @class TIRUtils
 */
class TIRUtils {
  static getTIRResult(dataArray, normalHigh = 180, normalLow = 70) {
    // 检查dataArray是否是数组且不为空
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return null;
    }

    // 检查dataArray的所有元素是否都是数值
    if (!dataArray.every(element => typeof element === 'number')) {
      return null;
    }

    // 过滤出数组中属于40到400之间的数值
    let filteredArray = dataArray.filter(val => val >= 36 && val <= 540);
    if (filteredArray.length === 0) {
      return null;
    }

    const arrayLength = filteredArray.length;

    const x1 = 250;
    const x2 = normalHigh;
    const x3 = normalLow;
    const x4 = 54;

    // 初始化计数器
    let veryHighCount = 0.0;
    let highCount = 0.0;
    let normalCount = 0.0;
    let lowCount = 0.0;
    let veryLowCount = 0.0;

    // 遍历数组，统计各区间的数量
    filteredArray.forEach(value => {
      if (value > x1) {
        veryHighCount++;
      } else if (value > x2 && value <= x1) {
        highCount++;
      } else if (value >= x3 && value <= x2) {
        normalCount++;
      } else if (value >= x4 && value < x3) {
        lowCount++;
      } else if (value < x4) {
        veryLowCount++;
      }
    });

    return new TIRResult(
      veryHighCount,
      highCount,
      normalCount,
      lowCount,
      veryLowCount,
      arrayLength
    );
  }
}

export {TIRResult, TIRUtils};
