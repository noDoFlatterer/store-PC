/**
 * 处理时间，方便显示
 * @param {} date
 * @returns
 */
export const changeDate = (date) => {
  let temp = new Date(date)
  return `${temp.getFullYear()}-
    ${temp.getMonth() < 10 ? '0' + temp.getMonth() : 0 + temp.getMonth()}-
    ${temp.getDate() < 10 ? '0' + temp.getDate() : temp.getDate()} 
    ${temp.getHours() < 10 ? '0' + temp.getHours() : 0 + temp.getHours()} 
    :${temp.getMinutes() < 10 ? '0' + temp.getMinutes() : temp.getMinutes()} 
    :${temp.getSeconds() < 10 ? '0' + temp.getSeconds() : temp.getSeconds()}`
}
