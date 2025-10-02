const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    // Configure email transporter (using Gmail as example)
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send task creation notification
  async sendTaskCreationNotification(taskOrder, recipients) {
    try {
      const emailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients.join(', '),
        subject: `New Task Order Created - ${taskOrder.unId}`,
        html: this.generateTaskCreationHTML(taskOrder),
        attachments: []
      };

      const info = await this.transporter.sendMail(emailOptions);
      console.log('Task creation email sent:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        sentTo: recipients
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send task completion notification
  async sendTaskCompletionNotification(taskOrder, recipients) {
    try {
      const emailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients.join(', '),
        subject: `Task Order Completed - ${taskOrder.unId}`,
        html: this.generateTaskCompletionHTML(taskOrder),
        attachments: []
      };

      const info = await this.transporter.sendMail(emailOptions);
      console.log('Task completion email sent:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        sentTo: recipients
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate HTML template for task creation
  generateTaskCreationHTML(taskOrder) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .priority-critical { color: #e74c3c; font-weight: bold; }
        .priority-high { color: #f39c12; font-weight: bold; }
        .priority-medium { color: #f1c40f; font-weight: bold; }
        .priority-low { color: #27ae60; font-weight: bold; }
        .info-section { margin: 15px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #3498db; }
        .footer { background-color: #ecf0f1; padding: 15px; text-align: center; font-size: 12px; color: #7f8c8d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Task Order Created</h1>
          <h2>${taskOrder.unId}</h2>
        </div>
        <div class="content">
          <div class="info-section">
            <h3>Task Details</h3>
            <p><strong>Title:</strong> ${taskOrder.title}</p>
            <p><strong>Priority:</strong> <span class="priority-${taskOrder.priority.toLowerCase()}">${taskOrder.priority}</span></p>
            <p><strong>Issue Description:</strong> ${taskOrder.issueDescription}</p>
          </div>
          
          <div class="info-section">
            <h3>Vehicle Information</h3>
            <p><strong>Vehicle Type:</strong> ${taskOrder.vehicleType}</p>
            <p><strong>Vehicle ID:</strong> ${taskOrder.vehicleId}</p>
            <p><strong>Location:</strong> ${taskOrder.vehicleDetails?.location || 'Not specified'}</p>
          </div>
          
          <div class="info-section">
            <h3>Identified By</h3>
            <p><strong>Driver:</strong> ${taskOrder.identifiedBy?.driverName || 'Not specified'}</p>
            <p><strong>Service Number:</strong> ${taskOrder.identifiedBy?.driverServiceNumber || 'Not specified'}</p>
            <p><strong>Contact:</strong> ${taskOrder.identifiedBy?.driverContact || 'Not specified'}</p>
          </div>
          
          <div class="info-section">
            <h3>Timeline</h3>
            <p><strong>Created:</strong> ${new Date(taskOrder.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> ${taskOrder.approvalStatus}</p>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from MTO Maintenance Plan System</p>
          <p>Please do not reply to this email</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // Generate HTML template for task completion
  generateTaskCompletionHTML(taskOrder) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #27ae60; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .info-section { margin: 15px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #27ae60; }
        .footer { background-color: #ecf0f1; padding: 15px; text-align: center; font-size: 12px; color: #7f8c8d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Task Order Completed</h1>
          <h2>${taskOrder.unId}</h2>
        </div>
        <div class="content">
          <div class="info-section">
            <h3>Completion Details</h3>
            <p><strong>Task:</strong> ${taskOrder.title}</p>
            <p><strong>Completed Date:</strong> ${new Date(taskOrder.workCompletionDate).toLocaleString()}</p>
            <p><strong>Total Duration:</strong> ${taskOrder.actualDuration || 0} hours</p>
          </div>
          
          <div class="info-section">
            <h3>Work Summary</h3>
            <p><strong>Work Completed:</strong> ${taskOrder.completionReport?.workCompleted || 'Not specified'}</p>
            <p><strong>Quality Check:</strong> ${taskOrder.completionReport?.qualityCheck || 'Pending'}</p>
            <p><strong>Next Maintenance:</strong> ${taskOrder.completionReport?.nextMaintenanceDate ? new Date(taskOrder.completionReport.nextMaintenanceDate).toLocaleDateString() : 'Not scheduled'}</p>
          </div>
          
          <div class="info-section">
            <h3>Vehicle Information</h3>
            <p><strong>Vehicle Type:</strong> ${taskOrder.vehicleType}</p>
            <p><strong>Vehicle ID:</strong> ${taskOrder.vehicleId}</p>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated notification from MTO Maintenance Plan System</p>
          <p>A detailed completion report PDF will be generated and shared via WhatsApp</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
}

module.exports = new EmailService();