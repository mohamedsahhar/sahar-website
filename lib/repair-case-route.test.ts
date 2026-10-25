import assert from "node:assert/strict";
import test from "node:test";

import { decodeCaseSlug, selectCaseSlugRedirect } from "./repair-case-route";

test("decodes encoded multilingual slugs before database lookup", () => {
  assert.equal(
    decodeCaseSlug("dyson-v8-%D8%AA%D8%B5%D9%84%D9%8A%D8%AD"),
    "dyson-v8-تصليح"
  );
});

test("maps an old extended case slug to its unique current slug", () => {
  assert.equal(
    selectCaseSlugRedirect(
      "dyson-v8-no-power-repair-motor-and-main-board-replacement-dyson-v8-motor-not-working",
      [
        "dyson-v8-battery-not-working",
        "dyson-v8-no-power-repair-vacuum-cleaner-won-t-turn-on",
      ]
    ),
    "dyson-v8-no-power-repair-vacuum-cleaner-won-t-turn-on"
  );
});

test("does not guess when more than one current slug has the same prefix", () => {
  assert.equal(
    selectCaseSlugRedirect("dyson-v8-no-power-old-title", [
      "dyson-v8-no-power-first-case",
      "dyson-v8-no-power-second-case",
    ]),
    null
  );
});

test("does not redirect unrelated or overly broad slugs", () => {
  assert.equal(
    selectCaseSlugRedirect("dyson-v8-repair", ["dyson-v8-repair-service"]),
    null
  );
});
