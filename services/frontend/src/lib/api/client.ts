import axios, { type AxiosInstance } from 'axios';

export class ApiClient {
  private client: AxiosInstance;
  private mockMode: boolean;

  constructor(baseURL: string, mockMode = false) {
    this.mockMode = mockMode;
    this.client = axios.create({
      baseURL: mockMode ? '' : baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token && !this.mockMode) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setMockMode(enabled: boolean) {
    this.mockMode = enabled;
  }

  isMockMode() {
    return this.mockMode;
  }

  async get<T>(url: string): Promise<T> {
    if (this.mockMode) {
      return this.getMockData<T>(url);
    }
    const response = await this.client.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    if (this.mockMode) {
      return this.postMockData<T>(url, data);
    }
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    if (this.mockMode) {
      return this.putMockData<T>(url, data);
    }
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    if (this.mockMode) {
      return this.patchMockData<T>(url, data);
    }
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    if (this.mockMode) {
      return this.deleteMockData<T>(url);
    }
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  private getMockData<T>(url: string): Promise<T> {
    return import('./mock-data').then((mod) => mod.getMockData<T>(url));
  }

  private postMockData<T>(url: string, data?: unknown): Promise<T> {
    return import('./mock-data').then((mod) => mod.postMockData<T>(url, data));
  }

  private putMockData<T>(url: string, data?: unknown): Promise<T> {
    return import('./mock-data').then((mod) => mod.putMockData<T>(url, data));
  }

  private patchMockData<T>(url: string, data?: unknown): Promise<T> {
    return import('./mock-data').then((mod) => mod.patchMockData<T>(url, data));
  }

  private deleteMockData<T>(url: string): Promise<T> {
    return import('./mock-data').then((mod) => mod.deleteMockData<T>(url));
  }
}

const API_URL = import.meta.env.VITE_API_URL || '/api';
const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

export const apiClient = new ApiClient(API_URL, MOCK_MODE);
