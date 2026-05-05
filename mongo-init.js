// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the streamflow database
db = db.getSiblingDB('streamflow');

// Create collections with validators
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password"],
      properties: {
        username: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "must be a valid email address and is required"
        },
        password: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        avatar: {
          bsonType: "string",
          description: "optional avatar URL"
        },
        isLive: {
          bsonType: "bool",
          description: "whether user is currently live streaming"
        },
        streamKey: {
          bsonType: "string",
          description: "unique stream key for the user"
        }
      }
    }
  }
});

db.createCollection('streams', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "title", "streamKey"],
      properties: {
        userId: {
          bsonType: "string",
          description: "ID of the streamer"
        },
        title: {
          bsonType: "string",
          description: "stream title"
        },
        description: {
          bsonType: "string",
          description: "stream description"
        },
        streamKey: {
          bsonType: "string",
          description: "unique stream key"
        },
        isLive: {
          bsonType: "bool",
          description: "whether stream is currently live"
        },
        viewers: {
          bsonType: "array",
          description: "array of viewer IDs"
        },
        category: {
          bsonType: "string",
          description: "stream category"
        },
        tags: {
          bsonType: "array",
          description: "stream tags"
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "streamKey": 1 }, { unique: true });

db.streams.createIndex({ "userId": 1 });
db.streams.createIndex({ "streamKey": 1 }, { unique: true });
db.streams.createIndex({ "isLive": 1 });
db.streams.createIndex({ "title": "text", "description": "text" });

print('MongoDB initialization completed successfully!');
