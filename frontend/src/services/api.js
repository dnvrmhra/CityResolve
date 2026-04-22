const BASE_URL = process.env.REACT_APP_API_URL;

export const fetchComplaints = async () => {
  const res = await fetch(`${BASE_URL}/api/complaints`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export const submitComplaint = async (data) => {
  const res = await fetch(`${BASE_URL}/api/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit');
  return res.json();
};

export const updateComplaintStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/api/complaints/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
};

export const deleteComplaint = async (id) => {
  const res = await fetch(`${BASE_URL}/api/complaints/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
};