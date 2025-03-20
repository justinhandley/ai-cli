import keytar from 'keytar';

async function getGitHubToken() {
  try {
    const token = await keytar.getPassword('ai-cli', 'github-token');
    if (!token) {
      console.error('No GitHub token found. Please run the CLI and authenticate first.');
      process.exit(1);
    }
    console.log(token);
  } catch (error) {
    console.error('Error retrieving GitHub token:', error);
    process.exit(1);
  }
}

getGitHubToken(); 