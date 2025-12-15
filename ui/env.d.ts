/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/vue" />
/// <reference types="vue-i18n/dist/vue-i18n.d.ts" />
/// <reference types="unplugin-icons/types/vue" />

export {};

declare module "axios" {
  export interface AxiosRequestConfig {
    mute?: boolean;
  }
}

declare module "*.vue" {
  import type { ComponentOptions } from "vue";
  const Component: ComponentOptions;
  export default Component;
}


declare module "vue" {
  interface ComponentCustomProperties {
    $formkit: any;
  }
}
