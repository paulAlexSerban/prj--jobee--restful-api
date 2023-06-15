# MongoDB Database

## Troubleshooting
- connecting with MondoDB Comppass is not possible
  - step 1: clean/delete the data folder
  - step 2: restart the database
  - step 3: connect with MongoDB Compass

- mongosh inside container (Mongo Shell)
  - step 1: `docker exec -it <CONTAINER_ID or NAME> bash`
  - step 2: `mongosh mongodb://<MONGO_INITDB_ROOT_USERNAME>:<MONGO_INITDB_ROOT_PASSWORD>@0.0.0.0:27017/admin`
  - step 3: `show dbs`
  - step 4: `use <DATABASE_NAME>`
  - step 5: `show collections`
  - step 6: `db.<COLLECTION_NAME>.find()`