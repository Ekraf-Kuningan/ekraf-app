git add .
if git commit -m "Commit current changes before reset"; then
    echo "Current changes committed."
    git push origin main
else
    echo "No changes to commit, proceeding to reset."
    git reset --hard origin/main
    npm install
    git add .
    git commit -m "Reset to origin/main and reinstalled dependencies"
    git push origin main
    echo "Repository has been reset to origin/main and dependencies reinstalled."
fi