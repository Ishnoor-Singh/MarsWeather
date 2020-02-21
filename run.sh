DEV="dev"
INSTALL="install"
if [ "$1" = "$DEV" ]
then
    cd src && npm i && npm run start:dev
elif [ "$1" = "$INSTALL" ]
then
    cd src && npm i
else 
    cd src && npm run start
fi