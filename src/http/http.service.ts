// src/http/http.service.ts
import { Injectable, HttpException } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data,
        error.response?.status || 500,
      );
    }
  }

  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data ||
          `Erro ao fazer requisição POST para ${url}: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }

  async patch<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.patch<T>(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Erro ao fazer requisição PATCH para ${url}: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Erro ao fazer requisição DELETE para ${url}: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }
}
