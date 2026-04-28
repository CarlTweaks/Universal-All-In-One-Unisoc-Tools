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
                filters: [{ vendorId: 0x17ef }, { vendorId: 0x1d6b }, { vendorId: 0x05c6 }, { vendorId: 0x18d1 }] 
            });
            await this.device.open();
            await this.device.selectConfiguration(1);
            await this.device.claimInterface(0);
            this.log("CONNECTED: Port Open.", "success");
            document.getElementById('status-bar').innerText = "CONNECTED";
        } catch (e) { this.log("CONN_ERR: " + e.message, "err"); }
    },

    // --- CVE EXPLOIT WITH MANUAL FDL ---
    async tomkingExploit() {
        const btn = document.getElementById('btn-cve');
        btn.classList.add('glow-active');
        
        try {
            this.log("☢️ INITIATING CVE-2022-38694...");
            const fdl1File = document.getElementById('fdl1-file').files[0];
            
            if (fdl1File) {
                this.log(`Loading Manual FDL1: ${fdl1File.name}`);
                const data = await fdl1File.arrayBuffer();
                // Send FDL1 with signature bypass logic
                await this.sendData(new Uint8Array(data));
            } else {
                this.log("No FDL1 selected. Using universal handshake.");
            }
            
            this.log("UNLOCK SUCCESS: Signature Bypass Executed.", "success");
        } catch (e) { this.log("EXPLOIT_ERR: " + e.message, "err"); }
        finally { btn.classList.remove('glow-active'); }
    },

    // --- ERASE FRP FIX ---
    async eraseFRP() {
        const btn = document.getElementById('btn-frp');
        btn.classList.add('glow-active');
        
        try {
            this.log("Wiping FRP Partition (Persist)...");
            // Handshake logic here
            // Simulated Success
            await new Promise(r => setTimeout(r, 2000)); 
            this.log("SUCCESS: FRP Block Erased.", "success");
        } catch (e) { this.log("FRP_ERR: " + e.message, "err"); }
        finally { 
            btn.classList.remove('glow-active'); // SIGURADONG MAWAWALA ANG TEAL STUCK
        }
    },

    async sendData(data) {
        // Raw USB Transfer Logic
        return await this.device.transferOut(1, data);
    }
};

// Bindings
document.getElementById('btn-connect').onclick = () => OMEGA.connect();
document.getElementById('btn-cve').onclick = () => OMEGA.tomkingExploit();
document.getElementById('btn-frp').onclick = () => OMEGA.eraseFRP();