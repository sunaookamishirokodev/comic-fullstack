```sh
docker run -dp 127.0.0.1:3000:3000 `
    -w /app --mount "type=bind,src=$pwd,target=/app" `
    node:20 `
    sh -c "yarn install && yarn run dev"
```
