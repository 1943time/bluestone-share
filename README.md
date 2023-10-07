# Bluestone Share Server

## Start
```bash
## install node
curl -fsSL https://fnm.vercel.app/install | bash
source /root/.bashrc
fnm install 18
## Install service program
git clone https://github.com/1943time/bluestone-share.git
cd bluestone-share
npm i
npm i pm2 -g
## start program
pm2 start
```

The port and secret can be changed by editing the .env file.

If you want to stop the service use `pm2 stop bluestone` command.