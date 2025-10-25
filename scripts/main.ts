import {
  system,
  ItemComponentUseEvent,
  CustomComponentParameters,
  world,
  ItemComponentUseOnEvent,
} from "@minecraft/server";

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
      for (let i = 0; i < 15; i++) {
        const loc = { x: block.x + dx * i, y: block.y + 1, z: block.z + dz * i };
        const targetBlock = dimension.getBlock(loc);
        // Only place if block above is air or undefined
        if (targetBlock && (targetBlock.typeId === "minecraft:air" || targetBlock.typeId === undefined)) {
          targetBlock.setType("minecraft:rail");
          placed++;
          lastRailLoc = loc;
        }
      }

      // Place powered rail and redstone block at the end
      if (lastRailLoc) {
        // world.sendMessage(`Placed ${placed} rails and 1 powered rail with redstone block.`);
        const poweredRailBlock = dimension.getBlock(lastRailLoc);
        if (poweredRailBlock) poweredRailBlock.setType("minecraft:golden_rail");
        const redstoneLoc = { x: lastRailLoc.x, y: lastRailLoc.y - 1, z: lastRailLoc.z };
        const redstoneBlock = dimension.getBlock(redstoneLoc);
        if (redstoneBlock) redstoneBlock.setType("minecraft:redstone_block");
      }
    },
  });
});
