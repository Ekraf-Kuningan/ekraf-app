#!/bin/bash

# Ambil JAVA_HOME dari Windows
WIN_JAVA_HOME=$(cmd.exe /C "echo %JAVA_HOME%" | tr -d '\r')

# Convert path ke /mnt
LINUX_JAVA_HOME=$(wslpath "$WIN_JAVA_HOME")

# Export
export JAVA_HOME="$LINUX_JAVA_HOME"
export PATH="$JAVA_HOME/bin:$PATH"
