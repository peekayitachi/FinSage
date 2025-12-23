const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
    const genAI = new GoogleGenerativeAI("AIzaSyDJNWVG3oCmxFc0ACbDiKGcFQXDMqF3z3g");

    const modelsToTest = [
        "gemini-2.5-flash-lite",
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-2.0-flash-exp"
    ];

    console.log("--- STARTING TEST ---");

    for (const modelName of modelsToTest) {
        console.log(`\nTesting: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello.");
            console.log(`SUCCESS with ${modelName}`);
            return;
        } catch (error) {
            console.log(`FAILED ${modelName}: ${error.message.split(']')[0]}]`);
        }
    }
}

main();
