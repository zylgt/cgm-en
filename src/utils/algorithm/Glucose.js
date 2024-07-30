export class GlucoseUtils {
  /**
   * 计算葡萄糖的平均值mean、变异系数CV、预估HbA1c（GMI）
   *
   * @static
   * @param {*} dataArray
   * @return {*} example: {
      mean: 120, // 单位：mg/dL
      CV: 22.1, // 单位：%
      CMI: 7.6, // 单位：%
    }
   * @memberof GlucoseUtils
   */
  static calculateMeanCvGmi(dataArray) {
    // 检查dataArray是否是数组且不为空
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return null;
    }

    // 检查dataArray的所有元素是否都是数值
    if (!dataArray.every(element => typeof element === 'number')) {
      return null;
    }

    // 过滤出数组中属于40到400之间的数值
    let filteredArray = dataArray.filter(val => val >= 40 && val <= 400);
    if (filteredArray.length === 0) {
      return null;
    }

    let sum = filteredArray.reduce((acc, val) => acc + val, 0);
    const mean = parseFloat(sum / filteredArray.length);
    let variance =
      filteredArray.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
      filteredArray.length;
    const SD = Math.sqrt(variance);
    const CV = parseFloat(((100 * SD) / mean).toFixed(1));

    /*  */
    const GMI = parseFloat((3.31 + 0.02392 * mean).toFixed(1));
    return {
      mean: mean, // 单位：mg/dL
      SDBG: SD,
      CV: CV, // 单位：%
      GMI: GMI, // 单位：%
    };
  }

  // mmol/l 转 mg/dl
  static mmolToMgdl(mmolValue) {
    const v = mmolValue * 18;
    return Math.round(v);
  }

  //mg/dl 转  mmol/l
  static mgdlToMmol(mgdlValue) {
    return Math.round((mgdlValue * 10) / 18) / 10;
  }

  static isValidGlucoseValue(value) {
    return value >= 40 && value <= 400;
  }
}
