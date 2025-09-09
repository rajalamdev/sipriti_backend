const { LogActivity } = require('../models');

exports.logActivity = async ({description, type, user_id}) => {
  try {
    const log = await LogActivity.create({
      description,
      type,
      user_id
    });
    return log;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
}