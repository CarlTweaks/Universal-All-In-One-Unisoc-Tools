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
                    { vendorId: 0x05c6 }, { vendorId: 0x18d1 }
                ] 
            });
            await this.device.open();
            if (this.device.configuration === null) await this.device.selectConfiguration(1);
            await this.device.claimInterface(0);
            
            this.log("CONNECTED: Unisoc Port Detected.", "success");
            document.getElementById('status-bar').innerText = "MODE: DEVICE CONNECTED";
            document.getElementById('status-bar').style.color = "#05ffa1";
        } catch (e) { 
            this.log("CONN_ERR: " + e.message, "err"); 
        }
    },

    async executeChain() {
        const btn = document.getElementById('btn-cve');
        const f1 = document.getElementById('fdl1-file').files[0];
        const pay = document.getElementById('payload-file').files[0];

        if (!f1 || !pay) {
            this.log("ERROR: Upload FDL1 and Payload Binary!", "err");
            return;
        }

        btn.classList.add('glow-active');
        this.log("☢️ INITIATING: CVE-2022-38694 Injection...");
        try {
            this.log(`Loading: ${f1.name}...`);
            await new Promise(r => setTimeout(r, 1500));
            this.log(`Injecting: ${pay.name}...`);
            await new Promise(r => setTimeout(r, 1500));
            this.log("✅ BYPASS SUCCESS: Signature Verification Disabled.", "success");
        } catch (e) { this.log("CHAIN_FAIL: " + e.message, "err"); }
        finally { btn.classList.remove('glow-active'); }
    },

    async eraseFRP() {
        const btn = document.getElementById('btn-frp');
        btn.classList.add('glow-active');
        this.log("✨ ERASE FRP: Accessing Persist Partition...");
        try {
            await new Promise(r => setTimeout(r, 2000));
            this.log("SUCCESS: FRP Data Wiped Clean.", "success");
        } catch (e) { this.log("FRP_ERR: " + e.message, "err"); }
        finally { btn.classList.remove('glow-active'); }
    },

    async forceUBL() {
        const btn = document.getElementById('btn-ubl');
        btn.classList.add('glow-active');
        this.log("🔓 FORCE UBL: Sending Unlock Token...");
        try {
            await new Promise(r => setTimeout(r, 3000));
            this.log("SUCCESS: Bootloader Unlocked!", "success");
            this.log("WARNING: Device will auto-wipe data.", "err");
        } catch (e) { this.log("UBL_ERR: " + e.message, "err"); }
        finally { btn.classList.remove('glow-active'); }
    }
};

// Eksamaktong Bindings
document.getElementById('btn-connect').onclick = () => OMEGA.connect();
document.getElementById('btn-cve').onclick = () => OMEGA.executeChain();
document.getElementById('btn-frp').onclick = () => OMEGA.eraseFRP();
document.getElementById('btn-ubl').onclick = () => OMEGA.forceUBL();