let complaints = [];

export const addComplaint = (data) => {
  complaints.push(data);
};

export const getComplaints = () => {
  return complaints;
};