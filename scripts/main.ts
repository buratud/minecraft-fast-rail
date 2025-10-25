import {
  system,
  ItemComponentUseEvent,
  CustomComponentParameters,
  world,
  ItemComponentUseOnEvent,
  ItemStack,
} from "@minecraft/server";
import { MinecraftItemTypes } from "@minecraft/vanilla-data";

system.beforeEvents.startup.subscribe((initEvent) => {
  initEvent.itemComponentRegistry.registerCustomComponent("yay:place_rail", {
    onUse(event: ItemComponentUseEvent, paramaters: CustomComponentParameters) {},
    onUseOn(event: ItemComponentUseOnEvent, parameters: CustomComponentParameters) {
      const block = event.block;
      if (!block) return;
      const dimension = block.dimension;

      // Helper to check rail types
      const isRail = (typeId: string) =>
        ["minecraft:rail", "minecraft:golden_rail", "minecraft:activator_rail", "minecraft:detector_rail"].includes(
          typeId
        );

      if (isRail(block.typeId)) {
        return;
      }

      // Get player direction
      const player = event.source;
      if (!player || !("getViewDirection" in player)) {
        return;
      }
      const direction = player.getViewDirection(); // {x, y, z}
      // Normalize direction to main axis (x or z)
      let dx = Math.abs(direction.x) > Math.abs(direction.z) ? Math.sign(direction.x) : 0;
      let dz = dx === 0 ? Math.sign(direction.z) : 0;

      if (dx === 0 && dz === 0) {
        return;
      }

      let placed = 0;
      let lastRailLoc = null;
      // Get the number of items held by the player from inventory

      let itemCount = 1;
      const inventoryComp = player.getComponent("minecraft:inventory");
      if (inventoryComp && inventoryComp.container) {
        for (let slot = 0; slot < inventoryComp.container.size; slot++) {
          const item = inventoryComp.container.getItem(slot);
          if (item && item.typeId.startsWith("yay:16_rails")) {
            itemCount = item.amount;
            break;
          }
        }
      }

      for (let n = 0; n < itemCount; n++) {
        let segmentLastLoc = null;
        for (let i = 0; i < 16; i++) {
          const loc = { x: block.x + dx * (i + n * 16), y: block.y + 1, z: block.z + dz * (i + n * 16) };
          const targetBlock = dimension.getBlock(loc);
          // Only place if block above is air or undefined
          if (targetBlock && (targetBlock.typeId === "minecraft:air" || targetBlock.typeId === undefined)) {
            if (i === 15) {
              // Place powered rail at the end of each segment
              targetBlock.setType("minecraft:golden_rail");
              // Place redstone block below powered rail
              const redstoneLoc = { x: loc.x, y: loc.y - 1, z: loc.z };
              const redstoneBlock = dimension.getBlock(redstoneLoc);
              redstoneBlock?.setType("minecraft:redstone_block");
            } else {
              targetBlock.setType("minecraft:rail");
            }
            placed++;
            segmentLastLoc = loc;
          }
        }
      }
    },
  });
});
