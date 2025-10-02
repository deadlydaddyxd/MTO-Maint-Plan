const vehicleData = {
  plantEquipment: [
    { id: 'UN-20216', name: 'Kato Crane 25 Ton', location: 'Sibut', year: 2008, category: 'Plant' },
    { id: 'UN-20324', name: 'Kato Crane 25 Ton', location: 'KB', year: 2011, category: 'Plant' },
    { id: 'UN-20127', name: 'Kato Crane 25 Ton', location: 'Batagafo', year: 2007, category: 'Plant' },
    { id: 'UN-20219', name: 'Kato Crane 20 Ton', location: 'KB', year: 1983, category: 'Plant' },
    { id: 'UN-20312', name: 'Motor Grader', location: 'Grimari', year: 2007, category: 'Plant' },
    { id: 'UN-20218', name: 'Motor Grader', location: 'KB', year: 2007, category: 'Plant' },
    { id: 'UN-20443', name: 'Motor Grader', location: 'N\'DELE', year: 2006, category: 'Plant' },
    { id: 'UN-20213', name: 'FE Loader', location: 'KB', year: 2007, category: 'Plant' },
    { id: 'UN-20212', name: 'FE Loader', location: 'N\'DELE', year: 2007, category: 'Plant' },
    { id: 'UN-20442', name: 'FE Loader', location: 'KB', year: 2020, category: 'Plant' },
    { id: 'UN-20328', name: 'Fork Lifter 7 ton', location: 'KB', year: 2006, category: 'Plant' },
    { id: 'UN-20221', name: 'Fork Lifter 7 ton', location: 'KB', year: 2006, category: 'Plant' },
    { id: 'UN-20101', name: 'Fork Lifter 7 ton', location: 'KB', year: 2006, category: 'Plant' },
    { id: 'UN-20220', name: 'Fork Lifter 15 ton', location: 'KB', year: 2006, category: 'Plant' },
    { id: 'UN-20215', name: 'Excavator', location: 'KB', year: 2014, category: 'Plant' },
    { id: 'UN-20214', name: 'Excavator', location: 'Grimari', year: 2014, category: 'Plant' },
    { id: 'UN-20441', name: 'Excavator', location: 'N\'DELE', year: 2014, category: 'Plant' },
    { id: 'UN-20325', name: 'Dozer D-85', location: 'N\'DELE', year: 2014, category: 'Plant' },
    { id: 'UN-20217', name: 'Dozer D-85', location: 'Grimari', year: 2014, category: 'Plant' },
    { id: 'UN-20327', name: 'Dozer D-40', location: 'KB', year: 1983, category: 'Plant' },
    { id: 'UN-20326', name: 'Dozer D-41', location: 'KB', year: 1986, category: 'Plant' },
    { id: 'UN-20240', name: 'Road Roller', location: 'N\'DELE', year: 2014, category: 'Plant' },
    { id: 'UN-20241', name: 'Road Roller', location: 'Grimari', year: 2014, category: 'Plant' },
    { id: 'UN-20438', name: 'Tractor', location: 'N\'DELE', year: 1990, category: 'Plant' },
    { id: 'UN-20439', name: 'Tractor with Bucket', location: 'KB', year: 2006, category: 'Plant' },
    { id: 'UN-20440', name: 'Tractor with Bucket', location: 'KB', year: 2006, category: 'Plant' },
    { id: 'UN20223', name: 'Compressor Tlr', location: 'KB', year: 2014, category: 'Plant' },
    { id: 'UN20224', name: 'Compressor Tlr', location: 'KB', year: 2014, category: 'Plant' },
    { id: 'UN-20446', name: 'Floodlight Set with Generator', location: 'KB', year: 2015, category: 'Plant' },
    { id: 'UN-20447', name: 'Floodlight Set with Generator', location: 'KB', year: 2015, category: 'Plant' },
    { id: 'UN-20448', name: 'Floodlight Set with Generator', location: 'KB', year: 2015, category: 'Plant' },
    { id: 'UN-20449', name: 'Floodlight Set with Generator', location: 'KB', year: 2015, category: 'Plant' },
    { id: '136231071', name: 'Welding Plant', location: 'KB', year: 2010, category: 'Plant' },
    { id: '13115027071', name: 'Welding Plant', location: 'KB', year: 2010, category: 'Plant' },
    { id: '496', name: 'Concrete Mix Machine', location: 'KB', year: 2012, category: 'Plant' },
    { id: '882', name: 'Concrete Mix Machine', location: 'KB', year: 2012, category: 'Plant' },
    { id: '0910FS', name: 'Concrete Mix Machine', location: 'KB', year: 2012, category: 'Plant' },
    { id: '0910FT', name: 'Concrete Mix Machine', location: 'KB', year: 2012, category: 'Plant' },
    { id: '20444', name: 'Concrete Mix Machine', location: 'KB', year: 2012, category: 'Plant' },
    { id: '23977', name: 'Concrete Mix Machine', location: 'KB', year: 2012, category: 'Plant' }
  ],
  
  bVehicles: [
    { id: 'UN-20250', name: 'Toyota Hilux Pickup Double Cabin', location: 'KB', year: 2012, category: 'B Vehicle' },
    { id: 'UN-20418', name: 'Jeep (4X4) With Military Radio', location: 'Bangui', year: 2020, category: 'B Vehicle' },
    { id: 'UN-20419', name: 'Jeep (4X4) With Military Radio', location: 'KB', year: 2020, category: 'B Vehicle' },
    { id: 'UN-20426', name: 'Jeep (4X4) With Military Radio', location: 'Bangui', year: 2016, category: 'B Vehicle' },
    { id: 'UN-20427', name: 'Jeep (4X4) With Military Radio', location: 'KB', year: 2013, category: 'B Vehicle' },
    { id: 'UN-20428', name: 'Jeep (4X4) With Military Radio', location: 'Bangui', year: 2012, category: 'B Vehicle' },
    { id: 'UN-20429', name: 'Jeep (4X4) With Military Radio', location: 'N,DELE', year: 2016, category: 'B Vehicle' },
    { id: 'UN-20195', name: 'Trk 1/4 Ton Jeep 4x4 RK JMR', location: 'KB', year: 2004, category: 'B Vehicle' },
    { id: 'UN-20424', name: 'Jeep (4X4) With Military Radio', location: 'Bangui', year: 2013, category: 'B Vehicle' },
    { id: 'UN-20425', name: 'Jeep (4X4) With Military Radio', location: 'Bangui', year: 2013, category: 'B Vehicle' },
    { id: 'UN-20191', name: 'Trk ¼ Ton Land Rover Defender 90 GS', location: 'KB', year: 2011, category: 'B Vehicle' },
    { id: 'UN-20192', name: 'Trk ¼ Ton Land Rover Defender 90 GS', location: 'KB', year: 2011, category: 'B Vehicle' },
    { id: 'UN-20137', name: 'Trk ¼ Ton Land Rover Defender 90 GS', location: 'KB', year: 2011, category: 'B Vehicle' },
    { id: 'UN-20011', name: 'Trk ¼ Ton Land Rover Defender 90 GS', location: 'KB', year: 2011, category: 'B Vehicle' },
    { id: 'UN-20136', name: 'Trk ¼ Ton Land Rover Defender 90 GS', location: 'KB', year: 1998, category: 'B Vehicle' },
    { id: 'UN-20194', name: 'Trk ¼ Ton Land Rover Defender 90 GS', location: 'KB', year: 2005, category: 'B Vehicle' },
    { id: 'UN-20193', name: 'Trk ¼ Ton Land Rover Defender 90 GS', location: 'KB', year: 2010, category: 'B Vehicle' },
    { id: 'UN-20135', name: 'Trk 1/4 Ton Land Rover Defender Amb', location: 'KB', year: 2003, category: 'B Vehicle' },
    { id: 'UN-20143', name: 'Trk 1/4 Ton Land Rover Defender Amb', location: 'KB', year: 2006, category: 'B Vehicle' },
    { id: 'UN-20004', name: 'Trk 1/4 Ton Land Rover Defender Amb 4 Stretchure', location: 'KB', year: 2010, category: 'B Vehicle' },
    { id: 'UN-20140', name: 'Trk 1 Ton Land Rover Defender 110 Shop Set', location: 'KB', year: 2007, category: 'B Vehicle' },
    { id: 'UN-20139', name: 'Trk 1 Ton Land Rover Defender 110 Shop Set', location: 'KB', year: 2007, category: 'B Vehicle' },
    { id: 'UN-20315', name: 'Trk 2.5 Ton Hino Shop Set', location: 'KB', year: 1983, category: 'B Vehicle' },
    { id: 'UN-20012', name: 'Trk 5 Ton Hino Shop Set', location: 'KB', year: 2007, category: 'B Vehicle' },
    { id: 'UN-20005', name: 'Trk 5 Ton Hino (4x4) GS Single Rear Wh', location: 'KB', year: 2013, category: 'B Vehicle' },
    { id: 'UN-20313', name: 'Trk 5 Ton Hino (4x4) GS Single Rear Wh', location: 'KB', year: 2013, category: 'B Vehicle' },
    { id: 'UN-20196', name: 'Trk 5 Ton Hino (4x4) GS Single Rear Wh', location: 'KB', year: 2013, category: 'B Vehicle' },
    { id: 'UN-20197', name: 'Trk 5 Ton Hino (4x4) GS Single Rear Wh', location: 'N,DELE', year: 2013, category: 'B Vehicle' },
    { id: 'UN-20198', name: 'Trk 5 Ton Hino (4x4) GS Single Rear Wh', location: 'N,DELE', year: 2009, category: 'B Vehicle' },
    { id: 'UN-20199', name: 'Trk 5 Ton Hino (4x4) GS Single Rear Wh', location: 'Grimari', year: 2013, category: 'B Vehicle' },
    { id: 'UN-20200', name: 'Trk 5 Ton Hino (4x4) GS Single Rear Wh', location: 'KB', year: 2013, category: 'B Vehicle' },
    { id: 'UN-20437', name: 'Truck Utility Cargo (5 Tons)', location: 'KB', year: 2020, category: 'B Vehicle' },
    { id: 'UN-20314', name: 'Trk 5 Ton Hino Water Bowzer (4500 lits)', location: 'Grimari', year: 2005, category: 'B Vehicle' },
    { id: 'UN-20149', name: 'Trk 5 Ton Hino Water Bowzer (4500 lits)', location: 'KB', year: 2010, category: 'B Vehicle' },
    { id: 'UN-20120', name: 'Trk 5 Ton Hino Water Bowzer (4500 lits)', location: 'KB', year: 2005, category: 'B Vehicle' },
    { id: 'UN-20203', name: 'Trk 5 Ton Hino Water Bowzer (4500 lits)', location: 'KB', year: 2010, category: 'B Vehicle' },
    { id: 'UN-20204', name: 'Trk 5 Ton Hino Water Bowzer (4500 lits)', location: 'KB', year: 2005, category: 'B Vehicle' },
    { id: 'UN-20006', name: 'Trk 5 Ton Hino Water Bowzer (4500 lits)', location: 'N,DELE', year: 2010, category: 'B Vehicle' },
    { id: 'UN-20150', name: 'Trk 5 Ton Hino Fuel Bowzer (4500 lits)', location: 'Grimari', year: 2005, category: 'B Vehicle' },
    { id: 'UN-20151', name: 'Trk 5 Ton Hino Fuel Bowzer (4500 lits)', location: 'KB', year: 2005, category: 'B Vehicle' },
    { id: 'UN-20013', name: 'Trk 5 Ton Hino Fuel Bowzer (4500 lits)', location: 'KB', year: 2005, category: 'B Vehicle' },
    { id: 'UN-20436', name: 'Truck, Tanker (Upto 5,000 Litres)', location: 'KB', year: 2012, category: 'B Vehicle' },
    { id: 'UN-20434', name: 'Truck, Sewer Cleaning', location: 'KB', year: 2017, category: 'B Vehicle' },
    { id: 'UN-20420', name: 'Truck, Refrigerator (Under 20 Feet)', location: 'KB', year: 2021, category: 'B Vehicle' },
    { id: 'UN-20421', name: 'Truck, Refrigerator (Under 20 Feet)', location: 'KB', year: 2021, category: 'B Vehicle' },
    { id: 'UN-20422', name: 'Truck, Refrigerator (Under 20 Feet)', location: 'KB', year: 2021, category: 'B Vehicle' },
    { id: 'UN-20121', name: 'Trk 7.5 Ton IVECO LRV', location: 'KB', year: 2005, category: 'B Vehicle' },
    { id: 'UN-20147', name: 'Trk 7.5 Ton IVECO LRV', location: 'KB', year: 2003, category: 'B Vehicle' },
    { id: 'UN-20206', name: 'Dump Trk 15 Ton Mitsubishi Fuso', location: 'KB', year: 2014, category: 'B Vehicle' },
    { id: 'UN-20146', name: 'Dump Trk 15 Ton Mitsubishi Fuso', location: 'KB', year: 2014, category: 'B Vehicle' },
    { id: 'UN-20119', name: 'Dump Trk 15 Ton Mitsubishi Fuso', location: 'N,DELE', year: 2014, category: 'B Vehicle' },
    { id: 'UN-20144', name: 'Dump Trk 15 Ton Mitsubishi Fuso', location: 'Sibut', year: 2014, category: 'B Vehicle' },
    { id: 'UN-20145', name: 'Dump Trk 15 Ton Mitsubishi Fuso', location: 'N,DELE', year: 2014, category: 'B Vehicle' },
    { id: 'UN-20207', name: 'Dump Trk 15 Ton Mitsubishi Fuso', location: 'Batagafu', year: 2014, category: 'B Vehicle' },
    { id: 'UN-20208', name: 'Dump Trk 15 Ton Mitsubishi Fuso', location: 'N,DELE', year: 2014, category: 'B Vehicle' },
    { id: 'UN-20209', name: 'Dump Trk 15 Ton Mitsubishi Fuso', location: 'N,DELE', year: 2014, category: 'B Vehicle' },
    { id: 'UN-20210', name: 'Dump Trk 15 Ton Mitsubishi Fuso', location: 'KB', year: 2014, category: 'B Vehicle' },
    { id: 'UN-20211', name: 'Dump Trk 15 Ton Mitsubishi Fuso', location: 'Grimari', year: 2014, category: 'B Vehicle' }
  ],

  aVehicles: [
    { id: '20375', name: 'APC Wheeled PUMA Infantry Carrier - armed (Class-I)', location: 'KB', year: 2016, category: 'A Vehicle' },
    { id: '20376', name: 'APC Wheeled PUMA Infantry Carrier - armed (Class-I)', location: 'KB', year: 2016, category: 'A Vehicle' },
    { id: '20377', name: 'APC Wheeled PUMA Infantry Carrier - armed (Class-I)', location: 'KB', year: 2016, category: 'A Vehicle' },
    { id: '20378', name: 'APC Wheeled PUMA Infantry Carrier - armed (Class-I)', location: 'KB', year: 2016, category: 'A Vehicle' },
    { id: '20423', name: 'APCs Wheeled Infantry Carrier Armed (Class-I)', location: 'KB', year: 2016, category: 'A Vehicle' },
    { id: '20379', name: 'MRAP Mine Resistant Ambush Protected Vehicle', location: 'KB', year: 2018, category: 'A Vehicle' }
  ],

  generatorSets: [
    { id: 'CD4045C069748', name: 'Gen Set 80 KVA (John Deere)', location: 'KB', year: 2015, category: 'Generator Set', kva: 80 },
    { id: 'U567051W', name: 'Gen Set 80 KVA (Perkins)', location: 'N,DELE', year: 2014, category: 'Generator Set', kva: 80 },
    { id: 'U589974X', name: 'Gen Set 80 KVA (Perkins)', location: 'KB', year: 2014, category: 'Generator Set', kva: 80 },
    { id: 'U589991X', name: 'Gen Set 80 KVA (Perkins)', location: 'KB', year: 2014, category: 'Generator Set', kva: 80, remarks: 'Gen fwd to Pak for O/H' },
    { id: 'CD4045B112625', name: 'Gen Set 80 KVA (John Deere)', location: 'KB', year: 2015, category: 'Generator Set', kva: 80 },
    { id: 'CD4045B146408', name: 'Gen Set 80 KVA (John Deere)', location: 'KB', year: 2015, category: 'Generator Set', kva: 80 },
    { id: 'U590200X', name: 'Gen Set 80 KVA (Perkins)', location: 'N,DELE', year: 2014, category: 'Generator Set', kva: 80 },
    { id: 'UN-20450', name: 'Gen Set 80 KVA (John Deere)', location: 'KB', year: 2016, category: 'Generator Set', kva: 80 },
    { id: 'UN-20451', name: 'Gen Set 80 KVA (John Deere)', location: 'KB', year: 2016, category: 'Generator Set', kva: 80 },
    { id: 'UN-20452', name: 'Gen Set 80 KVA (John Deere)', location: 'KB', year: 2016, category: 'Generator Set', kva: 80 },
    { id: 'UN-20453', name: 'Gen Set 80 KVA (John Deere)', location: 'KB', year: 2016, category: 'Generator Set', kva: 80 },
    { id: 'UN-20454', name: 'Gen Set 80 KVA (John Deere)', location: 'KB', year: 2016, category: 'Generator Set', kva: 80 },
    { id: 'CD4045B144925', name: 'Gen Set 80 KVA (John Deere)', location: 'KB', year: 2015, category: 'Generator Set', kva: 80, remarks: 'Gen fwd to Pak for O/H' },
    { id: 'U907131-T', name: 'Gen Set 50 KVA (Perkins)', location: 'KB', year: 2013, category: 'Generator Set', kva: 50 },
    { id: 'U902244S', name: 'Gen Set 50 KVA (Perkins)', location: 'KB', year: 2013, category: 'Generator Set', kva: 50, remarks: 'Gen fwd to Pak for O/H' },
    { id: 'U907132-T', name: 'Gen Set 50 KVA (Perkins)', location: 'KB', year: 2013, category: 'Generator Set', kva: 50 },
    { id: 'CD3029B136228', name: 'Gen Set 40 KVA (John Deere)', location: 'KB', year: 2014, category: 'Generator Set', kva: 40 },
    { id: 'U410914Y', name: 'Gen Set 30 KVA (Perkins)', location: 'KB', year: 2012, category: 'Generator Set', kva: 30 },
    { id: 'U410909 Y', name: 'Gen Set 30 KVA (Perkins)', location: 'Grimari', year: 2012, category: 'Generator Set', kva: 30 },
    { id: 'U399816-Y', name: 'Gen Set 30 KVA (Perkins)', location: 'KB', year: 2012, category: 'Generator Set', kva: 30 },
    { id: '84117753-002', name: 'Gen Set 9 KVA (Kohlar)', location: 'KB', year: 2010, category: 'Generator Set', kva: 9 },
    { id: '83521833-006', name: 'Gen Set 9 KVA (Kohlar)', location: 'KB', year: 2010, category: 'Generator Set', kva: 9 },
    { id: 'IEU1505', name: 'Gen Set 5 KVA (Kubota)', location: 'Grimari', year: 2008, category: 'Generator Set', kva: 5 },
    { id: '4875525', name: 'Gen Set 5 KVA', location: 'KB', year: 2008, category: 'Generator Set', kva: 5 },
    { id: 'IEU1792', name: 'Gen Set 5 KVA (Kubota)', location: 'KB', year: 2008, category: 'Generator Set', kva: 5 },
    { id: '4865076', name: 'Gen Set 5 KVA', location: 'KB', year: 2008, category: 'Generator Set', kva: 5 },
    { id: '4865109', name: 'Gen Set 5 KVA', location: 'KB', year: 2008, category: 'Generator Set', kva: 5 },
    { id: 'IEU2743', name: 'Gen Set 5 KVA (Kubota)', location: 'Sibut', year: 2008, category: 'Generator Set', kva: 5 }
  ],

  trailers: [
    { id: 'UN-20316', name: 'Truck Tractor Low Bed', location: 'N,DELE', year: 2011, category: 'B Vehicle' },
    { id: 'UN-20317', name: 'Truck Tractor Low Bed', location: 'KB', year: 2011, category: 'B Vehicle' },
    { id: 'UN-20318', name: 'Truck Tractor Heavy Eqpt', location: 'KB', year: 2011, category: 'B Vehicle' },
    { id: 'UN-20319', name: 'Truck Tractor Heavy Eqpt', location: 'Grimari', year: 2011, category: 'B Vehicle' },
    { id: 'UN-20320', name: 'Fuel Tlr 3500 litre', location: 'KB', year: 2006, category: 'B Vehicle' },
    { id: 'UN-20321', name: 'Fuel Tlr 3500 litre', location: 'N,DELE', year: 2006, category: 'B Vehicle' },
    { id: 'UN-20430', name: 'Fuel Tlr (2,000-7,000 litres)', location: 'KB', year: 2014, category: 'B Vehicle' },
    { id: 'UN-20431', name: 'Fuel Tlr (2,000-7,000 litres)', location: 'KB', year: 2014, category: 'B Vehicle' },
    { id: 'UN-20432', name: 'Fuel Tlr (2,000-7,000 litres)', location: 'KB', year: 2014, category: 'B Vehicle' },
    { id: 'UN 20335', name: 'Heavy Equipment Tlr', location: 'Grimari', year: 2011, category: 'B Vehicle' },
    { id: 'UN 20336', name: 'Heavy Equipment Tlr', location: 'KB', year: 2011, category: 'B Vehicle' },
    { id: 'UN 20333', name: 'Lowbed Tlr 20-40 Tons', location: 'KB', year: 2011, category: 'B Vehicle' },
    { id: 'UN 20334', name: 'Lowbed Tlr 20-40 Tons', location: 'N,DELE', year: 2011, category: 'B Vehicle' },
    { id: 'UN-20322', name: 'Water Tlr 3500 litre', location: 'N,DELE', year: 2006, category: 'B Vehicle' },
    { id: 'UN-20323', name: 'Water Tlr 3500 litre', location: 'KB', year: 2006, category: 'B Vehicle' },
    { id: 'UN-20433', name: 'Water Tlr (2,000-7,000 litres)', location: 'KB', year: 2017, category: 'B Vehicle' },
    { id: 'UN-20435', name: 'Water Tlr (2,000-7,000 litres)', location: 'KB', year: 2017, category: 'B Vehicle' }
  ]
};

// Maintenance schedules based on vehicle age and type
const getMaintenanceSchedule = (vehicle) => {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - vehicle.year;
  
  // Base maintenance schedule
  let schedule = [];
  
  // Age-based maintenance frequency
  if (vehicleAge > 15) {
    // Very old vehicles need more frequent maintenance
    schedule.push(
      { task: 'Weekly Visual Inspection', frequency: 'Weekly', priority: 'High' },
      { task: 'Oil Change & Filter', frequency: 'Monthly', priority: 'Critical' },
      { task: 'Brake System Check', frequency: 'Fortnightly', priority: 'Critical' },
      { task: 'Transmission Service', frequency: 'Quarterly', priority: 'High' },
      { task: 'Engine Overhaul Check', frequency: 'Quarterly', priority: 'Medium' }
    );
  } else if (vehicleAge > 10) {
    // Older vehicles
    schedule.push(
      { task: 'Visual Inspection', frequency: 'Weekly', priority: 'Medium' },
      { task: 'Oil Change & Filter', frequency: 'Fortnightly', priority: 'High' },
      { task: 'Brake System Check', frequency: 'Monthly', priority: 'High' },
      { task: 'Transmission Service', frequency: 'Quarterly', priority: 'Medium' }
    );
  } else if (vehicleAge > 5) {
    // Medium age vehicles
    schedule.push(
      { task: 'Visual Inspection', frequency: 'Fortnightly', priority: 'Medium' },
      { task: 'Oil Change & Filter', frequency: 'Monthly', priority: 'High' },
      { task: 'Brake System Check', frequency: 'Monthly', priority: 'Medium' },
      { task: 'General Service', frequency: 'Quarterly', priority: 'Medium' }
    );
  } else {
    // Newer vehicles
    schedule.push(
      { task: 'Visual Inspection', frequency: 'Monthly', priority: 'Low' },
      { task: 'Oil Change & Filter', frequency: 'Quarterly', priority: 'Medium' },
      { task: 'General Service', frequency: 'Quarterly', priority: 'Low' }
    );
  }

  // Category-specific maintenance
  if (vehicle.category === 'Plant') {
    schedule.push(
      { task: 'Hydraulic System Check', frequency: 'Weekly', priority: 'High' },
      { task: 'Track/Tire Inspection', frequency: 'Weekly', priority: 'High' },
      { task: 'Lubrication Service', frequency: 'Weekly', priority: 'Medium' },
      { task: 'Filter Replacement', frequency: 'Fortnightly', priority: 'Medium' }
    );
  }
  
  if (vehicle.category === 'Generator Set') {
    schedule.push(
      { task: 'Load Test', frequency: 'Weekly', priority: 'High' },
      { task: 'Fuel System Check', frequency: 'Weekly', priority: 'High' },
      { task: 'Battery Test', frequency: 'Fortnightly', priority: 'Medium' },
      { task: 'Cooling System Service', frequency: 'Monthly', priority: 'Medium' },
      { task: 'Generator Cleaning', frequency: 'Weekly', priority: 'Low' }
    );
  }

  if (vehicle.category === 'A Vehicle') {
    schedule.push(
      { task: 'Armor Inspection', frequency: 'Weekly', priority: 'Critical' },
      { task: 'Communication Systems Check', frequency: 'Weekly', priority: 'High' },
      { task: 'Weapons System Check', frequency: 'Weekly', priority: 'Critical' },
      { task: 'NBC System Test', frequency: 'Fortnightly', priority: 'High' }
    );
  }

  if (vehicle.category === 'B Vehicle') {
    if (vehicle.name.includes('Bowzer') || vehicle.name.includes('Tanker')) {
      schedule.push(
        { task: 'Tank Inspection', frequency: 'Weekly', priority: 'High' },
        { task: 'Pump System Check', frequency: 'Weekly', priority: 'High' },
        { task: 'Valve Operation Test', frequency: 'Fortnightly', priority: 'Medium' }
      );
    }
    
    if (vehicle.name.includes('Dump')) {
      schedule.push(
        { task: 'Hydraulic Dump System Check', frequency: 'Weekly', priority: 'High' },
        { task: 'Bed Inspection', frequency: 'Weekly', priority: 'Medium' }
      );
    }
  }

  return schedule;
};

// Generate maintenance tasks with realistic due dates based on last maintenance and cycles
const generateMaintenanceTasks = () => {
  const allVehicles = [
    ...vehicleData.plantEquipment,
    ...vehicleData.bVehicles,
    ...vehicleData.aVehicles,
    ...vehicleData.generatorSets,
    ...vehicleData.trailers
  ];

  const tasks = [];
  const today = new Date();

  allVehicles.forEach(vehicle => {
    const schedules = getMaintenanceSchedule(vehicle);
    
    schedules.forEach(schedule => {
      // Generate realistic last maintenance date (within the last 1-4 cycles)
      const cycleDays = {
        'Weekly': 7,
        'Fortnightly': 14,
        'Monthly': 30,
        'Quarterly': 90
      }[schedule.frequency] || 30;

      // Random last maintenance between 0.5 to 3 cycles ago
      const cyclesAgo = 0.5 + Math.random() * 2.5;
      const daysSinceLastMaintenance = Math.floor(cycleDays * cyclesAgo);
      const lastMaintenanceDate = new Date(today.getTime() - daysSinceLastMaintenance * 24 * 60 * 60 * 1000);
      
      // Calculate next due date based on last maintenance + cycle
      const nextDueDate = new Date(lastMaintenanceDate.getTime() + cycleDays * 24 * 60 * 60 * 1000);
      
      // Determine if task is completed (higher chance if recently done)
      const completionProbability = daysSinceLastMaintenance < (cycleDays * 0.8) ? 0.4 : 0.1;
      const isCompleted = Math.random() < completionProbability;

      tasks.push({
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleCategory: vehicle.category,
        location: vehicle.location,
        vehicleYear: vehicle.year,
        task: schedule.task,
        frequency: schedule.frequency,
        priority: schedule.priority,
        dueDate: nextDueDate.toISOString().split('T')[0],
        isCompleted: isCompleted,
        lastMaintenance: lastMaintenanceDate.toISOString().split('T')[0],
        cycleDays: cycleDays,
        daysSinceLastMaintenance: daysSinceLastMaintenance
      });
    });
  });

  // Sort tasks by priority and due date
  return tasks.sort((a, b) => {
    const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
};

export { vehicleData, generateMaintenanceTasks, getMaintenanceSchedule };