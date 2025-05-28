let temp = {
  title: "first test",
  content: "this is the content of the first test",
};

function calculateContentLength(jsonBody) {
  const stringifiedBody = JSON.stringify(jsonBody);
  return new TextEncoder().encode(stringifiedBody).length;
}

const contentLength = calculateContentLength(temp);
console.log(contentLength); // Output: 24

const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": contentLength,
  },
  body: JSON.stringify(temp),
};

fetch("http://localhost:3000/api/articles", requestOptions)
  .then((res) => res.json())
  .then((data) => console.log("res data" + data[0]))
  .catch((err) => console.log(err));
