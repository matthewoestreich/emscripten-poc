try {
	// Step 1: Fetch the main JavaScript file and the WebAssembly binary
	const [jsResponse, wasmResponse] = await Promise.all([fetch("https://z3-tawny.vercel.app/emscripten-poc-built.js"), fetch("https://z3-tawny.vercel.app/emscripten-poc-built.wasm")]);

	console.log({ step: "1. fetch stuff", jsResponse, wasmResponse });

	if (!jsResponse.ok || !wasmResponse.ok) {
		throw new Error("Failed to fetch Emscripten files.");
	}

	// Step 2: Get the script text and create a blob URL
	const jsText = await jsResponse.text();
	const jsBlob = new Blob([jsText], { type: "text/javascript" });
	let mainScriptUrlOrBlob = URL.createObjectURL(jsBlob);

	// Step 3: Define the Module object with mainScriptUrlOrBlob
	var Module = {
		// Set the location of the WASM file for loading
		locateFile: (path, prefix) => {
			console.log({ step: "locateFile", path, prefix });
			if (path.endsWith(".wasm")) {
				//const returning = "emscripten-poc-built.wasm";
				const returning = "https://z3-tawny.vercel.app/emscripten-poc-built.wasm";
				return returning;
			}
			return prefix + path;
		},
		mainScriptUrlOrBlob: mainScriptUrlOrBlob,
		print: (text) => {
			const outputDiv = document.getElementById("output");
			outputDiv.textContent += text + "\n";
		},
		printErr: (text) => {
			console.error(text);
		},
		onRuntimeInitialized: () => {
			console.log("Emscripten runtime initialized.");
		},
	};

	const script = document.createElement("script");
	script.src = mainScriptUrlOrBlob;
	document.body.appendChild(script);

	function callPOC() {
		try {
			if (typeof emscriptenPOC === "undefined") {
				console.log("emscriptenPOC not found, will try again in 1sec");
				setTimeout(() => callPOC(), 1000);
			} else {
				emscriptenPOC(Module).then((moduleInstance) => {
					console.log("emscriptenPOC Initialized!", { moduleInstance });
				});
			}
		} catch (e) {}
	}
	callPOC();
} catch (error) {
	console.error("An error occurred during Emscripten loading:", error);
	const outputDiv = document.getElementById("output");
	outputDiv.textContent = `Error: ${error.message}`;
}
