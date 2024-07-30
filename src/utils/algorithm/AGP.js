/* 本文件是用来计算AGP图谱中，五条线中的纵坐标取值的 */

export class AGPUtils {
  /**
   * 根据血糖数据，返回这个数组对应的第5百分位的血糖值、第25百分位的血糖值、第50百分位的血糖值、第75百分位的血糖值、第95百分位的血糖值、
   *
   * @static
   * @param {*} 血糖值数据，单位：md/dL
   * @return {*} {
      p05: 50,
      p25: 65,
      p50: 78,
      p75: 90,
      p95: 120,
    };
   * @memberof AGPUtils
   */
  static calculateYValue(dataArray) {
    // 检查dataArray是否是数组且不为空
    if (!Array.isArray(dataArray) || dataArray.length < 5) {
      return null;
    }

    // 检查dataArray的所有元素是否都是数值
    if (!dataArray.every(element => typeof element === 'number')) {
      return null;
    }

    // 过滤出数组中属于40到400之间的数值
    let filteredArray = dataArray.filter(val => val >= 40 && val <= 400);
    if (filteredArray.length < 5) {
      return null;
    }

    filteredArray.sort((a, b) => a - b);

    const arrayLength = filteredArray.length;
    const percentageArray = [0.05, 0.25, 0.5, 0.75, 0.95];
    const estimateIndexArray = percentageArray.map(val => val * arrayLength);

    const valueArray = estimateIndexArray.map(index => {
      if (Number.isInteger(index)) {
        return 0.5 * (filteredArray[index - 1] + filteredArray[index]);
      } else {
        return filteredArray[Math.ceil(index) - 1];
      }
    });

    return {
      p05: valueArray[0],
      p25: valueArray[1],
      p50: valueArray[2],
      p75: valueArray[3],
      p95: valueArray[4],
    };
  }
}
