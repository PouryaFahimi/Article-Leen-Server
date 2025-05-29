let temp = {
  title: "first test",
  content: "this is the content of the first test",
  username: "eg",
};

function calculateContentLength(jsonBody) {
  const stringifiedBody = JSON.stringify(jsonBody);
  return new TextEncoder().encode(stringifiedBody).length;
}

const contentLength = calculateContentLength(temp);
console.log(contentLength);

const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": contentLength,
    Authorization: "Bearer token",
  },
  body: JSON.stringify(temp),
};

fetch("http://localhost:3000/api/articles", requestOptions)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("Response from server:", data);
  })
  .catch((error) => {
    console.error("Request failed:", error);
  });
