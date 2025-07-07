// Script to add Unitree B2-W to robots.json
const unitreeB2W = {
  "id": "unitree-b2w",
  "title": "Unitree B2-W",
  "slug": "unitree-b2w",
  "manufacturer": "Unitree Robotics",
  "category": "Quadruped",
  "featured": true,
  "image": "images/robots/unitree-b2w/unitree-b2w-main.jpg",
  "description": "Unitree B2‑W is a rugged, wheeled-quadruped robot capable of 20 km/h all-terrain mobility, heavy payloads, and autonomous navigation.",
  "fullDescription": "The Unitree B2‑W is a hybrid quadruped robot from Unitree Robotics, combining legged agility with wheeled speed. Designed as an industrial/field-grade platform, it adapts to stairs, slopes, rough ground, and flat surfaces with seamless leg-wheel transformation. It's tailored for robust tasks such as inspection, logistics, rescue, and autonomous patrolling.",
  "specifications": {
    "Dimensions (Standing)": "1098 × 550 × 758 mm",
    "Dimensions (Prone)": "950 × 550 × 450 mm", 
    "Weight": "75–85 kg (with battery)",
    "Battery": "58V, >2 kWh (~2250 Wh)",
    "Max Speed (Wheels)": "20 km/h (≈5 m/s)",
    "Max Speed (Legs)": "Up to 6 m/s",
    "Endurance (No Load)": "5 hours (~70 km)",
    "Endurance (20kg Load)": "4 hours (~25 km)",
    "Static Payload": "120 kg",
    "Dynamic Payload": ">40 kg (while walking)",
    "Stair Climbing": "20–25 cm continuous, up to 40 cm stepping",
    "Slope Capability": ">45°",
    "Jump Distance": ">1.6 m horizontal, 0.5–1.2 m ditch width",
    "Protection Rating": "IP67 dust/water protection",
    "Operating Temperature": "–20°C to 55°C",
    "Processors": "Intel Core i5/i7, optional Nvidia Jetson Orin NX",
    "Sensors": "3D LiDAR (optional), depth & optical cameras, IMUs"
  },
  "capabilities": [
    "Adaptive Locomotion: Seamlessly switches between wheels and legs for optimal performance",
    "Terrain Resilience: Excellent balance on gravel, grass, stairs, inclines, and uneven ground",
    "Obstacle Navigation: Capable of stair navigation and acrobatic maneuvers",
    "Autonomous Operations: Equipped with mapping, path planning, OTA updates, and remote control",
    "Heavy Lifting: Can carry over 40 kg while moving and support up to 120 kg statically",
    "Environmental Durability: IP67 protection enables operation in harsh weather conditions"
  ],
  "applications": [
    "Industrial Inspection: Patrol pipelines, power grids, and remote infrastructures",
    "Logistics & Transport: Deliver goods across warehouses, farms, mines, or outdoor facilities",
    "Emergency & Rescue: Navigate disaster zones, rubble, or steep terrain to support rescue teams",
    "Research & Development: Versatile testbed for payload, sensor integrations, and navigation research",
    "Security & Surveillance: Autonomous site monitoring with onboard LiDAR and cameras",
    "Agricultural Operations: Field monitoring, crop inspection, and automated farming tasks"
  ],
  "videos": [
    {
      "title": "Unitree B2-W - Official Demonstration",
      "url": "https://www.youtube.com/watch?v=X2UxtKLZnNo",
      "embedUrl": "https://www.youtube.com/embed/X2UxtKLZnNo"
    }
  ],
  "images": [
    "images/robots/unitree-b2w/unitree-b2w-main.jpg",
    "images/robots/unitree-b2w/unitree-b2w-terrain.jpg",
    "images/robots/unitree-b2w/unitree-b2w-specs.jpg",
    "images/robots/unitree-b2w/unitree-b2w-side.jpg"
  ],
  "sources": [
    {
      "title": "Unitree Robotics - Official Website",
      "url": "https://www.unitree.com/"
    }
  ],
  "tags": ["Quadruped", "All-Terrain", "Autonomous", "Industrial", "Inspection", "Logistics", "Unitree"],
  "releaseYear": "2024",
  "status": "Commercial",
  "price": "~$100,000 USD"
};

console.log("Unitree B2-W robot data ready to be added to robots.json");
console.log(JSON.stringify(unitreeB2W, null, 2));
