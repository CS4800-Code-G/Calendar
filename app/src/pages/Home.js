const loadPosts = async () => {
    let results = await fetch(`${baseUrl}/posts/latest`).then(resp => resp.json());
    setPosts(results);
  }