import Feedback from '../models/Feedback.js';

export const createFeedback = async (userId, feedbackData) => {
  const feedback = await Feedback.create({
    user: userId,
    complaint: feedbackData.complaint || undefined,
    name: feedbackData.name,
    email: feedbackData.email,
    title: feedbackData.title,
    descriptionFeedback: feedbackData.descriptionFeedback,
  });

  return feedback;
};

export const getMyFeedback = async (userId) => {
  return await Feedback.find({ user: userId }).sort({ createdAt: -1 });
};
