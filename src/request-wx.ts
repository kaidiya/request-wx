interface Response {
  [key:string]:any,
}

interface RequestConfigs {
  header?: Record<string, string|number>,
  successCondition?: (res:Response) => boolean,
  isShowErrorMessage?: boolean,
  commonParams?: Record<string, any>,
  baseUrl?: string,
  getErrorno?: (res:Response) => number | string,
  getErrorMsg?: (res:Response) => string,
}

interface RequestOptions {
  requestHeaders?: Record<string, string|number>,
  isShowLoading?: boolean,
}

type RequestMethod = 'OPTIONS'|'GET'|'HEAD'|'POST'|'PUT'|'DELETE'|'TRACE'|'CONNECT';

export const NET_ERR_NO = -11;
export const SERVICE_ERR_NO = -10;

/**
 * @param {*} type 请求的类型
 * @param {*} configs 请求的通用配置项
 * @param {*} url 请求的路由
 * @param {*} params 请求的参数
 */
const httpRequest = (wx: Record<string, any>, type:RequestMethod, configs?:RequestConfigs) => (url:string, params?:Record<string, any>, requestOptions?:RequestOptions) => {
  const { 
    header = {}, 
    successCondition = (res:Response) =>  res && res.data && res.data.errno === 0,
    isShowErrorMessage = true,
    commonParams = {},
    baseUrl = '',
    getErrorno = (res:Response) => res && res.data && res.data.errno,
    getErrorMsg = (res:Response) => res && res.data && res.data.errmsg,
  } = configs || {};
  const { requestHeaders = {}, isShowLoading = false } = requestOptions || {};
  return new Promise((resolve, reject) => {
    isShowLoading && wx.showLoading({ title: '加载中' });
    wx.request({
      url: `${baseUrl}${url}`,
      method: type || 'GET',
      data: Object.assign(commonParams, params || {}),
      header: {
        ...header,
        ...requestHeaders,
      },
      success(res:Response) {
        const errMessage:Record<string, string|number> = {};
        if (successCondition(res)) {
          // http code 200
          resolve(res.data);  // 直接将服务器返回的数据抛出
        } else {
          errMessage.errno = getErrorno(res) || SERVICE_ERR_NO;
          errMessage.errmsg = getErrorMsg(res) || '网络错误';
          reject(errMessage);
        } 
        if (errMessage.errmsg && isShowErrorMessage) {
          wx.showToast({
            title: errMessage.errmsg,
            icon: 'none',
          });
        }
      },
      fail(err:{errMsg:string}) {
        reject({errno: NET_ERR_NO, errmsg: err.errMsg});
        isShowErrorMessage && wx.showToast({
          title: '请求异常',
          icon: 'none',
        });
      },
      complete() {
        isShowLoading && wx.hideLoading();
      }
    });
  })
};

export default httpRequest;
