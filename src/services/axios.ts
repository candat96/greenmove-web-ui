'use client'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";


const headers: AxiosRequestConfig["headers"] = {
  "Content-Type": "application/json",
};

class Axios {
  private instance: AxiosInstance
  private interceptor: number | null = null

  constructor() {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URI,
    })
    console.log('process.env.NEXT_PUBLIC_BASE_URI', process.env.NEXT_PUBLIC_BASE_URI);

    // Request interceptor to add token
    instance.interceptors.request.use(
      (config) => {
        const token = this.getToken() // Get token from storage or wherever it is saved
        console.log('token', token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}` // Add token to headers
        }
        config.headers['x-language'] = 'vi'
        return config
      },
     
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized()
        }
        return Promise.reject(error)
      }
    )

    // Response interceptor
    const interceptor = instance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: AxiosError) => Promise.reject(error)
    )

    this.interceptor = interceptor
    this.instance = instance
  }

  // Method to get token (adjust this according to your token management)
  private getToken(): string | null {
    return localStorage.getItem('accessToken') // Example: getting token from localStorage
  }

  public get Instance(): AxiosInstance {
    return this.instance
  }

  private useInterceptor() {
    if (this.interceptor === null) {
      const interceptor = this.instance.interceptors.response.use(
        (response: AxiosResponse) => response.data,
        (error: AxiosError) => {
          if (error.response?.status === 401) {
            this.handleUnauthorized()
          }
          return Promise.reject(error)
        }
      )
      this.interceptor = interceptor
    }
  }

  private ejectInterceptor() {
    if (this.interceptor !== null) {
      this.instance.interceptors.response.eject(this.interceptor)
      this.interceptor = null
    }
  }

  private handleUnauthorized() {
    // cookies().set('accessToken', '', { expires: new Date(0) })
    if(window) {
      window.localStorage.removeItem('accessToken')
      window.localStorage.removeItem('refreshToken')
      window.document.cookie = "";
    }
  }

  // Create
  public post<T = any, R = T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    this.useInterceptor()
    return this.Instance.post<T, R>(url, data, { ...config, headers })
  }

  // Read
  public get<T = any, R = T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    this.useInterceptor()
    return this.Instance.get<T, R>(url, config)
  }

  // Update
  public put<T = any, R = T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    this.useInterceptor()
    return this.Instance.put<T, R>(url, data, config)
  }

  public patch<T = any, R = T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    this.useInterceptor()
    return this.Instance.patch<T, R>(url, data, config)
  }

  // Delete
  public delete<T = any, R = T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    this.useInterceptor()
    return this.Instance.delete<T, R>(url, config)
  }

  // Post with full response
  public pull<T = any, R = T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    this.ejectInterceptor()
    return this.Instance.post<T, R>(url, data, config)
  }
}

const axiosInstance = new Axios();
export default axiosInstance;
