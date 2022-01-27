const anchor = require('@project-serum/anchor');

// The Solana System Program
const { SystemProgram } = anchor.web3;

const gifLink = 'https://c.tenor.com/hxo-v4-M-K4AAAAM/brook-one-piece.gif';


const main = async () => {
    console.log('🚀 Starting test...');

    // Create and set the provider
    // We need to set and update it, so that it can communicate with our frontend
    const provider = anchor.Provider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Buildspacesolprogram;

    // Create an account keypair for our program to use
    const baseAccount = anchor.web3.Keypair.generate();

    //
    const tx = await program.rpc.startStuffOff({
        accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
    });

    console.log('📝 Your transaction signature:', tx);

    // Fetch data from the account
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count (before GIF added):', account.totalGifs.toString());

    // Call add_gif function - it requires a gif_link String argument
    await program.rpc.addGif(
        gifLink,
        {
            accounts: {
                baseAccount: baseAccount.publicKey,
                user: provider.wallet.publicKey,
            },
        }
    );

    // Get the account again to verify the update
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count (after GIF added):', account.totalGifs.toString());
    console.log('👀 GIF List:', account.gifList);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

runMain();
