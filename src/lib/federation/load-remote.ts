"use client";

import { loadRemote } from "@module-federation/runtime";
import type { ComponentType } from "react";

type RemoteModuleShape = {
  default?: ComponentType;
  [exportName: string]: ComponentType | undefined;
};

export async function loadRemoteModule(id: string): Promise<ComponentType> {
  const loaded = await loadRemote<RemoteModuleShape | ComponentType>(id);
  if (loaded == null) {
    throw new Error(`Remote ${id} returned an empty module.`);
  }
  if (typeof loaded === "function") {
    return loaded;
  }
  if (typeof loaded.default === "function") {
    return loaded.default;
  }
  const exposeName = id.split("/").pop();
  if (exposeName && typeof loaded[exposeName] === "function") {
    return loaded[exposeName];
  }
  throw new Error(`Remote ${id} has no React component export.`);
}
