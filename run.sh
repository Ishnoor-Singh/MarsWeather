DEV="dev"
if [ "$1" = "$DEV" ]
then
    cd src && npm i && npm run start:dev
else
    cd src && npm i && npm run start
fi