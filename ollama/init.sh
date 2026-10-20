#!/bin/bash

ollama serve &

OLLAMA_PID=$!

sleep 10

echo "Pulling mistral model"

ollama run mistral &

wait $OLLAMA_PID