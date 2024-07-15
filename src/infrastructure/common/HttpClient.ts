import { environment } from "../../../environments/environment";

export class HttpClient {

  private static instance: HttpClient;
  private static readonly DEFAULT_TIMEOUT: number = 10000;
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  private constructor() {
    this.baseUrl = this.getBaseUrl();
    this.defaultHeaders = this.getDefaultHeaders();
  }

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  private getBaseUrl(): string {
    return environment.apiUrl;
  }

  private getDefaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const fullUrl: string = `${this.baseUrl}${url}`;
    const response: Response = await this.fetchWithTimeout(fullUrl, options);

    this.handleErrorResponse(response);

    return response.json();
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller: AbortController = new AbortController();
    const id: NodeJS.Timeout = setTimeout(() => controller.abort(), HttpClient.DEFAULT_TIMEOUT);

    const response: Response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(id);
    return response;
  }

  private handleErrorResponse(response: Response): void {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  public async get<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, this.getRequestOptions('GET', options));
  }

  public async post<T>(url: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, this.getRequestOptions('POST', options, data));
  }

  public async put<T>(url: string, data?: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, this.getRequestOptions('PUT', options, data));
  }

  public async delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, this.getRequestOptions('DELETE', options));
  }

  private getRequestOptions(method: string, options: RequestInit, data?: unknown): RequestInit {
    return {
      ...options,
      method: method,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    };
  }

}
