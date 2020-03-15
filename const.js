/**
 * @enum
 * @property {string} STATUS.SUCCESS 成功
 * @property {string} STATUS.ERROR 失败
 * @property {string} STATUS.EMAIL_REPEATED 邮箱重复
 * @property {string} STATUS.USERNAME_REPERATED 用户名重复
 * @property {string} STATUS.PASSWORD_ERROR 密码错误
 */
const STATUS = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  EMAIL_REPEATED: 'EMAIL_REPEATED',
  USERNAME_REPERATED: 'USERNAME_REPERATED',
  PASSWORD_ERROR: 'PASSWORD_ERROR',
  UNFIND:'UNFIND',
  UPDATE:'UPDATE'
}
module.exports = STATUS
