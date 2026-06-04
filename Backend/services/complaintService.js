import Complaint from '../models/Complaint.js';

export const createComplaint = async (userId, complaintData, file) => {
  const imageUrl = file ? `/uploads/complaints/${file.filename}` : undefined;

  const complaint = await Complaint.create({
    user: userId,
    name: complaintData.name,
    title: complaintData.title,
    email: complaintData.email,
    type: complaintData.type,
    area: complaintData.area || 'campus',
    roomNumber: complaintData.roomNumber || undefined,
    description: complaintData.description,
    imageUrl,
  });

  return complaint;
};

export const getMyComplaints = async (userId) => {
  return await Complaint.find({ user: userId }).sort({ createdAt: -1 });
};
