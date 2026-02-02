// File: /api/script.js
module.exports = async (req, res) => {
    // Set security headers
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // CHANGE THIS URL to your script URL
    const REAL_SCRIPT_URL = "https://raw.githubusercontent.com/i77lhm/Libraries/refs/heads/main/Utopia/Example.lua";
    
    // Basic validation - check if request is likely from Roblox
    const userAgent = req.headers['user-agent'] || '';
    const isFromRoblox = userAgent.includes('Roblox') || 
                        req.query.key === 'community';
    
    if (!isFromRoblox) {
        // Return a friendly message for browser access
        return res.send(`-- 🔒 Pevolution Community Gateway
-- 
-- This is a protected script endpoint.
-- 
-- Direct browser access is not allowed.
-- Use in Roblox executor:
-- 
-- loadstring(game:HttpGet("https://pevolution.vercel.app/api/script", true))()
-- 
-- Join our community: https://discord.gg/pevolution
-- 
-- ⚠️  Note: This is basic protection only.
--    Determined users may still be able to access the source.`);
    }
    
    // Create loader that fetches the actual script
    const loaderScript = `-- Pevolution Community Loader
-- Basic script protection gateway
-- Community: https://discord.gg/pevolution

local function loadCommunityScript()
    local scriptURL = "${REAL_SCRIPT_URL}"
    
    print("[Pevolution] Loading community script...")
    print("[Pevolution] Gateway: pevolution.vercel.app")
    
    local success, scriptContent = pcall(function()
        return game:HttpGet(scriptURL, true)
    end)
    
    if success then
        print("[Pevolution] ✓ Script loaded successfully")
        print("[Pevolution] ⚠️  Remember: This is basic protection")
        print("[Pevolution] ℹ️   Join community for help: discord.gg/pevolution")
        
        local func, errorMsg = loadstring(scriptContent)
        if func then
            func()
        else
            warn("[Pevolution] ✗ Error loading script: " .. tostring(errorMsg))
        end
    else
        warn("[Pevolution] ✗ Failed to fetch script: " .. tostring(scriptContent))
    end
end

-- Start loading
loadCommunityScript()`;
    
    res.send(loaderScript);
};