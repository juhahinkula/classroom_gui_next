This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

**GUI for Github Classroom** 

To be fixed: 
- Organizationis read from the `.env` file. Should be dynamically fetched.
- Move submissions fetch to server side

## Getting Started

### Install dependencies
```bash
npm install
```
### Create Github token
Use fine-grained personal access token: [https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token]

### Create .env file
Create `.env` file to the project root and add the following env variable using your own token:
```
NEXT_PUBLIC_GITHUB_TOKEN=[your_token]
GITHUB_TOKEN=[your_token]
NEXT_PUBLIC_FILE_PATH=src/App.tsx
NEXT_PUBLIC_OWNER_ORGANIZATION=[Organization login of your classrooms]
```
### run the project
```
npm run dev
```
