const BASE_URL = process.env.REACT_APP_API_URL;

export const fetchComplaints = async () => {
  const res = await fetch(`${BASE_URL}/api/complaints`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

/**
 * Submit a complaint with optional image files.
 * Sends multipart/form-data when images are present so the backend
 * (multer) can receive and store them as base64 data-URLs in MongoDB.
 */
export const submitComplaint = async (data, imageFiles = []) => {
  if (imageFiles.length > 0) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    imageFiles.forEach(file => formData.append('images', file));

    const res = await fetch(`${BASE_URL}/api/complaints`, {
      method: 'POST',
      // Do NOT set Content-Type — browser sets it with the correct multipart boundary
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to submit');
    return res.json();
  }

  // No images — plain JSON
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