import React from "react";
import { describe, expect, it } from "vitest";
import reactRenderer from "react-test-renderer";
import { createReactComponents } from "./createReactComponents";
// @ts-ignore
import projectJSON from "./__fixtures__/uimix/data.json";

describe(createReactComponents.name, () => {
  it("generates components", async () => {
    const components = createReactComponents(
      projectJSON,
      {
        "YmY-tuteU03QY-k_2ARy1uacNmXDNmOX-FFAlj2qCIo=": (
          await import(
            // @ts-ignore
            "./__fixtures__/uimix/images/YmY-tuteU03QY-k_2ARy1uacNmXDNmOX-FFAlj2qCIo=.png"
          )
        ).default,
      },
      {
        "src/stories/Button.tsx": await import(
          "../../sandbox/src/stories/Button"
        ),
        "src/stories/Header.tsx": await import(
          "../../sandbox/src/stories/Header"
        ),
      }
    );

    console.log(components);

    const Button = components.get("Button")!;
    const Stack = components.get("Stack")!;
    const Page = components.get("Page")!;

    expect(
      reactRenderer
        .create(
          <Button
            overrides={{
              text: {
                children: "Hello, world!",
              },
            }}
          />
        )
        .toJSON()
    ).toMatchSnapshot();
    expect(reactRenderer.create(<Stack />).toJSON()).toMatchSnapshot();
    expect(
      reactRenderer
        .create(
          <Page
            overrides={{
              stack: {
                overrides: {
                  text: {
                    children: "Nested oveerride!",
                  },
                },
              },
            }}
          />
        )
        .toJSON()
    ).toMatchSnapshot();
  });
});
