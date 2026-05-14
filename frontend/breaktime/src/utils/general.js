/* 
 *  apiCall
 *  Summary: Makes a call to the backend with the given url, method, body, and token
 *  Input: url    (string) - url path for the api call
 *          method (string) - the HTTPS method for the specific endpoint (E.g. "GET")
 *          body   (object)   - the req.body that's sent to the endpoint (E.g. { ID })
 *          token  (string) - the authentication session token for a user
 *  Returns: The response from the backend or if there is an error, throws an object 
 *          with the status and statusText
 *  Notes:
 *      - If any parameter is unnecessary for an endpoint use null in the function call
 *      - All string values for the method parameter should be uppercase
 *      - Example Usage: apiCall('/staff/create', "POST", { firstName, lastName, ... }, None)
 *      - An instance of the backend must be running in a separate terminal for local use
 */
export const apiCall = async (url, method, body, token) => {

  // add '/' to the beginning of the url if it is not there
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  let response;
  try {
    response = await fetch(import.meta.env.VITE_BASE_URL + url, {
      method: method,
      headers: {
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), 
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },

      body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
    });
  } catch (error) {
    console.error('Error in apiCall:', error);
    throw { status: 500, statusText: 'Error in apiCall' };
  }

  if (!response.ok) {
    console.error(response);
    let message;
    try {
      const body = await response.json();
      message = body?.message;
    } catch {}
    throw { status: response.status, statusText: response.statusText, message };
  }

  const contentType = response.headers.get('content-type');
  if (!contentType) {
    console.error('Invalid content type:', contentType);
    throw { status: 500, statusText: 'Invalid content type' };
  }

  if (contentType.includes('application/json')) {
    return await response.json();
  }
  
  return { message: await response.text()};
};


/*
 * DATE UTILITIES 
 */

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// "YYYY-MM-DD" → "wednesday"
export const toDayName = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return DAYS[new Date(year, month - 1, day).getDay()];
};

// Date object → "YYYY-MM-DD"  (avoids UTC timezone shift from toISOString)
export const toDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// "YYYY-MM-DD" → "Apr 8th"
export const toDisplayDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const s = ['th', 'st', 'nd', 'rd'];
  const v = day % 100;
  const ordinal = day + (s[(v - 20) % 10] || s[v] || s[0]);
  return date.toLocaleDateString('en-US', { month: 'short' }) + ' ' + ordinal;
};

// ISO timestamp string → "Apr 8th, 9:32 PM"
export const toDisplayTimestamp = (ts) => {
  const d = new Date(ts);
  const day = d.getDate();
  const s = ['th', 'st', 'nd', 'rd'];
  const v = day % 100;
  const ordinal = day + (s[(v - 20) % 10] || s[v] || s[0]);
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${month} ${ordinal}, ${time}`;
};

// "09:30" → "9:30 AM"
export const toDisplayTime = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};