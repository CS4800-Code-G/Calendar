await fetch(`${baseUrl}/posts`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      author, title, tags: tags.split(","), body
    })
  }).then(resp => resp.json());

  await fetch(`${baseUrl}/posts/comment/${params.id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      author, body
    })
  });

  await fetch(`${baseUrl}/posts/${params.id}`, {
    method: "DELETE"
  });