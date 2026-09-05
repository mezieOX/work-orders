/**
 * Seed script — run with: pnpm seed
 * Writes a handful of realistic sample work orders into data/work-orders.json.
 */
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { WorkOrder } from "../src/lib/types";

const DATA_PATH = path.join(process.cwd(), "data", "work-orders.json");

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

const samples: WorkOrder[] = [
  {
    id: uuidv4(),
    title: "Replace HVAC filter — Bay 3",
    description:
      "Customer reported weak airflow. Swap MERV-13 filter, check condensate line, confirm thermostat setpoint.",
    priority: "Medium",
    status: "Open",
    updatedAt: hoursAgo(2),
  },
  {
    id: uuidv4(),
    title: "Diagnose intermittent network drop",
    description:
      "Office switches lose uplink every ~40 minutes. Capture logs from edge switch, reseat SFP, verify PoE budget.",
    priority: "High",
    status: "In Progress",
    updatedAt: hoursAgo(5),
  },
  {
    id: uuidv4(),
    title: "Calibrate conveyor photo-eye",
    description:
      "Line 2 false-triggers at high speed. Realign sensor, clean lens, update PLC debounce to 12ms.",
    priority: "High",
    status: "Open",
    updatedAt: hoursAgo(12),
  },
  {
    id: uuidv4(),
    title: "Annual fire extinguisher check",
    description:
      "Walk all floors, verify tags and pressure gauges, log any units needing recharge.",
    priority: "Low",
    status: "Done",
    updatedAt: hoursAgo(48),
  },
  {
    id: uuidv4(),
    title: "Install LED shop lights — aisle B",
    description:
      "Mount six 4ft fixtures, wire to existing junction box, leave old fluorescents for disposal.",
    priority: "Medium",
    status: "In Progress",
    updatedAt: hoursAgo(26),
  },
];

async function seed() {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, `${JSON.stringify(samples, null, 2)}\n`, "utf8");
  console.log(`Seeded ${samples.length} work orders → ${DATA_PATH}`);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
