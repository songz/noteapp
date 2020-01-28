if [ -d "./data" ] 
then
    echo "Directory ./data to store notes exists, so no action is taken" 
else
    echo "Creating folder ./data" 
    mkdir ./data
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
