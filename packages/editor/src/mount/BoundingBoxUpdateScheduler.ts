import { action, makeObservable } from "mobx";
import { ElementMount } from "./ElementMount";
import { VariantMount } from "./VariantMount";

export class BoundingBoxUpdateScheduler {
  constructor() {
    makeObservable(this);
  }

  schedule(mount: ElementMount | VariantMount): void {
    this.mounts.add(mount);

    if (!this.scheduled) {
      this.scheduled = true;
      setTimeout(() => this.updateAll(), 0);
    }
  }

  @action private updateAll(): void {
    for (const mount of this.mounts) {
      mount.updateBoundingBox();
    }
    this.mounts.clear();
    this.scheduled = false;
  }

  private readonly mounts = new Set<ElementMount | VariantMount>();
  private scheduled = false;
}
