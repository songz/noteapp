if [ -d "./data" ] 
then
    echo "Directory ./data to store notes exists, so taking minor actions" 
    echo "Creating assets folder if does not exist./data/.noteapp-assets" 
    mkdir -p ./data/.noteapp-assets
else
    echo "Creating folder ./data" 
    mkdir -p ./data
    echo "Creating assets folder ./data/.noteapp-assets" 
    mkdir -p ./data/.noteapp-assets
    echo "Going into folder ./data" 
    cd ./data
    echo "Should be in folder now.... Full Path:" 
    pwd
    echo "...."
    echo "Initializing git in the folder" 
    git init
    echo "Going out of the folder" 
    cd ..
    echo "Complete! This was a success. Enjoy!" 
fi
