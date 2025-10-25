# 16 Rails Minecraft Scripting Project

## Overview

This project is a Minecraft Bedrock Edition scripting pack written in TypeScript. It introduces a custom item, "16 Rails", which allows players to quickly place rail patterns in the world.

## Features

- **Custom Item: 16 Rails**
  - Use the item to place a sequence of rails in the direction the player is facing.
  - Each pattern consists of 16 blocks: 15 regular rails followed by 1 powered rail with a redstone block underneath.
  - The number of patterns placed equals the number of items held (e.g., holding 4 items places 4 patterns).
  - Rails are only placed if the target block is air and there is no block above.
  - Powered rails and redstone blocks are placed only if the space is available.

## Installation

1. **Clone or Download**
   - Download or clone this repository to your local machine.

2. **Install Dependencies**
   - Make sure you have [Node.js](https://nodejs.org/) installed.
   - Run `npm install` in the project directory.

3. **Build and Deploy**
   - To build and deploy to your Minecraft development folders, run:
     ```powershell
     npm run local-deploy
     ```
   - For production addon creation:
     ```powershell
     npm run mcaddon:production
     ```

## Usage

1. **Add the Behavior Pack**
   - In Minecraft, add the behavior pack to your world.

2. **Get the Custom Item**
   - Use `/give @p yay:16_rails <amount>` to get the custom item.

3. **Place Rails**
   - Hold the "16 Rails" item and use it on a block.
   - Rails will be placed in the direction you are facing, following the pattern described above.
   - The number of patterns placed matches the number of items held.

## Technical Details

- **Main Script:** `scripts/main.ts`
  - Handles the custom item logic and rail placement.
  - Uses the Minecraft Bedrock Scripting API (`@minecraft/server`).
- **Behavior Pack Manifest:** `behavior_packs/16_rails/manifest.json`
- **Resource Pack:** Includes custom textures for the item in `resource_packs/16_rails/textures/items/`.

## Customization

- You can modify the rail pattern length or logic in `scripts/main.ts`.
- Change item properties in `behavior_packs/16_rails/items/16_rails.json`.
- Update textures in the resource pack folder.

## Development

- TypeScript is used for scripting. Edit files in the `scripts/` folder.
- Use `npm run local-deploy -- --watch` for live development and auto-deploy.
- Lint your code with:
  ```powershell
  npm run lint
  ```
- Auto-fix lint issues:
  ```powershell
  npm run lint -- --fix
  ```

## Credits

- Based on the Minecraft TypeScript Starter Project by Microsoft.
- Custom scripting and automation by project contributors.

## License

This project is open source. See `LICENSE` for details.
