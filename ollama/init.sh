#!/bin/bash

ollama serve &

OLLAMA_PID=$!

sleep 10

ollama pull mistral &

wait $OLLAMA_PID