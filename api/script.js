// File: /api/script.js
module.exports = async (req, res) => {
    // Security headers
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    
    const REAL_SCRIPT_URL = "https://raw.githubusercontent.com/i77lhm/Libraries/refs/heads/main/Utopia/Example.lua";
    
    // Security validation
    const userAgent = req.headers['user-agent'] || '';
    const isFromRoblox = userAgent.includes('Roblox') || 
                        req.headers['x-roblox-agent'] ||
                        req.query.key === process.env.SECRET_KEY;
    
    if (!isFromRoblox) {
        return res.status(403).send(`-- 🔒 Pevolution Protected Endpoint
-- 
-- Direct browser access is not permitted.
-- Use in Roblox Executor:
-- loadstring(game:HttpGet("https://pevolution.vercel.app/api/script", true))()
-- 
-- Join Discord: https://discord.gg/pevolution`);
    }
    
    const loaderScript = `-- 🔒 Pevolution Secure Loader v2.0
local REAL_SCRIPT = "${REAL_SCRIPT_URL}"

local function loadSecure()
    local success, script = pcall(function()
        return game:HttpGet(REAL_SCRIPT, true)
    end)
    
    if success then
        local func = loadstring(script)
        if func then 
            func()
            print("[Pevolution] Script loaded successfully")
        end
    else
        warn("[Pevolution] Failed to load script")
    end
end

loadSecure()`;
    
    res.send(loaderScript);
};