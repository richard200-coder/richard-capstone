import User from '../models/User.js';
import Progress from '../models/Progress.js';
import smsService from '../services/sms.service.js';

// Send progress report SMS to parent
export const sendProgressReport = async (req, res) => {
  try {
    const { studentId, progressData } = req.body;

    // Validate required fields
    if (!studentId || !progressData) {
      return res.status(400).json({
        success: false,
        message: 'Student ID and progress data are required'
      });
    }

    // Get student information
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if SMS is enabled and parent phone is available
    if (!student.smsEnabled || !student.parentPhone || !student.parentName) {
      return res.status(400).json({
        success: false,
        message: 'SMS notifications not enabled or parent information missing'
      });
    }

    // Send SMS
    const result = await smsService.sendProgressReport(
      student.name,
      student.parentName,
      student.parentPhone,
      progressData
    );

    // Update progress record to mark SMS as sent
    if (progressData.progressId) {
      await Progress.findByIdAndUpdate(progressData.progressId, {
        smsSent: true,
        smsSentAt: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Progress report sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Error sending progress report:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send progress report'
    });
  }
};

// Send weekly progress summary
export const sendWeeklySummary = async (req, res) => {
  try {
    const { studentId, weekStart, weekEnd } = req.body;

    // Validate required fields
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    // Get student information
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if SMS is enabled and parent phone is available
    if (!student.smsEnabled || !student.parentPhone || !student.parentName) {
      return res.status(400).json({
        success: false,
        message: 'SMS notifications not enabled or parent information missing'
      });
    }

    // Calculate date range for the week
    const startDate = weekStart ? new Date(weekStart) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = weekEnd ? new Date(weekEnd) : new Date();

    // Get weekly progress data
    const weeklyProgress = await Progress.find({
      studentId: studentId,
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    });

    if (weeklyProgress.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No progress data found for the specified week'
      });
    }

    // Calculate weekly statistics
    const totalQuizzes = weeklyProgress.length;
    const totalScore = weeklyProgress.reduce((sum, progress) => sum + progress.quizScore, 0);
    const averageScore = totalScore / totalQuizzes;
    const totalTime = weeklyProgress.reduce((sum, progress) => sum + progress.timeSpent, 0);

    const weeklyData = {
      totalQuizzes,
      averageScore,
      totalTime
    };

    // Send SMS
    const result = await smsService.sendWeeklySummary(
      student.name,
      student.parentName,
      student.parentPhone,
      weeklyData
    );

    res.json({
      success: true,
      message: 'Weekly summary sent successfully',
      messageId: result.messageId,
      weeklyData
    });

  } catch (error) {
    console.error('Error sending weekly summary:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send weekly summary'
    });
  }
};

// Test SMS functionality
export const sendTestSMS = async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    // Validate required fields
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Send test SMS
    const result = await smsService.sendTestSMS(phoneNumber, message);

    res.json({
      success: true,
      message: 'Test SMS sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Error sending test SMS:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send test SMS'
    });
  }
};

// Update user SMS settings
export const updateSMSSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { parentPhone, parentName, smsEnabled } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Update user SMS settings
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        parentPhone: parentPhone || '',
        parentName: parentName || '',
        smsEnabled: smsEnabled || false
      },
      { new: true, select: '-passwordHash' }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'SMS settings updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating SMS settings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update SMS settings'
    });
  }
};

// Get SMS settings for a user
export const getSMSSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findById(userId).select('name parentPhone parentName smsEnabled');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      smsSettings: {
        parentPhone: user.parentPhone,
        parentName: user.parentName,
        smsEnabled: user.smsEnabled
      }
    });

  } catch (error) {
    console.error('Error getting SMS settings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get SMS settings'
    });
  }
};
