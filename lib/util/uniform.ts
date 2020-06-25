/**
 * 一様分布から乱数を生成
 *
 * @param min
 * @param max
 */
export default function uniform (min: number, max: number) {
  return Math.random() * (max - min) + min
}
