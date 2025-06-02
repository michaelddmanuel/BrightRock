const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email templates (simplified for MVP)
const emailTemplates = {
  'training-registration': (data) => `
    <h2>Registration Confirmation: ${data.trainingTitle}</h2>
    <p>Dear ${data.userName},</p>
    <p>You have successfully registered for the following training session:</p>
    <p><strong>Title:</strong> ${data.trainingTitle}</p>
    <p><strong>Date:</strong> ${data.trainingDate}</p>
    <p><strong>Time:</strong> ${data.trainingTime}</p>
    <p><strong>Location:</strong> ${data.trainingLocation}</p>
    ${data.trainingLink ? `<p><strong>Meeting Link:</strong> <a href="${data.trainingLink}">${data.trainingLink}</a></p>` : ''}
    <p>Please ensure you arrive on time and complete the declaration form after the session.</p>
    <p>Regards,<br>Sasol ESD Team</p>
  `,
  
  'training-reminder': (data) => `
    <h2>Reminder: Upcoming Training Session</h2>
    <p>Dear ${data.userName},</p>
    <p>This is a reminder that you are registered for the following training session:</p>
    <p><strong>Title:</strong> ${data.trainingTitle}</p>
    <p><strong>Date:</strong> ${data.trainingDate}</p>
    <p><strong>Time:</strong> ${data.trainingTime}</p>
    <p><strong>Location:</strong> ${data.trainingLocation}</p>
    ${data.trainingLink ? `<p><strong>Meeting Link:</strong> <a href="${data.trainingLink}">${data.trainingLink}</a></p>` : ''}
    <p>Please ensure you arrive on time and complete the declaration form after the session.</p>
    <p>Regards,<br>Sasol ESD Team</p>
  `,
  
  'declaration-reminder': (data) => `
    <h2>Action Required: Training Declaration Form</h2>
    <p>Dear ${data.userName},</p>
    <p>Our records indicate that you attended the following training session but have not yet submitted the required declaration form:</p>
    <p><strong>Title:</strong> ${data.trainingTitle}</p>
    <p><strong>Date:</strong> ${data.trainingDate}</p>
    <p>Please log in to the Sasol Training Portal and complete the declaration form as soon as possible to ensure compliance.</p>
    <p>Regards,<br>Sasol ESD Team</p>
  `,
};

/**
 * Send notification to users
 * @param {Object} options - Notification options
 * @param {string} options.type - Notification type (email, sms, in-app)
 * @param {string} options.to - Recipient
 * @param {string} options.subject - Email subject
 * @param {string} options.template - Template name
 * @param {Object} options.data - Template data
 * @returns {Promise} - Resolves when notification is sent
 */
exports.sendNotification = async (options) => {
  try {
    if (options.type === 'email') {
      const template = emailTemplates[options.template] || ((data) => `<p>${data.message || 'No message'}</p>`);
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"Sasol Training" <noreply@sasoltraining.com>',
        to: options.to,
        subject: options.subject,
        html: template(options.data),
      };
      
      return await transporter.sendMail(mailOptions);
    }
    
    // For future implementation: SMS and in-app notifications
    if (options.type === 'sms') {
      console.log('SMS notification not implemented yet');
      // Would integrate with SMS gateway service
    }
    
    if (options.type === 'in-app') {
      console.log('In-app notification not implemented yet');
      // Would store notification in database for retrieval by frontend
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

/**
 * Schedule notifications for upcoming training sessions
 * This would typically be run by a cron job
 */
exports.scheduleTrainingReminders = async () => {
  try {
    const { Training, Attendance, User } = require('../models');
    const { Op } = require('sequelize');
    
    // Find training sessions starting in the next 24 hours
    const upcomingTrainings = await Training.findAll({
      where: {
        startDate: {
          [Op.between]: [new Date(), new Date(Date.now() + 24 * 60 * 60 * 1000)]
        },
        status: 'scheduled'
      }
    });
    
    for (const training of upcomingTrainings) {
      // Find registered users
      const attendances = await Attendance.findAll({
        where: { TrainingId: training.id },
        include: [{ model: User }]
      });
      
      // Send reminders
      for (const attendance of attendances) {
        if (attendance.User && attendance.User.email) {
          await exports.sendNotification({
            type: 'email',
            to: attendance.User.email,
            subject: `Reminder: ${training.title}`,
            template: 'training-reminder',
            data: {
              userName: `${attendance.User.firstName} ${attendance.User.lastName}`,
              trainingTitle: training.title,
              trainingDate: new Date(training.startDate).toLocaleDateString(),
              trainingTime: new Date(training.startDate).toLocaleTimeString(),
              trainingLocation: training.location || 'Virtual',
              trainingLink: training.isVirtual ? training.meetingLink : null
            }
          });
        }
      }
    }
    
    console.log(`Sent reminders for ${upcomingTrainings.length} upcoming training sessions`);
  } catch (error) {
    console.error('Error scheduling training reminders:', error);
    throw error;
  }
};

/**
 * Send reminders for missing declaration forms
 * This would typically be run by a cron job
 */
exports.sendDeclarationReminders = async () => {
  try {
    const { Attendance, Declaration, Training, User } = require('../models');
    const { Op } = require('sequelize');
    
    // Find attended sessions in the last 7 days without declaration forms
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    
    const attendances = await Attendance.findAll({
      where: {
        status: 'attended',
        checkInTime: { [Op.between]: [sevenDaysAgo, now] },
      },
      include: [
        { 
          model: Declaration,
          required: false
        },
        { 
          model: Training
        },
        {
          model: User
        }
      ],
      // Only include attendances without a declaration
      having: literal('COUNT("Declaration"."id") = 0'),
      group: ['Attendance.id', 'Training.id', 'User.id']
    });
    
    // Send reminders
    for (const attendance of attendances) {
      if (attendance.User && attendance.User.email) {
        await exports.sendNotification({
          type: 'email',
          to: attendance.User.email,
          subject: `Action Required: Declaration Form for ${attendance.Training.title}`,
          template: 'declaration-reminder',
          data: {
            userName: `${attendance.User.firstName} ${attendance.User.lastName}`,
            trainingTitle: attendance.Training.title,
            trainingDate: new Date(attendance.Training.startDate).toLocaleDateString()
          }
        });
      }
    }
    
    console.log(`Sent declaration reminders for ${attendances.length} attendances`);
  } catch (error) {
    console.error('Error sending declaration reminders:', error);
    throw error;
  }
};
