const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import the Equipment model
const Equipment = require('./models/equipment.model');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://umernusratjaved_db_user:WGlc4xHOKBDdmdIa@maint-data-cluster.2uboyxj.mongodb.net/?retryWrites=true&w=majority&appName=maint-data-cluster";
    
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Parse CSV data and create vehicle entries
const parseAndPopulateVehicles = () => {
  const vehicles = [];

  // A VEHICLES
  const aVehicles = [
    { unNumber: "20375", baNumber: "20AT0461", type: "APC Wheeled PUMA Infantry Carrier - armed (Class-I)", year: 2016, location: "KB" },
    { unNumber: "20376", baNumber: "20AT0462", type: "APC Wheeled PUMA Infantry Carrier - armed (Class-I)", year: 2016, location: "KB" },
    { unNumber: "20377", baNumber: "20AT0463", type: "APC Wheeled PUMA Infantry Carrier - armed (Class-I)", year: 2016, location: "KB" },
    { unNumber: "20378", baNumber: "20AT0464", type: "APC Wheeled PUMA Infantry Carrier - armed (Class-I)", year: 2016, location: "KB" },
    { unNumber: "20423", baNumber: "20AT2064", type: "APCs Wheeled Infantry Carrier Armed (Class-I)", year: 2016, location: "KB" },
    { unNumber: "20379", baNumber: "22SW0823", type: "MRAP Mine Resistant Ambush Protected Vehicle", year: 2018, location: "KB" }
  ];

  // B VEHICLES
  const bVehicles = [
    { unNumber: "UN-20250", type: "Toyota Hilux Pickup Double Cabin", year: 2012, location: "KB" },
    { unNumber: "UN-20418", type: "Jeep (4X4) With Military Radio", year: 2020, location: "Bangui" },
    { unNumber: "UN-20419", type: "Jeep (4X4) With Military Radio", year: 2020, location: "KB" },
    { unNumber: "UN-20426", type: "Jeep (4X4) With Military Radio", year: 2016, location: "Bangui" },
    { unNumber: "UN-20427", type: "Jeep (4X4) With Military Radio", year: 2013, location: "KB" },
    { unNumber: "UN-20428", type: "Jeep (4X4) With Military Radio", year: 2012, location: "Bangui" },
    { unNumber: "UN-20429", type: "Jeep (4X4) With Military Radio", year: 2016, location: "N'DELE" },
    { unNumber: "UN-20195", type: "Trk 1/4 Ton Jeep 4x4 RK JMR", year: 2004, location: "KB" },
    { unNumber: "UN-20424", type: "Jeep (4X4) With Military Radio", year: 2013, location: "Bangui" },
    { unNumber: "UN-20425", type: "Jeep (4X4) With Military Radio", year: 2013, location: "Bangui" },
    { unNumber: "UN-20191", type: "Trk ¼ Ton Land Rover Defender 90 GS", year: 2011, location: "KB" },
    { unNumber: "UN-20192", type: "Trk ¼ Ton Land Rover Defender 90 GS", year: 2011, location: "KB" },
    { unNumber: "UN-20137", type: "Trk ¼ Ton Land Rover Defender 90 GS", year: 2011, location: "KB" },
    { unNumber: "UN-20011", type: "Trk ¼ Ton Land Rover Defender 90 GS", year: 2011, location: "KB" },
    { unNumber: "UN-20136", type: "Trk ¼ Ton Land Rover Defender 90 GS", year: 1998, location: "KB" },
    { unNumber: "UN-20194", type: "Trk ¼ Ton Land Rover Defender 90 GS", year: 2005, location: "KB" },
    { unNumber: "UN-20193", type: "Trk ¼ Ton Land Rover Defender 90 GS", year: 2010, location: "KB" },
    { unNumber: "UN-20135", type: "Trk 1/4 Ton Land Rover Defender Amb", year: 2003, location: "KB" },
    { unNumber: "UN-20143", type: "Trk 1/4 Ton Land Rover Defender Amb", year: 2006, location: "KB" },
    { unNumber: "UN-20004", type: "Trk 1/4 Ton Land Rover Defender Amb 4 Stretcher", year: 2010, location: "KB" },
    { unNumber: "UN-20140", type: "Trk 1 Ton Land Rover Defender 110 Shop Set", year: 2007, location: "KB" },
    { unNumber: "UN-20139", type: "Trk 1 Ton Land Rover Defender 110 Shop Set", year: 2007, location: "KB" },
    { unNumber: "UN-20315", type: "Trk 2.5 Ton Hino Shop Set", year: 1983, location: "KB" },
    { unNumber: "UN-20012", type: "Trk 5 Ton Hino Shop Set", year: 2007, location: "KB" },
    { unNumber: "UN-20005", type: "Trk 5 Ton Hino (4x4) GS Single Rear Wh", year: 2013, location: "KB" },
    { unNumber: "UN-20313", type: "Trk 5 Ton Hino (4x4) GS Single Rear Wh", year: 2013, location: "KB" },
    { unNumber: "UN-20196", type: "Trk 5 Ton Hino (4x4) GS Single Rear Wh", year: 2013, location: "KB" },
    { unNumber: "UN-20197", type: "Trk 5 Ton Hino (4x4) GS Single Rear Wh", year: 2013, location: "N'DELE" },
    { unNumber: "UN-20198", type: "Trk 5 Ton Hino (4x4) GS Single Rear Wh", year: 2009, location: "N'DELE" },
    { unNumber: "UN-20199", type: "Trk 5 Ton Hino (4x4) GS Single Rear Wh", year: 2013, location: "Grimari" },
    { unNumber: "UN-20200", type: "Trk 5 Ton Hino (4x4) GS Single Rear Wh", year: 2013, location: "KB" },
    { unNumber: "UN-20437", type: "Truck Utility Cargo (5 Tons) - ILO Over 5 Tons", year: 2020, location: "KB" },
    { unNumber: "UN-20314", type: "Trk 5 Ton Hino Water Bowzer (4500 lits)", year: 2005, location: "Grimari" },
    { unNumber: "UN-20149", type: "Trk 5 Ton Hino Water Bowzer (4500 lits)", year: 2010, location: "KB" },
    { unNumber: "UN-20120", type: "Trk 5 Ton Hino Water Bowzer (4500 lits)", year: 2005, location: "KB" },
    { unNumber: "UN-20203", type: "Trk 5 Ton Hino Water Bowzer (4500 lits)", year: 2010, location: "KB" },
    { unNumber: "UN-20204", type: "Trk 5 Ton Hino Water Bowzer (4500 lits)", year: 2005, location: "KB" },
    { unNumber: "UN-20006", type: "Trk 5 Ton Hino Water Bowzer (4500 lits)", year: 2010, location: "N'DELE" },
    { unNumber: "UN-20150", type: "Trk 5 Ton Hino Fuel Bowzer (4500 lits)", year: 2005, location: "Grimari" },
    { unNumber: "UN-20151", type: "Trk 5 Ton Hino Fuel Bowzer (4500 lits)", year: 2005, location: "KB" },
    { unNumber: "UN-20013", type: "Trk 5 Ton Hino Fuel Bowzer (4500 lits)", year: 2005, location: "KB" },
    { unNumber: "UN-20436", type: "Truck, Tanker (Upto 5,000 Litres)", year: 2012, location: "KB" },
    { unNumber: "UN-20434", type: "Truck, Sewer Cleaning", year: 2017, location: "KB" },
    { unNumber: "UN-20420", type: "Truck, Refrigerator (Under 20 Feet)", year: 2021, location: "KB" },
    { unNumber: "UN-20421", type: "Truck, Refrigerator (Under 20 Feet)", year: 2021, location: "KB" },
    { unNumber: "UN-20422", type: "Truck, Refrigerator (Under 20 Feet)", year: 2021, location: "KB" },
    { unNumber: "UN-20121", type: "Trk 7.5 Ton IVECO LRV", year: 2005, location: "KB" },
    { unNumber: "UN-20147", type: "Trk 7.5 Ton IVECO LRV", year: 2003, location: "KB" },
    { unNumber: "UN-20206", type: "Dump Trk 15 Ton Mitsubishi Fuso", year: 2014, location: "KB" },
    { unNumber: "UN-20146", type: "Dump Trk 15 Ton Mitsubishi Fuso", year: 2014, location: "KB" },
    { unNumber: "UN-20119", type: "Dump Trk 15 Ton Mitsubishi Fuso", year: 2014, location: "N'DELE" },
    { unNumber: "UN-20144", type: "Dump Trk 15 Ton Mitsubishi Fuso", year: 2014, location: "Sibut" },
    { unNumber: "UN-20145", type: "Dump Trk 15 Ton Mitsubishi Fuso", year: 2014, location: "N'DELE" },
    { unNumber: "UN-20207", type: "Dump Trk 15 Ton Mitsubishi Fuso", year: 2014, location: "Batangafo" },
    { unNumber: "UN-20208", type: "Dump Trk 15 Ton Mitsubishi Fuso", year: 2014, location: "N'DELE" },
    { unNumber: "UN-20209", type: "Dump Trk 15 Ton Mitsubishi Fuso", year: 2014, location: "N'DELE" },
    { unNumber: "UN-20210", type: "Dump Trk 15 Ton Mitsubishi Fuso", year: 2014, location: "KB" },
    { unNumber: "UN-20211", type: "Dump Trk 15 Ton Mitsubishi Fuso", year: 2014, location: "Grimari" }
  ];

  // C VEHICLES (Plant Equipment)
  const cVehicles = [
    { unNumber: "UN-20213", type: "FE Loader", year: 2007, location: "KB" },
    { unNumber: "UN-20212", type: "FE Loader", year: 2007, location: "N'DELE" },
    { unNumber: "UN-20442", type: "FE Loader", year: 2020, location: "KB" },
    { unNumber: "UN-20328", type: "Fork Lifter 7 ton", year: 2006, location: "KB" },
    { unNumber: "UN-20221", type: "Fork Lifter 7 ton", year: 2006, location: "KB" },
    { unNumber: "UN-20101", type: "Fork Lifter 7 ton", year: 2006, location: "KB" },
    { unNumber: "UN-20220", type: "Fork Lifter 15 ton", year: 2006, location: "KB" },
    { unNumber: "UN-20215", type: "Excavator", year: 2014, location: "KB" },
    { unNumber: "UN-20214", type: "Excavator", year: 2014, location: "Grimari" },
    { unNumber: "UN-20441", type: "Excavator", year: 2014, location: "N'DELE" },
    { unNumber: "UN-20325", type: "Dozer D-85", year: 2014, location: "N'DELE" },
    { unNumber: "UN-20217", type: "Dozer D-85", year: 2014, location: "Grimari" },
    { unNumber: "UN-20327", type: "Dozer D-40", year: 1983, location: "KB" },
    { unNumber: "UN-20326", type: "Dozer D-41", year: 1986, location: "KB" },
    { unNumber: "UN-20216", type: "Kato Crane 25 Ton", year: 2008, location: "Sibut" },
    { unNumber: "UN-20324", type: "Kato Crane 25 Ton", year: 2011, location: "KB" },
    { unNumber: "UN-20127", type: "Kato Crane 25 Ton", year: 2007, location: "Batangafo" },
    { unNumber: "UN-20219", type: "Kato Crane 20 Ton", year: 1983, location: "KB" },
    { unNumber: "UN-20312", type: "Motor Grader", year: 2007, location: "Grimari" },
    { unNumber: "UN-20218", type: "Motor Grader", year: 2007, location: "KB" },
    { unNumber: "UN-20443", type: "Motor Grader", year: 2006, location: "N'DELE" },
    { unNumber: "UN-20240", type: "Road Roller", year: 2014, location: "N'DELE" },
    { unNumber: "UN-20241", type: "Road Roller", year: 2014, location: "Grimari" },
    { unNumber: "UN-20438", type: "Tractor", year: 1990, location: "N'DELE" },
    { unNumber: "UN-20439", type: "Tractor with Bucket", year: 2006, location: "KB" },
    { unNumber: "UN-20440", type: "Tractor with Bucket", year: 2006, location: "KB" }
  ];

  // TRAILERS
  const trailers = [
    { unNumber: "UN-20320", type: "Fuel Tlr 3500 litre", year: 2006, location: "KB" },
    { unNumber: "UN-20321", type: "Fuel Tlr 3500 litre", year: 2006, location: "N'DELE" },
    { unNumber: "UN-20430", type: "Fuel Tlr (2,000-7,000 litres)", year: 2014, location: "KB" },
    { unNumber: "UN-20431", type: "Fuel Tlr (2,000-7,000 litres)", year: 2014, location: "KB" },
    { unNumber: "UN-20432", type: "Fuel Tlr (2,000-7,000 litres)", year: 2014, location: "KB" },
    { unNumber: "UN-20335", type: "Heavy Equipment Tlr", year: 2011, location: "Grimari" },
    { unNumber: "UN-20336", type: "Heavy Equipment Tlr", year: 2011, location: "KB" },
    { unNumber: "UN-20333", type: "Lowbed Tlr 20-40 Tons", year: 2011, location: "KB" },
    { unNumber: "UN-20334", type: "Lowbed Tlr 20-40 Tons", year: 2011, location: "N'DELE" },
    { unNumber: "UN-20322", type: "Water Tlr 3500 litre", year: 2006, location: "N'DELE" },
    { unNumber: "UN-20323", type: "Water Tlr 3500 litre", year: 2006, location: "KB" },
    { unNumber: "UN-20433", type: "Water Tlr (2,000-7,000 litres)", year: 2017, location: "KB" },
    { unNumber: "UN-20435", type: "Water Tlr (2,000-7,000 litres)", year: 2017, location: "KB" }
  ];

  // GENERATOR SETS
  const generatorSets = [
    { unNumber: "CD4045C069748", type: "Gen Set 80 KVA (John Deere)", year: 2020, location: "KB" },
    { unNumber: "U567051W", type: "Gen Set 80 KVA (Perkins)", year: 2018, location: "N'DELE" },
    { unNumber: "U589974X", type: "Gen Set 80 KVA (Perkins)", year: 2019, location: "KB" },
    { unNumber: "U589991X", type: "Gen Set 80 KVA (Perkins)", year: 2019, location: "KB", remarks: "Gen fwd to Pak for O/H" },
    { unNumber: "CD4045B112625", type: "Gen Set 80 KVA (John Deere)", year: 2017, location: "KB" },
    { unNumber: "CD4045B146408", type: "Gen Set 80 KVA (John Deere)", year: 2018, location: "KB" },
    { unNumber: "U590200X", type: "Gen Set 80 KVA (Perkins)", year: 2019, location: "N'DELE" },
    { unNumber: "UN-20450", type: "Gen Set 80 KVA (John Deere)", year: 2020, location: "KB" },
    { unNumber: "UN-20451", type: "Gen Set 80 KVA (John Deere)", year: 2020, location: "KB" },
    { unNumber: "UN-20452", type: "Gen Set 80 KVA (John Deere)", year: 2020, location: "KB" },
    { unNumber: "UN-20453", type: "Gen Set 80 KVA (John Deere)", year: 2020, location: "KB" },
    { unNumber: "UN-20454", type: "Gen Set 80 KVA (John Deere)", year: 2020, location: "KB" },
    { unNumber: "CD4045B144925", type: "Gen Set 80 KVA (John Deere)", year: 2018, location: "KB", remarks: "Gen fwd to Pak for O/H" },
    { unNumber: "U907131-T", type: "Gen Set 50 KVA (Perkins)", year: 2015, location: "KB" },
    { unNumber: "U902244S", type: "Gen Set 50 KVA (Perkins)", year: 2014, location: "KB", remarks: "Gen fwd to Pak for O/H" },
    { unNumber: "U907132-T", type: "Gen Set 50 KVA (Perkins)", year: 2015, location: "KB" },
    { unNumber: "CD3029B136228", type: "Gen Set 40 KVA (John Deere)", year: 2017, location: "KB" },
    { unNumber: "U410914Y", type: "Gen Set 30 KVA (Perkins)", year: 2012, location: "KB" },
    { unNumber: "U410909Y", type: "Gen Set 30 KVA (Perkins)", year: 2012, location: "Grimari" },
    { unNumber: "U399816-Y", type: "Gen Set 30 KVA (Perkins)", year: 2011, location: "KB" },
    { unNumber: "84117753-002", type: "Gen Set 9 KVA (Kohlar)", year: 2016, location: "KB" },
    { unNumber: "83521833-006", type: "Gen Set 9 KVA (Kohlar)", year: 2016, location: "KB" },
    { unNumber: "IEU1505", type: "Gen Set 5 KVA (Kubota)", year: 2018, location: "Grimari" },
    { unNumber: "4875525", type: "Gen Set 5 KVA", year: 2017, location: "KB" },
    { unNumber: "IEU1792", type: "Gen Set 5 KVA (Kubota)", year: 2018, location: "KB" },
    { unNumber: "4865076", type: "Gen Set 5 KVA", year: 2017, location: "KB" },
    { unNumber: "4865109", type: "Gen Set 5 KVA", year: 2017, location: "KB" },
    { unNumber: "IEU2743", type: "Gen Set 5 KVA (Kubota)", year: 2019, location: "Sibut" }
  ];

  // Convert all to standard format matching the Equipment model schema
  aVehicles.forEach(v => vehicles.push({ 
    vehicleId: v.baNumber || v.unNumber, // Use BA Number as vehicleId if available
    unNumber: v.unNumber, // Keep UN Number separate
    vehicleType: v.type, // Vehicle Type from CSV
    name: v.type, 
    category: "A Vehicle", 
    location: v.location || "KB", 
    year: v.year, 
    status: "Operational",
    manufacturer: v.type.includes('PUMA') ? 'PUMA' : v.type.includes('MRAP') ? 'MRAP' : 'Unknown'
  }));
  
  bVehicles.forEach(v => vehicles.push({ 
    vehicleId: v.unNumber, 
    unNumber: v.unNumber, // Keep UN Number separate
    vehicleType: v.type, // Vehicle Type from CSV
    name: v.type, 
    category: "B Vehicle", 
    location: v.location || "KB", 
    year: v.year, 
    status: "Operational",
    manufacturer: v.type.includes('Toyota') ? 'Toyota' : v.type.includes('Land Rover') ? 'Land Rover' : 
                 v.type.includes('Hino') ? 'Hino' : v.type.includes('IVECO') ? 'IVECO' : 
                 v.type.includes('Mitsubishi') ? 'Mitsubishi' : 'Unknown'
  }));
  
  cVehicles.forEach(v => vehicles.push({ 
    vehicleId: v.unNumber, 
    unNumber: v.unNumber, // Keep UN Number separate
    vehicleType: v.type, // Vehicle Type from CSV
    name: v.type, 
    category: "Plant", 
    location: v.location || "KB", 
    year: v.year, 
    status: "Operational",
    manufacturer: v.type.includes('Kato') ? 'Kato' : v.type.includes('Dozer') ? 'Caterpillar' : 'Unknown'
  }));
  
  trailers.forEach(v => vehicles.push({ 
    vehicleId: v.unNumber, 
    unNumber: v.unNumber, // Keep UN Number separate
    vehicleType: v.type, // Vehicle Type from CSV
    name: v.type, 
    category: "Plant", // Trailers categorized as Plant equipment
    location: v.location || "KB", 
    year: v.year, 
    status: "Operational",
    manufacturer: 'Unknown'
  }));
  
  generatorSets.forEach(v => {
    // Extract KVA from the type
    const kvaMatch = v.type.match(/(\d+)\s*KVA/i);
    const kva = kvaMatch ? parseInt(kvaMatch[1]) : null;
    
    vehicles.push({ 
      vehicleId: v.unNumber, 
      unNumber: v.unNumber, // Keep UN Number separate
      vehicleType: v.type, // Vehicle Type from CSV
      name: v.type, 
      category: "Generator Set", 
      location: v.location || "KB", 
      year: v.year, 
      status: v.remarks && v.remarks.includes('O/H') ? "For Overhaul" : "Operational",
      kva: kva,
      manufacturer: v.type.includes('John Deere') ? 'John Deere' : 
                   v.type.includes('Perkins') ? 'Perkins' : 
                   v.type.includes('Kohlar') ? 'Kohler' : 
                   v.type.includes('Kubota') ? 'Kubota' : 'Unknown',
      remarks: v.remarks || ''
    });
  });

  return vehicles;
};

const populateDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Clearing existing equipment...');
    await Equipment.deleteMany({});
    console.log('✅ Existing equipment cleared');

    console.log('📊 Parsing vehicle data...');
    const vehicles = parseAndPopulateVehicles();
    
    console.log(`📦 Inserting ${vehicles.length} vehicles...`);
    
    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];
      try {
        await Equipment.create(vehicle);
        console.log(`✅ Created: ${vehicle.vehicleId} - ${vehicle.name}`);
      } catch (error) {
        console.error(`❌ Failed to create ${vehicle.vehicleId}:`, error.message);
      }
    }
    
    console.log('🎉 Database population completed!');
    
    // Summary
    const totalVehicles = await Equipment.countDocuments();
    const aVehicleCount = await Equipment.countDocuments({ category: "A Vehicle" });
    const bVehicleCount = await Equipment.countDocuments({ category: "B Vehicle" });
    const plantEquipmentCount = await Equipment.countDocuments({ category: "Plant" });
    const generatorCount = await Equipment.countDocuments({ category: "Generator Set" });
    
    console.log('\n📋 SUMMARY:');
    console.log('════════════════════════════════════════');
    console.log(`📊 Total Equipment: ${totalVehicles}`);
    console.log(`🚗 A Vehicles: ${aVehicleCount}`);
    console.log(`🚛 B Vehicles: ${bVehicleCount}`);
    console.log(`🏗️  Plant Equipment (C Vehicles + Trailers): ${plantEquipmentCount}`);
    console.log(`⚡ Generator Sets: ${generatorCount}`);
    console.log('════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
};

populateDatabase();