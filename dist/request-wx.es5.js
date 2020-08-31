/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var NET_ERR_NO = -11;
var SERVICE_ERR_NO = -10;
/**
 * @param {*} type 请求的类型
 * @param {*} configs 请求的通用配置项
 * @param {*} url 请求的路由
 * @param {*} params 请求的参数
 */
var httpRequest = function (wx, type, configs) { return function (url, params, requestOptions) {
    var _a = configs || {}, _b = _a.header, header = _b === void 0 ? {} : _b, _c = _a.successCondition, successCondition = _c === void 0 ? function (res) { return res && res.data && res.data.errno === 0; } : _c, _d = _a.isShowErrorMessage, isShowErrorMessage = _d === void 0 ? true : _d, _e = _a.commonParams, commonParams = _e === void 0 ? {} : _e, _f = _a.baseUrl, baseUrl = _f === void 0 ? '' : _f, _g = _a.getErrorno, getErrorno = _g === void 0 ? function (res) { return res && res.data && res.data.errno; } : _g, _h = _a.getErrorMsg, getErrorMsg = _h === void 0 ? function (res) { return res && res.data && res.data.errmsg; } : _h;
    var _j = requestOptions || {}, _k = _j.requestHeaders, requestHeaders = _k === void 0 ? {} : _k, _l = _j.isShowLoading, isShowLoading = _l === void 0 ? false : _l;
    return new Promise(function (resolve, reject) {
        isShowLoading && wx.showLoading({ title: '加载中' });
        wx.request({
            url: "" + baseUrl + url,
            method: type || 'GET',
            data: Object.assign(commonParams, params || {}),
            header: __assign(__assign({}, header), requestHeaders),
            success: function (res) {
                var errMessage = {};
                if (successCondition(res)) {
                    // http code 200
                    resolve(res.data); // 直接将服务器返回的数据抛出
                }
                else {
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
            fail: function (err) {
                reject({ errno: NET_ERR_NO, errmsg: err.errMsg });
                isShowErrorMessage && wx.showToast({
                    title: '请求异常',
                    icon: 'none',
                });
            },
            complete: function () {
                isShowLoading && wx.hideLoading();
            }
        });
    });
}; };

export default httpRequest;
export { NET_ERR_NO, SERVICE_ERR_NO };
//# sourceMappingURL=request-wx.es5.js.map
