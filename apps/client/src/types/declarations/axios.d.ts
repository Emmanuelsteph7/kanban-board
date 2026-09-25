import 'axios';

declare module 'axios' {
  // Custom properties for Axios request config
  export interface AxiosRequestConfig {
    // Show a toast if the request fails
    showToastOnError?: boolean;
  }
}
