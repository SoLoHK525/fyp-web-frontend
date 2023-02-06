import { create } from 'apisauce';
import { clientStorage } from '../utils/client-storage';
import { Auth } from '../types/Auth';

const isSSR = typeof window === 'undefined';

function getApiInstance() {
  return create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT,
  });
}

async function getAuthentcationToken() {
  const auth = clientStorage.get<Auth>('auth');

  if (!auth) {
    // TODO: handle if there's no token
    return;
  }

  return auth.token;
}

const instance = getApiInstance();

export type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'head';

const getMethodInstance = (method: RequestMethod) => {
  console.log(instance.getBaseURL());
  return instance[method];
};

async function request<T>(
  method: RequestMethod,
  path: string,
  data: Record<string, any> = {},
  injectToken = true,
  headers: Record<string, any> = {},
) {
  const instance = getMethodInstance(method);

  if (injectToken) {
    headers['Authorization'] = `Bearer ${await getAuthentcationToken()}`;
  }

  return await instance(path, data, {
    headers: headers,
  }).then(res => {
    if (res.status === 401) {
      // redirect
      throw new ApiError('unauthorized', 'Unauthorized', res.status);
    }

    if (res.problem === 'NETWORK_ERROR') {
      throw new ApiNetworkError();
    }

    if (!res.ok) {
      const data = res.data as ApiResponseFailed;
      throw new ApiError(data.error, data.error, res.status ?? 500, data.payload);
    }

    const { payload, ...rest } = res.data as ApiResponseSuccess<T>;

    return {
      ...payload,
      metadata: rest,
    };
  }).catch((error: Error) => {

    throw new ApiError(error.name, error.message, 0);
  });
}

interface BaseApiResponse {
  success: boolean;
  server_time: number;
}

export interface ApiResponseSuccess<T = any> extends BaseApiResponse {
  success: true;
  payload: T;
}

export interface ApiResponseFailed<E = any> extends BaseApiResponse {
  success: false;
  error: string;
  payload: E;
  status_code: number;
}

export type ApiResponse<T = any, E = any> = T extends ApiResponseFailed<E> ? ApiResponseFailed<E> : ApiResponseSuccess<T>;

export type ApiErrorCode = 'unauthorized'
  | 'not_found'
  | 'forbidden'
  | 'network_error'
  ;

export class ApiError<E = any> extends Error {
  constructor(
    readonly error_code: ApiErrorCode | string,
    readonly message: string,
    readonly status_code: number = 0,
    readonly payload?: E,
  ) {
    super();
  }
}

export class ApiNetworkError extends ApiError {
  constructor() {
    super('network_error', 'Network Error');
  }
}

export { request };