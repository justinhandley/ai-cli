import keytar from 'keytar';

async function getGitHubToken() {
  try {
    const token = await keytar.getPassword('ai-cli', 'github');
    if (!token) {
      console.error('No GitHub token found. Please run "ai config github <your-token>" to configure your GitHub token.');
      process.exit(1);
    }
    console.log(token);
  } catch (error) {
    console.error('Error retrieving GitHub token:', error);
    process.exit(1);
  }
}

getGitHubToken(); 