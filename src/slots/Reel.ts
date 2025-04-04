import * as PIXI from "pixi.js";
import { AssetLoader } from "../utils/AssetLoader";
import { SYMBOL_SPACING } from "../utils/constants";

const SYMBOL_TEXTURES = [
  "symbol1.png",
  "symbol2.png",
  "symbol3.png",
  "symbol4.png",
  "symbol5.png",
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down

export class Reel {
  public container: PIXI.Container;
  private symbols: PIXI.Sprite[];
  private symbolSize: number;
  private symbolCount: number;
  private speed: number = 0;
  private isSpinning: boolean = false;

  constructor(symbolCount: number, symbolSize: number) {
    this.container = new PIXI.Container();
    this.symbols = [];
    this.symbolSize = symbolSize;
    this.symbolCount = symbolCount;

    this.createSymbols();
  }

  private createSymbols(): void {
    // Clear any previous symbols (if any)
    this.symbols = [];

    // Create and position the symbols vertically in the container
    for (let i = 0; i < this.symbolCount; i++) {
      const symbol = this.createRandomSymbol(); // Create a random symbol sprite
      symbol.x = i * this.symbolSize + i * SYMBOL_SPACING;
      symbol.y = 0;

      this.container.addChild(symbol); // Add the symbol to the container
      this.symbols.push(symbol); // Store the symbol for later manipulation (e.g., during spinning)
    }
  }

  private createRandomSymbol(): PIXI.Sprite {
    // Get a random symbol texture name from the list
    const textureName =
      SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];

    // Use AssetLoader to get the PIXI.Texture
    const texture = AssetLoader.getTexture(textureName);

    if (!texture) {
      console.warn(`Texture not found for symbol: ${textureName}`);
      return new PIXI.Sprite(); // Fallback empty sprite
    }

    // Create and return a new sprite using the texture
    return new PIXI.Sprite(texture);
  }

  public update(delta: number): void {
    if (!this.isSpinning && this.speed === 0) return;

    // TODO:Move symbols horizontally

    // If we're stopping, slow down the reel
    if (!this.isSpinning && this.speed > 0) {
      this.speed *= SLOWDOWN_RATE;

      // If speed is very low, stop completely and snap to grid
      if (this.speed < 0.5) {
        this.speed = 0;
        this.snapToGrid();
      }
    }
  }

  private snapToGrid(): void {
    // TODO: Snap symbols to horizontal grid positions
  }

  public startSpin(): void {
    this.isSpinning = true;
    this.speed = SPIN_SPEED;
  }

  public stopSpin(): void {
    this.isSpinning = false;
    // The reel will gradually slow down in the update method
  }
}
