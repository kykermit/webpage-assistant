/**
 * 時間の経過率からエフェクトeaseInOutQuadパターンの算出結果を返す
 * @param percentage 時間の経過率
 */
 const easeInOutQuad = (percentage: number): number => {
    return percentage < 0.5 ? 2 * (percentage ** 2) : -1 + ((4 - (2 * percentage)) * percentage);
};

export {
    easeInOutQuad,
}
