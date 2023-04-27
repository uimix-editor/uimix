import { describe, expect, it } from "vitest";
import { Color } from "@uimix/foundation/src/utils/Color";
import { Project } from "./Project";
import { Node } from "./Node";

function createEmptyPage() {
  const project = new Project();

  const page = project.nodes.create("page");

  project.node.append([page]);

  return [project, page] as const;
}

describe(Node.name, () => {
  it("can insert nodes", () => {
    const [proj, page] = createEmptyPage();

    const frame = proj.nodes.create("frame");
    frame.name = "Frame";

    page.append([frame]);

    expect(page.children[0].type).toBe("frame");

    const text = proj.nodes.create("text");
    text.name = "Text";

    page.insertBefore([text], frame);

    expect(page.children[0].type).toBe("text");
    expect(page.children[1].type).toBe("frame");
    expect(page.children[0].name).toBe("Text");
    expect(page.children[1].name).toBe("Frame");
    expect(page.children.length).toBe(2);

    const selectable0 = proj.selectables.get([page.children[0].id]);
    const selectable1 = proj.selectables.get([page.children[1].id]);
    selectable0.style.rowGap = 10;
    expect(selectable0.originalNode === page.children[0]).toBe(true);
    expect(selectable0.style.rowGap).toStrictEqual(10);
    expect(selectable1.originalNode === page.children[1]).toBe(true);
    expect(selectable1.style.rowGap).toStrictEqual(0);

    text.remove();

    expect(page.children[0].type).toBe("frame");
    expect(page.children.length).toBe(1);
  });

  it("can move nodes", () => {
    const [proj, page] = createEmptyPage();

    const frames: Node[] = [];

    for (let i = 0; i < 10; ++i) {
      const frame = proj.nodes.create("frame");
      frame.name = `Frame ${i}`;
      page.append([frame]);

      const frameSelectable = frame.selectable;
      const style = frameSelectable.style;
      style.position = {
        left: i * 100 + 50,
        top: 90,
      };
      style.width = 50;
      style.height = 50;
      style.fills = [{ type: "solid", color: Color.from("red").toHex() }];

      frames.push(frame);
    }

    page.selectable.insertBefore(
      frames.map((f) => f.selectable).slice(5),
      frames[0].selectable
    );

    expect(page.selectable.children.map((c) => c.originalNode.name)).toEqual([
      "Frame 5",
      "Frame 6",
      "Frame 7",
      "Frame 8",
      "Frame 9",
      "Frame 0",
      "Frame 1",
      "Frame 2",
      "Frame 3",
      "Frame 4",
    ]);

    page.selectable.insertBefore([frames[5].selectable], frames[7].selectable);
    expect(page.selectable.children.map((c) => c.originalNode.name)).toEqual([
      "Frame 6",
      "Frame 5",
      "Frame 7",
      "Frame 8",
      "Frame 9",
      "Frame 0",
      "Frame 1",
      "Frame 2",
      "Frame 3",
      "Frame 4",
    ]);
  });

  it("handles components", () => {
    const [proj, page] = createEmptyPage();

    const component = proj.nodes.create("component");
    component.name = "Test Component";
    page.append([component]);

    const frame = proj.nodes.create("frame");
    frame.name = "default";
    component.append([frame]);

    const text = proj.nodes.create("text");
    text.name = "Text";
    frame.append([text]);

    const variant = proj.nodes.create("variant");
    variant.name = "hover";
    component.append([variant]);

    expect(page.children[0].type).toBe("component");
    const componentID = page.children[0].id;

    const [rootNode, hoverVariant] = page.children[0].children;
    const textNode = rootNode.children[0];

    const rootSelectable = proj.selectables.get([rootNode.id]);
    expect(rootSelectable.originalNode.type).toBe("frame");
    rootSelectable.style.rowGap = 12;

    const textSelectable = rootSelectable.children[0];
    expect(textSelectable.originalNode === textNode).toBe(true);
    expect(textSelectable.originalNode.type).toBe("text");
    textSelectable.style.fontSize = 24;

    const hoverSelectable = proj.selectables.get([hoverVariant.id]);
    expect(hoverSelectable.originalNode === hoverVariant).toBe(true);
    expect(hoverSelectable.node === rootNode).toBe(true);
    expect(hoverSelectable.style.rowGap).toStrictEqual(12);

    const instance = proj.nodes.create("instance");
    instance.name = "Instance";
    page.append([instance]);

    const instanceSelectable = proj.selectables.get([instance.id]);
    instanceSelectable.style.mainComponent = componentID;

    const instanceTextSelectable = instanceSelectable.children[0];

    expect(instanceSelectable.mainComponent?.rootNode === rootNode).toBe(true);
    expect(instanceSelectable.style.rowGap).toStrictEqual(12);
    expect(instanceSelectable.parent === page.selectable).toBe(true);

    expect(instanceTextSelectable.originalNode === textNode).toBe(true);
    expect(instanceTextSelectable.style.fontSize).toStrictEqual(24);
    expect(instanceTextSelectable.parent === instanceSelectable).toBe(true);

    instanceSelectable.style.rowGap = 16;
    expect(instanceSelectable.style.rowGap).toStrictEqual(16);
    expect(rootSelectable.style.rowGap).toStrictEqual(12);

    instanceTextSelectable.style.fontSize = 32;
    expect(instanceTextSelectable.style.fontSize).toStrictEqual(32);
    expect(textSelectable.style.fontSize).toStrictEqual(24);

    rootSelectable.select();
    expect(rootSelectable.selected).toBe(true);
    expect(instanceSelectable.selected).toBe(false);
    expect(textSelectable.selected).toBe(false);
    expect(textSelectable.ancestorSelected).toBe(true);
  });

  it("avoid infinite instantiation", () => {
    const [proj, page] = createEmptyPage();

    const component = proj.nodes.create("component");
    component.name = "Test Component";
    page.append([component]);

    const frame = proj.nodes.create("frame");
    frame.name = "default";
    component.append([frame]);

    const text = proj.nodes.create("text");
    text.name = "Text";
    frame.append([text]);

    const variant = proj.nodes.create("variant");
    variant.name = "hover";
    component.append([variant]);

    const instance = proj.nodes.create("instance");
    instance.name = "Instance";
    frame.append([instance]);

    instance.selectable.style.mainComponent = component.id;

    expect(instance.children.length).toBe(0);
  });
});
