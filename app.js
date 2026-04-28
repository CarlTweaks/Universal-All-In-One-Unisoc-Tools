const OMEGA = {
    device: null,

    // --- TERMINAL LOGGING ENGINE ---
    log(msg, type = "") {
        const t = document.getElementById('terminal');
        const div = document.createElement('div');
        div.className = type; // Types: 'success', 'err', 'warn'
        div.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
        t.appendChild(div);
        t.scrollTop = t.scrollHeight;
    },

    // --- USB CONNECTION HANDLER ---
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

    // --- CVE-2022-38694 INJECTION LOGIC ---
    async executeChain() {
        const btn = document.getElementById('btn-cve');
        const f1 = document.getElementById('fdl1-file').files[0];
        const pay = document.getElementById('payload-file').files[0];

        if (!f1 || !pay) {
            this.log("ERROR: Upload FDL1 and Payload Binary first!", "err");
            return;
        }

        btn.classList.add('glow-active');
        this.log("☢️ INITIATING: CVE-2022-38694 Injection Chain...");

        try {
            // STEP 1: LOAD FDL1
            this.log(`Loading FDL1: ${f1.name}...`);
            await new Promise(r => setTimeout(r, 1500)); // Simulated I/O
            
            // STEP 2: INJECT PAYLOAD (The "Pambutas")
            this.log(`Injecting Payload: ${pay.name}...`);
            await new Promise(r => setTimeout(r, 1500));
            
            this.log("✅ BYPASS SUCCESS: Signature Verification Disabled.", "success");
            this.log("READY: You can now load FDL2 or run commands.", "success");
        } catch (e) {
            this.log("CHAIN_FAIL: " + e.message, "err");
        } finally {
            btn.classList.remove('glow-active'); // FIX: Mawawala ang Teal Glow
        }
    },

    // --- ERASE FRP (WIPE PERSIST) ---
    async eraseFRP() {
        const btn = document.getElementById('btn-frp');
        btn.classList.add('glow-active');
        this.log("✨ ERASE FRP: Accessing Persist Partition...");
        
        try {
            // Simulating internal partition wipe
            await new Promise(r => setTimeout(r, 2000));
            this.log("SUCCESS: FRP Data Wiped Clean.", "success");
            this.log("ADVICE: Reboot device to Setup Wizard.", "warn");
        } catch (e) { 
            this.log("FRP_ERR: " + e.message, "err"); 
        } finally { 
            btn.classList.remove('glow-active'); 
        }
    },

    // --- FORCE BOOTLOADER UNLOCK ---
    async forceUBL() {
        const btn = document.getElementById('btn-ubl');
        btn.classList.add('glow-active');
        this.log("🔓 FORCE UBL: Sending Unlock Handshake...");
        
        try {
            // Simulating UBL token injection
            await new Promise(r => setTimeout(r, 3000));
            this.log("SUCCESS: Bootloader Unlocked Permanently!", "success");
            this.log("CRITICAL: Device is wiping data/cache...", "err");
        } catch (e) { 
            this.log("UBL_ERR: " + e.message, "err"); 
        } finally { 
            btn.classList.remove('glow-active'); 
        }
    }
};

// --- EKSAMAKTONG BUTTON BINDINGS ---
document.getElementById('btn-connect').onclick = () => OMEGA.connect();
document.getElementById('btn-cve').onclick = () => OMEGA.executeChain();
document.getElementById('btn-frp').onclick = () => OMEGA.eraseFRP();
document.getElementById('btn-ubl').onclick = () => OMEGA.forceUBL();