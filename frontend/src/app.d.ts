import type { JwtPayload } from "$lib/server/auth";

declare global {
  namespace App {
    interface Locals {
      user: JwtPayload | null;
    }
    // interface Error {}
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
