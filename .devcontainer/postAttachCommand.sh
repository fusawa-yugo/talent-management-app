#!/bin/sh

# Install dependencies on backend
cd backend-ts
npm install
cd -

# Install dependencies on frontend
cd frontend
npm install
cd -

# Install dependencies on CDK
cd cdk-ts
npm install
cd -
