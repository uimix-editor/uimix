import { action, makeObservable } from "mobx";
import { RootElementMount } from "./RootElementMount";

export class BoundingBoxUpdateScheduler {
  constructor() {
    makeObservable(this);
  }

  schedule(mount: RootElementMount): void {
    this.mounts.add(mount);

    if (!this.scheduled) {
      this.scheduled = true;
      queueMicrotask(() => this.updateAll());
    }
  }

  @action private updateAll(): void {
    for (const mount of this.mounts) {
      mount.updateBoundingBox();
    }
    this.mounts.clear();
    this.scheduled = false;
  }

  private readonly mounts = new Set<RootElementMount>();
  private scheduled = false;
}
