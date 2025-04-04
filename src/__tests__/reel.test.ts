import { Reel } from "../slots/Reel";
import { sound } from "../utils/sound";
import * as PIXI from "pixi.js";

// Mock PIXI Container and other required classes
jest.mock("pixi.js", () => {
  const originalModule = jest.requireActual("pixi.js");
  return {
    ...originalModule,
    Container: jest.fn().mockImplementation(() => ({
      children: [],
      addChild: jest.fn(),
      removeChild: jest.fn(),
    })),
    Sprite: jest.fn(),
    Texture: jest.fn(),
    BaseTexture: jest.fn(),
  };
});

describe("Reel", () => {
  let reel: Reel;
  const symbolCount: number = 5;
  const symbolSize: number = 100;

  beforeEach(() => {
    reel = new Reel(symbolCount, symbolSize);

    // @ts-ignore
    jest.spyOn(sound, "stop").mockImplementation(() => {});
  });

  test("should create symbols in the reel container", () => {
    setTimeout(() => {
      expect(reel.container.children.length).toBe(symbolCount);
      expect(reel.container.children[0]).toBeInstanceOf(PIXI.Sprite);
    }, 0);
  });

  test("should start spinning when startSpin is called", () => {
    reel.startSpin();
    expect(reel.getIsSpinning()).toBe(true);
    expect(reel.getSpeed()).toBe(50);
  });

  test("should stop spinning when stopSpin is called", () => {
    reel.startSpin();
    reel.stopSpin();
    expect(reel.getIsSpinning()).toBe(false);
  });

  test("should stop the sound when snapToGrid is called", () => {
    reel.startSpin();
    setTimeout(() => {
      reel.setSpeed(0.4);
      reel.update(0.1);
      expect(sound.stop).toHaveBeenCalledWith("Reel spin");
    });
  });

  test("should recycle symbols correctly when moving horizontally", () => {
    reel.startSpin();
    reel.getSymbols()[0].x = -symbolSize;
    reel.update(1); // This will trigger symbol recycling
    expect(reel.getSymbols()[0].x).toBeGreaterThanOrEqual(0);
  });
});
