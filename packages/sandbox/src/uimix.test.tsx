import reactRenderer from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { Card, Page } from "./components.uimix.js";
import { Button } from "./button.uimix.js";

describe(Button.name, () => {
  it("render", async () => {
    expect(
      reactRenderer
        .create(
          <Button
            className="other-class"
            textProps={{
              children: "Hello, world!",
            }}
          />
        )
        .toJSON()
    ).toMatchSnapshot();
  });
});

describe(Page.name, () => {
  it("render", async () => {
    expect(
      reactRenderer
        .create(
          <Page
            buttonProps={{
              label: "Override Button Label",
            }}
            stackProps={{
              // TODO: typing
              // @ts-ignore
              textProps: {
                children: "Override inner item",
              },
            }}
          />
        )
        .toJSON()
    ).toMatchSnapshot();
  });
});

describe(Card.name, () => {
  it("render", async () => {
    expect(reactRenderer.create(<Card />).toJSON()).toMatchSnapshot();
  });
});
