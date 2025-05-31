#!/bin/sh
set -eu

PROJECT_ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)

cd "$PROJECT_ROOT_DIR/backend-ts"
npm ci
mkdir -p "layers/nodejs" 
cp -r node_modules "layers/nodejs/node_modules"
npm run build
cd -

cd "$PROJECT_ROOT_DIR/frontend"
npm ci
npm run build
cd -

cd "$PROJECT_ROOT_DIR/cdk-ts"
npm ci
cdk deploy --all
cd -

AWS_ACCOUNT=$(aws sts get-caller-identity | jq -r .Account)
aws s3 cp --recursive "$PROJECT_ROOT_DIR/frontend/out" "s3://workshi-2025-tma-${AWS_ACCOUNT}/"
