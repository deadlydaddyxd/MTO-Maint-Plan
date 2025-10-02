// Note: Manual WhatsApp distribution - PDFs are generated and stored in cloud
// Users can download PDFs and manually share via WhatsApp

class ManualDistributionService {
  constructor() {
    // No external service required - just PDF generation and storage
    this.enabled = process.env.PDF_STORAGE_ENABLED === 'true';
  }

  // Generate completion report for manual WhatsApp distribution
  async prepareCompletionReport(taskOrder, pdfUrl) {
    try {
      // Generate distribution information for manual sharing
      const distributionInfo = {
        taskOrderId: taskOrder.unId,
        pdfUrl: pdfUrl,
        distributionMessage: this.generateCompletionMessage(taskOrder),
        recipients: this.getRecipientList(taskOrder),
        instructions: 'Download the PDF from the URL above and manually share via WhatsApp to the listed recipients'
      };

      return {
        success: true,
        distributionInfo,
        pdfUrl: pdfUrl
      };
    } catch (error) {
      console.error('Distribution preparation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send task creation notification via WhatsApp
  async sendTaskNotification(recipientNumber, taskOrder) {
    try {
      const formattedNumber = this.formatWhatsAppNumber(recipientNumber);
      
      const message = await this.client.messages.create({
        from: this.whatsappNumber,
        to: formattedNumber,
        body: this.generateTaskNotificationMessage(taskOrder)
      });

      return {
        success: true,
        messageSid: message.sid,
        status: message.status,
        sentTo: recipientNumber
      };
    } catch (error) {
      console.error('WhatsApp sending error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Format phone number for WhatsApp
  formatWhatsAppNumber(phoneNumber) {
    // Remove any existing whatsapp: prefix
    let cleanNumber = phoneNumber.replace('whatsapp:', '');
    
    // Add + if not present
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = '+' + cleanNumber;
    }
    
    return 'whatsapp:' + cleanNumber;
  }

  // Generate completion report message
  generateCompletionMessage(taskOrder) {
    return `🔧 *MAINTENANCE TASK COMPLETED*\n\n` +
           `*UN ID:* ${taskOrder.unId}\n` +
           `*Task:* ${taskOrder.title}\n` +
           `*Vehicle:* ${taskOrder.vehicleType} - ${taskOrder.vehicleId}\n` +
           `*Priority:* ${taskOrder.priority}\n` +
           `*Completed:* ${new Date(taskOrder.workCompletionDate).toLocaleDateString()}\n` +
           `*Duration:* ${taskOrder.actualDuration || 0} hours\n\n` +
           `*Quality Check:* ${taskOrder.completionReport?.qualityCheck || 'Pending'}\n\n` +
           `📄 *Detailed completion report is attached above*\n\n` +
           `_This is an automated message from MTO Maintenance Plan System_`;
  }

  // Generate task notification message
  generateTaskNotificationMessage(taskOrder) {
    return `🚨 *NEW MAINTENANCE TASK*\n\n` +
           `*UN ID:* ${taskOrder.unId}\n` +
           `*Task:* ${taskOrder.title}\n` +
           `*Vehicle:* ${taskOrder.vehicleType} - ${taskOrder.vehicleId}\n` +
           `*Priority:* ${taskOrder.priority}\n` +
           `*Issue:* ${taskOrder.issueDescription}\n` +
           `*Identified by:* ${taskOrder.identifiedBy?.driverName || 'Unknown'}\n` +
           `*Created:* ${new Date(taskOrder.createdAt).toLocaleDateString()}\n\n` +
           `_Please check the maintenance dashboard for full details_\n\n` +
           `_This is an automated message from MTO Maintenance Plan System_`;
  }

  // Get recipient list for manual distribution
  getRecipientList(taskOrder) {
    const recipients = [];
    
    // Add driver contact if available
    if (taskOrder.identifiedBy?.driverContact) {
      recipients.push({
        name: taskOrder.identifiedBy.driverName,
        phone: taskOrder.identifiedBy.driverContact,
        role: 'Driver (Issue Identifier)'
      });
    }
    
    // Add standard recipients
    recipients.push(
      { role: 'Transport Officer', instruction: 'Check user directory for contact' },
      { role: 'Maintenance Officer', instruction: 'Check user directory for contact' },
      { role: 'Commanding Officer', instruction: 'Check user directory for contact' },
      { role: 'Task Requestor', instruction: 'Check task order for contact details' }
    );
    
    return recipients;
  }

  // Prepare bulk distribution information
  async prepareBulkDistribution(recipients, taskOrder, pdfUrl = null) {
    try {
      const distributionData = recipients.map(recipient => ({
        recipient,
        message: pdfUrl ? 
          this.generateCompletionMessage(taskOrder) : 
          this.generateTaskNotificationMessage(taskOrder),
        pdfUrl: pdfUrl,
        instructions: pdfUrl ? 
          'Share the PDF completion report via WhatsApp' : 
          'Send task notification via WhatsApp'
      }));
      
      return {
        success: true,
        totalRecipients: recipients.length,
        distributionData,
        manualDistributionRequired: true
      };
    } catch (error) {
      console.error('Bulk distribution preparation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ManualDistributionService();