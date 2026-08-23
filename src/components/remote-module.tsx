"use client";

import { type ComponentType, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { loadRemoteModule } from "@/lib/federation/load-remote";
import { ensureFederation } from "@/lib/federation/runtime";

type RemoteModuleProps = {
  remote: string;
  name: string;
};

export function RemoteModule({ remote, name }: RemoteModuleProps) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    setComponent(null);
    try {
      ensureFederation();
      const next = await loadRemoteModule(remote);
      setComponent(() => next);
    } catch (error) {
      console.error(error);
      setFailed(true);
    }
  }, [remote]);

  useEffect(() => {
    void load();
  }, [load]);

  if (failed) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3">
        <p>{name} is unavailable.</p>
        <Button type="button" onClick={() => void load()}>
          Try again
        </Button>
      </div>
    );
  }

  if (Component == null) {
    return <p aria-live="polite">Loading {name}…</p>;
  }

  return <Component />;
}
