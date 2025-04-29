#!/bin/bash

ollama serve &

OLLAMA_PID=$!

sleep 10

ollama pull llama3.1 &

wait $OLLAMA_PID