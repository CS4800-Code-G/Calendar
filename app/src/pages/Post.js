let results = await fetch(`${baseUrl}/posts/${params.id}`).then(resp => resp.json());