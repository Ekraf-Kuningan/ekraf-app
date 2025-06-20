git --reset --hard origin/main
npm install
git add .
git commit -m "Reset to origin/main and reinstalled dependencies"
git push origin main
echo "Repository has been reset to origin/main and dependencies reinstalled."