// A helper function that returns a promise that resolves after a given time
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loopWithDelay() {
    for (let i = 0; i < 10; i++) {
        console.log(i); // Your loop code here
        await delay(100); // Wait for 1 second
    }
}

// Call the async function to execute the loop with delay
loopWithDelay();
