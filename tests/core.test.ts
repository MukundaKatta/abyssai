import { describe, it, expect } from "vitest";
import { Abyssai } from "../src/core.js";
describe("Abyssai", () => {
  it("init", () => { expect(new Abyssai().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Abyssai(); await c.process(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Abyssai(); await c.process(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
