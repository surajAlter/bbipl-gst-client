// apiUtils.js

export const postData = async (url, data) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      return result;  // Return the server response
    } catch (error) {
      throw new Error('Error submitting data: ' + error.message);
    }
  };
  