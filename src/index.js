import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Function to generate a random alphanumeric string of specified length
const generateRandomString = (length) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKETNAME;

export const handler = async (event) => {
  try {
    // Log the event for debugging purposes
    console.log("Event = ", event);

    // Extract body from the event, handling the format based on the trigger type
    const data = event.body ? JSON.parse(event.body) : event;

    console.log("Parsed Data = ", data);

    if (
      !data ||
      !data.name ||
      typeof data.name !== "string" ||
      !data.age ||
      typeof data.age !== "number"
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid input: JSON must contain 'name' (string) and 'age' (number)",
        }),
      };
    }

    console.log("name = ", typeof data.name, "age = ", typeof data.age);

    // Generate a unique file name with the specified format
    const uniqueNumbers = Date.now(); // Use current timestamp as unique numbers
    const uniqueCharacters = generateRandomString(6); // Generate 6 random characters
    const uniqueFileName = `file${uniqueNumbers}_${uniqueCharacters}.json`;

    // Set up the S3 PutObject command
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      Body: JSON.stringify(data), // Use the parsed data
      ContentType: "application/json",
    });

    // Upload to S3 and capture the response
    const response = await s3Client.send(putCommand);

    const eTag = response.ETag.replace(/"/g, "");

    return {
      statusCode: 200,
      body: JSON.stringify({
        e_tag: eTag,
        url: `https://${BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${uniqueFileName}`,
      }),
    };
  } catch (error) {
    console.error("Error storing JSON file:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error storing JSON data" }),
    };
  }
};
