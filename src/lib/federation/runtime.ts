"use client";

import {
  init,
  type ModuleFederationRuntimePlugin,
  registerRemotes,
} from "@module-federation/runtime";
import * as React from "react";
import * as JsxDevRuntime from "react/jsx-dev-runtime";
import * as JsxRuntime from "react/jsx-runtime";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";

const reactVersion = React.version;

function requiredRemoteEntry(name: string, value: string | undefined) {
  const entry = value?.trim();
  if (!entry) {
    throw new Error(
      `Missing ${name}. Set it in .env (see .env.example).`,
    );
  }
  return entry;
}

function shareHostLib(lib: object) {
  return {
    version: reactVersion,
    lib: () => lib,
    shareConfig: {
      singleton: true,
      requiredVersion: false as const,
      eager: true,
      strictVersion: false,
    },
    strategy: "loaded-first" as const,
  };
}

function federationRemotes() {
  return [
    {
      name: "speed_reader",
      alias: "speed_reader",
      entry: requiredRemoteEntry(
        "NEXT_PUBLIC_SPEED_READER_REMOTE_ENTRY",
        process.env.NEXT_PUBLIC_SPEED_READER_REMOTE_ENTRY,
      ),
    },
    {
      name: "sprite_generator",
      alias: "sprite_generator",
      entry: requiredRemoteEntry(
        "NEXT_PUBLIC_SPRITE_GENERATOR_REMOTE_ENTRY",
        process.env.NEXT_PUBLIC_SPRITE_GENERATOR_REMOTE_ENTRY,
      ),
    },
  ];
}

const shared = {
  react: shareHostLib(React),
  "react-dom": shareHostLib(ReactDOM),
  "react-dom/client": shareHostLib(ReactDOMClient),
  "react/jsx-runtime": shareHostLib(JsxRuntime),
  "react/jsx-dev-runtime": shareHostLib(JsxDevRuntime),
};

const rewritePublicPathToEntryOrigin: ModuleFederationRuntimePlugin = {
  name: "rewrite-public-path-to-entry-origin",
  loadRemoteSnapshot(args) {
    const { remoteSnapshot, manifestUrl } = args;
    if (!manifestUrl || !remoteSnapshot || !("publicPath" in remoteSnapshot)) {
      return args;
    }

    try {
      return {
        ...args,
        remoteSnapshot: {
          ...remoteSnapshot,
          publicPath: `${new URL(manifestUrl).origin}/`,
        },
      };
    } catch {
      return args;
    }
  },
};

let initialized = false;

function installViteReactPreamble() {
  if (typeof window === "undefined") {
    return;
  }

  const view = window as Window & {
    $RefreshReg$?: () => void;
    $RefreshSig$?: () => (type: unknown) => unknown;
    __vite_plugin_react_preamble_installed__?: boolean;
  };

  view.$RefreshReg$ ??= () => {};
  view.$RefreshSig$ ??= () => (type) => type;
  view.__vite_plugin_react_preamble_installed__ = true;
}

export function ensureFederation() {
  installViteReactPreamble();
  const remotes = federationRemotes();

  if (initialized) {
    registerRemotes(remotes);
    return;
  }

  initialized = true;
  init({
    name: "host",
    remotes,
    shared,
    shareStrategy: "loaded-first",
    plugins: [rewritePublicPathToEntryOrigin],
  });
}
