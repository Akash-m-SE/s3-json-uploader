
# S3 Json Uploader

The `storeJson` Lambda function allows users to store JSON data as files in an Amazon S3 bucket. Integrated with AWS API Gateway, this function handles HTTP POST requests, providing a serverless and efficient solution for data storage.
## Features

**Store JSON Data:** Accepts JSON payloads via HTTP POST requests and stores them in S3.

**Response with Metadata:** Returns the eTag and URL of the stored file upon successful storage.

**Validation:** Ensures only valid JSON payloads are processed and stored.
## Workflow

- The `storeJson` Lambda function is triggered by a POST request via API Gateway.

- The function validates the JSON payload.

- A unique file is created in the specified S3 bucket, containing the JSON payload.
- The function returns a response with the eTag and file URL of the stored data.
## Example Request and Response

Example POST request:
```
{
  "name": "John",
  "age": 30
}

```

Response:

```
{
  "e_tag": "\"a1b2c3d4e5f6g7h8i9j0\"",
  "url": "https://<your-aws-s3-bucket-name>.s3.<your-aws-s3-bucket-region>.amazonaws.com/<uploaded-file-name>.json"
}

```
## Error Handling

- Validates JSON payload structure.

- Manages S3 access issues and unexpected errors with appropriate error messages.

- Returns structured errors for invalid JSON inputs.
## Environment Setup

To run this project, you will need to create an AWS S3 bucket, setup these policies inside the S3 bucket:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAccessToS3Bucket",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

Then create an IAM user with proper access to the S3 bucket and get your access keys.

Add the following environment variables to your lambda function's configuration


`AWS_S3_REGION` `AWS_S3_BUCKET_NAME` `AWS_S3_ACCESS_KEY_ID` `AWS_S3_SECRET_ACCESS_KEY`

## Installation/Setup

- Set up a public S3 bucket with proper policies to store JSON files.

- Create the `storeJson` Lambda function in AWS Lambda for which you can get the source code from the repository's src/index.js file.

- Set Up API Gateway:
    - Create a new API in API Gateway.
    - Set up a POST endpoint and link it to the `storeJson` Lambda function.

## Tech Stack

**RunTime:** Node.js 18.x

**AWS Services:** Lambda, S3, API Gateway

