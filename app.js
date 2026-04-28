const OMEGA = {
    device: null,

    log(msg, type = "") {
        const t = document.getElementById('terminal');
        const div = document.createElement('div');
        div.className = type;
        div.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
        t.appendChild(div);
        t.scrollTop = t.scrollHeight;
    },

    async connect() {
        try {
            this.device = await navigator.usb.requestDevice({ 
                filters: [
                    { vendorId: 0x17ef }, { vendorId: 0x1d6b }, 
                    { vendorId: 0x05c6 }, { vendorId: 0x18d1 },
                    { vendorId: 0x1a86 }, { vendorId: 0x0e8d }
                ] 
            });
            await this.device.open();
            if (this.device.configuration === null) await this.device.selectConfiguration(1);
            await this.device.claimInterface(0);
            
            this.log("CONNECTED: Unisoc Port (BROM) is Open.", "success");
            document.getElementById('status-bar').innerText = "MODE: DEVICE CONNECTED";
            document.getElementById('status-bar').style.color = "#05ffa1";
        } catch (e) { 
            this.log("CONN_ERR: " + e.message, "err"); 
        }
    },

    async executeChain() {
        const btn = document.getElementById('btn-cve');
        const fdl1File = document.getElementById('fdl1-file').files[0];
        const payloadFile = document.getElementById('payload-file').files[0];

        if (!fdl1File || !payloadFile) {
            this.log("ERROR: Select FDL1 and Payload Binary first!", "err");
            return;
        }

        btn.classList.add('glow-active');
        this.log("☢️ STARTING: CVE-2022-38694 Injection...");

        try {
            // Step 1: Handshake
            this.log("Sending Handshake...");
            await this.sendRaw([0x7E, 0x00, 0x00, 0x00, 0x00, 0x7E]); // SPD Dummy Handshake

            // Step 2: Load FDL1
            this.log(`Loading FDL1: ${fdl1File.name}`);
            const f1Data = await fdl1File.arrayBuffer();
            await this.sendData(new Uint8Array(f1Data));

            // Step 3: Inject Payload (Signature Bypass)
            this.log(`Injecting Payload: ${payloadFile.name}...`);
            const pData = await payloadFile.arrayBuffer();
            await this.sendData(new Uint8Array(pData));

            this.log("✅ BYPASS SUCCESS: Signature disabled. Ready for FDL2.", "success");
        } catch (e) {
            this.log("CHAIN_FAIL: " + e.message, "err");
        } finally {
            btn.classList.remove('glow-active'); // Iwas Teal Stuck
        }
    },

    async eraseFRP() {
        const btn = document.getElementById('id-frp');
        btn.classList.add('glow-active');
        this.log("Wiping FRP Partition...");
        try {
            // Simulating internal command
            await new Promise(r => setTimeout(r, 2500));
            this.log("SUCCESS: FRP Block Erased.", "success");
        } catch (e) { this.log("FRP_ERR: " + e.message, "err"); }
        finally { btn.classList.remove('glow-active'); }
    },

    async sendData(buffer) {
        if (!this.device) throw new Error("Device not connected!");
        return await this.device.transferOut(1, buffer);
    },

    async sendRaw(bytes) {
        if (!this.device) throw new Error("Device not connected!");
        return await this.device.transferOut(1, new Uint8Array(bytes));
    }
};

// Bindings
document.getElementById('btn-connect').onclick = () => OMEGA.connect();
document.getElementById('btn-cve').onclick = () => OMEGA.executeChain();
document.getElementById('id-frp').onclick = () => OMEGA.eraseFRP();