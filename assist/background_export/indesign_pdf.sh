FILE_TXT="/Applications/Adobe InDesign CS5.5/Adobe InDesign CS5.5.app/Contents/MacOS/DisableAsyncExports.txt"
if [[ -f "$FILE_TXT" ]];
then
  rm "$FILE_TXT"
else
  touch "$FILE_TXT"
fi
