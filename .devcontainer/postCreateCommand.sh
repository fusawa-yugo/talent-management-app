#!/bin/sh

# Docker may create these directories as it mounts,
# thus they can be owned by the root user.
sudo chown -R vscode:vscode "backend-ts/node_modules"
sudo chown -R vscode:vscode "frontend/node_modules"
sudo chown -R vscode:vscode "cdk-ts/node_modules"

# In case the host user does not have those directories,
# mounting them will cause permission issues in future.
# We change an owner to the vscode user who has the same UID as the host user.
sudo chown -R vscode:vscode "$HOME/.aws"
sudo chown -R vscode:vscode "$HOME/.ssh"

# Safely remove the .gitconfig 'directory' in case
# the host user does not have the .gitconfig file.
(test -d "$HOME/.gitconfig" && sudo rm -d "$HOME/.gitconfig") || true
