#!/bin/bash
sudo systemctl enable mongod
sudo systemctl start mongod
python3 -m http.server 8080 &
node /home/alejandromoyo/work/Control-WAF-rules/backend/server.js &

echo "Servidores iniciados en segundo plano."
echo "Para detenerlos, busca sus PIDs con 'ps aux | grep <nombre_del_proceso>' y usa 'kill <PID>'."