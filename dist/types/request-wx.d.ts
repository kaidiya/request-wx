interface Response {
    [key: string]: any;
}
interface RequestConfigs {
    header?: Record<string, string | number>;
    successCondition?: (res: Response) => boolean;
    isShowErrorMessage?: boolean;
    commonParams?: Record<string, any>;
    baseUrl?: string;
    getErrorno?: (res: Response) => number | string;
    getErrorMsg?: (res: Response) => string;
}
interface RequestOptions {
    requestHeaders?: Record<string, string | number>;
    isShowLoading?: boolean;
}
declare type RequestMethod = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
/**
 * @param {*} type 请求的类型
 * @param {*} configs 请求的通用配置项
 * @param {*} url 请求的路由
 * @param {*} params 请求的参数
 */
declare const httpRequest: (wx: Record<string, any>, type: RequestMethod, configs?: RequestConfigs | undefined) => (url: string, params?: Record<string, any> | undefined, requestOptions?: RequestOptions | undefined) => Promise<unknown>;
