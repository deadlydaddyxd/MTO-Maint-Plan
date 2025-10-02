// Vehicle data for the maintenance system
const vehicleData = {
  aVehicles: [
    {
      id: "A001",
      registration: "MIL-A-001",
      make: "Toyota",
      model: "Hilux",
      year: 2020,
      status: "Active",
      lastMaintenance: "2024-09-15",
      nextMaintenance: "2024-12-15",
      mileage: 45000,
      unit: "Transport Company A"
    },
    {
      id: "A002",
      registration: "MIL-A-002",
      make: "Ford",
      model: "Ranger",
      year: 2019,
      status: "Active",
      lastMaintenance: "2024-08-20",
      nextMaintenance: "2024-11-20",
      mileage: 52000,
      unit: "Transport Company A"
    }
  ],
  
  bVehicles: [
    {
      id: "B001",
      registration: "MIL-B-001",
      make: "Mercedes",
      model: "Unimog U4000",
      year: 2018,
      status: "Active",
      lastMaintenance: "2024-09-10",
      nextMaintenance: "2024-12-10",
      mileage: 38000,
      unit: "Engineer Battalion"
    },
    {
      id: "B002",
      registration: "MIL-B-002",
      make: "Volvo",
      model: "FH16",
      year: 2020,
      status: "Under Maintenance",
      lastMaintenance: "2024-09-25",
      nextMaintenance: "2024-12-25",
      mileage: 42000,
      unit: "Logistics Battalion"
    },
    {
      id: "B003",
      registration: "MIL-B-003",
      make: "Scania",
      model: "R500",
      year: 2019,
      status: "Active",
      lastMaintenance: "2024-08-15",
      nextMaintenance: "2024-11-15",
      mileage: 48000,
      unit: "Transport Company B"
    }
  ],
  
  plantEquipment: [
    {
      id: "C001",
      registration: "MIL-C-001",
      make: "Caterpillar",
      model: "320D Excavator",
      year: 2017,
      status: "Active",
      lastMaintenance: "2024-09-05",
      nextMaintenance: "2024-12-05",
      operatingHours: 2800,
      unit: "Engineer Company"
    },
    {
      id: "C002",
      registration: "MIL-C-002",
      make: "Komatsu",
      model: "D65PX Bulldozer",
      year: 2018,
      status: "Active",
      lastMaintenance: "2024-08-30",
      nextMaintenance: "2024-11-30",
      operatingHours: 2400,
      unit: "Engineer Company"
    },
    {
      id: "C003",
      registration: "MIL-C-003",
      make: "JCB",
      model: "4CX Backhoe",
      year: 2019,
      status: "Under Maintenance",
      lastMaintenance: "2024-09-20",
      nextMaintenance: "2024-12-20",
      operatingHours: 1800,
      unit: "Engineer Battalion"
    }
  ],
  
  generatorSets: [
    {
      id: "G001",
      registration: "MIL-G-001",
      make: "Cummins",
      model: "C250 D5",
      year: 2020,
      status: "Active",
      lastMaintenance: "2024-09-12",
      nextMaintenance: "2024-12-12",
      operatingHours: 1200,
      unit: "Signal Company",
      powerRating: "250kVA"
    },
    {
      id: "G002",
      registration: "MIL-G-002",
      make: "Perkins",
      model: "1306C-E87TAG4",
      year: 2019,
      status: "Active",
      lastMaintenance: "2024-08-25",
      nextMaintenance: "2024-11-25",
      operatingHours: 1500,
      unit: "Engineer Battalion",
      powerRating: "200kVA"
    }
  ]
};

module.exports = { vehicleData };