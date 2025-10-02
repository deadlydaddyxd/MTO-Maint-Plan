const twilio = require('twilio');

class WhatsAppService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Format: whatsapp:+14155238886
  }

  // Send completion report PDF via WhatsApp
  async sendCompletionReport(recipientNumber, taskOrder, pdfUrl) {
    try {
      // Format the recipient number
      const formattedNumber = this.formatWhatsAppNumber(recipientNumber);
      
      const message = await this.client.messages.create({
        from: this.whatsappNumber,
        to: formattedNumber,
        body: this.generateCompletionMessage(taskOrder),
        mediaUrl: [pdfUrl]
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

  // Send bulk WhatsApp messages
  async sendBulkMessages(recipients, taskOrder, pdfUrl = null) {
    try {
      const promises = recipients.map(async (recipient) => {
        if (pdfUrl) {
          return await this.sendCompletionReport(recipient, taskOrder, pdfUrl);
        } else {
          return await this.sendTaskNotification(recipient, taskOrder);
        }
      });

      const results = await Promise.all(promises);
      
      return {
        success: true,
        totalSent: results.filter(r => r.success).length,
        totalFailed: results.filter(r => !r.success).length,
        results: results
      };
    } catch (error) {
      console.error('Bulk WhatsApp sending error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new WhatsAppService();