"use client";

import { init, registerRemotes } from "@module-federation/runtime";
import * as React from "react";
import * as JsxDevRuntime from "react/jsx-dev-runtime";
import * as JsxRuntime from "react/jsx-runtime";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";

const DEFAULT_SPEED_READER_ENTRY = "http://localhost:3002/mf-manifest.json";
const DEFAULT_SPRITE_GENERATOR_ENTRY = "http://localhost:3003/mf-manifest.json";
const reactVersion = React.version;

function shareHostLib(lib: object) {
  return {
    version: reactVersion,
    lib: () => lib,
    shareConfig: {
      singleton: true,
      requiredVersion: false,
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
      entry:
        process.env.NEXT_PUBLIC_SPEED_READER_REMOTE_ENTRY ||
        DEFAULT_SPEED_READER_ENTRY,
    },
    {
      name: "sprite_generator",
      alias: "sprite_generator",
      entry:
        process.env.NEXT_PUBLIC_SPRITE_GENERATOR_REMOTE_ENTRY ||
        DEFAULT_SPRITE_GENERATOR_ENTRY,
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
  });
}
