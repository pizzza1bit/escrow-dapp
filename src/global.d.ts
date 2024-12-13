export {};

declare global {
  interface Window {
    deBridge: any; // Use `any` or a more specific type if you have one
  }
}
