FROM ollama/ollama:latest

RUN mkdir -p /root/.ollama

EXPOSE 11434

COPY init.sh /root/init.sh

RUN chmod +x /root/init.sh

ENTRYPOINT [ "/bin/bash", "/root/init.sh" ]