import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

class SMSService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (this.accountSid && this.authToken && this.fromNumber) {
      this.client = twilio(this.accountSid, this.authToken);
      this.isConfigured = true;
    } else {
      console.warn('Twilio not configured. SMS functionality will be disabled.');
      this.isConfigured = false;
    }
  }

  // Format phone number to international format
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // If it starts with 0, replace with country code (assuming Philippines +63)
    if (cleaned.startsWith('0')) {
      return `+63${cleaned.substring(1)}`;
    }
    
    // If it doesn't start with +, add +63 (Philippines country code)
    if (!cleaned.startsWith('+')) {
      return `+63${cleaned}`;
    }
    
    return `+${cleaned}`;
  }

  // Send progress report SMS to parent
  async sendProgressReport(studentName, parentName, parentPhone, progressData) {
    if (!this.isConfigured) {
      throw new Error('SMS service not configured');
    }

    try {
      const formattedPhone = this.formatPhoneNumber(parentPhone);
      
      // Create progress summary
      const subject = progressData.subject;
      const score = progressData.quizScore;
      const totalQuestions = progressData.totalQuestions;
      const correctAnswers = progressData.correctAnswers;
      const timeSpent = Math.round(progressData.timeSpent / 60); // Convert to minutes
      
      // Determine performance level
      let performance = '';
      if (score >= 90) {
        performance = 'Excellent! 🌟';
      } else if (score >= 80) {
        performance = 'Very Good! 👍';
      } else if (score >= 70) {
        performance = 'Good! ✅';
      } else if (score >= 60) {
        performance = 'Needs Improvement 📚';
      } else {
        performance = 'Needs More Practice 📖';
      }

      const message = `Hello ${parentName}! 📱

${studentName}'s ${subject} Progress Report:

📊 Score: ${score}% (${correctAnswers}/${totalQuestions})
⏱️ Time: ${timeSpent} minutes
📈 Performance: ${performance}

Keep encouraging ${studentName} to continue learning! 

- LearnPlay Team`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`SMS sent successfully to ${formattedPhone}. SID: ${result.sid}`);
      return { success: true, messageId: result.sid };
      
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  // Send weekly progress summary
  async sendWeeklySummary(studentName, parentName, parentPhone, weeklyData) {
    if (!this.isConfigured) {
      throw new Error('SMS service not configured');
    }

    try {
      const formattedPhone = this.formatPhoneNumber(parentPhone);
      
      const totalQuizzes = weeklyData.totalQuizzes;
      const averageScore = Math.round(weeklyData.averageScore);
      const totalTime = Math.round(weeklyData.totalTime / 60); // Convert to minutes
      
      let performance = '';
      if (averageScore >= 90) {
        performance = 'Outstanding! 🌟';
      } else if (averageScore >= 80) {
        performance = 'Excellent! 👍';
      } else if (averageScore >= 70) {
        performance = 'Good Progress! ✅';
      } else {
        performance = 'Keep Practicing! 📚';
      }

      const message = `Hello ${parentName}! 📱

${studentName}'s Weekly Progress Summary:

📊 Average Score: ${averageScore}%
📝 Quizzes Completed: ${totalQuizzes}
⏱️ Total Study Time: ${totalTime} minutes
📈 Overall Performance: ${performance}

Great job ${studentName}! Keep up the excellent work! 

- LearnPlay Team`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`Weekly summary SMS sent successfully to ${formattedPhone}. SID: ${result.sid}`);
      return { success: true, messageId: result.sid };
      
    } catch (error) {
      console.error('Weekly summary SMS sending failed:', error);
      throw new Error(`Failed to send weekly summary SMS: ${error.message}`);
    }
  }

  // Test SMS functionality
  async sendTestSMS(phoneNumber, message = 'Test message from LearnPlay SMS service') {
    if (!this.isConfigured) {
      throw new Error('SMS service not configured');
    }

    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`Test SMS sent successfully to ${formattedPhone}. SID: ${result.sid}`);
      return { success: true, messageId: result.sid };
      
    } catch (error) {
      console.error('Test SMS sending failed:', error);
      throw new Error(`Failed to send test SMS: ${error.message}`);
    }
  }
}

export default new SMSService();
