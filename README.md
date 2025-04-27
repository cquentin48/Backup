# Backup

Snapshot manager across a network.

# How to use it

To launch it, please use the following command :
```
docker compose up -d --build
```

⚠️ You must launch again the `backend` container once all is done, since it doesn't wait the `embeddings` database to be up (it is a work in progress).
