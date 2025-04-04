// Import Howl from the howler.js library to handle audio playback
import { Howl } from "howler";

// A map to store all loaded sounds, using a string alias as the key
const soundMap: Record<string, Howl> = {};

/**
 * A simple sound manager using Howler.js
 * Provides methods to add and play sounds by alias.
 */
export const sound = {
  /**
   * Registers a new sound with a given alias and file URL.
   * If the alias already exists, it will overwrite the existing sound.
   *
   * @param alias - A unique name to refer to the sound (e.g. 'spin', 'win').
   * @param url - Path to the sound file (e.g. 'assets/sounds/spin.mp3').
   */
  add: (alias: string, url: string): void => {
    if (soundMap[alias]) {
      console.warn(`Sound alias "${alias}" already exists. Overwriting.`);
    }

    // Create and store a new Howl instance for the sound
    soundMap[alias] = new Howl({
      src: [url], // Accepts an array of sources for compatibility
    });

    console.log(`Sound added: ${alias} from ${url}`);
  },

  /**
   * Plays a previously registered sound using its alias.
   * Logs an error if the alias is not found in the sound map.
   *
   * @param alias - The name of the sound to play.
   */
  play: (alias: string): void => {
    const sound = soundMap[alias];
    if (!sound) {
      console.error(`No sound found for alias: ${alias}`);
      return;
    }

    sound.play();
    console.log(`Playing sound: ${alias}`);
  },

  stop: (alias: string): void => {
    const sound = soundMap[alias];
    if (!sound) {
      console.error(`No sound found for alias: ${alias}`);
      return;
    }
    sound.stop();
  },
};
