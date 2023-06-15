#!/bin/bash

# Define the directory to start from
directoryPath="."

# Define old and new file names
oldFileName=".env.common"
newFileName=".env.common"

# Use the find command to locate files with the old file name
# Note: This will not do anything if the old file name is the same as the new file name
# Rename these files with the new file name
find "$directoryPath" -type f -name "$oldFileName" -print0 | while IFS= read -r -d '' file; do
    # Generate new file path by replacing old file name with new file name
    newFilePath="${file/$oldFileName/$newFileName}"
    
    # Rename the file and print the update
    mv "$file" "$newFilePath"
    echo "Renamed file: $file to $newFilePath"
done

echo "All matching files have been renamed."

# Now we will replace instances of the oldFileName string within all files under the directoryPath
find "$directoryPath" -type f -print0 | while IFS= read -r -d '' file; do
    # Check if the file contains the old file name string
    if grep -q "$oldFileName" "$file"; then
        # Use sed to replace the old file name string with the new file name string
        # Note the '' after -i for macOS
        sed -i '' "s/$oldFileName/$newFileName/g" "$file"
        
        # Print the name of the modified file
        echo "Modified file: $file"
    fi
done

echo "All string replacements have been done."
