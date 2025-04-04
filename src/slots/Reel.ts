import * as PIXI from "pixi.js";
import { AssetLoader } from "../utils/AssetLoader";
import { SYMBOL_SPACING } from "../utils/constants";
import { sound } from "../utils/sound";

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
      symbol.x = i * this.symbolSize + i * SYMBOL_SPACING; // Initial position horizontally
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

    // Move each symbol horizontally by the speed value
    this.moveSymbolsHorizontally(delta);

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

  private moveSymbolsHorizontally(delta: number): void {
    // Move each symbol horizontally by the speed value
    for (let i = 0; i < this.symbols.length; i++) {
      this.symbols[i].x -= this.speed * delta; // Move to the left
    }

    // If a symbol has moved off-screen, reset its position to the far right
    if (this.symbols[0].x <= -this.symbolSize) {
      // Recycle symbol to the right side
      this.symbols.push(this.symbols.shift()!); // Remove the first symbol and add it to the end
      this.symbols[this.symbols.length - 1].x =
        this.symbols[this.symbols.length - 2].x +
        this.symbolSize +
        SYMBOL_SPACING; // Place it at the end
    }
  }

  public snapToGrid(): void {
    // Snap the positions of the symbols to the grid
    const correctionFactor = 0.1; // Small factor to smooth the snapping (less abrupt)

    // Align symbols back to their original grid positions with smooth transitions
    for (let i = 0; i < this.symbols.length; i++) {
      const targetX = i * (this.symbolSize + SYMBOL_SPACING);

      // Smoothly adjust positions to grid target (avoid abrupt snapping)
      this.symbols[i].x =
        targetX + correctionFactor * (this.symbols[i].x - targetX);
    }

    // stopping sound when reels snap
    sound.stop("Reel spin");
  }

  public startSpin(): void {
    this.isSpinning = true;
    this.speed = SPIN_SPEED;
  }

  public stopSpin(): void {
    this.isSpinning = false;
    // The reel will gradually slow down in the update method
  }

  // Getters (used for testing)
  // Public getters and setters methods for testing

  // Public getter and setter for isSpinning
  public getIsSpinning(): boolean {
    return this.isSpinning;
  }

  public setIsSpinning(value: boolean): void {
    this.isSpinning = value;
  }

  // Public getter and setter for speed
  public getSpeed(): number {
    return this.speed;
  }

  public setSpeed(value: number): void {
    this.speed = value;
  }

  // Public getter and setter for symbols
  public getSymbols(): Array<any> {
    return this.symbols;
  }

  public setSymbols(value: Array<any>): void {
    this.symbols = value;
  }
}
