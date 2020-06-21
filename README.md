# Docker Build Push to GitHub Package Registry

Builds and pushes Docker images to GitHub Package Registry

## Usage examples:

### Build and publish Docker Image with ref and sha tag  

```yaml
    steps:
    - uses: actions/checkout@v2
      name: Check out code

    - name: Build and Publish Docker image
      uses: zvfvrv/docker-bpgpr@1.0.0
      with:
        gh_token: ${{ secrets.TOKEN_GH }}
        image_name: test
        tag_with_ref: true
        tag_with_sha: true
        path: ./test
        dockerfile: Dockerfile
```

### Build and publish Docker Image with a `latest` tag

```yaml
    steps:
    - uses: actions/checkout@v2
      name: Check out code

    - name: Build and Publish Docker image
      uses: zvfvrv/docker-bpgpr@1.0.0
      with:
        gh_token: ${{ secrets.TOKEN_GH }}
        image_name: test
        tags: latest
        path: ./test
        dockerfile: Dockerfile
```

### Build and without publish Docker Image

```yaml
    steps:
    - uses: actions/checkout@v2
      name: Check out code

    - name: Build and Publish Docker image
      uses: zvfvrv/docker-bpgpr@1.0.0
      with:
        gh_token: ${{ secrets.TOKEN_GH }}
        image_name: test
        tag_with_ref: true
        tag_with_sha: true
        path: ./test
        dockerfile: Dockerfile
        target: withcurl
        push: false
```
