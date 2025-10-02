const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class PDFService {
  // Generate completion report PDF
  async generateCompletionReportPDF(taskOrder) {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `completion-report-${taskOrder.unId}-${Date.now()}.pdf`;
      const filePath = path.join(__dirname, '../temp', fileName);
      
      // Ensure temp directory exists
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20)
         .fillColor('#2c3e50')
         .text('MAINTENANCE TASK COMPLETION REPORT', { align: 'center' });

      doc.moveDown(0.5);
      doc.fontSize(14)
         .fillColor('#34495e')
         .text(`UN ID: ${taskOrder.unId}`, { align: 'center' });

      doc.moveDown(1.5);

      // Task Information Section
      this.addSection(doc, 'TASK INFORMATION', [
        ['Task Order Number:', taskOrder.taskOrderNumber],
        ['Title:', taskOrder.title],
        ['Priority Level:', taskOrder.priority],
        ['Issue Description:', taskOrder.issueDescription],
        ['Created Date:', new Date(taskOrder.createdAt).toLocaleDateString()],
        ['Completion Date:', new Date(taskOrder.workCompletionDate).toLocaleDateString()]
      ]);

      // Vehicle Information Section
      this.addSection(doc, 'VEHICLE INFORMATION', [
        ['Vehicle Type:', taskOrder.vehicleType],
        ['Vehicle ID:', taskOrder.vehicleId],
        ['Vehicle Name:', taskOrder.vehicleDetails?.name || 'N/A'],
        ['Location:', taskOrder.vehicleDetails?.location || 'N/A'],
        ['Current Status:', taskOrder.vehicleDetails?.currentStatus || 'N/A']
      ]);

      // Driver Information Section
      this.addSection(doc, 'ISSUE IDENTIFIED BY', [
        ['Driver Name:', taskOrder.identifiedBy?.driverName || 'N/A'],
        ['Service Number:', taskOrder.identifiedBy?.driverServiceNumber || 'N/A'],
        ['Contact Number:', taskOrder.identifiedBy?.driverContact || 'N/A'],
        ['Identification Date:', new Date(taskOrder.identifiedBy?.identificationDate).toLocaleDateString()]
      ]);

      // Work Details Section
      this.addSection(doc, 'WORK DETAILS', [
        ['Work Started:', new Date(taskOrder.workStartDate).toLocaleDateString()],
        ['Work Completed:', new Date(taskOrder.workCompletionDate).toLocaleDateString()],
        ['Estimated Duration:', `${taskOrder.estimatedDuration || 0} hours`],
        ['Actual Duration:', `${taskOrder.actualDuration || 0} hours`],
        ['Work Status:', taskOrder.workStatus]
      ]);

      // Completion Report Section
      if (taskOrder.completionReport) {
        this.addSection(doc, 'COMPLETION REPORT', [
          ['Work Completed:', taskOrder.completionReport.workCompleted || 'N/A'],
          ['Test Results:', taskOrder.completionReport.testResults || 'N/A'],
          ['Quality Check:', taskOrder.completionReport.qualityCheck || 'Pending'],
          ['Technician Notes:', taskOrder.completionReport.technicianNotes || 'N/A'],
          ['Recommended Actions:', taskOrder.completionReport.recommendedActions || 'N/A'],
          ['Next Maintenance Date:', taskOrder.completionReport.nextMaintenanceDate ? 
            new Date(taskOrder.completionReport.nextMaintenanceDate).toLocaleDateString() : 'Not scheduled']
        ]);
      }

      // Parts Used Section
      if (taskOrder.completionReport?.partsUsed && taskOrder.completionReport.partsUsed.length > 0) {
        doc.addPage();
        doc.fontSize(16)
           .fillColor('#2c3e50')
           .text('PARTS USED', { underline: true });
        
        doc.moveDown(0.5);

        // Table headers
        const tableTop = doc.y;
        const partNameX = 50;
        const partNumberX = 200;
        const quantityX = 350;
        const costX = 450;

        doc.fontSize(12)
           .fillColor('#34495e')
           .text('Part Name', partNameX, tableTop, { width: 140 })
           .text('Part Number', partNumberX, tableTop, { width: 140 })
           .text('Quantity', quantityX, tableTop, { width: 90 })
           .text('Cost', costX, tableTop, { width: 90 });

        doc.moveTo(50, doc.y + 5)
           .lineTo(540, doc.y + 5)
           .stroke();

        doc.moveDown(0.5);

        let totalCost = 0;
        taskOrder.completionReport.partsUsed.forEach(part => {
          const y = doc.y;
          doc.fontSize(10)
             .fillColor('#000')
             .text(part.partName || 'N/A', partNameX, y, { width: 140 })
             .text(part.partNumber || 'N/A', partNumberX, y, { width: 140 })
             .text(part.quantity?.toString() || '0', quantityX, y, { width: 90 })
             .text(`Rs. ${part.actualCost || 0}`, costX, y, { width: 90 });
          
          totalCost += part.actualCost || 0;
          doc.moveDown(0.3);
        });

        doc.moveDown(0.5);
        doc.fontSize(12)
           .fillColor('#2c3e50')
           .text(`Total Parts Cost: Rs. ${totalCost}`, costX, doc.y, { width: 90 });
      }

      // Approval Section
      doc.addPage();
      this.addSection(doc, 'APPROVALS', [
        ['Approved By:', taskOrder.approvedBy ? 'Yes' : 'Pending'],
        ['Approval Date:', taskOrder.approvalDate ? new Date(taskOrder.approvalDate).toLocaleDateString() : 'Pending'],
        ['Final Approval Status:', taskOrder.finalApprovalStatus],
        ['Final Approved By:', taskOrder.finalApprovedBy ? 'Yes' : 'Pending'],
        ['Final Approval Date:', taskOrder.finalApprovalDate ? new Date(taskOrder.finalApprovalDate).toLocaleDateString() : 'Pending']
      ]);

      // Footer
      doc.moveDown(2);
      doc.fontSize(10)
         .fillColor('#7f8c8d')
         .text('This is a computer-generated report from MTO Maintenance Plan System', { align: 'center' });
      
      doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, { align: 'center' });

      // Finalize PDF
      doc.end();

      // Wait for the PDF to be written
      await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        resource_type: 'raw',
        public_id: `completion-reports/${taskOrder.unId}`,
        overwrite: true,
        invalidate: true
      });

      // Clean up local file
      fs.unlinkSync(filePath);

      return {
        success: true,
        pdfUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        fileName: fileName
      };

    } catch (error) {
      console.error('PDF generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper method to add sections to PDF
  addSection(doc, title, data) {
    doc.fontSize(14)
       .fillColor('#2c3e50')
       .text(title, { underline: true });
    
    doc.moveDown(0.5);

    data.forEach(([label, value]) => {
      doc.fontSize(10)
         .fillColor('#34495e')
         .text(label, { continued: true })
         .fillColor('#000')
         .text(` ${value}`);
      doc.moveDown(0.2);
    });

    doc.moveDown(1);
  }
}

module.exports = new PDFService();